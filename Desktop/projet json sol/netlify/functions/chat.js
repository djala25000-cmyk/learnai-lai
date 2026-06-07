exports.handler = async function(event, context) {
  // Accepte seulement les requêtes POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);

    // Appel à l'API Groq avec la clé secrète
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
            content: `Tu es l'assistant officiel de LEARN A.I $LAI, un meme coin sur Solana dédié à l'apprentissage de l'intelligence artificielle.
Tu aides les visiteurs à :
- Comprendre ce qu'est $LAI et comment l'acheter
- Apprendre l'IA de façon simple et accessible
- Répondre aux questions sur Solana et la crypto
- Expliquer les concepts IA en langage simple

Infos importantes :
- Mint Address : FEb3iGcsk5HVKwzugWWSGgEhmxsj2h2P7NMjxWGwBTc5
- Acheter : https://pump.fun/coin/DgaQtZvWN8hf52H4pjsossbLqvQPFqM9ZpQxhS2fpump
- Site : https://djala25000-cmyk.github.io/learnai-lai/
- Twitter : @LearnAI_LAI
- Discord : https://discord.gg/dnqzEG5u

Réponds toujours de façon courte, claire et amicale. Tu parles la langue de l'utilisateur automatiquement.`
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
    const reply = data.choices[0].message.content;

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
      body: JSON.stringify({ error: 'Erreur du serveur' })
    };
  }
};
