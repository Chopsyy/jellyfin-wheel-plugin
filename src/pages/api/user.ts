import { NextApiRequest, NextApiResponse } from "next";

const JELLYFIN_API_URL =
  process.env.JELLYFIN_API_URL || "https://api.jellyfin.org";
const JELLYFIN_API_KEY = process.env.JELLYFIN_API_KEY as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch the user list from Jellyfin
    const userResponse = await fetch(`${JELLYFIN_API_URL}/Users`, {
      headers: {
        "X-Emby-Token": JELLYFIN_API_KEY,
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch users: ${userResponse.status}`);
    }

    const users = await userResponse.json();
    console.log("Fetched users:", users);

    // Get the first user's ID
    const userId = users[0]?.Id;

    if (!userId) {
      throw new Error("No users found in Jellyfin.");
    }

    res.status(200).json({ userId });
  } catch (error) {
    console.error("Error fetching user ID from Jellyfin:", error);
    res.status(500).json({ error: "Failed to fetch user ID from Jellyfin" });
  }
}
