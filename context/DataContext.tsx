import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Profile, Habit, CheckIn, DailyQuote, CheckInStatus } from '../types';
import { format, isSameDay, differenceInDays, getDay, eachDayOfInterval } from 'date-fns';
import subDays from 'date-fns/subDays';
import parseISO from 'date-fns/parseISO';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface DataContextType {
    session: Session | null;
    profile: Profile | null;
    habits: Habit[];
    activeHabit: Habit | null;
    checkIns: CheckIn[];
    dailyQuote: DailyQuote | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<any>;
    logout: () => Promise<void>;
    signUp: (data: any) => Promise<any>;
    addHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'is_active' | 'created_at'>) => Promise<void>;
    addCheckIn: (checkIn: Omit<CheckIn, 'id' | 'user_id' | 'habit_id' | 'created_at'>) => Promise<void>;
    getDailyQuote: () => Promise<void>;
    updateProfile: (updatedProfile: Partial<Profile>) => Promise<void>;
    getCheckInForDate: (date: Date) => CheckIn | undefined;
    getStreak: () => number;
    getSuccessRate: () => number;
    getDaysActive: () => number;
    getRecentCheckins: (days?: number) => CheckIn[];
    deleteActiveHabit: () => Promise<void>;
    archiveActiveHabit: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const HABIT_COLUMNS = 'id, user_id, name, motivation, days_of_week, duration_days, start_date, is_active';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
    const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                setLoading(true);
                const today = format(new Date(), 'yyyy-MM-dd');

                // Fetch Profile, Habits, CheckIns, and Today's Quote in parallel
                const [
                    profileRes,
                    habitsRes,
                    checkInsRes,
                    quoteRes
                ] = await Promise.all([
                    supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
                    supabase.from('habits').select(HABIT_COLUMNS).eq('user_id', session.user.id),
                    supabase.from('checkins').select('*').eq('user_id', session.user.id),
                    supabase.from('daily_quotes').select('user_id, content, date').eq('user_id', session.user.id).eq('date', today).maybeSingle()
                ]);

                if (profileRes.data) setProfile(profileRes.data);
                else if (profileRes.error) console.error('Profile fetch error:', profileRes.error.message);

                if (habitsRes.data) setHabits(habitsRes.data as Habit[]);
                else if (habitsRes.error) console.error('Habits fetch error:', habitsRes.error.message);

                if (checkInsRes.data) setCheckIns(checkInsRes.data);
                else if (checkInsRes.error) console.error('Check-ins fetch error:', checkInsRes.error.message);

                if (quoteRes.data) setDailyQuote(quoteRes.data);
                else if (quoteRes.error) console.error('Quote fetch error:', quoteRes.error.message);

                setLoading(false);
            } else {
                 setProfile(null);
                 setHabits([]);
                 setCheckIns([]);
                 setDailyQuote(null);
                 setLoading(false);
            }
        };
        fetchData();
    }, [session]);
    

    const login = async (email: string, pass: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if(error) throw error;
    };
    
    const signUp = async (signUpData: any) => {
        const { email, password, ...profileData } = signUpData;
        const { error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: {
                    full_name: profileData.full_name,
                    whatsapp: profileData.whatsapp,
                    birth_date: profileData.birth_date,
                    cpf: profileData.cpf
                }
            }
        });
        if (error) throw error;
    };
    
    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    const activeHabit = useMemo(() => habits.find(h => h.is_active) || null, [habits]);

    const addHabit = async (habitData: Omit<Habit, 'id' | 'user_id' | 'is_active'>) => {
        if (!session) throw new Error("User not logged in");

        if(activeHabit) {
            await supabase.from('habits').update({ is_active: false }).eq('id', activeHabit.id);
        }

        const newHabit = {
            ...habitData,
            user_id: session.user.id,
            is_active: true,
            start_date: format(new Date(), 'yyyy-MM-dd'),
        };

        const { data, error } = await supabase.from('habits').insert(newHabit).select(HABIT_COLUMNS).single();
        if (error) throw error;
        if (data) {
             setHabits(prev => [...prev.map(h => ({...h, is_active: false})), data as Habit]);
        }
    };

    const addCheckIn = async (checkInData: Omit<CheckIn, 'id' | 'user_id' | 'habit_id'>) => {
        if (!session || !activeHabit) throw new Error("No active session or habit");
        
        const newCheckIn = {
            ...checkInData,
            user_id: session.user.id,
            habit_id: activeHabit.id,
        };

        const { data, error } = await supabase.from('checkins').insert(newCheckIn).select().single();
        if (error) throw error;
        if(data) setCheckIns(prev => [...prev, data]);
    };

    const getDailyQuote = async () => {
        if (!session) throw new Error("User not logged in");
        const today = format(new Date(), 'yyyy-MM-dd');

        // 1. Check if a quote for today already exists
        const { data: existingQuote } = await supabase
            .from('daily_quotes')
            .select('user_id, content, date')
            .eq('user_id', session.user.id)
            .eq('date', today)
            .maybeSingle();

        if (existingQuote) {
            setDailyQuote(existingQuote);
            return;
        }

        // 2. If not, generate a new one
        const { generateDailyQuote } = await import('../services/gemini');
        const content = await generateDailyQuote();
        const newQuote: DailyQuote = {
            user_id: session.user.id,
            content,
            date: today,
        };

        // 3. Save the new quote to the database
        const { error } = await supabase.from('daily_quotes').insert(newQuote);
        if (error) {
            console.error("Error saving daily quote:", error);
            // Fallback to setting quote in local state only if DB save fails
        }
        setDailyQuote(newQuote);
    };


    const updateProfile = async (updatedData: Partial<Profile>) => {
        if (!session) throw new Error("User not logged in");
        const { error } = await supabase.from('profiles').update(updatedData).eq('id', session.user.id);
        if(error) throw error;
        setProfile(prev => ({...prev!, ...updatedData}));
    };
    
    const archiveActiveHabit = async () => {
        if (!activeHabit) return;

        const { data, error } = await supabase
            .from('habits')
            .update({ is_active: false })
            .eq('id', activeHabit.id)
            .select(HABIT_COLUMNS)
            .single();

        if (error) {
            console.error("Error archiving habit:", error);
            throw error;
        }

        if (data) {
            setHabits(prev => prev.map(h => h.id === activeHabit.id ? (data as Habit) : h));
        }
    };

    const deleteActiveHabit = async () => {
        if (!activeHabit) return;

        const { error: habitError } = await supabase
            .from('habits')
            .delete()
            .eq('id', activeHabit.id);

        if (habitError) {
            console.error("Error deleting habit:", habitError);
            throw habitError;
        }

        setCheckIns(prev => prev.filter(c => c.habit_id !== activeHabit.id));
        setHabits(prev => prev.filter(h => h.id !== activeHabit.id));
    };

    const getCheckInForDate = useCallback((date: Date): CheckIn | undefined => {
        return checkIns.find(c => isSameDay(parseISO(c.date), date));
    }, [checkIns]);

    const getRecentCheckins = useCallback((days: number = 7): CheckIn[] => {
        const today = new Date();
        return checkIns.filter(c => differenceInDays(today, parseISO(c.date)) < days)
                       .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    }, [checkIns]);
    
     const getStreak = useCallback(() => {
        if (!activeHabit) return 0;
        let streak = 0;
        let currentDate = new Date();
        
        const todaysCheckin = getCheckInForDate(currentDate);
        if(todaysCheckin && todaysCheckin.status !== 'missed') {
            streak++;
            currentDate = subDays(currentDate, 1);
        } else if (!todaysCheckin && activeHabit.days_of_week.includes(getDay(currentDate))){
             if (isSameDay(parseISO(activeHabit.start_date), new Date())) return 0;
        } else {
             currentDate = subDays(currentDate, 1);
        }

        while (true) {
            const checkIn = getCheckInForDate(currentDate);
            const dayOfWeek = getDay(currentDate);

            if (activeHabit.days_of_week.includes(dayOfWeek)) {
                if (checkIn && checkIn.status !== 'missed') {
                    streak++;
                } else {
                    break; 
                }
            }
             if (differenceInDays(new Date(), parseISO(activeHabit.start_date)) < 1 && streak === 0) break;
            currentDate = subDays(currentDate, 1);
            if (differenceInDays(new Date(), currentDate) > 365) break; 
        }
        return streak;
    }, [checkIns, activeHabit, getCheckInForDate]);

    const getSuccessRate = useCallback(() => {
        if (!activeHabit) return 0;
        const habitStartDate = parseISO(activeHabit.start_date);
        const today = new Date();
        if (habitStartDate > today) return 0;
        const allDaysSinceStart = eachDayOfInterval({ start: habitStartDate, end: today });
        const successfulCheckIns = checkIns.filter(c => c.habit_id === activeHabit.id && (c.status === 'completed' || c.status === 'partial')).length;
        const expectedCheckinCount = allDaysSinceStart.filter(day => activeHabit.days_of_week.includes(getDay(day))).length;
        if (expectedCheckinCount === 0) return 0;
        return Math.min(Math.round((successfulCheckIns / expectedCheckinCount) * 100), 100);
    }, [activeHabit, checkIns]);

    const getDaysActive = useCallback(() => {
        if (!activeHabit) return 0;
        return differenceInDays(new Date(), parseISO(activeHabit.start_date)) + 1;
    }, [activeHabit]);

    const value = {
        session, profile, habits, activeHabit, checkIns, dailyQuote, loading,
        login, logout, signUp, addHabit, addCheckIn, getDailyQuote, updateProfile,
        getCheckInForDate, getStreak, getSuccessRate, getDaysActive, getRecentCheckins, deleteActiveHabit, archiveActiveHabit
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};