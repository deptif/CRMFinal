
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface CustomObject {
  id: string;
  name: string;
  label: string;
  fields: string[];
  recordTypes: string[];
  layouts: string[];
  validations: string[];
  formulas: string[];
}

interface ComponentDependency {
  id: string;
  type: 'custom_object' | 'custom_field' | 'page_layout' | 'record_type' | 'validation' | 'formula';
  name: string;
  dependencies: string[];
  dependents: string[];
  status: 'draft' | 'active' | 'deprecated';
}

interface DeploymentPackage {
  id: string;
  name: string;
  components: ComponentDependency[];
  environment: 'development' | 'staging' | 'production';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at: Date;
  deployed_at?: Date;
}

export const useCustomizationIntegration = () => {
  const [dependencies, setDependencies] = useState<ComponentDependency[]>([]);
  const [deploymentPackages, setDeploymentPackages] = useState<DeploymentPackage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    loadDependencies();
    loadDeploymentPackages();
  }, []);

  const loadDependencies = () => {
    const stored = localStorage.getItem('customization_dependencies');
    if (stored) {
      setDependencies(JSON.parse(stored));
    }
  };

  const loadDeploymentPackages = () => {
    const stored = localStorage.getItem('deployment_packages');
    if (stored) {
      const packages = JSON.parse(stored).map((pkg: any) => ({
        ...pkg,
        created_at: new Date(pkg.created_at),
        deployed_at: pkg.deployed_at ? new Date(pkg.deployed_at) : undefined
      }));
      setDeploymentPackages(packages);
    }
  };

  const saveDependencies = (deps: ComponentDependency[]) => {
    localStorage.setItem('customization_dependencies', JSON.stringify(deps));
    setDependencies(deps);
  };

  const saveDeploymentPackages = (packages: DeploymentPackage[]) => {
    localStorage.setItem('deployment_packages', JSON.stringify(packages));
    setDeploymentPackages(packages);
  };

  const analyzeDependencies = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      // Simulate dependency analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get data from localStorage
      const customObjects = JSON.parse(localStorage.getItem('custom_objects') || '[]');
      const customFields = JSON.parse(localStorage.getItem('customFields') || '[]');
      const pageLayouts = JSON.parse(localStorage.getItem('page_layouts') || '[]');
      const formulas = JSON.parse(localStorage.getItem('formulaFields') || '[]');
      
      const newDependencies: ComponentDependency[] = [];
      
      // Analyze Custom Objects
      customObjects.forEach((obj: any) => {
        newDependencies.push({
          id: obj.id,
          type: 'custom_object',
          name: obj.name,
          dependencies: [],
          dependents: customFields.filter((f: any) => f.object === obj.name).map((f: any) => f.id),
          status: obj.isDeployed ? 'active' : 'draft'
        });
      });
      
      // Analyze Custom Fields
      customFields.forEach((field: any) => {
        newDependencies.push({
          id: field.id,
          type: 'custom_field',
          name: field.name,
          dependencies: [field.object],
          dependents: formulas.filter((f: any) => f.dependencies.includes(field.name)).map((f: any) => f.id),
          status: 'active'
        });
      });
      
      // Analyze Formulas
      formulas.forEach((formula: any) => {
        newDependencies.push({
          id: formula.id,
          type: 'formula',
          name: formula.name,
          dependencies: formula.dependencies || [],
          dependents: [],
          status: formula.isValid ? 'active' : 'draft'
        });
      });
      
      saveDependencies(newDependencies);
      toast.success('Análise de dependências concluída!');
    } catch (error) {
      toast.error('Erro ao analisar dependências');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const createDeploymentPackage = useCallback((components: string[], environment: DeploymentPackage['environment']) => {
    const selectedComponents = dependencies.filter(dep => components.includes(dep.id));
    
    const newPackage: DeploymentPackage = {
      id: crypto.randomUUID(),
      name: `Deploy ${environment} - ${new Date().toLocaleDateString()}`,
      components: selectedComponents,
      environment,
      status: 'pending',
      created_at: new Date()
    };
    
    const updatedPackages = [newPackage, ...deploymentPackages];
    saveDeploymentPackages(updatedPackages);
    toast.success('Pacote de deployment criado!');
    return newPackage;
  }, [dependencies, deploymentPackages]);

  const deployPackage = useCallback(async (packageId: string) => {
    const packageToUpdate = deploymentPackages.find(pkg => pkg.id === packageId);
    if (!packageToUpdate) return;

    // Update status to in_progress
    const updatedPackages = deploymentPackages.map(pkg => 
      pkg.id === packageId ? { ...pkg, status: 'in_progress' as const } : pkg
    );
    saveDeploymentPackages(updatedPackages);

    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update status to completed
      const finalPackages = deploymentPackages.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, status: 'completed' as const, deployed_at: new Date() }
          : pkg
      );
      saveDeploymentPackages(finalPackages);
      toast.success('Deploy realizado com sucesso!');
    } catch (error) {
      // Update status to failed
      const failedPackages = deploymentPackages.map(pkg => 
        pkg.id === packageId ? { ...pkg, status: 'failed' as const } : pkg
      );
      saveDeploymentPackages(failedPackages);
      toast.error('Falha no deploy');
    }
  }, [deploymentPackages]);

  const validateDependencies = useCallback((componentIds: string[]) => {
    const issues: string[] = [];
    
    componentIds.forEach(id => {
      const component = dependencies.find(dep => dep.id === id);
      if (component) {
        // Check if all dependencies are included
        component.dependencies.forEach(depId => {
          if (!componentIds.includes(depId)) {
            issues.push(`${component.name} requires ${depId} but it's not included`);
          }
        });
      }
    });
    
    return issues;
  }, [dependencies]);

  return {
    dependencies,
    deploymentPackages,
    isAnalyzing,
    analyzeDependencies,
    createDeploymentPackage,
    deployPackage,
    validateDependencies,
    loadDependencies,
    loadDeploymentPackages
  };
};
