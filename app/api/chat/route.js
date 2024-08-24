import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.`;

export async function POST(req) {
  try {
    const data = await req.json();

    // Initialize Pinecone
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.index("rag2").namespace("ns1");

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    // Prepare text for embedding
    let textForEmbedding = "";
    for (const message of data) {
      if (message.content && message.content.trim()) {
        // Check for content and trim
        textForEmbedding += message.content.trim() + "\n"; // Only add trimmed content
      }
    }

    const text = textForEmbedding.trim();

    if (!text) {
      throw new Error("No valid content provided for embedding.");
    }

    if (!text) {
      throw new Error("No valid content provided for embedding.");
    }
    // Generate embeddings
    const result = await model.embedContent({ content: text });
    const embeddings = result.embedding;

    // Query Pinecone index
    const results = await index.query({
      topK: 3,
      vector: embeddings["values"],
      includeMetadata: true,
    });

    // Format results
    let resultString = "";
    results.matches.forEach((match) => {
      resultString += `
Returned Results:
Professor: ${match.id}
Review: ${match.metadata.review}
Subject: ${match.metadata.subject}
Stars: ${match.metadata.stars}
\n\n`;
    });

    // Prepare content for completion
    const lastMessage = data[data.length - 1];
    const lastMessageContent = lastMessage.content + resultString;
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

    // Generate content
    const completion = await model.generateContent({
      contents: [
        { role: "system", content: systemPrompt },
        ...lastDataWithoutLastMessage,
        { role: "user", content: lastMessageContent },
      ],
      model: "gemini-1.5-flash",
      stream: true,
    });

    // Stream response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error handling request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
