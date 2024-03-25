import { Hono } from 'hono'
import { cors } from 'hono/cors';

const app = new Hono()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono AI !')
})

app.post('/ai', async (c) => {
  const payload = await c.req.json();
  const messages = payload.messages;
  const aiApiKey = c.req.header('ai-api-key');
  const apiUrl = 'https://api.pawan.krd/v1/chat/completions';

  if (aiApiKey) {
      try {
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${aiApiKey}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  model: 'pai-001-light',
                  max_tokens: 500,
                  messages,
              }),
          });
          const data = await response.json();
          return c.json(data);
      } catch (error) {
          console.error('Error:', error);
          return c.json({ error: 'Failed to generate response' });
      }
  } else {
      return c.json({ error: 'Missing AI API key in headers' }, 400);
  }
});

export default app;
