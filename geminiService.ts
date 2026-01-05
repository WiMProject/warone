
import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, Order } from "./types";

// Always use the required initialization format for GoogleGenAI using the process.env.API_KEY variable directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getInventoryInsights(inventory: InventoryItem[], orders: Order[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze this Warteg inventory and recent orders. 
        Inventory: ${JSON.stringify(inventory)}
        Recent Orders: ${JSON.stringify(orders)}
        Provide a JSON summary of:
        1. Low stock alerts
        2. Predicted shortage items for tomorrow
        3. A suggested special menu based on current surplus.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            alerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            predictions: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestion: { type: Type.STRING }
          },
          required: ["alerts", "predictions", "suggestion"]
        }
      }
    });
    // Access response.text as a property to get the generated content string
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Insight Error:", error);
    return null;
  }
}