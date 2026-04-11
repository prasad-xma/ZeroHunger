const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_API_KEY);

const generateAllergyRecommendations = async (allergies, userProfile = {}) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        let userContext = '';
        if (userProfile.dateOfBirth) {
            const age = Math.floor((new Date() - new Date(userProfile.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
            userContext += `The user is a ${age}-year-old ${userProfile.gender || ''}. `;
        } else if (userProfile.gender) {
            userContext += `The user is ${userProfile.gender}. `;
        }

        const prompt = `As a nutrition and food safety expert, provide comprehensive recommendations for someone with the following food allergies: ${allergies.join(', ')}.
${userContext}
Please provide a detailed response in the following JSON format:
{
  "recommendations": [
    "General dietary recommendations and lifestyle advice"
  ],
  "foods_to_avoid": [
    "Specific foods and ingredients to avoid completely"
  ],
  "safe_alternatives": [
    "Safe food alternatives and substitutes"
  ],
  "cross_contamination_notes": [
    "Important notes about cross-contamination risks"
  ],
  "reading_labels_tips": [
    "Tips for reading food labels and identifying hidden allergens"
  ],
  "emergency_precautions": [
    "Emergency precautions and what to do if exposed"
  ],
  "personalized_advice": {
    "health_management": [
      "Specific health management strategies for these allergies"
    ],
    "nutrition_tips": [
      "Key nutrition and dietary management tips"
    ],
    "lifestyle_recommendations": [
      "Practical lifestyle and daily management recommendations"
    ],
    "dining_guidance": [
      "Guidance for dining out, grocery shopping, and meal planning"
    ]
  }
}

Focus on practical, actionable advice that can help someone manage these allergies safely. Be thorough but concise. Ensure the response is valid JSON format.`;

        const startTime = Date.now();
        const result = await model.generateContent(prompt);
        const responseTime = Date.now() - startTime;
        
        const response = result.response;
        const text = response.text();
        
        // Parse the AI response
        let aiResponse;
        try {
            // Clean up the response to ensure it's valid JSON
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            aiResponse = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            throw new Error('Invalid AI response format');
        }
        
        return {
            ai_response: aiResponse,
            metadata: {
                model_used: 'gemini-2.5-flash',
                response_time_ms: responseTime,
                generated_at: new Date()
            }
        };
        
    } catch (error) {
        console.error('Google AI API error details:', error.message);
        console.error('Full error:', error);
        throw new Error('Failed to generate allergy recommendations');
    }
};

module.exports = {
    generateAllergyRecommendations
};
