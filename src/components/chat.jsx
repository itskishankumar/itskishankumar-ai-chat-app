import { Input } from "@/components/ui/input";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export default function Chat() {
  async function handleEnter(input) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: input,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });
    console.log(response.text);
  }
  return (
    <div className="w-full lg:w-1/2">
      <Input placeholder="Ask me anything" onEnter={handleEnter} />
    </div>
  );
}
