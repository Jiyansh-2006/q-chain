
import { GoogleGenAI, Type } from "@google/genai";
import { FraudAlert } from '../types';

export const getFraudAlerts = async (): Promise<FraudAlert[]> => {
    // In a real app, you would not expose the API key on the frontend.
    // This should be called from a backend service.
    // As per instructions, we assume process.env.API_KEY is available.
    if (!process.env.API_KEY) {
        console.warn("API_KEY not found. Using mock fraud alerts.");
        return getMockFraudAlerts();
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 3 examples of suspicious blockchain transactions for a fraud detection system. Include a transaction hash (random hex string), a reason for suspicion, a severity level (Low, Medium, or High), and a timestamp (ISO 8601).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            transactionHash: {
                                type: Type.STRING,
                                description: 'A random 66-character hex string starting with 0x.'
                            },
                            reason: {
                                type: Type.STRING,
                                description: 'The reason the transaction is flagged as suspicious.'
                            },
                            severity: {
                                type: Type.STRING,
                                description: 'The severity level: Low, Medium, or High.'
                            },
                            timestamp: {
                                type: Type.STRING,
                                description: 'An ISO 8601 formatted timestamp for the alert.'
                            }
                        },
                        required: ["transactionHash", "reason", "severity", "timestamp"]
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const alerts = JSON.parse(jsonText) as FraudAlert[];
        return alerts;

    } catch (error) {
        console.error("Error fetching fraud alerts from Gemini API:", error);
        return getMockFraudAlerts();
    }
};


const getMockFraudAlerts = (): FraudAlert[] => {
    return [
        {
            transactionHash: '0x1a2b3c...',
            reason: 'High volume transfer to a newly created wallet address.',
            severity: 'High',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
        },
        {
            transactionHash: '0x4d5e6f...',
            reason: 'Transaction originates from an address associated with phishing scams.',
            severity: 'Medium',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
            transactionHash: '0x7g8h9i...',
            reason: 'Unusually small, rapid-fire transactions (dusting attempt).',
            severity: 'Low',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        }
    ];
};
