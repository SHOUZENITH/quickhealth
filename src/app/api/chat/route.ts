import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error("❌ Config Error: OPENROUTER_API_KEY is missing in .env.local");
      return NextResponse.json(
        { error: 'Server configuration error: Missing API Key' }, 
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "QuickHealth",
      },
      body: JSON.stringify({
        // ⚡ FIX: Switched to Llama 3 (Most reliable free model currently)
        // If you specifically want DeepSeek, try "deepseek/deepseek-chat" (might be paid)
        model: "tngtech/deepseek-r1t2-chimera:free", 
        messages: [
          {
            role: "system",
            content: "You are the QuickHealth Assistant, a helpful medical AI. Provide general health advice, explain medical terms, and suggest lifestyle changes. IMPORTANT: Always include a disclaimer that you are an AI and not a doctor. If the user mentions severe symptoms (chest pain, trouble breathing, heavy bleeding), tell them to go to the Emergency Room immediately."
          },
          ...messages
        ],
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ OpenRouter API Error:", response.status, errorText);
      return NextResponse.json(
        { error: `OpenRouter Error: ${response.statusText}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Server Internal Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}