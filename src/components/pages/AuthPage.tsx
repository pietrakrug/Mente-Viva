import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Brain } from '../Icons';
import { toast } from '../../App';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signUp } = useData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        whatsapp: '',
        birth_date: '',
        cpf: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleToggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            full_name: '',
            email: '',
            whatsapp: '',
            birth_date: '',
            cpf: '',
            password: '',
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Login realizado com sucesso!');
            } else {
                await signUp(formData);
                toast.success('Conta criada com sucesso! Bem-vindo(a)!');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Ocorreu um erro.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-start justify-start min-h-screen bg-background p-8 md:p-16">
            <div className="w-full max-w-lg">
                <div className="flex items-center gap-4 mb-4">
                    <Brain className="h-10 w-10 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Mente Viva</h1>
                        <p className="text-muted-foreground">Sua jornada de transformação começa aqui.</p>
                    </div>
                </div>

                <div className="mt-12">
                     <h2 className="text-2xl font-semibold mb-4">
                        {isLogin ? 'Acessar sua conta' : 'Criar uma conta'}
                    </h2>

                    {isLogin ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 space-y-2 sm:space-y-0">
                                <label htmlFor="email" className="sr-only">E-mail</label>
                                <input id="email" type="email" name="email" placeholder="E-mail" required className="flex-grow w-full px-3 py-2 bg-background border rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} value={formData.email} />
                                
                                <label htmlFor="password-login" className="sr-only">Senha</label>
                                <input id="password-login" type="password" name="password" placeholder="Senha" required className="flex-grow w-full px-3 py-2 bg-background border rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} value={formData.password} />
                                
                                <button type="submit" disabled={loading} className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed whitespace-nowrap">
                                    {loading ? '...' : 'Entrar'}
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" name="full_name" placeholder="Nome completo" required className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                            <input type="text" name="whatsapp" placeholder="WhatsApp (11) 99999-9999" required className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                            <input type="date" name="birth_date" placeholder="Data de nascimento" required className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                            <input type="text" name="cpf" placeholder="CPF" required className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                            <input type="email" name="email" placeholder="E-mail" required className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                            <input type="password" name="password" placeholder="Senha (mínimo 6 caracteres)" required minLength={6} className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                            
                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed">
                                {loading ? 'Criando...' : 'Criar Conta'}
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-sm">
                        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        <button onClick={handleToggleForm} className="font-semibold text-primary hover:underline ml-1">
                            {isLogin ? 'Cadastre-se' : 'Faça login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
