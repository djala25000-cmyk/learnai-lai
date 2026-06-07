exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `Tu es l'assistant officiel de LEARN A.I $LAI, un meme coin sur Solana dédié à l'apprentissage de l'intelligence artificielle. Tu aides les visiteurs à comprendre l'IA et $LAI. Mint Address : FEb3iGcsk5HVKwzugWWSGgEhmxsj2h2P7NMjxWGwBTc5. Acheter : https://pump.fun/coin/DgaQtZvWN8hf52H4pjsossbLqvQPFqM9ZpQxhS2fpump. Réponds toujours de façon courte et amicale dans la langue de l'utilisateur.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || JSON.stringify(data);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
