
import { useState, useEffect, useCallback } from 'react';
import { DataSource, DataSourceType } from '@/types/dashboard';

interface MockDataConfig {
  type: DataSourceType;
  count: number;
  includeTimeSeries: boolean;
}

export const useMockData = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);

  const generateSalesData = useCallback((count: number) => {
    const data = [];
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const products = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
    const salespeople = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown'];

    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      
      data.push({
        id: i + 1,
        date: date.toISOString().split('T')[0],
        region: regions[Math.floor(Math.random() * regions.length)],
        product: products[Math.floor(Math.random() * products.length)],
        salesperson: salespeople[Math.floor(Math.random() * salespeople.length)],
        revenue: Math.floor(Math.random() * 10000) + 1000,
        quantity: Math.floor(Math.random() * 100) + 1,
        profit: Math.floor(Math.random() * 3000) + 500,
        month: date.toLocaleDateString('pt-BR', { month: 'long' }),
        quarter: `Q${Math.ceil((date.getMonth() + 1) / 3)}`,
        year: date.getFullYear(),
        conversionRate: Math.random() * 0.3 + 0.1,
        customerSatisfaction: Math.random() * 2 + 3, // 3-5 rating
      });
    }

    return data;
  }, []);

  const generateUsersData = useCallback((count: number) => {
    const data = [];
    const departments = ['Sales', 'Marketing', 'Engineering', 'Support', 'HR'];
    const statuses = ['Active', 'Inactive', 'Pending'];

    for (let i = 0; i < count; i++) {
      const joinDate = new Date();
      joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 1000));

      data.push({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@company.com`,
        department: departments[Math.floor(Math.random() * departments.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        joinDate: joinDate.toISOString().split('T')[0],
        lastLogin: new Date().toISOString(),
        loginCount: Math.floor(Math.random() * 1000),
        performance: Math.random() * 100,
        salary: Math.floor(Math.random() * 50000) + 30000,
        age: Math.floor(Math.random() * 40) + 25,
        satisfaction: Math.random() * 2 + 3,
      });
    }

    return data;
  }, []);

  const generateProductsData = useCallback((count: number) => {
    const data = [];
    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
    const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'];

    for (let i = 0; i < count; i++) {
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() - Math.floor(Math.random() * 365));

      data.push({
        id: i + 1,
        name: `Product ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        brand: brands[Math.floor(Math.random() * brands.length)],
        price: Math.floor(Math.random() * 1000) + 10,
        cost: Math.floor(Math.random() * 500) + 5,
        stock: Math.floor(Math.random() * 1000),
        unitsSold: Math.floor(Math.random() * 5000),
        rating: Math.random() * 2 + 3,
        reviews: Math.floor(Math.random() * 1000),
        launchDate: launchDate.toISOString().split('T')[0],
        profitMargin: Math.random() * 0.5 + 0.1,
        returnRate: Math.random() * 0.1,
      });
    }

    return data;
  }, []);

  const generateFinancialData = useCallback((count: number) => {
    const data = [];
    const accounts = ['Cash', 'Accounts Receivable', 'Inventory', 'Equipment', 'Accounts Payable'];
    const types = ['Income', 'Expense', 'Asset', 'Liability'];

    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));

      data.push({
        id: i + 1,
        date: date.toISOString().split('T')[0],
        account: accounts[Math.floor(Math.random() * accounts.length)],
        type: types[Math.floor(Math.random() * types.length)],
        amount: Math.floor(Math.random() * 50000) + 1000,
        description: `Transaction ${i + 1}`,
        month: date.toLocaleDateString('pt-BR', { month: 'long' }),
        quarter: `Q${Math.ceil((date.getMonth() + 1) / 3)}`,
        year: date.getFullYear(),
        budget: Math.floor(Math.random() * 60000) + 5000,
        variance: Math.random() * 0.4 - 0.2, // -20% to +20%
        category: accounts[Math.floor(Math.random() * accounts.length)],
      });
    }

    return data;
  }, []);

  const createDataSource = useCallback((config: MockDataConfig): DataSource => {
    let data: any[] = [];
    let fields: any[] = [];

    switch (config.type) {
      case 'sales':
        data = generateSalesData(config.count);
        fields = [
          { name: 'date', type: 'date', label: 'Data', aggregatable: false, filterable: true },
          { name: 'region', type: 'string', label: 'Região', aggregatable: false, filterable: true },
          { name: 'product', type: 'string', label: 'Produto', aggregatable: false, filterable: true },
          { name: 'salesperson', type: 'string', label: 'Vendedor', aggregatable: false, filterable: true },
          { name: 'revenue', type: 'number', label: 'Receita', aggregatable: true, filterable: true },
          { name: 'quantity', type: 'number', label: 'Quantidade', aggregatable: true, filterable: true },
          { name: 'profit', type: 'number', label: 'Lucro', aggregatable: true, filterable: true },
          { name: 'conversionRate', type: 'percentage', label: 'Taxa de Conversão', aggregatable: true, filterable: true },
        ];
        break;

      case 'users':
        data = generateUsersData(config.count);
        fields = [
          { name: 'name', type: 'string', label: 'Nome', aggregatable: false, filterable: true },
          { name: 'department', type: 'string', label: 'Departamento', aggregatable: false, filterable: true },
          { name: 'status', type: 'string', label: 'Status', aggregatable: false, filterable: true },
          { name: 'joinDate', type: 'date', label: 'Data de Entrada', aggregatable: false, filterable: true },
          { name: 'loginCount', type: 'number', label: 'Logins', aggregatable: true, filterable: true },
          { name: 'performance', type: 'percentage', label: 'Performance', aggregatable: true, filterable: true },
          { name: 'salary', type: 'number', label: 'Salário', aggregatable: true, filterable: true },
        ];
        break;

      case 'products':
        data = generateProductsData(config.count);
        fields = [
          { name: 'name', type: 'string', label: 'Nome', aggregatable: false, filterable: true },
          { name: 'category', type: 'string', label: 'Categoria', aggregatable: false, filterable: true },
          { name: 'brand', type: 'string', label: 'Marca', aggregatable: false, filterable: true },
          { name: 'price', type: 'number', label: 'Preço', aggregatable: true, filterable: true },
          { name: 'stock', type: 'number', label: 'Estoque', aggregatable: true, filterable: true },
          { name: 'unitsSold', type: 'number', label: 'Unidades Vendidas', aggregatable: true, filterable: true },
          { name: 'rating', type: 'number', label: 'Avaliação', aggregatable: true, filterable: true },
        ];
        break;

      case 'financial':
        data = generateFinancialData(config.count);
        fields = [
          { name: 'date', type: 'date', label: 'Data', aggregatable: false, filterable: true },
          { name: 'account', type: 'string', label: 'Conta', aggregatable: false, filterable: true },
          { name: 'type', type: 'string', label: 'Tipo', aggregatable: false, filterable: true },
          { name: 'amount', type: 'number', label: 'Valor', aggregatable: true, filterable: true },
          { name: 'budget', type: 'number', label: 'Orçamento', aggregatable: true, filterable: true },
          { name: 'variance', type: 'percentage', label: 'Variação', aggregatable: true, filterable: true },
        ];
        break;

      default:
        data = generateSalesData(config.count);
        fields = [];
    }

    return {
      id: crypto.randomUUID(),
      name: `${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Data`,
      type: config.type,
      data,
      fields,
      lastUpdated: new Date(),
    };
  }, [generateSalesData, generateUsersData, generateProductsData, generateFinancialData]);

  const initializeDataSources = useCallback(() => {
    const sources = [
      createDataSource({ type: 'sales', count: 1000, includeTimeSeries: true }),
      createDataSource({ type: 'users', count: 500, includeTimeSeries: true }),
      createDataSource({ type: 'products', count: 200, includeTimeSeries: false }),
      createDataSource({ type: 'financial', count: 800, includeTimeSeries: true }),
    ];

    setDataSources(sources);
  }, [createDataSource]);

  useEffect(() => {
    initializeDataSources();
  }, [initializeDataSources]);

  const refreshDataSource = useCallback((sourceId: string) => {
    setDataSources(prev => prev.map(source => {
      if (source.id === sourceId) {
        const newSource = createDataSource({
          type: source.type,
          count: source.data.length,
          includeTimeSeries: true,
        });
        return {
          ...source,
          data: newSource.data,
          lastUpdated: new Date(),
        };
      }
      return source;
    }));
  }, [createDataSource]);

  return {
    dataSources,
    createDataSource,
    refreshDataSource,
    initializeDataSources,
  };
};
