import type { NextApiRequest, NextApiResponse } from 'next';

function normalizeTafsirText(input: string) {
  return input
    .replace(/\s+/g, ' ')
    .replace(/[،؛]/g, '، ')
    .replace(/[.!؟]/g, '. ')
    .trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const text = typeof req.body?.text === 'string' ? normalizeTafsirText(req.body.text) : '';
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const safeText = text.slice(0, 200);
    const params = new URLSearchParams({
      ie: 'UTF-8',
      client: 'tw-ob',
      tl: 'ar',
      q: safeText,
      ttsspeed: '1',
    });
    const endpoint = `https://translate.google.com/translate_tts?${params.toString()}`;

    const response = await fetch(endpoint, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `TTS provider failed: ${response.status}` });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    return res.status(200).send(audioBuffer);
  } catch (error) {
    console.error('Tafsir TTS error:', error);
    return res.status(500).json({ error: 'Failed to generate tafsir voice' });
  }
}
