import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { toast } from '../App';
import type { Habit } from '../types';

interface HabitCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const HabitCreationModal: React.FC<HabitCreationModalProps> = ({ isOpen, onClose }) => {
    const { addHabit, habits } = useData();
    const [step, setStep] = useState(1);
    const [habitName, setHabitName] = useState('');
    const [motivation, setMotivation] = useState('');
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [duration, setDuration] = useState<15 | 30 | 45>(30);
    
    const habitLimit = 1;
    const totalSteps = 3;

    const handleDayClick = (dayIndex: number) => {
        setSelectedDays(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex)
                : [...prev, dayIndex]
        );
    };

    const handleNext = () => {
        if (step === 1 && habitName.trim().length === 0) {
            toast.error("Por favor, dê um nome ao seu hábito.");
            return;
        }
        if (step === 2 && motivation.trim().length === 0) {
            toast.error("Sua motivação é importante! Escreva o porquê.");
            return;
        }
        setStep(s => s + 1);
    };
    
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = () => {
        if (habits.filter(h => h.is_active).length >= habitLimit) {
            toast.error(`Você já atingiu o limite de ${habitLimit} hábito ativo. Crie um novo para substituir o atual.`);
            return;
        }
        if (selectedDays.length === 0) {
            toast.error("Escolha pelo menos um dia da semana.");
            return;
        }
        
        const newHabit: Omit<Habit, 'id' | 'user_id' | 'is_active' | 'start_date'> = {
            name: habitName,
            motivation,
            days_of_week: selectedDays.sort(),
            duration_days: duration,
        };
        addHabit(newHabit);
        toast.success("Hábito criado com sucesso!");
        onClose();
        // Reset state for next time
        setStep(1);
        setHabitName('');
        setMotivation('');
        setSelectedDays([]);
        setDuration(30);
    };

    if (!isOpen) return null;

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Qual hábito você quer construir?</h3>
                        <p className="text-sm text-muted-foreground mb-4">Seja específico. Ex: "Meditar por 10 minutos".</p>
                        <input
                            type="text"
                            value={habitName}
                            onChange={(e) => setHabitName(e.target.value)}
                            maxLength={60}
                            className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="ex: Meditação Matinal"
                        />
                         <p className="text-right text-xs text-muted-foreground mt-1">{habitName.length}/60</p>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Por que isso é importante para você?</h3>
                         <p className="text-sm text-muted-foreground mb-4">Conectar-se com seu "porquê" é a chave para a motivação duradoura.</p>
                        <textarea
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="Escreva sua motivação aqui..."
                        />
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Frequência e Duração</h3>
                        <p className="text-sm text-muted-foreground mb-4">Defina os dias e por quanto tempo quer se comprometer.</p>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Quais dias da semana?</label>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                    {daysOfWeek.map((day, index) => (
                                        <button
                                            key={day}
                                            onClick={() => handleDayClick(index)}
                                            className={`p-2 border rounded-lg transition-all ${
                                                selectedDays.includes(index)
                                                    ? 'bg-primary text-primary-foreground border-primary border-2 font-bold'
                                                    : 'bg-background hover:bg-secondary'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Duração do Desafio</label>
                                <select value={duration} onChange={(e) => setDuration(Number(e.target.value) as 15|30|45)} className="w-full px-4 py-2 bg-background border rounded-lg">
                                    <option value="15">15 dias</option>
                                    <option value="30">30 dias</option>
                                    <option value="45">45 dias</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-center">Criar Novo Hábito</h2>
                <div className="w-full bg-muted rounded-full h-2.5 mb-6">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                </div>
                
                <div className="min-h-[200px]">
                    {renderStepContent()}
                </div>

                <div className="flex justify-between mt-6">
                    {step > 1 ? (
                        <button onClick={handleBack} className="px-6 py-2 border rounded-lg hover:bg-secondary">Voltar</button>
                    ) : <div></div>}
                    {step < totalSteps ? (
                        <button onClick={handleNext} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Próximo</button>
                    ) : (
                        <button onClick={handleSubmit} className="px-6 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90">Criar Hábito</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HabitCreationModal;
