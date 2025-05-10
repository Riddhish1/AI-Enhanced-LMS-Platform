// YouTube API service to fetch videos related to course topics
import { supabase } from '../lib/supabase';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  url: string;
  duration: string;
  embedUrl: string;
}

export const searchYouTubeVideos = async (
  query: string,
  maxResults: number = 3
): Promise<YouTubeVideo[]> => {
  console.log(`Searching YouTube for: ${query}`);
  
  try {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_YT_API_KEY;
    
    if (!apiKey) {
      console.error('YouTube API key not found in environment variables');
      return [];
    }
    
    // Build a more specific search query to get better results
    // Extract key terms from the query
    const terms = query.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(term => term.length > 3) // Only keep meaningful words
      .slice(0, 5); // Take first 5 terms (most important)
    
    // Determine the main topic from the query
    let moduleType = 'tutorial';
    if (/html|css|javascript|react|web/i.test(query)) {
      moduleType = 'web development tutorial';
    } else if (/vfx|effect|animation|3d|blender|maya|houdini/i.test(query)) {
      moduleType = 'visual effects tutorial';
    } else if (/design|ui|ux|interface/i.test(query)) {
      moduleType = 'design tutorial';
    }
    
    // Create a refined search query
    const refinedQuery = [...terms, moduleType].join(' ');
    console.log(`Refined search query: ${refinedQuery}`);
    
    // Build the YouTube Data API URL
    const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
    const params = new URLSearchParams({
      part: 'snippet',
      maxResults: maxResults.toString(),
      q: refinedQuery,
      type: 'video',
      relevanceLanguage: 'en',
      videoEmbeddable: 'true',
      key: apiKey
    });
    
    // Make the API request
    const response = await fetch(`${baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we received items
    if (!data.items || data.items.length === 0) {
      console.warn('No videos found for query:', refinedQuery);
      return [];
    }
    
    // Process the results
    const videos: YouTubeVideo[] = await Promise.all(
      data.items.map(async (item: any) => {
        // Get video duration from a separate API call
        const videoDetails = await getVideoDetails(item.id.videoId, apiKey);
        
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          duration: videoDetails.duration || 'Unknown',
          embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
        };
      })
    );
    
    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

// Helper function to get video details (for duration)
const getVideoDetails = async (videoId: string, apiKey: string): Promise<{ duration: string }> => {
  try {
    const baseUrl = 'https://www.googleapis.com/youtube/v3/videos';
    const params = new URLSearchParams({
      part: 'contentDetails',
      id: videoId,
      key: apiKey
    });
    
    const response = await fetch(`${baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse ISO 8601 duration
    const isoDuration = data.items[0]?.contentDetails?.duration || 'PT0S';
    const duration = formatDuration(isoDuration);
    
    return { duration };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return { duration: 'Unknown' };
  }
};

// Format ISO 8601 duration to readable format
const formatDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'Unknown';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

// Function to generate summary of video using Gemini API
export const generateVideoSummary = async (videoId: string, moduleContent: string): Promise<string> => {
  try {
    console.log(`Generating summary for video: ${videoId} related to module content`);
    
    const { geminiGenerateContent } = await import('../lib/gemini');
    
    // Create a prompt for Gemini
    const prompt = `
      Analyze this YouTube video (ID: ${videoId}) and explain how it relates to this module content:
      
      "${moduleContent}"
      
      Format your response as:
      
      [1 sentence describing how this video complements the module]
      
      Key Connections:
      • [3-4 bullet points highlighting specific concepts from the module that the video demonstrates]
      
      Learning Value:
      • [1-2 bullet points on what additional insights the video provides]
      
      Keep the entire summary under 200 words and strictly focused on the relationship between the video and the module content.
      DO NOT include phrases like "AI-generated" or "This summary was created by AI" anywhere.
    `;
    
    // Call the Gemini API
    const summary = await geminiGenerateContent(prompt);
    return summary;
    
  } catch (error) {
    console.error('Error generating video summary:', error);
    return 'Unable to generate summary. Please try again later.';
  }
}; 