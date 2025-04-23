import { NextApiRequest, NextApiResponse } from 'next';

const JELLYFIN_API_URL =
  process.env.JELLYFIN_API_URL || 'http://localhost:8096/api';
const JELLYFIN_API_KEY = process.env.JELLYFIN_API_KEY as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      `${JELLYFIN_API_URL}/Items?IncludeItemTypes=Movie&Recursive=true`,
      {
        headers: {
          'X-Emby-Token': JELLYFIN_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Jellyfin API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log('Jellyfin API Response:', data);

    // Extract unique genres and titles
    const genres = new Set<string>();
    const titles: string[] = [];
    data.Items.forEach((item: any) => {
      if (item.Genres) {
        item.Genres.forEach((genre: string) => genres.add(genre));
      }
      if (item.Name) {
        titles.push(item.Name); // Collect show/movie titles
      }
    });

    res.status(200).json({ genres: Array.from(genres), titles });
  } catch (error) {
    console.error('Error fetching data from Jellyfin:', error);
    res.status(500).json({ error: 'Failed to fetch data from Jellyfin' });
  }
}
