import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, History, BarChart, TestTube, Quote, Lightbulb, User, Brain } from './Icons';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/history', label: 'Histórico', icon: History },
    { path: '/reports', label: 'Relatórios', icon: BarChart },
    { path: '/tests', label: 'Testes', icon: TestTube },
    { path: '/daily-quote', label: 'Frase do Dia', icon: Quote },
    { path: '/tips', label: 'Dicas', icon: Lightbulb },
    { path: '/profile', label: 'Perfil', icon: User },
];

const Sidebar: React.FC = () => {
    const location = useLocation();
    
    return (
        <aside className="hidden lg:flex lg:flex-col w-64 bg-secondary/30 border-r border-border p-4">
            <div className="flex items-center gap-2 mb-8">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">Mente Viva</h1>
            </div>
            <nav className="flex flex-col gap-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:bg-primary/10 hover:text-primary ${
                                isActive ? 'bg-primary/10 text-primary font-semibold' : ''
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

const MobileNav: React.FC = () => {
    return (
        <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-10">
            <nav className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 p-1 transition-colors w-full text-center ${
                                isActive ? 'text-primary' : 'text-muted-foreground'
                            }`
                        }
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="text-xs">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </footer>
    );
};

const Layout: React.FC = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
                <Outlet />
            </main>
            <MobileNav />
        </div>
    );
};

export default Layout;
