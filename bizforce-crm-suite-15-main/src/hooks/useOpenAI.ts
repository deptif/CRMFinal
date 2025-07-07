
import { useState } from 'react';

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getAPIKey = () => {
    return localStorage.getItem('openai_api_key') || '';
  };

  const generateText = async (prompt: string, context?: string) => {
    const apiKey = getAPIKey();
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please configure it in Settings.');
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: context || 'You are an assistant specialized in CRM and sales. Be objective and professional.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Check your key in Settings.');
        }
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeEmail = async (emailContent: string) => {
    const prompt = `Analyze this email and provide:
1. Sentiment (positive/neutral/negative)
2. Intent (purchase/question/complaint/other)
3. Priority (high/medium/low)
4. Response suggestion

Email: ${emailContent}`;

    return await generateText(prompt, 'You are an expert in commercial communication analysis.');
  };

  const generateEmailResponse = async (originalEmail: string, context: string) => {
    const prompt = `Generate a professional response to this email, considering the context:

Original email: ${originalEmail}

Context: ${context}

Generate a cordial and professional response.`;

    return await generateText(prompt, 'You are an expert in commercial communication.');
  };

  const scoreLead = async (leadData: any) => {
    const prompt = `Analyze this lead and give a score from 0-100:

Lead data:
- Company: ${leadData.company}
- Position: ${leadData.position}
- Industry: ${leadData.industry}
- Company size: ${leadData.companySize}
- Budget: ${leadData.budget}
- Timeline: ${leadData.timeline}

Provide:
1. Score (0-100)
2. Justification
3. Recommended next actions`;

    return await generateText(prompt, 'You are an expert in B2B lead qualification.');
  };

  const generateInsights = async (salesData: any) => {
    const prompt = `Analyze this sales data and generate insights:

${JSON.stringify(salesData, null, 2)}

Provide insights about:
1. Trends
2. Opportunities
3. Risks
4. Recommendations`;

    return await generateText(prompt, 'You are a specialized sales analyst.');
  };

  return {
    generateText,
    analyzeEmail,
    generateEmailResponse,
    scoreLead,
    generateInsights,
    isLoading,
    hasAPIKey: () => !!getAPIKey()
  };
};
