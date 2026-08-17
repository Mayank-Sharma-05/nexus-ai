import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { generateGeminiResponse, GeminiChatMessage } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const prompt: GeminiChatMessage[] = [
      {
        role: "user",
        content: `Generate a professional portfolio profile for a software developer. Provide the response in this exact JSON format (no markdown, no extra text):

{
  "name": "Full Name",
  "title": "Professional Title (e.g., Senior Full-Stack Engineer)",
  "bio": "A compelling 2-3 sentence professional bio highlighting expertise and achievements",
  "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6", "Skill7", "Skill8"]
}

Make it realistic and professional. Focus on modern web development technologies.`
      }
    ];

    const response = await generateGeminiResponse(prompt);
    
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const data = JSON.parse(jsonMatch[0]);
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Portfolio autofill failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
