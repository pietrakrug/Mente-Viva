import React, { useState } from 'react';
import { Target, Lightbulb, Brain, ChevronRight, Moon, Dumbbell } from '../Icons';

interface Tip {
    title: string;
    content: string;
    science: string;
    action: string;
}

interface Category {
    name: string;
    icon: React.ElementType;
    tips: Tip[];
}

const tipsData: Category[] = [
    {
        name: 'Formação de Hábitos',
        icon: Target,
        tips: [
            { title: 'Regra dos 2 Minutos', content: 'Reduza seu novo hábito a algo que leva menos de dois minutos para ser feito.', science: 'Diminui a energia de ativação necessária, tornando mais fácil começar e superar a procrastinação.', action: 'Se quer ler mais, comece lendo uma página. Se quer se exercitar, coloque sua roupa de ginástica.' },
            { title: 'Empilhamento de Hábitos', content: 'Ancore um novo hábito a um hábito já existente.', science: 'Aproveita um gatilho neural já estabelecido, criando uma cadeia de comportamentos automáticos.', action: 'Após escovar os dentes (hábito existente), medite por um minuto (novo hábito).' },
        ],
    },
    {
        name: 'Sono & Recuperação',
        icon: Moon,
        tips: [
            { title: 'Ciclo de 90 Minutos', content: 'Planeje seu sono em múltiplos de 90 minutos (ex: 7.5h ou 9h) para acordar ao final de um ciclo de sono, sentindo-se mais revigorado.', science: 'Respeita os ciclos REM e NREM do cérebro, evitando a "inércia do sono" que ocorre ao acordar durante o sono profundo.', action: 'Use uma calculadora de sono online para determinar a melhor hora de dormir com base na hora que você precisa acordar.' },
            { title: 'Luz Solar pela Manhã', content: 'Exponha-se à luz solar direta (sem óculos de sol) por 5-10 minutos logo após acordar.', science: 'A luz solar matinal ajuda a regular seu ritmo circadiano (relógio biológico), sinalizando para o cérebro que é hora de estar alerta e suprimindo a melatonina.', action: 'Tome seu café da manhã perto de uma janela ou faça uma curta caminhada ao ar livre assim que acordar.' },
            { title: 'Ritual de Desligamento', content: 'Crie uma rotina relaxante 30-60 minutos antes de dormir, sem telas.', science: 'Sinaliza para o seu cérebro que é hora de desacelerar e começar a produzir melatonina, o hormônio do sono.', action: 'Defina um alarme 30 minutos antes da hora de dormir para começar seu ritual: ler um livro, tomar um chá, ouvir música calma.' },
            { title: 'Timing da Cafeína', content: 'Evite consumir cafeína pelo menos 8 a 10 horas antes do seu horário de dormir.', science: 'A cafeína tem uma meia-vida longa, o que significa que pode permanecer no seu sistema e atrapalhar a qualidade do sono profundo, mesmo que você consiga adormecer.', action: 'Troque o café da tarde por um chá de ervas ou água com gás.' },
        ],
    },
    {
        name: 'Exercício & Bem-Estar',
        icon: Dumbbell,
        tips: [
            { title: 'Micro-Exercícios Diários', content: 'Em vez de um treino de 1 hora, faça de 5 a 10 minutos de atividade várias vezes ao dia.', science: 'Ativa o metabolismo e libera endorfinas de forma consistente, melhorando o humor e a energia sem a alta barreira de uma longa sessão.', action: 'Faça 10 flexões antes do café da manhã ou 20 agachamentos enquanto espera um arquivo baixar.' },
            { title: 'Caminhada Pós-Refeição', content: 'Faça uma caminhada leve de 10 a 15 minutos após a refeição principal.', science: 'Ajuda a regular os níveis de açúcar no sangue, melhora a digestão e pode prevenir a queda de energia pós-refeição.', action: 'Em vez de sentar no sofá depois do almoço, caminhe pelo seu quarteirão.' },
        ],
    },
    {
        name: 'Foco & Produtividade',
        icon: Brain,
        tips: [
            { title: 'Técnica Pomodoro Adaptada', content: 'Trabalhe focado por 25 minutos, depois faça uma pausa de 5 minutos.', science: 'Respeita a capacidade de atenção do cérebro e previne o esgotamento mental, mantendo a performance alta.', action: 'Use um timer. Durante os 25 minutos, proíba-se de checar notificações ou e-mails.' },
            { title: 'Monotarefa Radical', content: 'Faça apenas uma coisa de cada vez. Feche todas as outras abas e aplicativos.', science: 'O cérebro humano não é multitarefa. A "multitarefa" é na verdade uma troca rápida de contexto, que consome energia e aumenta os erros.', action: 'Defina uma única tarefa para os próximos 30 minutos e elimine todas as outras distrações.' },
        ],
    },
    {
        name: 'Motivação & Mentalidade',
        icon: Lightbulb,
        tips: [
            { title: 'Bundling de Tentações', content: 'Combine algo que você quer fazer com algo que você precisa fazer.', science: 'Associa uma recompensa imediata (dopamina) a uma tarefa menos prazerosa, aumentando a motivação para completá-la.', action: 'Só assista sua série favorita (querer) enquanto estiver na esteira (precisar).' },
            { title: 'Reformular o Fracasso', content: 'Veja uma falha não como uma derrota, mas como um dado.', science: 'Promove uma "mentalidade de crescimento" (growth mindset), que vê desafios como oportunidades de aprendizado, em vez de ameaças ao ego.', action: 'Se você pulou um dia de treino, pergunte-se: "O que eu aprendi com isso?" em vez de "Eu sou um fracasso".' },
        ]
    }
];

const AccordionItem: React.FC<{ tip: Tip }> = ({ tip }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left hover:bg-secondary">
                <span className="font-semibold">{tip.title}</span>
                <ChevronRight className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 bg-secondary/30 space-y-3 text-sm">
                    <p><strong className="text-primary">O que é:</strong> {tip.content}</p>
                    <p><strong className="text-accent">A Ciência:</strong> {tip.science}</p>
                    <p className="p-2 bg-primary/10 rounded-md"><strong className="text-primary">Ação Imediata:</strong> {tip.action}</p>
                </div>
            )}
        </div>
    )
};


const TipsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dicas & Estratégias</h1>
            <p className="text-muted-foreground">Uma biblioteca de conhecimento com técnicas baseadas em ciência para otimizar sua jornada.</p>

            <div className="space-y-8">
                {tipsData.map(category => (
                    <div key={category.name}>
                        <div className="flex items-center gap-3 mb-4">
                            <category.icon className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-semibold">{category.name}</h2>
                        </div>
                        <div className="bg-card border rounded-lg overflow-hidden">
                            {category.tips.map(tip => <AccordionItem key={tip.title} tip={tip} />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TipsPage;