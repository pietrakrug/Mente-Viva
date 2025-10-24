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
        <div className="flex items-center justify-center min-h-screen bg-secondary/30 p-4">
            <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border">
                <div className="flex flex-col items-center mb-6">
                    <Brain className="h-12 w-12 text-primary mb-2" />
                    <h1 className="text-3xl font-bold text-primary">Mente Viva</h1>
                    <p className="text-muted-foreground mt-1">Sua jornada de transformação começa aqui.</p>
                </div>

                <h2 className="text-2xl font-semibold text-center mb-6">
                    {isLogin ? 'Acessar sua conta' : 'Criar uma conta'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <input type="text" name="full_name" placeholder="Nome completo" required className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                            <input type="text" name="whatsapp" placeholder="WhatsApp (11) 99999-9999" required className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                            <input type="date" name="birth_date" placeholder="Data de nascimento" required className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                            <input type="text" name="cpf" placeholder="CPF" required className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                        </>
                    )}
                    <input type="email" name="email" placeholder="E-mail" required className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                    <input type="password" name="password" placeholder="Senha" required minLength={6} className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-primary focus:border-primary" onChange={handleChange} />
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed">
                        {loading ? (isLogin ? 'Entrando...' : 'Criando...') : (isLogin ? 'Entrar' : 'Criar Conta')}
                    </button>
                </form>

                <p className="text-center text-muted-foreground mt-6 text-sm">
                    {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="font-semibold text-primary hover:underline ml-1">
                        {isLogin ? 'Cadastre-se' : 'Faça login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
