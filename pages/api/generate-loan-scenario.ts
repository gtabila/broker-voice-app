import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { transcript } = req.body;

  const prompt = `Based on the following client notes, generate a loan scenario summary and list any missing information required for a submission.\n\nClient Notes:\n${transcript}`;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a mortgage submission assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    })
  });

  const json = await openaiRes.json();
  const message = json.choices?.[0]?.message?.content || 'No response from GPT.';

  const [scenario, ...missingLines] = message.split('Missing');
  res.status(200).json({
    scenario: scenario.trim(),
    missingInfo: missingLines.length > 0 ? 'Missing' + missingLines.join('Missing').trim() : 'None'
  });
}
