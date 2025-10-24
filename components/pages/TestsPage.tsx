
import React from 'react';
import { Brain, Target, Shield } from '../Icons';

interface TestCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    duration: string;
    questions: number;
    color: string;
}

const TestCard: React.FC<TestCardProps> = ({ icon: Icon, title, description, duration, questions, color }) => (
    <div className="bg-card border rounded-lg p-6 flex flex-col">
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${color}/10`}>
                <Icon className={`h-8 w-8 ${color}`} />
            </div>
            <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{description}</p>
            </div>
        </div>
        <div className="flex-grow" />
        <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground border-t pt-4">
            <span>~{duration} min</span>
            <span>{questions} perguntas</span>
        </div>
        <button className={`mt-4 w-full font-semibold py-2 rounded-lg bg-${color.split('-')[1]} text-white/90 hover:opacity-90 transition-opacity`}>
            Iniciar Teste
        </button>
    </div>
);

const TestsPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Testes Comportamentais</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Descubra mais sobre seus padrões de pensamento e comportamento com nossas avaliações baseadas em neurociência. Conhecer-se é o primeiro passo para a mudança.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TestCard
                    icon={Brain}
                    title="Avaliação de Controle Executivo"
                    description="Mede sua autodisciplina, foco e capacidade de adiar gratificação."
                    duration="5"
                    questions={15}
                    color="text-primary"
                />
                <TestCard
                    icon={Target}
                    title="Perfil de Sensibilidade à Recompensa"
                    description="Avalia seu sistema motivacional, descobrindo se você responde mais a recompensas internas ou externas."
                    duration="5"
                    questions={15}
                    color="text-accent"
                />
                <TestCard
                    icon={Shield}
                    title="Inventário de Autossabotagem"
                    description="Identifica loops comportamentais inconscientes e vieses cognitivos que podem estar impedindo seu progresso."
                    duration="7"
                    questions={20}
                    color="text-warning"
                />
            </div>

            <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold">Por que fazer os testes?</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                    Nossos testes não são diagnósticos, mas ferramentas de autoconhecimento. Ao entender como seu cérebro funciona, você pode escolher estratégias de formação de hábitos que se alinham com seus pontos fortes naturais, tornando a jornada mais fácil e eficaz. Recomendamos refazer os testes a cada 3 meses para acompanhar sua evolução.
                </p>
            </div>
        </div>
    );
};

export default TestsPage;
