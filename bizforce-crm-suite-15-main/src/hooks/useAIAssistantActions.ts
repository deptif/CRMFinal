
import { useCallback } from 'react';

export const useAIAssistantActions = () => {
  const navigateToSection = useCallback((section: string) => {
    // Simula clique no item da sidebar
    const sidebarItem = document.querySelector(`[data-section="${section}"]`);
    if (sidebarItem) {
      (sidebarItem as HTMLElement).click();
    }
    
    // Atualiza URL
    window.history.pushState({}, '', `/?section=${section}`);
    
    // Dispatch custom event para componentes ouvirem
    window.dispatchEvent(new CustomEvent('sectionChange', { detail: { section } }));
  }, []);

  const openModal = useCallback((modalType: string, data?: any) => {
    window.dispatchEvent(new CustomEvent('openModal', { detail: { modalType, data } }));
  }, []);

  const performQuickAction = useCallback((action: string, params?: any) => {
    switch (action) {
      case 'create-account':
        openModal('account', { mode: 'create' });
        break;
      case 'create-contact':
        openModal('contact', { mode: 'create' });
        break;
      case 'create-opportunity':
        openModal('opportunity', { mode: 'create' });
        break;
      case 'schedule-activity':
        openModal('activity', { mode: 'create', type: 'meeting' });
        break;
      default:
        console.log(`Ação não reconhecida: ${action}`, params);
    }
  }, [openModal]);

  return {
    navigateToSection,
    openModal,
    performQuickAction
  };
};
