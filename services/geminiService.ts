
import { GoogleGenAI, Type } from "@google/genai";
import { ContactMessage } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeContactMessage = async (message: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful admin assistant at ForgeCraft Fabrication. Review this inquiry and provide a brief internal assessment (urgency, project type, and recommended next step). Message: "${message}"`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "No assessment available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to analyze message.";
  }
};

export const generateAutoReply = async (name: string, content: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a professional, warm auto-reply for a fabrication shop named ForgeCraft. The customer's name is ${name}. Their message was: "${content}". Mention that we will review their requirements and get back to them within 24 hours.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Thank you for contacting ForgeCraft. We will get back to you shortly.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Thank you for your message. We have received it and will be in touch soon.";
  }
};
