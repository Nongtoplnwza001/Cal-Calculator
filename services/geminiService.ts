import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const analyzeFoodImage = async (base64Image: string, mimeType: string): Promise<NutritionData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: `คุณคือนักโภชนาการผู้เชี่ยวชาญ วิเคราะห์รูปภาพนี้:
            1. ถ้าเป็นอาหาร ให้ระบุชื่อ, พลังงาน (kcal), โปรตีน (g), คาร์โบไฮเดรต (g), ไขมัน (g), และคำแนะนำสุขภาพสั้นๆ เป็นภาษาไทย
            2. ถ้าไม่ใช่อาหาร ให้ตั้งค่า is_food เป็น false และใส่ค่า 0 หรือ null ในช่องอื่นๆ`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_food: { type: Type.BOOLEAN },
            food_name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            description: { type: Type.STRING },
          },
          required: ["is_food", "food_name", "calories", "protein", "carbs", "fat", "description"],
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text) as NutritionData;
    return data;

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("ไม่สามารถวิเคราะห์รูปภาพได้ กรุณาลองใหม่อีกครั้ง");
  }
};