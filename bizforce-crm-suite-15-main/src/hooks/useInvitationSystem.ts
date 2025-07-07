
import { useState } from 'react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

interface InvitationData {
  email: string;
  name: string;
  position: string;
  department: string;
  company: string;
}

export const useInvitationSystem = () => {
  const [isSending, setIsSending] = useState(false);

  const sendInvitation = async (userData: InvitationData) => {
    // Verificar se EmailJS está configurado
    const emailJSConfig = localStorage.getItem('emailjs_config');
    if (!emailJSConfig) {
      toast.error('Configure primeiro o EmailJS nas configurações');
      return false;
    }

    setIsSending(true);

    try {
      const config = JSON.parse(emailJSConfig);
      
      // Gerar token único para o convite
      const invitationToken = crypto.randomUUID();
      
      // Salvar dados do convite no localStorage (em produção seria no banco)
      const invitationData = {
        token: invitationToken,
        email: userData.email,
        name: userData.name,
        position: userData.position,
        department: userData.department,
        company: userData.company,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      // Salvar no localStorage
      const existingInvitations = JSON.parse(localStorage.getItem('pending_invitations') || '[]');
      existingInvitations.push(invitationData);
      localStorage.setItem('pending_invitations', JSON.stringify(existingInvitations));

      // Criar link de ativação
      const activationLink = `${window.location.origin}/?activate=${invitationToken}`;

      // Inicializar EmailJS
      emailjs.init(config.publicKey);

      // Dados do email
      const emailData = {
        to_email: userData.email,
        to_name: userData.name,
        from_name: config.fromName,
        from_email: config.fromEmail,
        subject: `Bem-vindo ao ${config.fromName} - Ative sua conta`,
        user_name: userData.name,
        user_position: userData.position,
        company_name: userData.company,
        activation_link: activationLink,
        message: `Olá ${userData.name}!\n\nVocê foi convidado para fazer parte da nossa equipe como ${userData.position}.\n\nPara ativar sua conta e começar a usar o sistema, clique no link abaixo:\n\n${activationLink}\n\nSe você não solicitou este convite, pode ignorar este email.\n\nSaudações,\nEquipe ${config.fromName}`
      };

      console.log('Enviando convite:', emailData);

      // Enviar email
      await emailjs.send(
        config.serviceId,
        config.templateId,
        emailData,
        config.publicKey
      );

      toast.success(`Convite enviado para ${userData.email}!`);
      return true;

    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      toast.error('Erro ao enviar convite. Verifique as configurações do EmailJS.');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const getInvitationByToken = (token: string) => {
    const invitations = JSON.parse(localStorage.getItem('pending_invitations') || '[]');
    return invitations.find((inv: any) => inv.token === token);
  };

  const activateInvitation = (token: string) => {
    const invitations = JSON.parse(localStorage.getItem('pending_invitations') || '[]');
    const updatedInvitations = invitations.map((inv: any) => 
      inv.token === token ? { ...inv, status: 'activated', activatedAt: new Date().toISOString() } : inv
    );
    localStorage.setItem('pending_invitations', JSON.stringify(updatedInvitations));
  };

  return {
    sendInvitation,
    isSending,
    getInvitationByToken,
    activateInvitation
  };
};
