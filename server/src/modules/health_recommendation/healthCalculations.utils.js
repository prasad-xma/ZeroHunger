

// Calculate BMI
const calculateBMI = (weight_kg, height_cm) => {
    const height_m = height_cm / 100;
    const bmi = Number((weight_kg / (height_m * height_m)).toFixed(1));
    
    let category;
    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
    } else {
        category = 'Obese';
    }
    
    return {
        value: bmi,
        category
    };
};

// Calculate BMR
const calculateBMR = (weight_kg, height_cm, age, gender) => {
    let bmr;
    
    if (gender === 'male') {
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
    } else if (gender === 'female') {
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
    } else {
        const maleBMR = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
        const femaleBMR = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
        bmr = (maleBMR + femaleBMR) / 2;
    }
    
    return Math.round(bmr);
};

// Get activity multiplier
const getActivityMultiplier = (activity_level) => {
    const multipliers = {
        'sedentary': 1.2,
        'lightly active': 1.375,
        'moderately active': 1.55,
        'very active': 1.725,
        'extra active': 1.9
    };
    
    return multipliers[activity_level] || 1.2;
};

// Calculate TDEE
const calculateTDEE = (bmr, activity_level) => {
    const multiplier = getActivityMultiplier(activity_level);
    return Math.round(bmr * multiplier);
};

// Calculate daily calorie target
const calculateDailyCalorieTarget = (tdee, goal) => {
    switch (goal) {
        case 'lose':
            return Math.round(tdee * 0.85);
        case 'gain':
            return Math.round(tdee * 1.15);
        case 'maintain':
        default:
            return tdee;
    }
};


// Calculate macronutrients
const calculateMacronutrients = (daily_calories, goal, dietary_preference) => {
    let proteinRatio, carbRatio, fatRatio;
    
    switch (dietary_preference) {
        case 'keto':
            proteinRatio = 0.25;
            carbRatio = 0.05;
            fatRatio = 0.70;
            break;
        case 'vegetarian':
        case 'vegan':
            proteinRatio = 0.20;
            carbRatio = 0.55;
            fatRatio = 0.25;
            break;
        case 'paleo':
            proteinRatio = 0.30;
            carbRatio = 0.20;
            fatRatio = 0.50;
            break;
        default:
            proteinRatio = goal === 'gain' ? 0.30 : 0.25;
            carbRatio = goal === 'gain' ? 0.45 : 0.45;
            fatRatio = goal === 'gain' ? 0.25 : 0.30;
    }
    
    const proteinCalories = daily_calories * proteinRatio;
    const carbCalories = daily_calories * carbRatio;
    const fatCalories = daily_calories * fatRatio;
    
    return {
        protein: Math.round(proteinCalories / 4),
        carbs: Math.round(carbCalories / 4),
        fat: Math.round(fatCalories / 9)
    };
};

// Calculate water intake goal
const calculateWaterIntakeGoal = (weight_kg, activity_level) => {
    const baseWater = weight_kg * 0.033;
    const multiplier = getActivityMultiplier(activity_level);
    const totalWater = baseWater * multiplier;
    
    return Math.round((totalWater + Number.EPSILON) * 10) / 10;
};


const calculateAllHealthMetrics = (user_profile) => {
    const { weight_kg, height_cm, age, gender, activity_level, goal, dietary_preference } = user_profile;
    
    // Calculate all health metrics
    const bmi = calculateBMI(weight_kg, height_cm);

    // Calculate BMR
    const bmr = calculateBMR(weight_kg, height_cm, age, gender);
    
    // Calculate TDEE
    const tdee = calculateTDEE(bmr, activity_level);
    
    // Calculate daily calorie target
    const daily_calories = calculateDailyCalorieTarget(tdee, goal);
    
    // Calculate macronutrients
    const macronutrients = calculateMacronutrients(daily_calories, goal, dietary_preference);
    
    // Calculate water intake goal
    const water_intake_goal = calculateWaterIntakeGoal(weight_kg, activity_level);
    
    return {
        bmi,
        bmr,
        tdee,
        daily_calories,
        macronutrients,
        water_intake_goal
    };
};

module.exports = {
    calculateBMI,
    calculateBMR,
    calculateTDEE,
    calculateDailyCalorieTarget,
    calculateMacronutrients,
    calculateWaterIntakeGoal,
    calculateAllHealthMetrics,
    getActivityMultiplier
};
