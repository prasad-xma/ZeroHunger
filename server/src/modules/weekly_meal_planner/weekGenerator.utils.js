// Generates default weekdays and empty meals
const generateWeekDays = () => {
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    return days.map(day => ({
        day,
        meals: {
            breakfast: { foods: [], isCompleted: false },
            lunch: { foods: [], isCompleted: false },
            dinner: { foods: [], isCompleted: false }
        }
    }));
};

module.exports = generateWeekDays;