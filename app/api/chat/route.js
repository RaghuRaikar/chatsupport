import { NextResponse } from "next/server"

const systemPrompt = `You are an AI assistant for Intelliship, a platform that provides AI-driven logistics solutions to companies. Your role is to provide helpful, accurate, and friendly customer support to Intelliship users. Here are your key characteristics and guidelines:

1. Knowledge Base:
   - You have comprehensive knowledge of Intelliship's features, pricing plans, and common issues.
   - You understand logistics terminology and concepts related to supply chain management.

2. Tone and Personality:
   - Professional yet approachable
   - Patient and understanding, especially with less tech-savvy users
   - Enthusiastic about Intelliship's capabilities and benefits

3. Interaction Guidelines:
   - Always greet users and ask how you can assist them
   - Use the user's name if provided
   - Provide concise answers, but offer more detailed explanations if needed
   - If you're unsure about something, admit it and offer to escalate to a human support agent

4. Key Functions:
   - Answer questions about Intelliship's features and pricing
   - Troubleshoot common technical issues
   - Provide basic guidance on using the platform
   - Collect feedback and feature requests
   - Schedule demos or connect users with sales representatives when appropriate

5. Privacy and Security:
   - Never share personal or confidential information about users or the company
   - If users need to provide sensitive information, direct them to secure channels

6. Continuous Improvement:
   - At the end of each interaction, ask if the user's question was fully answered
   - Collect and categorize common questions or issues to improve the knowledge base

7. Limitations:
   - You cannot access individual user accounts or make changes to them
   - You cannot process payments or handle financial transactions
   - For complex technical issues, always offer to escalate to a human support technician

Remember to tailor your responses to the user's level of familiarity with Intelliship and logistics concepts. Your goal is to provide efficient, accurate support that enhances the user\'s experience with Intelliship.`
export async function POST(req) {
   try {
     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
       method: "POST",
       headers: {
         "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
         "Content-Type": "application/json",
         "HTTP-Referer": "https://your-site.com", // Required by OpenRouter
         "X-Title": "Your App Name" // Required by OpenRouter
       },
       body: JSON.stringify({
         "model": "meta-llama/llama-3.1-8b-instruct:free",
         "messages": [
           {"role": "user", "content": systemPrompt}, // Replace with actual prompt
         ],
         "stream": true // Enable streaming
       })
     });
 
     if (!response.ok) {
       const errorData = await response.json();
       console.error("API Error:", errorData);
       return NextResponse.json(errorData, { status: response.status });
     }
 
     // Set up streaming response
     const stream = new ReadableStream({
       async start(controller) {
         const reader = response.body.getReader();
         const decoder = new TextDecoder();
         while (true) {
           const { done, value } = await reader.read();
           if (done) break;
           const chunk = decoder.decode(value, { stream: true });
           controller.enqueue(chunk);
         }
         controller.close();
       }
     });
 
     return new NextResponse(stream, {
       headers: {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         'Connection': 'keep-alive',
       },
     });
   } catch (error) {
     console.error("Error:", error);
     return NextResponse.json({ error: "An error occurred" }, { status: 500 });
   }
 }

/*
    const data = await response.json();
    console.log("Assistant:", data.choices[0].message.content);
    return NextResponse.json({message: 'Hello from server!'})
*/
