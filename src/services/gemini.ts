import { GoogleGenAI } from "@google/genai";
import type { CheckIn } from '../types';

// Fix: Switched to process.env.API_KEY as per @google/genai guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export const generateInsight = async (checkIns: CheckIn[]): Promise<string> => {
  // Fix: Check for process.env.API_KEY.
  if (!process.env.API_KEY) {
    return "API key not configured. This is a placeholder insight: you are doing great, but remember to rest when you feel tired. Consistency is key.";
  }
  if (checkIns.length < 3) {
    return "Continue fazendo check-ins para receber seu primeiro insight personalizado da IA!";
  }

  const checkinSummary = checkIns.map(c => ({
    date: c.date,
    status: c.status,
    challenges: c.challenges,
    motivations: c.motivations,
    mood: c.mood,
  }));

  const prompt = `
    Analyze the following recent check-in data for a user's habit.
    The user is from Brazil, so respond in a friendly, empathetic, and encouraging tone in Brazilian Portuguese.
    Data: ${JSON.stringify(checkinSummary)}

    Instructions:
    1. Identify the most significant behavioral pattern (positive or negative).
    2. Be empathetic and encouraging.
    3. Offer a practical, actionable suggestion based on the pattern.
    4. Keep the response concise, between 2-3 sentences.
    5. Do not sound like a robot. Be conversational and human.
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insight:", error);
    return "Tivemos um problema ao gerar seu insight. Por favor, tente novamente mais tarde. Enquanto isso, continue firme no seu hábito!";
  }
};

export const generateDailyQuote = async (): Promise<string> => {
  // Fix: Check for process.env.API_KEY.
  if (!process.env.API_KEY) {
    return "A jornada de mil milhas começa com um único passo. (API Key não configurada)";
  }
    
  const prompt = `
    Gere uma frase do dia para um usuário brasileiro que está construindo um novo hábito.
    O objetivo é criar uma mensagem que seja simples, mas profunda, gerando conexão, motivação e trazendo um pequeno insight único.

    Instruções:
    1.  **Tom:** Acolhedor, inspirador e sábio. Evite gírias e humor excessivo. Use uma linguagem clara e acessível.
    2.  **Conteúdo:** Conecte a jornada de criar um hábito a um conceito real de neurociência ou psicologia comportamental, explicado de forma muito simples. A ideia é dar ao usuário uma pequena "pílula de conhecimento" que valide seu esforço.
    3.  **Objetivo Emocional:** A frase deve fazer o usuário se sentir compreendido, inteligente e capaz. Deve reforçar que a dificuldade é normal e faz parte do processo de mudança cerebral.
    4.  **Formato:** Curto e direto, ideal para uma reflexão rápida. Duas ou três frases no máximo.
    5.  **Originalidade:** Seja criativo e evite clichês motivacionais comuns. Puxe de conceitos como 'carga cognitiva', 'viés de confirmação', 'o platô do potencial latente' ou 'efeito composto' para trazer perspectivas novas e surpreendentes.

    Exemplos de estilo (não repita estes, use-os como inspiração para o tom):
    - "Cada vez que você repete seu hábito, você fortalece uma nova trilha no seu cérebro. Não é apenas 'força de vontade', é neuroplasticidade em ação. Você está literalmente reescrevendo sua mente."
    - "O desconforto que você sente ao iniciar é o som do seu cérebro construindo algo novo. Acolha esse sentimento como um sinal de crescimento, não de fraqueza. A recompensa vem logo após."
    - "Pequenos progressos liberam mais dopamina do que grandes vitórias esporádicas. Celebre a pequena ação de hoje. É ela que ensina seu cérebro a querer voltar amanhã."
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating daily quote:", error);
    return "O maior obstáculo é sempre a inércia do primeiro movimento. Uma vez em movimento, a física está do seu lado. Continue!";
  }
};
