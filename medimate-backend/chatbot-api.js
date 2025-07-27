// app/api/chatbot/route.js (Next.js 13+ App Router)

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400 });
    }

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'medibot',
        messages: [
          {
            role: 'system',
            content: 'You are a medical assistant. Only reply to health-related questions.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        stream: false,
      }),
    });

    const data = await response.json();

    if (data.error || !data.message?.content) {
      return new Response(JSON.stringify({ error: 'Invalid response from Medibot' }), { status: 500 });
    }

    return new Response(JSON.stringify({ reply: data.message.content.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ API Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to connect to Medibot' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
