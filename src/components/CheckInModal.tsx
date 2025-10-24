import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { toast } from '../App';
import type { CheckIn, CheckInStatus } from '../types';
import { format } from 'date-fns';

interface CheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const challengesOptions = ["Fadiga física", "Exaustão mental", "Falta de tempo", "Distrações", "Falta de motivação", "Fatores ambientais"];
const motivationsOptions = ["Meta pessoal", "Responsabilidade externa", "Recompensa imediata", "Benefícios a longo prazo", "Apoio de outros"];
const sabotageOptions = ["Procrastinação", "Perfeccionismo", "Pensamento 'tudo ou nada'", "Autocrítica negativa", "Comparação com outros"];

const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
    const { addCheckIn, activeHabit } = useData();
    const [step, setStep] = useState(1);
    const totalSteps = 7;

    const [status, setStatus] = useState<CheckInStatus | null>(null);
    const [challenges, setChallenges] = useState<string[]>([]);
    const [motivations, setMotivations] = useState<string[]>([]);
    const [sabotagePatterns, setSabotagePatterns] = useState<string[]>([]);
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'none' | null>(null);
    const [energyLevel, setEnergyLevel] = useState<number>(5);
    const [satisfaction, setSatisfaction] = useState<number>(5);
    const [mood, setMood] = useState<number>(5);
    const [reflection, setReflection] = useState('');

    const resetState = () => {
        setStep(1);
        setStatus(null);
        setChallenges([]);
        setMotivations([]);
        setSabotagePatterns([]);
        setTimeOfDay(null);
        setEnergyLevel(5);
        setSatisfaction(5);
        setMood(5);
        setReflection('');
    }

    const handleNext = () => {
        if (step === 1 && !status) {
            toast.error("Por favor, selecione o status do seu hábito.");
            return;
        }
        setStep(s => Math.min(s + 1, totalSteps));
    };

    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = () => {
        if (!status) {
             toast.error("Ocorreu um erro, status não definido.");
             return;
        }
        const newCheckIn: Omit<CheckIn, 'id' | 'user_id' | 'habit_id' | 'created_at'> = {
            date: format(new Date(), 'yyyy-MM-dd'),
            status, challenges, motivations, sabotage_patterns: sabotagePatterns, 
            time_of_day: timeOfDay === 'none' ? undefined : (timeOfDay || undefined),
            energy_level: energyLevel, satisfaction, mood, reflection,
        };
        addCheckIn(newCheckIn);
        toast.success("Check-in registrado com sucesso!");
        onClose();
        resetState();
    };

    if (!isOpen) return null;
    
    const handleCheckboxChange = (option: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
        setList(prev => prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]);
    };
    
    const renderStepContent = () => {
        switch(step) {
            case 1:
                return <div>
                    <h3 className="text-lg font-semibold mb-4">Como foi seu hábito hoje?</h3>
                    <div className="space-y-3">
                        {(['completed', 'partial', 'missed'] as CheckInStatus[]).map(s => (
                            <button key={s} onClick={() => setStatus(s)} className={`w-full text-left p-4 border rounded-lg transition-all ${status === s ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-secondary'}`}>
                                {s === 'completed' && '✅ Totalmente Completo'}
                                {s === 'partial' && '⚠️ Parcialmente Completo'}
                                {s === 'missed' && '❌ Não Realizado'}
                            </button>
                        ))}
                    </div>
                </div>;
            case 2:
                return <div>
                    <h3 className="text-lg font-semibold mb-4">Quais desafios você enfrentou?</h3>
                    <div className="space-y-2">
                        {challengesOptions.map(opt => <label key={opt} className="flex items-center gap-2 p-2 rounded hover:bg-secondary"><input type="checkbox" checked={challenges.includes(opt)} onChange={() => handleCheckboxChange(opt, challenges, setChallenges)} /> {opt}</label>)}
                    </div>
                </div>;
            case 3:
                return <div>
                    <h3 className="text-lg font-semibold mb-4">O que te motivou?</h3>
                    <div className="space-y-2">
                        {motivationsOptions.map(opt => <label key={opt} className="flex items-center gap-2 p-2 rounded hover:bg-secondary"><input type="checkbox" checked={motivations.includes(opt)} onChange={() => handleCheckboxChange(opt, motivations, setMotivations)} /> {opt}</label>)}
                    </div>
                </div>;
            case 4:
                return <div>
                    <h3 className="text-lg font-semibold mb-4">Identificou algum padrão de autossabotagem?</h3>
                    <div className="space-y-2">
                        {sabotageOptions.map(opt => <label key={opt} className="flex items-center gap-2 p-2 rounded hover:bg-secondary"><input type="checkbox" checked={sabotagePatterns.includes(opt)} onChange={() => handleCheckboxChange(opt, sabotagePatterns, setSabotagePatterns)} /> {opt}</label>)}
                    </div>
                </div>;
            case 5:
                return <div>
                    <h3 className="text-lg font-semibold mb-4">Em qual período do dia você se sabotou?</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {(['morning', 'afternoon', 'evening', 'none'] as const).map(p => (
                            <button key={p} onClick={() => setTimeOfDay(p)} className={`w-full text-center p-4 border rounded-lg transition-all ${timeOfDay === p ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-secondary'}`}>
                                {p === 'morning' && 'Manhã'}
                                {p === 'afternoon' && 'Tarde'}
                                {p === 'evening' && 'Noite'}
                                {p === 'none' && 'Não me sabotei hoje'}
                            </button>
                        ))}
                    </div>
                </div>;
            case 6:
                return <div>
                    <h3 className="text-lg font-semibold mb-4">Como você se sente? (1-10)</h3>
                    <div className="space-y-4">
                        <label className="block">Nível de Energia: {energyLevel}<input type="range" min="1" max="10" value={energyLevel} onChange={e => setEnergyLevel(Number(e.target.value))} className="w-full" /></label>
                        <label className="block">Satisfação: {satisfaction}<input type="range" min="1" max="10" value={satisfaction} onChange={e => setSatisfaction(Number(e.target.value))} className="w-full" /></label>
                        <label className="block">Humor: {mood}<input type="range" min="1" max="10" value={mood} onChange={e => setMood(Number(e.target.value))} className="w-full" /></label>
                    </div>
                </div>;
            case 7:
                 return (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">O que você aprendeu sobre si hoje?</h3>
                         <p className="text-sm text-muted-foreground mb-4">(Opcional)</p>
                        <textarea
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="Sua reflexão..."
                        />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-center">Check-in: {activeHabit?.name}</h2>
                <div className="w-full bg-muted rounded-full h-2.5 mb-6">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                </div>
                
                <div className="min-h-[250px] flex flex-col justify-center">
                    {renderStepContent()}
                </div>

                <div className="flex justify-between mt-6">
                    {step > 1 ? (
                        <button onClick={handleBack} className="px-6 py-2 border rounded-lg hover:bg-secondary">Voltar</button>
                    ) : <div></div>}
                    {step < totalSteps ? (
                        <button onClick={handleNext} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Próximo</button>
                    ) : (
                        <button onClick={handleSubmit} className="px-6 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90">Finalizar Check-in</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckInModal;
