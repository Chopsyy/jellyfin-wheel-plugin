import { NextApiRequest, NextApiResponse } from 'next';

const wheelItems = [
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
  'Item 5',
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const randomIndex = Math.floor(Math.random() * wheelItems.length);
    const selectedItem = wheelItems[randomIndex];
    res.status(200).json({ selectedItem });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}