
import React, { createContext, useContext, ReactNode } from 'react';
import { useMockApplications } from '@/hooks/useMockApplications';
import { Application } from '@/types';

interface ApplicationContextType {
  applications: Application[];
  isLoading: boolean;
  hasError: boolean;
  createApplication: (appData: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => Promise<{ data: Application | null; error: any }>;
  updateApplication: (appId: string, updates: Partial<Application>) => Promise<{ data: any; error: any }>;
  deleteApplication: (appId: string) => Promise<{ error: any }>;
  refetch: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const applicationData = useMockApplications();

  return (
    <ApplicationContext.Provider value={applicationData}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};
