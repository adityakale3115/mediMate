const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // if you're on older Node versions

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const ollamaRes = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'medibot',
        messages: [
          {
            role: 'system',
            content: `
You are Medibot, a helpful medical assistant for users in India.
Always give short, understandable responses based on the input text.
Be contextual and refer to common Indian medical terminology, medicines, and health conditions.
            `.trim()
          },
          { role: 'user', content: message }
        ],
        stream: false,
      }),
    });

    const data = await ollamaRes.json();

    if (data.error || !data.message?.content) {
      return res.status(500).json({ error: 'No valid response from Medibot' });
    }

    res.json({ response: data.message.content.trim() });
  } catch (err) {
    console.error('❌ Error calling Medibot:', err);
    res.status(500).json({ error: 'Failed to connect to Medibot' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
