const HealthAdvice = require('./healthAdvice.model');
const HealthRecommendation = require('../health_recommendation/healthRecommendation.model');

// Generate personalized health advice based on user profile
const generateHealthAdvice = async (req, res) => {
    try {
        const { healthProfileId } = req.params;
        const userId = req.user.id;

        // Get the health profile
        const healthProfile = await HealthRecommendation.findOne({ 
            _id: healthProfileId, 
            userId,
            is_active: true 
        });

        if (!healthProfile) {
            return res.status(404).json({ message: 'Health profile not found' });
        }

        // Check if advice already exists and is not expired
        const existingAdvice = await HealthAdvice.findOne({
            healthProfileId,
            expires_at: { $gt: new Date() },
            is_active: true
        });

        if (existingAdvice) {
            await syncProfileRecommendations(healthProfile, existingAdvice.advice);
            return res.status(200).json(existingAdvice);
        }

        // Generate new advice based on profile
        const advice = generateAdviceContent(healthProfile);

        // Create new health advice record
        const newAdvice = new HealthAdvice({
            userId,
            healthProfileId,
            advice: JSON.parse(JSON.stringify(advice))
        });

        await newAdvice.save();
        await syncProfileRecommendations(healthProfile, advice);

        res.status(201).json(newAdvice);
    } catch (error) {
        console.error('Error generating health advice:', error);
        res.status(500).json({ message: 'Failed to generate health advice' });
    }
};

// Get health advice for a user
const getHealthAdvice = async (req, res) => {
    try {
        const { healthProfileId } = req.params;
        const userId = req.user.id;

        const advice = await HealthAdvice.findOne({
            healthProfileId,
            userId,
            is_active: true
        }).populate('healthProfileId', 'profile_name');

        if (!advice) {
            return res.status(404).json({ message: 'Health advice not found' });
        }

        res.status(200).json(advice);
    } catch (error) {
        console.error('Error fetching health advice:', error);
        res.status(500).json({ message: 'Failed to fetch health advice' });
    }
};

// Get all health advice for a user
const getAllHealthAdvice = async (req, res) => {
    try {
        const userId = req.user.id;

        const adviceList = await HealthAdvice.find({
            userId,
            is_active: true
        }).populate('healthProfileId', 'profile_name user_profile.goal')
          .sort({ generated_at: -1 });

        res.status(200).json(adviceList);
    } catch (error) {
        console.error('Error fetching health advice list:', error);
        res.status(500).json({ message: 'Failed to fetch health advice list' });
    }
};

// Regenerate health advice
const regenerateHealthAdvice = async (req, res) => {
    try {
        const { healthProfileId } = req.params;
        const userId = req.user.id;

        // Get the health profile
        const healthProfile = await HealthRecommendation.findOne({ 
            _id: healthProfileId, 
            userId,
            is_active: true 
        });

        if (!healthProfile) {
            return res.status(404).json({ message: 'Health profile not found' });
        }

        // Deactivate existing advice
        await HealthAdvice.updateMany(
            { healthProfileId, userId },
            { is_active: false }
        );

        // Generate new advice
        const advice = generateAdviceContent(healthProfile);

        const newAdvice = new HealthAdvice({
            userId,
            healthProfileId,
            advice
        });

        await newAdvice.save();
        await syncProfileRecommendations(healthProfile, advice);

        res.status(201).json(newAdvice);
    } catch (error) {
        console.error('Error regenerating health advice:', error);
        res.status(500).json({ message: 'Failed to regenerate health advice' });
    }
};

// Helper function to generate advice content based on profile
function generateAdviceContent(profile) {
    const { user_profile, recommendations } = profile;
    const { goal, dietary_preference, activity_level, meal_frequency } = user_profile;

    // Meal management advice
    const mealManagement = {
        frequency: `${meal_frequency} meals per day recommended`,
        timing: getMealTiming(meal_frequency),
        portion_control: getPortionControlAdvice(goal),
        meal_preparation: getMealPrepAdvice(user_profile.cooking_time)
    };

    // Calorie management
    const calorieManagement = {
        daily_target: recommendations.daily_calories,
        meal_distribution: getCalorieDistribution(recommendations.daily_calories, meal_frequency),
        tips: getCalorieTips(goal)
    };

    // Nutrition levels
    const nutritionLevels = {
        protein: {
            target: recommendations.macronutrients.protein,
            sources: getProteinSources(dietary_preference)
        },
        carbs: {
            target: recommendations.macronutrients.carbs,
            sources: getCarbSources(dietary_preference)
        },
        fats: {
            target: recommendations.macronutrients.fat,
            sources: getFatSources(dietary_preference)
        },
        vitamins: getVitaminRecommendations(goal),
        minerals: getMineralRecommendations(goal)
    };

    // Meal suggestions
    const mealSuggestions = generateMealSuggestions(dietary_preference, recommendations.daily_calories, user_profile);

    // Lifestyle tips
    const lifestyleTips = {
        hydration: getHydrationTips(user_profile.water_intake, activity_level),
        exercise: getExerciseTips(goal, activity_level),
        sleep: getSleepTips(user_profile.sleep_hours),
        stress_management: getStressManagementTips()
    };

    // Weekly plan
    const weeklyPlan = []; // Temporarily disabled to isolate the issue

    return {
        meal_management: mealManagement,
        calorie_management: calorieManagement,
        nutrition_levels: nutritionLevels,
        meal_suggestions: mealSuggestions,
        lifestyle_tips: lifestyleTips,
        weekly_plan: weeklyPlan
    };
}

// Helper functions for generating specific advice
function getMealTiming(frequency) {
    const timings = {
        3: ['7:00 AM - Breakfast', '12:00 PM - Lunch', '7:00 PM - Dinner'],
        4: ['7:00 AM - Breakfast', '11:00 AM - Snack', '1:00 PM - Lunch', '7:00 PM - Dinner'],
        5: ['7:00 AM - Breakfast', '10:00 AM - Snack', '1:00 PM - Lunch', '4:00 PM - Snack', '7:00 PM - Dinner'],
        6: ['7:00 AM - Breakfast', '9:30 AM - Snack', '12:30 PM - Lunch', '3:30 PM - Snack', '6:30 PM - Dinner', '9:00 PM - Snack']
    };
    return timings[frequency] || timings[3];
}

function getPortionControlAdvice(goal) {
    const advice = {
        lose: 'Use smaller plates, measure portions, eat slowly, stop when 80% full',
        gain: 'Use larger plates, eat every 2-3 hours, focus on calorie-dense foods',
        maintain: 'Balance portions, listen to hunger cues, maintain consistent meal times'
    };
    return advice[goal] || advice.maintain;
}

function getMealPrepAdvice(cookingTime) {
    const advice = {
        '< 15 min': 'Focus on quick recipes, pre-cut vegetables, overnight oats, smoothies',
        '15-30 min': 'Batch cook proteins, prepare ingredients ahead, use one-pan meals',
        '30-60 min': 'Meal prep on weekends, cook in batches, freeze portions',
        '> 60 min': 'Try complex recipes, make large batches, experiment with new cuisines'
    };
    return advice[cookingTime] || advice['15-30 min'];
}

function getCalorieDistribution(totalCalories, frequency) {
    const distribution = {
        3: { breakfast: 0.3, lunch: 0.4, dinner: 0.3, snacks: 0 },
        4: { breakfast: 0.25, lunch: 0.35, dinner: 0.3, snacks: 0.1 },
        5: { breakfast: 0.2, lunch: 0.3, dinner: 0.25, snacks: 0.25 },
        6: { breakfast: 0.2, lunch: 0.25, dinner: 0.2, snacks: 0.35 }
    };

    const dist = distribution[frequency] || distribution[3];
    return {
        breakfast: Math.round(totalCalories * dist.breakfast),
        lunch: Math.round(totalCalories * dist.lunch),
        dinner: Math.round(totalCalories * dist.dinner),
        snacks: Math.round(totalCalories * dist.snacks)
    };
}

function getCalorieTips(goal) {
    const tips = {
        lose: [
            'Track your daily calorie intake',
            'Choose nutrient-dense, low-calorie foods',
            'Drink water before meals to feel fuller',
            'Avoid liquid calories like sodas and juices'
        ],
        gain: [
            'Eat calorie-dense foods like nuts and avocados',
            'Add healthy fats to your meals',
            'Drink milk or protein shakes between meals',
            'Eat every 2-3 hours'
        ],
        maintain: [
            'Maintain consistent calorie intake',
            'Focus on balanced macronutrients',
            'Listen to your body hunger signals',
            'Adjust calories based on activity level'
        ]
    };
    return tips[goal] || tips.maintain;
}

function getProteinSources(dietaryPreference) {
    const sources = {
        vegetarian: ['Lentils', 'Beans', 'Tofu', 'Greek yogurt', 'Eggs', 'Quinoa', 'Paneer'],
        vegan: ['Lentils', 'Beans', 'Tofu', 'Tempeh', 'Seitan', 'Quinoa', 'Nuts', 'Seeds'],
        'non-vegetarian': ['Chicken breast', 'Fish', 'Eggs', 'Lean beef', 'Turkey', 'Greek yogurt'],
        keto: ['Chicken', 'Fish', 'Eggs', 'Tofu', 'Cheese', 'Nuts', 'Seeds'],
        paleo: ['Chicken', 'Fish', 'Eggs', 'Lean meat', 'Nuts', 'Seeds'],
        mediterranean: ['Fish', 'Chicken', 'Eggs', 'Legumes', 'Nuts', 'Greek yogurt'],
        'gluten-free': ['Chicken', 'Fish', 'Eggs', 'Rice protein', 'Quinoa', 'Nuts', 'Seeds'],
        'dairy-free': ['Chicken', 'Fish', 'Eggs', 'Lentils', 'Beans', 'Tofu', 'Nuts']
    };
    return sources[dietaryPreference] || sources['non-vegetarian'];
}

function getCarbSources(dietaryPreference) {
    const sources = {
        vegetarian: ['Brown rice', 'Quinoa', 'Sweet potatoes', 'Oats', 'Whole wheat bread'],
        vegan: ['Brown rice', 'Quinoa', 'Sweet potatoes', 'Oats', 'Whole grain pasta'],
        'non-vegetarian': ['Brown rice', 'Sweet potatoes', 'Oats', 'Quinoa', 'Whole grain bread'],
        keto: ['Leafy greens', 'Cauliflower', 'Broccoli', 'Zucchini', 'Avocado'],
        paleo: ['Sweet potatoes', 'Butternut squash', 'Plantains', 'Cassava'],
        mediterranean: ['Whole grain bread', 'Brown rice', 'Quinoa', 'Fruits', 'Vegetables'],
        'gluten-free': ['Brown rice', 'Quinoa', 'Sweet potatoes', 'Corn', 'Buckwheat'],
        'dairy-free': ['Brown rice', 'Quinoa', 'Sweet potatoes', 'Oats', 'Fruits']
    };
    return sources[dietaryPreference] || sources['non-vegetarian'];
}

function getFatSources(dietaryPreference) {
    const sources = {
        vegetarian: ['Avocado', 'Nuts', 'Seeds', 'Olive oil', 'Cheese'],
        vegan: ['Avocado', 'Nuts', 'Seeds', 'Olive oil', 'Coconut oil'],
        'non-vegetarian': ['Avocado', 'Nuts', 'Seeds', 'Olive oil', 'Fatty fish'],
        keto: ['Avocado', 'Nuts', 'Seeds', 'Olive oil', 'Coconut oil', 'Butter'],
        paleo: ['Avocado', 'Nuts', 'Seeds', 'Olive oil', 'Coconut oil'],
        mediterranean: ['Olive oil', 'Avocado', 'Nuts', 'Fatty fish', 'Seeds'],
        'gluten-free': ['Avocado', 'Nuts', 'Seeds', 'Olive oil', 'Coconut oil'],
        'dairy-free': ['Avocado', 'Nuts', 'Seeds', 'Olive oil', 'Coconut oil']
    };
    return sources[dietaryPreference] || sources['non-vegetarian'];
}

function getVitaminRecommendations(goal) {
    return ['Vitamin D', 'Vitamin B12', 'Vitamin C', 'Vitamin A', 'Vitamin E'];
}

function getMineralRecommendations(goal) {
    return ['Iron', 'Calcium', 'Magnesium', 'Zinc', 'Potassium'];
}

function generateMealSuggestions(dietaryPreference, dailyCalories, userProfile) {
    // This would typically call an AI service or use a more complex algorithm
    // For now, returning basic suggestions
    return {
        breakfast: [{
            name: 'Oatmeal with fruits',
            ingredients: ['Oats', 'Banana', 'Berries', 'Almonds'],
            calories: Math.round(dailyCalories * 0.25),
            prep_time: '10 min'
        }],
        lunch: [{
            name: 'Grilled chicken salad',
            ingredients: ['Chicken breast', 'Mixed greens', 'Vegetables', 'Olive oil'],
            calories: Math.round(dailyCalories * 0.35),
            prep_time: '20 min'
        }],
        dinner: [{
            name: 'Baked salmon with vegetables',
            ingredients: ['Salmon', 'Broccoli', 'Sweet potato', 'Olive oil'],
            calories: Math.round(dailyCalories * 0.3),
            prep_time: '30 min'
        }],
        snacks: [{
            name: 'Greek yogurt with nuts',
            ingredients: ['Greek yogurt', 'Mixed nuts', 'Honey'],
            calories: Math.round(dailyCalories * 0.1),
            prep_time: '5 min'
        }]
    };
}

function getHydrationTips(currentIntake, activityLevel) {
    const tips = [
        'Drink at least 8 glasses of water daily',
        'Carry a water bottle with you',
        'Drink water before, during, and after exercise',
        'Set reminders to drink water regularly'
    ];

    if (activityLevel === 'very active' || activityLevel === 'extra active') {
        tips.push('Increase water intake on active days');
        tips.push('Consider electrolyte drinks for intense workouts');
    }

    return tips;
}

function getExerciseTips(goal, activityLevel) {
    const tips = {
        lose: [
            'Combine cardio and strength training',
            'Aim for 150 minutes of moderate cardio per week',
            'Include 2-3 strength training sessions',
            'Add high-intensity interval training (HIIT)'
        ],
        gain: [
            'Focus on strength training 3-4 times per week',
            'Limit excessive cardio',
            'Ensure adequate protein intake',
            'Allow proper recovery between workouts'
        ],
        maintain: [
            'Maintain balanced exercise routine',
            'Include both cardio and strength training',
            'Stay active daily',
            'Try different activities to stay motivated'
        ]
    };
    return tips[goal] || tips.maintain;
}

function getSleepTips(currentSleep) {
    const tips = [
        'Aim for 7-9 hours of sleep per night',
        'Maintain consistent sleep schedule',
        'Avoid screens 1 hour before bed',
        'Create a relaxing bedtime routine'
    ];

    if (currentSleep < 7) {
        tips.push('Consider increasing sleep duration for better recovery');
    }

    return tips;
}

function getStressManagementTips() {
    return [
        'Practice deep breathing exercises',
        'Try meditation or yoga',
        'Take regular breaks during work',
        'Engage in hobbies you enjoy',
        'Connect with friends and family'
    ];
}

function generateWeeklyPlan(goal, dietaryPreference) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map(day => ({
        day,
        meals: [
            {
                type: 'breakfast',
                suggestions: ['Protein-rich breakfast', 'Include fruits', 'Whole grains']
            },
            {
                type: 'lunch',
                suggestions: ['Balanced meal', 'Include vegetables', 'Lean protein']
            },
            {
                type: 'dinner',
                suggestions: ['Lighter meal', 'Easy to digest', 'Nutrient-dense']
            }
        ],
        tips: [
            'Stay hydrated throughout the day',
            'Take short walks after meals',
            'Listen to your hunger cues'
        ]
    }));
}

async function syncProfileRecommendations(profile, advice) {
    const meal_suggestions = extractMealSuggestions(advice.meal_suggestions);
    const exercise_recommendations = Array.isArray(advice.lifestyle_tips?.exercise)
        ? advice.lifestyle_tips.exercise
        : [];
    const lifestyle_tips = [
        ...(Array.isArray(advice.lifestyle_tips?.hydration) ? advice.lifestyle_tips.hydration : []),
        ...(Array.isArray(advice.lifestyle_tips?.sleep) ? advice.lifestyle_tips.sleep : []),
        ...(Array.isArray(advice.lifestyle_tips?.stress_management) ? advice.lifestyle_tips.stress_management : [])
    ];

    await HealthRecommendation.findOneAndUpdate(
        { _id: profile._id, userId: profile.userId, is_active: true },
        {
            $set: {
                'recommendations.meal_suggestions': meal_suggestions,
                'recommendations.exercise_recommendations': exercise_recommendations,
                'recommendations.lifestyle_tips': lifestyle_tips
            }
        },
        { new: true }
    );
}

function extractMealSuggestions(mealSuggestions = {}) {
    if (!mealSuggestions || typeof mealSuggestions !== 'object') return [];

    return Object.values(mealSuggestions).flatMap(list =>
        Array.isArray(list)
            ? list.map(item => {
                if (!item) return '';
                if (typeof item === 'string') return item;
                return item.name || item.title || JSON.stringify(item);
            })
            : []
    ).filter(Boolean);
}

module.exports = {
    generateHealthAdvice,
    getHealthAdvice,
    getAllHealthAdvice,
    regenerateHealthAdvice
};
