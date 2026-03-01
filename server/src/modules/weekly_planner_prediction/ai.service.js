const axios = require('axios');

exports.getAIAdvice = async ({ goal, performance, predictedWeight }) => {
    try {
        const prompt = `As a nutrition expert, provide meal planning advice based on the following:
User Goal: ${goal}
Weekly Meal Adherence: ${performance}%
Predicted Weight Next Month: ${predictedWeight} kg

Provide 3-4 specific, actionable bullet points for weekly meal planning. Focus on practical advice.
Return ONLY a JSON object with this format:
{
  "advice": [
    "Specific tip 1 for meal planning",
    "Specific tip 2 for meal planning", 
    "Specific tip 3 for meal planning"
  ]
}

Examples of good advice:
- "Prepare protein-rich breakfasts to improve satiety and adherence"
- "Plan meals every Sunday to reduce weekday decision fatigue"
- "Include vegetables in at least 2 meals daily for better nutrition"`;

        if (!process.env.HF_API_KEY) {
            return getFallbackAdvice(performance);
        }

        const response = await axios.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            { inputs: prompt, parameters: { max_new_tokens: 200, temperature: 0.7 } },
            { 
                headers: { 
                    "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        );

        if (response.data && response.data[0] && response.data[0].generated_text) {
            try {
                const text = response.data[0].generated_text;
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (parsed.advice && Array.isArray(parsed.advice)) {
                        return parsed.advice.slice(0, 4);
                    }
                }
            } catch (parseError) {
                console.warn('Failed to parse AI response:', parseError.message);
            }
        }

        return getFallbackAdvice(performance);

    } catch (err) {
        console.error('AI service error:', err.message);
        return getFallbackAdvice(performance);
    }
};

function getFallbackAdvice(performance) {
    const performanceNum = parseFloat(performance) || 0;
    
    if (performanceNum >= 80) {
        return [
            "Maintain your excellent meal planning consistency",
            "Consider adding variety to prevent meal fatigue",
            "Track micronutrients for optimal nutrition"
        ];
    } else if (performanceNum >= 50) {
        return [
            "Prepare meals in advance to improve adherence",
            "Focus on completing breakfast meals consistently",
            "Set reminders for meal times to stay on track"
        ];
    } else {
        return [
            "Start with planning just one meal per day",
            "Keep simple, easy-to-prepare meal options",
            "Use a meal tracking app to stay accountable"
        ];
    }
}