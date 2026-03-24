// Backend/src/controllers/song.controller.js
const axios = require("axios");

// ─────────────────────────────────────────────
// Emotion → base query
// ─────────────────────────────────────────────
const EMOTION_QUERIES = {
  happy:   ["best bollywood dance songs", "hindi party hits", "upbeat bollywood 2024"],
  sad:     ["sad bollywood songs", "emotional hindi arijit singh", "heartbreak hindi songs"],
  angry:   ["desi hip hop rap", "phonk hindi aggressive", "indian rap hard"],
  neutral: ["lofi hindi chill", "indian lofi beats", "bollywood lofi mix"],
  relaxed: ["soft acoustic hindi", "indian instrumental calm", "soothing bollywood"],
};

// ─────────────────────────────────────────────
// Top 10 Indian Categories
// ─────────────────────────────────────────────
const CATEGORIES = {
  bollywood:  "bollywood hits songs",
  lofi:       "lofi hindi songs",
  punjabi:    "punjabi songs 2024",
  rap:        "indian rap desi hip hop",
  romantic:   "romantic hindi songs",
  devotional: "hindi bhajan devotional",
  folk:       "indian folk songs",
  retro:      "retro bollywood classic",
  indie:      "indian indie songs",
  workout:    "hindi workout gym songs",
};

// ─────────────────────────────────────────────
// YouTube search helper
// ─────────────────────────────────────────────
const searchYouTube = async (query, maxResults = 12, pageToken = "") => {
  const params = {
    part:            "snippet",
    q:               query,
    type:            "video",
    videoCategoryId: "10",
    maxResults,
    key:             process.env.YOUTUBE_API_KEY,
  };
  if (pageToken) params.pageToken = pageToken;

  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    { params }
  );

  const songs = response.data.items.map((item) => ({
    title:     item.snippet.title.replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "").trim(),
    artist:    item.snippet.channelTitle,
    youtubeId: item.id.videoId,
    thumbnail: item.snippet.thumbnails?.medium?.url || "",
  }));

  return {
    songs,
    nextPageToken: response.data.nextPageToken || null,
  };
};

// ─────────────────────────────────────────────
// GET /api/songs/categories
// Frontend ko categories list bhejo
// ─────────────────────────────────────────────
const getCategories = (req, res) => {
  const list = [
    { id: "bollywood",  label: "Bollywood",  emoji: "🎬" },
    { id: "lofi",       label: "Lo-Fi",       emoji: "🎧" },
    { id: "punjabi",    label: "Punjabi",     emoji: "🥁" },
    { id: "rap",        label: "Rap / Hip Hop", emoji: "🎤" },
    { id: "romantic",   label: "Romantic",    emoji: "❤️" },
    { id: "devotional", label: "Devotional",  emoji: "🙏" },
    { id: "folk",       label: "Folk",        emoji: "🪘" },
    { id: "retro",      label: "Retro",       emoji: "📻" },
    { id: "indie",      label: "Indie",       emoji: "🎸" },
    { id: "workout",    label: "Workout",     emoji: "💪" },
  ];
  return res.status(200).json({ success: true, categories: list });
};

// ─────────────────────────────────────────────
// POST /api/songs/getSongs
// Body: { emotion, topTwo, pageToken, query, category }
// ─────────────────────────────────────────────
const getSongs = async (req, res) => {
  try {
    const {
      emotion   = "neutral",
      topTwo    = [],
      pageToken = "",
      query:    customQuery = "",
      category  = "",
    } = req.body;

    let finalQuery;

    // Priority: customQuery > category > emotion
    if (customQuery) {
      // Direct search query — YouTube se seedha
      finalQuery = customQuery;
    } else if (category && CATEGORIES[category]) {
      // Category selected
      finalQuery = CATEGORIES[category];
    } else {
      // Emotion based
      const validEmotions = ["happy", "sad", "angry", "neutral", "relaxed"];
      const safeEmotion   = validEmotions.includes(emotion) ? emotion : "neutral";
      const queries       = EMOTION_QUERIES[safeEmotion];
      finalQuery = pageToken
        ? req.body.savedQuery || queries[0]
        : queries[Math.floor(Math.random() * queries.length)];
    }

    console.log(`🎵 Query: "${finalQuery}" | page: ${pageToken || "1"}`);

    const { songs, nextPageToken } = await searchYouTube(finalQuery, 12, pageToken);

    if (!songs.length) {
      return res.status(404).json({ success: false, message: "No songs found" });
    }

    return res.status(200).json({
      success:       true,
      emotion,
      query:         finalQuery,
      savedQuery:    finalQuery, // pagination ke liye same query
      songs,
      nextPageToken,
    });

  } catch (error) {
    console.error("❌ getSongs error:", error.message);
    if (error.response?.status === 403) {
      return res.status(403).json({ success: false, message: "YouTube API quota exceeded." });
    }
    return res.status(500).json({ success: false, message: "Failed to fetch songs" });
  }
};

module.exports = { getSongs, getCategories };