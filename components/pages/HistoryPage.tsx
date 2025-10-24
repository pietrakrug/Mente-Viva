import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import type { CheckIn } from '../../types';
import { ChevronRight, CheckCircle } from '../Icons';
// Fix: Import date-fns functions directly instead of using window.dateFns
// Fix: Changed to direct submodule import for parseISO as it was not found in the main 'date-fns' export.
import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';

const statusMap = {
    completed: { text: 'Completo', color: 'bg-success', icon: '✅' },
    partial: { text: 'Parcial', color: 'bg-warning', icon: '⚠️' },
    missed: { text: 'Não Realizado', color: 'bg-destructive', icon: '❌' },
};

const CheckInCard: React.FC<{ checkIn: CheckIn; habitName?: string }> = ({ checkIn, habitName }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { status, date, reflection, energy_level, satisfaction, mood, challenges, motivations } = checkIn;
    const details = statusMap[status];

    return (
        <div className="bg-card border rounded-lg overflow-hidden">
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${details.color}`}></div>
                    <div>
                        <p className="font-semibold">{format(parseISO(date), "EEEE, dd 'de' MMMM 'de' yyyy")}</p>
                        {habitName && <p className="text-xs text-muted-foreground">{habitName}</p>}
                        <p className={`text-sm font-medium ${details.color.replace('bg-', 'text-')}`}>{details.text}</p>
                    </div>
                </div>
                <ChevronRight className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
            {isExpanded && (
                <div className="p-4 border-t bg-secondary/30 space-y-4">
                    {reflection && (
                        <div className="p-3 bg-background rounded-md border">
                            <p className="text-sm font-semibold mb-1">Reflexão:</p>
                            <p className="text-muted-foreground text-sm italic">"{reflection}"</p>
                        </div>
                    )}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-muted-foreground">Energia</p>
                            <p className="font-bold text-lg">{energy_level}/10</p>
                        </div>
                         <div>
                            <p className="text-xs text-muted-foreground">Satisfação</p>
                            <p className="font-bold text-lg">{satisfaction}/10</p>
                        </div>
                         <div>
                            <p className="text-xs text-muted-foreground">Humor</p>
                            <p className="font-bold text-lg">{mood}/10</p>
                        </div>
                    </div>
                    {challenges && challenges.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold mb-2">Desafios:</p>
                            <div className="flex flex-wrap gap-2">
                                {challenges.map(c => <span key={c} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{c}</span>)}
                            </div>
                        </div>
                    )}
                    {motivations && motivations.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold mb-2">Motivações:</p>
                            <div className="flex flex-wrap gap-2">
                                {motivations.map(m => <span key={m} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{m}</span>)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const HistoryPage: React.FC = () => {
    const { checkIns, habits } = useData();
    const sortedCheckIns = [...checkIns].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Histórico de Check-ins</h1>

            {sortedCheckIns.length > 0 ? (
                <div className="space-y-4">
                    {sortedCheckIns.map(checkIn => {
                        const habit = habits.find(h => h.id === checkIn.habit_id);
                        return <CheckInCard key={checkIn.id} checkIn={checkIn} habitName={habit?.name} />;
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-card border rounded-lg">
                    <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Seu histórico está vazio</h3>
                    <p className="text-muted-foreground mt-2">Complete seu primeiro check-in para começar a ver seu progresso aqui!</p>
                </div>
            )}
        </div>
    );
};

export default HistoryPage;