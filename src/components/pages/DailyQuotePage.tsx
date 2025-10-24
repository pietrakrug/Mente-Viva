import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Gift, Lock, Copy } from '../Icons';
import { toast } from '../../App';
import { isToday, parseISO } from 'date-fns';

type QuoteState = 'loading' | 'revealed' | 'locked' | 'ready';

const DailyQuotePage: React.FC = () => {
    const { dailyQuote, getDailyQuote } = useData();
    const [quoteState, setQuoteState] = useState<QuoteState>('loading');

    useEffect(() => {
        // Fix: Improved logic to handle stale quotes from previous days.
        if (!dailyQuote || !isToday(parseISO(dailyQuote.date))) {
            setQuoteState('ready');
        } else {
            setQuoteState('revealed');
        }
    }, [dailyQuote]);

    const handleReveal = async () => {
        setQuoteState('loading');
        try {
            await getDailyQuote();
            // The useEffect will catch the change and set state to 'revealed'
        } catch (error) {
            toast.error("Não foi possível buscar a frase do dia.");
            setQuoteState('ready'); // Revert to ready on error
        }
    };

    const handleCopy = () => {
        if (dailyQuote?.content) {
            navigator.clipboard.writeText(dailyQuote.content);
            toast.success("Frase copiada para a área de transferência!");
        }
    };

    const renderContent = () => {
        switch (quoteState) {
            case 'loading':
                return (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Gerando sua dose diária de inspiração...</p>
                    </div>
                );
            case 'ready':
                return (
                    <div className="text-center">
                        <Gift className="h-24 w-24 mx-auto text-primary animate-pulse-strong" />
                        <h2 className="text-2xl font-bold mt-4">Seu Baú Diário</h2>
                        <p className="text-muted-foreground my-2">Uma nova pérola de sabedoria espera por você.</p>
                        <button onClick={handleReveal} className="mt-4 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-transform hover:scale-105">
                            Revelar Frase do Dia
                        </button>
                    </div>
                );
            case 'revealed':
                return (
                     <div className="text-center">
                        <blockquote className="text-xl lg:text-2xl font-serif italic p-6 border-l-4 border-accent bg-accent/10 rounded-r-lg">
                            "{dailyQuote?.content}"
                        </blockquote>
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-secondary">
                                <Copy className="h-4 w-4" /> Copiar
                            </button>
                             <p className="text-sm text-muted-foreground">Volte amanhã para uma nova frase!</p>
                        </div>
                    </div>
                );
             case 'locked': // This state is similar to revealed for simplicity
                return (
                     <div className="text-center">
                        <Lock className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-bold">Já Usou Hoje</h2>
                        <p className="text-muted-foreground my-2">Sua frase de hoje já foi revelada. Volte amanhã para uma nova inspiração!</p>
                    </div>
                )
        }
    };
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Frase do Dia</h1>
            <div className="bg-card border rounded-lg flex items-center justify-center min-h-[400px] p-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default DailyQuotePage;
