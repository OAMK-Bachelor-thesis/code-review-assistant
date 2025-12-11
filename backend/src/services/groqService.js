const Groq = require('groq-sdk');
const prompts = require('../utils/prompts');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Analyze code using Groq
async function analyzeCode(codeSnippet) {
  try {
    if (!codeSnippet || codeSnippet.trim().length === 0) {
      throw new Error('Code snippet cannot be empty');
    }

    // Build the prompt
    const userMessage = prompts.buildAnalysisPrompt(codeSnippet);

    console.log('Calling Groq API...');

    // Call Groq API
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 2000,
    });

    console.log('Groq response:', response);

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response from Groq');
    }

    // Extract the generated text
    const generatedText = response.choices[0].message.content;

    console.log('Generated text:', generatedText);

    // Parse JSON response
    let analysis;
    try {
      // Clean up the response - remove any markdown code blocks
      let cleanedText = generatedText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7);
      }
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
      }

      analysis = JSON.parse(cleanedText.trim());
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Text to parse:', generatedText);

      return {
        analysis: {
          summary: 'Unable to parse AI response. Please try again.',
          score: 0,
          issues: [],
          error: 'JSON parsing failed',
        },
      };
    }

    return { analysis };
  } catch (error) {
    console.error('Groq analysis error:', error);
    throw error;
  }
}

// Security-focused analysis
async function analyzeCodeSecurity(codeSnippet) {
  try {
    const prompt = prompts.buildSecurityPrompt(codeSnippet);

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 1500,
    });

    const generatedText = response.choices[0].message.content;
    const analysis = JSON.parse(generatedText.trim());

    return { analysis };
  } catch (error) {
    console.error('Security analysis error:', error);
    throw error;
  }
}

// Performance-focused analysis
async function analyzeCodePerformance(codeSnippet) {
  try {
    const prompt = prompts.buildPerformancePrompt(codeSnippet);

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 1500,
    });

    const generatedText = response.choices[0].message.content;
    const analysis = JSON.parse(generatedText.trim());

    return { analysis };
  } catch (error) {
    console.error('Performance analysis error:', error);
    throw error;
  }
}

module.exports = {
  analyzeCode,
  analyzeCodeSecurity,
  analyzeCodePerformance,
};