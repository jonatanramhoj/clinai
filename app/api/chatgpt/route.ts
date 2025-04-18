import { NextResponse } from "next/server";

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Received messages:", messages); // Log incoming messages

    // Call to OpenAI's Chat API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or the model you prefer
      messages: messages,
    });

    console.log("OpenAI Response:", response); // Log OpenAI response

    return NextResponse.json({ message: response.choices[0].message });
  } catch (error) {
    console.error("Error in API route:", error); // Log any errors
    return NextResponse.json(
      { error: "Failed to fetch from OpenAI" },
      { status: 500 }
    );
  }
}
