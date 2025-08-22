export const config = { runtime: 'nodejs' };
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    ok: true,
    method: req.method,
    node: process.version,
    time: new Date().toISOString(),
  });
}
