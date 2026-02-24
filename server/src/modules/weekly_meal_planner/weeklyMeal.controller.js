const WeeklyMeal = require('./weeklyMeal.model');

// Create a new weekly plan
exports.createWeeklyPlan = async (req, res) => {
    try {
        const { userId, weekStartDate, meals } = req.body;

        const plan = new WeeklyMeal({
            userId,
            weekStartDate,
            meals
        });

        await plan.save();

        res.status(201).json({
            message: "Weekly plan created successfully",
            plan
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get weekly plan by user
exports.getUserWeeklyPlan = async (req, res) => {
    try {
        const { userId } = req.params;

        const plan = await WeeklyMeal.find({ userId });

        res.status(200).json(plan);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update a weekly plan
exports.updateWeeklyPlan = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedPlan = await WeeklyMeal.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Weekly plan updated",
            updatedPlan
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete a weekly plan
exports.deleteWeeklyPlan = async (req, res) => {
    try {
        const { id } = req.params;

        await WeeklyMeal.findByIdAndDelete(id);

        res.status(200).json({
            message: "Weekly plan deleted"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};