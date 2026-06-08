export async function onRequestPost(context) {
  const { message } = await context.request.json();
  const apiKey = context.env.GROQ_API_KEY;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Tu es l\'assistant officiel de LEARN A.I $LAI sur Solana. Tu aides les visiteurs à comprendre l\'IA et $LAI. Réponds toujours de façon courte et amicale dans la langue de l\'utilisateur.'
        },
        { role: 'user', content: message }
      ],
      max_tokens: 500
    })
  });

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu répondre.';

  return new Response(JSON.stringify({ reply }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
