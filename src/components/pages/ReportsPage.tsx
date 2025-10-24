import React from 'react';
import { useData } from '../../context/DataContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart as BarChartIcon } from '../Icons';

const COLORS = {
    completed: 'hsl(var(--success))',
    partial: 'hsl(var(--warning))',
    missed: 'hsl(var(--destructive))',
};

const ReportsPage: React.FC = () => {
    const { checkIns, getSuccessRate } = useData();

    if (checkIns.length === 0) {
        return (
             <div className="text-center py-16 bg-card border rounded-lg">
                <BarChartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Sem dados para relatórios</h3>
                <p className="text-muted-foreground mt-2">Faça alguns check-ins para começar a ver suas análises de desempenho.</p>
            </div>
        );
    }
    
    // Data processing
    const executionBalance = [
        { name: 'Completo', value: checkIns.filter(c => c.status === 'completed').length },
        { name: 'Parcial', value: checkIns.filter(c => c.status === 'partial').length },
        { name: 'Não Cumprido', value: checkIns.filter(c => c.status === 'missed').length },
    ].filter(item => item.value > 0);

    const difficultyMoments = [
        { name: 'Manhã', missed: checkIns.filter(c => c.time_of_day === 'morning' && c.status === 'missed').length },
        { name: 'Tarde', missed: checkIns.filter(c => c.time_of_day === 'afternoon' && c.status === 'missed').length },
        { name: 'Noite', missed: checkIns.filter(c => c.time_of_day === 'evening' && c.status === 'missed').length },
    ];
    
    const countItems = (field: 'sabotage_patterns' | 'motivations' | 'challenges') => {
        const counts: { [key: string]: number } = {};
        checkIns.forEach(c => {
            c[field]?.forEach(item => {
                counts[item] = (counts[item] || 0) + 1;
            });
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    }
    
    const sabotageData = countItems('sabotage_patterns').slice(0, 5);
    const motivationData = countItems('motivations');
    const challengeData = countItems('challenges');


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Relatórios Analíticos</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg border text-center">
                    <p className="text-muted-foreground">Taxa de Sucesso</p>
                    <p className="text-4xl font-bold text-success">{getSuccessRate()}%</p>
                </div>
                <div className="bg-card p-4 rounded-lg border text-center">
                    <p className="text-muted-foreground">Total de Check-ins</p>
                    <p className="text-4xl font-bold">{checkIns.length}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border text-center">
                    <p className="text-muted-foreground">Check-ins Completos</p>
                    <p className="text-4xl font-bold">{executionBalance.find(e => e.name === 'Completo')?.value || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Balanço de Execução">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={executionBalance} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {executionBalance.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name.split(' ')[0].toLowerCase() as keyof typeof COLORS]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
                 <ChartCard title="Momentos de Dificuldade">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={difficultyMoments} layout="vertical">
                             <XAxis type="number" hide />
                             <YAxis type="category" dataKey="name" width={60} />
                             <Tooltip />
                             <Bar dataKey="missed" fill={COLORS.missed} name="Não cumprido" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Padrões de Autossabotagem">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={sabotageData}>
                            <XAxis dataKey="name" hide />
                             <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--accent))" name="Frequência" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Fontes de Motivação">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={motivationData}>
                            <XAxis dataKey="name" hide />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--primary))" name="Frequência" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

const ChartCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-card p-4 rounded-lg border">
        <h3 className="font-semibold mb-4">{title}</h3>
        {children}
    </div>
);

export default ReportsPage;
