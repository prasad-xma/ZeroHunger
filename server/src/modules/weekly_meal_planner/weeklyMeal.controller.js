const WeeklyMeal = require('./weeklyMeal.model');
const generateWeekDays = require('./weekGenerator.utils');

// Create weekly plan
exports.createWeeklyMeal = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        
        const { weekStartDate, goal } = req.body;
        
        if (!weekStartDate) {
            return res.status(400).json({ message: "Week start date is required" });
        }

        // Check if plan already exists for this date
        const existing = await WeeklyMeal.findOne({ weekStartDate });
        if (existing) {
            return res.status(400).json({ message: "Weekly plan already exists for this date" });
        }

        const weeklyMeal = new WeeklyMeal({
            weekStartDate: new Date(weekStartDate),
            goal: goal || 'maintenance',
            days: generateWeekDays()
        });

        const result = await weeklyMeal.save();
        console.log('Created plan:', result);
        res.status(201).json(result);
    } catch (err) {
        console.log('Error in createWeeklyMeal:', err.message);
        res.status(400).json({ message: err.message });
    }
};

// Get all plans
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await WeeklyMeal.find().sort({ weekStartDate: -1 });
        res.json(plans);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get plan by ID
exports.getWeeklyMeal = async (req, res) => {
    try {
        const plan = await WeeklyMeal.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }
        res.json(plan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Add food to meal
exports.addFood = async (req, res) => {
    try {
        const { day, mealType, name, grams, image, calories } = req.body;
        const plan = await WeeklyMeal.findById(req.params.id);
        
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        const dayData = plan.days.find(d => d.day === day);
        if (!dayData) {
            return res.status(400).json({ message: "Invalid day" });
        }

        if (!dayData.meals[mealType]) {
            return res.status(400).json({ message: "Invalid meal type" });
        }

        dayData.meals[mealType].foods.push({ 
            name, 
            grams: Number(grams),
            image: image || '',
            calories: calories || 0
        });
        const result = await plan.save();
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update food in meal
exports.updateFood = async (req, res) => {
    try {
        const { day, mealType, foodIndex, name, grams } = req.body;
        const plan = await WeeklyMeal.findById(req.params.id);
        
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        const dayData = plan.days.find(d => d.day === day);
        if (!dayData || !dayData.meals[mealType]) {
            return res.status(400).json({ message: "Invalid day or meal type" });
        }

        if (dayData.meals[mealType].foods[foodIndex]) {
            dayData.meals[mealType].foods[foodIndex] = { name, grams: Number(grams) };
        }

        const result = await plan.save();
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Remove food from meal
exports.removeFood = async (req, res) => {
    try {
        const { day, mealType, foodIndex } = req.body;
        const plan = await WeeklyMeal.findById(req.params.id);
        
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        const dayData = plan.days.find(d => d.day === day);
        if (!dayData || !dayData.meals[mealType]) {
            return res.status(400).json({ message: "Invalid day or meal type" });
        }

        dayData.meals[mealType].foods.splice(foodIndex, 1);
        const result = await plan.save();
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Mark meal as completed
exports.completeMeal = async (req, res) => {
    try {
        const { day, mealType, isCompleted } = req.body;
        const plan = await WeeklyMeal.findById(req.params.id);
        
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        const dayData = plan.days.find(d => d.day === day);
        if (!dayData || !dayData.meals[mealType]) {
            return res.status(400).json({ message: "Invalid day or meal type" });
        }

        dayData.meals[mealType].isCompleted = isCompleted;
        const result = await plan.save();
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get weekly summary
exports.getSummary = async (req, res) => {
    try {
        const plan = await WeeklyMeal.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        let totalMeals = 0, completedMeals = 0;
        plan.days.forEach(day => {
            ['breakfast', 'lunch', 'dinner'].forEach(meal => {
                totalMeals++;
                if (day.meals[meal] && day.meals[meal].isCompleted) {
                    completedMeals++;
                }
            });
        });

        const performance = totalMeals > 0 ? ((completedMeals / totalMeals) * 100).toFixed(2) : 0;

        res.json({ 
            goal: plan.goal, 
            totalMeals, 
            completedMeals, 
            performance: Number(performance) 
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete weekly plan
exports.deleteWeeklyMeal = async (req, res) => {
    try {
        const plan = await WeeklyMeal.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }
        res.json({ message: "Weekly plan deleted successfully", deletedPlan: plan });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete all plans
exports.deleteAllPlans = async (req, res) => {
    try {
        console.log('Delete all plans request received');
        const result = await WeeklyMeal.deleteMany({});
        console.log('Delete result:', result);
        res.json({ 
            message: "All plans deleted successfully", 
            deletedCount: result.deletedCount 
        });
    } catch (err) {
        console.log('Error in deleteAllPlans:', err.message);
        res.status(400).json({ message: err.message });
    }
};

// Get plans by user (for compatibility with frontend)
exports.getPlansByUser = async (req, res) => {
    try {
        const plans = await WeeklyMeal.find().sort({ weekStartDate: -1 });
        res.json(plans);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};