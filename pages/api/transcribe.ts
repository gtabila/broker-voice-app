import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  res.status(200).json({
    transcript: 'Client needs $850,000 loan for a house in Brisbane. 20% deposit. Self-employed.'
  });
}