const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
          content: 'You are Medibot, a helpful medical assistant for users in India. Always give answers relevant to Indian healthcare systems, emergency numbers, hospitals, and medicines available in India.',
        },
          { role: 'user', content: message },
        ],
        stream: false,
      }),
    });

    const data = await ollamaRes.json();

    if (data.error || !data.message?.content) {
      return res.status(500).json({ error: 'No valid response from medibot' });
    }

    res.json({ response: data.message.content });
  } catch (err) {
    console.error('❌ Error calling medibot:', err);
    res.status(500).json({ error: 'Failed to connect to medibot' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
