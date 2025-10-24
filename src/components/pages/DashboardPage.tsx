import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
// Fix: Imported Bar component from recharts
import { BarChart as RechartsBarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Flame, Target, CheckCircle, Calendar, Brain } from '../Icons';
import { generateInsight } from '../../services/gemini';
import HabitCreationModal from '../HabitCreationModal';
import CheckInModal from '../CheckInModal';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, getDay, startOfMonth, startOfWeek, subDays } from 'date-fns';

// Fix: Added a color map to prevent Tailwind JIT issues with dynamic class names.
const statCardColorMap = {
    orange: 'text-orange-500 bg-orange-500/10',
    green: 'text-green-500 bg-green-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
};

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string | number, color: keyof typeof statCardColorMap }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-card p-4 rounded-lg border flex items-start gap-4">
        <div className={`p-2 rounded-full ${statCardColorMap[color]}`}>
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const CalendarView: React.FC = () => {
    const { getCheckInForDate, activeHabit } = useData();
    const [currentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getStatusColor = (status: string | undefined) => {
        if (!status) return 'bg-transparent';
        switch (status) {
            case 'completed': return 'bg-success/80';
            case 'partial': return 'bg-warning/80';
            case 'missed': return 'bg-destructive/80';
            default: return 'bg-transparent';
        }
    };
    
    return (
        <div className="bg-card p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{format(currentDate, 'MMMM yyyy')}</h3>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => <div key={i}>{day}</div>)}
                {days.map(day => {
                    const checkin = getCheckInForDate(day);
                    const isToday = isSameDay(day, new Date());
                    const isHabitDay = activeHabit?.days_of_week.includes(getDay(day));

                    return (
                        <div key={day.toString()} className="flex justify-center items-center h-8">
                           <div className={`w-7 h-7 rounded-full flex items-center justify-center
                                ${isToday ? 'border-2 border-primary' : ''}
                                ${getStatusColor(checkin?.status)}
                                ${!isHabitDay && !checkin ? 'text-muted-foreground/50': ''}
                            `}>
                                {format(day, 'd')}
                           </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

const DashboardPage: React.FC = () => {
    const { profile, activeHabit, checkIns, getStreak, getSuccessRate, getDaysActive, getCheckInForDate, getRecentCheckins } = useData();
    const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [insight, setInsight] = useState<string>('');
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);

    const hasCheckedInToday = !!getCheckInForDate(new Date());
    
    useEffect(() => {
        const fetchInsight = async () => {
            if (activeHabit && checkIns.filter(c => c.habit_id === activeHabit.id).length >= 3) {
                setIsLoadingInsight(true);
                const recentCheckins = getRecentCheckins(7);
                const newInsight = await generateInsight(recentCheckins);
                setInsight(newInsight);
                setIsLoadingInsight(false);
            }
        };
        fetchInsight();
    }, [checkIns, activeHabit, getRecentCheckins]);

    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), i);
        const checkin = getCheckInForDate(date);
        return {
            name: format(date, 'EEE'),
            status: checkin?.status || 'none',
        };
    }).reverse();
    
    const statusColorMap: { [key: string]: string } = {
        completed: 'hsl(var(--success))',
        partial: 'hsl(var(--warning))',
        missed: 'hsl(var(--destructive))',
        none: 'hsl(var(--muted))'
    };

    if (!activeHabit) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-semibold">Bem-vindo(a), {profile?.full_name.split(' ')[0]}!</h2>
                <p className="text-muted-foreground mt-2">Parece que você ainda não tem um hábito ativo.</p>
                <button onClick={() => setIsHabitModalOpen(true)} className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Criar meu primeiro hábito
                </button>
                <HabitCreationModal isOpen={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Flame} title="Streak Atual" value={`${getStreak()} dias`} color="orange" />
                <StatCard icon={Target} title="Taxa de Sucesso" value={`${getSuccessRate()}%`} color="green" />
                <StatCard icon={CheckCircle} title="Total de Check-ins" value={checkIns.length} color="blue" />
                <StatCard icon={Calendar} title="Dias Ativos" value={getDaysActive()} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg-col-span-2 space-y-6">
                    <div className="bg-card p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-2">{activeHabit.name}</h2>
                        {hasCheckedInToday ? (
                            <div className="flex items-center gap-2 text-success">
                                <CheckCircle className="h-5 w-5" />
                                <p>Parabéns! Você já fez seu check-in de hoje.</p>
                            </div>
                        ) : (
                            <button onClick={() => setIsCheckInModalOpen(true)} className="bg-gradient-to-r from-primary to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
                                Fazer Check-in de Hoje
                            </button>
                        )}
                    </div>

                    <div className="bg-card p-6 rounded-lg border">
                        <h3 className="font-semibold mb-4">Consistência Semanal</h3>
                        <div style={{width: '100%', height: 200}}>
                            <ResponsiveContainer>
                                <RechartsBarChart data={weeklyData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis hide={true} />
                                    <Tooltip contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))'}}/>
                                    {/* Fix: Replaced nested BarChart with Bar component */}
                                    <Bar dataKey="status" barSize={30} radius={[4, 4, 0, 0]}>
                                        {weeklyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={statusColorMap[entry.status]} />
                                        ))}
                                    </Bar>
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-accent/80 to-purple-500 p-6 rounded-lg text-accent-foreground">
                        <div className="flex items-center gap-3 mb-3">
                            <Brain className="h-6 w-6" />
                            <h3 className="text-lg font-semibold">Insight da IA</h3>
                        </div>
                        {isLoadingInsight ? (
                           <p className="animate-pulse">Gerando seu insight...</p>
                        ) : (
                            <p className="text-sm">{insight}</p>
                        )}
                    </div>
                     <CalendarView />
                </div>
            </div>
            <HabitCreationModal isOpen={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} />
            <CheckInModal isOpen={isCheckInModalOpen} onClose={() => setIsCheckInModalOpen(false)} />
        </div>
    );
};

export default DashboardPage;
