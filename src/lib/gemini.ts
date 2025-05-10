import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
};

export const generateCourseSummary = async (courseContent: string): Promise<string> => {
  const prompt = `Summarize this module content in a clear, structured format:
  
  ${courseContent}
  
  Format your response as:
  
  [1-2 sentence overview of what the module teaches]
  
  Key Concepts:
  • [3-4 bullet points of the most important concepts]
  
  Practical Applications:
  • [2-3 bullet points on how this knowledge is applied]
  
  Keep the entire summary concise (under 200 words) and directly related to the content.
  If it's web development content, focus on programming concepts.
  If it's VFX content, focus on visual effects techniques.
  DO NOT include phrases like "AI-generated" or "This summary was created by AI" anywhere.`;
  
  return getGeminiResponse(prompt);
};

export const getPersonalizedRecommendations = async (viewedCourses: string[], interests: string[]): Promise<string> => {
  const prompt = `Based on these completed courses: ${viewedCourses.join(', ')}
  And interests in: ${interests.join(', ')}
  
  As a VFX and Animation software development expert, recommend 3-5 advanced topics or courses they should explore next. For each recommendation:
  - Explain its relevance to film/VFX industry
  - Highlight technical skills they'll gain
  - Mention specific software or frameworks they'll work with
  - Describe potential career opportunities`;
  
  return getGeminiResponse(prompt);
};

// Gemini AI API integration

// Mock implementation for demo purposes
export const geminiGenerateContent = async (prompt: string): Promise<string> => {
  console.log('Generating content with Gemini API:', prompt.substring(0, 50) + '...');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For a real implementation, you would do:
  /*
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
  */
  
  // Instead, return a mock response
  return `This video perfectly complements the module content by providing visual demonstrations of the concepts you're teaching. 

Key takeaways relevant to your module:
• The video shows practical applications of theoretical concepts covered in your module
• It provides real-world examples that reinforce the importance of the techniques you're teaching
• The tutorial's approach aligns with your teaching methodology, making concepts more accessible
• Students will benefit from seeing professional implementation of the skills they're learning

The combination of your module content with this video creates a more comprehensive learning experience, bridging theory and practice.`;
};

// Function to summarize module content
export const summarizeModuleContent = async (content: string): Promise<string> => {
  console.log('Summarizing module content with Gemini API');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For a real implementation, you would call the Gemini API
  
  // Return a mock summary
  return `This module covers essential concepts in VFX production, focusing on key techniques and industry-standard practices. The content emphasizes both theoretical foundations and practical applications, preparing students for real-world production challenges.`;
};

// Function to generate study questions based on content
export const generateStudyQuestions = async (content: string): Promise<string[]> => {
  console.log('Generating study questions with Gemini API');
  
  try {
    // Create a carefully crafted prompt for more relevant questions
    const prompt = `
      Based on this module content about web development or VFX:
      "${content}"
      
      Generate 4 thought-provoking discussion questions that:
      1. Directly reference specific concepts taught in the module
      2. Encourage application of the knowledge (not just recall)
      3. Are clearly related to the main topic (HTML, VFX, or whatever the module covers)
      4. Challenge the student to think critically and creatively about the material
      5. Invite more open-ended responses that demonstrate deeper understanding
      
      Each question should:
      - Be concise (under 30 words)
      - Begin with phrases like "How would you...", "Explain why...", "Compare and contrast...", or "What would happen if..."
      - Focus on topics that complement, not duplicate, what would be covered in multiple-choice questions
      - Encourage relating the content to real-world applications
      
      If the content mentions HTML, web development, or coding - focus questions on that.
      If the content mentions VFX, animation, or visual effects - focus questions on that.
      
      IMPORTANT: Return only plain text questions, one per line, with no additional formatting, numbering, quotes, or array notation.
      DO NOT return the response as a JSON array, a Python array, or with any code formatting.
    `;

    // Call the Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Process the response to extract questions
    let questions = response
      .split(/\n+/) // Split by newlines
      .map(q => q.trim()) // Trim whitespace
      .filter(q => q && !q.match(/^(\d+\.|\*|-)/)) // Remove numbering or bullets
      .map(q => q.replace(/^["']\s*|\s*["']$/g, '')); // Remove quotes
    
    // Post-process to remove any remaining artifacts
    questions = questions.map(q => {
      return q
        .replace(/^\s*python\s*\[\s*|\s*\]\s*$/g, '') // Remove python [] wrapper if present
        .replace(/\\n/g, '') // Remove newline characters
        .replace(/^["']\s*|\s*["']$/g, ''); // Remove extra quotes
    });
    
    // Ensure we have the right number of questions
    questions = questions.filter(q => q.length > 10);
    
    return questions.length > 0 ? questions : [
      "How would you apply these concepts to solve a real-world problem in your field?",
      "Explain why these techniques are important in professional VFX or web development projects.",
      "Compare and contrast the approaches discussed in this module with alternatives you may know about.",
      "What would happen if you combined these techniques with other methods you've learned previously?"
    ];
  } catch (error) {
    console.error('Error generating study questions:', error);
    return [
      "How would you apply these concepts to solve a real-world problem in your field?",
      "Explain why these techniques are important in professional VFX or web development projects.",
      "Compare and contrast the approaches discussed in this module with alternatives you may know about.",
      "What would happen if you combined these techniques with other methods you've learned previously?"
    ];
  }
};

// Function to generate objective questions with multiple choices
export const generateObjectiveQuestions = async (content: string): Promise<any[]> => {
  console.log('Generating objective questions with Gemini API');
  
  try {
    // Create prompt for generating objective questions
    const prompt = `
      Based on this module content:
      "${content}"
      
      Generate 3 objective multiple-choice questions that test understanding of key concepts.
      
      For each question:
      1. Make it specific to the content provided and ensure questions are challenging but fair
      2. Include 4 answer options (a, b, c, d) where ONLY ONE is correct
      3. Clearly mark the correct answer
      4. Ensure options are plausible and not obviously incorrect
      5. Focus on testing understanding rather than memorization
      
      Format your response as a JSON array:
      [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": "Option that is correct"
        },
        ...
      ]
      
      ENSURE the questions are directly related to the specific content provided.
      If the content is about HTML, make HTML questions.
      If the content is about VFX/3D, make VFX/3D questions.
      
      Return ONLY valid JSON with no explanations or additional text.
    `;

    // Call the Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the JSON response
    try {
      const questions = JSON.parse(response);
      return Array.isArray(questions) ? questions : [];
    } catch (error) {
      console.error('Error parsing questions JSON:', error);
      return [];
    }
  } catch (error) {
    console.error('Error generating objective questions:', error);
    return [];
  }
};