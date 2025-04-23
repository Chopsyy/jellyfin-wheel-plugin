import { NextApiRequest, NextApiResponse } from "next";

const JELLYFIN_API_URL =
  process.env.JELLYFIN_API_URL || "http://localhost:8096/api";
const JELLYFIN_API_KEY = process.env.JELLYFIN_API_KEY as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch the user ID
    const userResponse = await fetch(`${JELLYFIN_API_URL}/Users`, {
      headers: {
        "X-Emby-Token": JELLYFIN_API_KEY,
      },
    });

    const users = await userResponse.json();
    console.dir({ userResponse }, { depth: 0 });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch users: ${userResponse.status}`);
    }

    const userId = users[0]?.Id;
    console.log(userId);

    if (!userId) {
      throw new Error("No users found in Jellyfin.");
    }

    // Fetch shows for the user
    const response = await fetch(
      `${JELLYFIN_API_URL}/Users/${userId}/Items?IncludeItemTypes=Series&Recursive=true`,
      {
        headers: {
          "X-Emby-Token": JELLYFIN_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Jellyfin API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log("Jellyfin API Response:", data);

    // Extract unique genres and titles
    const genres = new Set<string>();
    const titles: string[] = [];
    data.Items.forEach((item: any) => {
      if (item.Genres) {
        item.Genres.forEach((genre: string) => genres.add(genre));
      }
      if (item.Name) {
        titles.push(item.Name); // Collect show titles
      }
    });

    res.status(200).json({ genres: Array.from(genres), titles });
  } catch (error) {
    console.error("Error fetching data from Jellyfin:", error);
    res.status(500).json({ error: "Failed to fetch data from Jellyfin" });
  }
}
