import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { transcript } = req.body;

  const prompt = `Create a loan scenario based on this input: ${transcript}\n\nAlso list what information is missing.`;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a loan application assistant.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const json = await openaiRes.json();
  const message = json.choices?.[0]?.message?.content || 'No GPT response.';

  const [scenario, ...rest] = message.split('Missing');
  res.status(200).json({
    scenario: scenario.trim(),
    missingInfo: rest.length > 0 ? 'Missing' + rest.join('Missing') : 'None'
  });
}