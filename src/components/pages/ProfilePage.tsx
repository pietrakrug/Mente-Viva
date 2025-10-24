import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { toast } from '../../App';
import type { Profile } from '../../types';

const avatars = Array.from({ length: 10 }, (_, i) => i + 1);
const avatarUrl = "https://robohash.org/mente-viva-{seed}.png?set=set4&size=100x100";


const ProfilePage: React.FC = () => {
    const { profile, updateProfile, logout, activeHabit, deleteActiveHabit, archiveActiveHabit, loading } = useData();
    const [formData, setFormData] = useState<Partial<Profile>>(profile || {});
    const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || '1');
    const [isSaving, setIsSaving] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData(profile);
            setSelectedAvatar(profile.avatar || '1');
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({ ...formData, avatar: selectedAvatar });
            toast.success("Perfil atualizado com sucesso!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleArchiveHabit = async () => {
        if (window.confirm("Você tem certeza que deseja encerrar seu hábito atual? Ele será salvo em seu histórico e você poderá criar um novo.")) {
            setIsArchiving(true);
            try {
                await archiveActiveHabit();
                toast.success("Hábito arquivado! Você pode criar um novo no Dashboard.");
            } catch (error: any) {
                 toast.error(error.message);
            } finally {
                setIsArchiving(false);
            }
        }
    };
    
    const handleDeleteHabit = async () => {
        if (window.confirm("ATENÇÃO: Esta ação é irreversível! Você tem certeza que deseja APAGAR permanentemente seu hábito e todo o seu histórico de check-ins?")) {
            setIsDeleting(true);
            try {
                await deleteActiveHabit();
                toast.success("Hábito apagado com sucesso! Você pode criar um novo no Dashboard.");
            } catch (error: any) {
                 toast.error(error.message);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const activeHabitsCount = activeHabit ? 1 : 0;

    if (loading || !profile) return <div>Carregando perfil...</div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            
            <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold">Escolha seu Companheiro de Jornada</h2>
                <p className="text-muted-foreground text-sm mb-4">Selecione um avatar que represente sua força interior. Este será seu símbolo de progresso na Mente Viva.</p>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-4 mb-4">
                    {avatars.map((avatarId) => (
                        <button key={avatarId} onClick={() => setSelectedAvatar(avatarId.toString())} className={`rounded-full aspect-square border-4 transition-all ${selectedAvatar === avatarId.toString() ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}>
                            <img src={avatarUrl.replace('{seed}', avatarId.toString())} alt={`Avatar ${avatarId}`} className="rounded-full w-full h-full object-cover bg-secondary" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                        <input type="text" name="full_name" value={formData.full_name || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-background" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                        <input type="email" name="email" value={formData.email || ''} readOnly className="w-full mt-1 p-2 border rounded-md bg-background opacity-70" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-muted-foreground">WhatsApp</label>
                        <input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-background" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
                        <input type="date" name="birth_date" value={formData.birth_date || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-background" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-muted-foreground">CPF</label>
                        <input type="text" name="cpf" value={formData.cpf || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-background" />
                    </div>
                    <div>
                         <label className="text-sm font-medium text-muted-foreground">Membro desde</label>
                         <p className="mt-1 p-2 font-semibold">{new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">Gerenciamento do Hábito</h2>
                 <p className="text-muted-foreground text-sm mb-4">
                    Aqui você pode gerenciar seu ciclo de hábitos. Encerrar um hábito o salva no histórico para consulta, enquanto excluir o remove permanentemente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleArchiveHabit}
                        disabled={!activeHabit || isArchiving || isDeleting}
                        className="px-4 py-2 border rounded-lg hover:bg-secondary text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isArchiving ? 'Encerrando...' : 'Encerrar e Arquivar Hábito'}
                    </button>
                    <button
                        onClick={handleDeleteHabit}
                        disabled={!activeHabit || isDeleting || isArchiving}
                        className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? 'Excluindo...' : 'Excluir Hábito Permanentemente'}
                    </button>
                </div>
            </div>

             <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">Meu Hábito</h2>
                <p className="text-muted-foreground text-sm mb-2">Você pode ter apenas 1 hábito ativo por vez.</p>
                <p className="font-bold text-lg">{activeHabitsCount} de 1 hábito ativo</p>
                <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(activeHabitsCount / 1) * 100}%` }}></div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <button onClick={logout} className="px-6 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10">Sair</button>
                <button onClick={handleSave} disabled={isSaving} className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50">
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
