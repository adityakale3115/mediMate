// For Node.js (Express) or Next.js API Route

import fetch from 'node-fetch'; // Use native fetch if Node >=18

export async function POST(req, res) {
  const { message } = await req.json();

  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'medibot',
      messages: [
        { role: 'system', content: 'You are a medical assistant. Only reply to health-related questions.' },
        { role: 'user', content: message }
      ],
      stream: false
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.message.content });
}
