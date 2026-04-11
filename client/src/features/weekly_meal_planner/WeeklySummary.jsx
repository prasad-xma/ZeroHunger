import React from 'react';
import { Calendar, CheckCircle, TrendingUp, Clock } from 'lucide-react';

const WeeklySummary = ({ plan }) => {
  // Calculate total planned meals
  const totalPlannedMeals = plan.days?.reduce((total, day) => 
    total + 
    (day.meals.breakfast.foods.length > 0 ? 1 : 0) +
    (day.meals.lunch.foods.length > 0 ? 1 : 0) +
    (day.meals.dinner.foods.length > 0 ? 1 : 0), 0
  );

  // Calculate completed meals
  const completedMeals = plan.days?.reduce((total, day) => 
    total + 
    (day.meals.breakfast.isCompleted ? 1 : 0) +
    (day.meals.lunch.isCompleted ? 1 : 0) +
    (day.meals.dinner.isCompleted ? 1 : 0), 0
  );

  // Calculate completion rate
  const completionRate = totalPlannedMeals > 0 ? Math.round((completedMeals / totalPlannedMeals) * 100) : 0;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Planned Meals */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Planned Meals</h4>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalPlannedMeals}</p>
          <p className="text-sm text-gray-600 mt-1">Total meals planned</p>
        </div>

        {/* Completed Meals */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Completed</h4>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{completedMeals}</p>
          <p className="text-sm text-gray-600 mt-1">Meals completed</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Completion Rate</h4>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-600">{completionRate}%</p>
          <p className="text-sm text-gray-600 mt-1">Progress percentage</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Weekly Progress</h4>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Start</span>
          <span>Goal: {plan.goal}</span>
          <span>Complete</span>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">Daily Breakdown</h4>
        <div className="space-y-3">
          {plan.days?.map((day, index) => {
            const dayTotal = 
              (day.meals.breakfast.isCompleted ? 1 : 0) +
              (day.meals.lunch.isCompleted ? 1 : 0) +
              (day.meals.dinner.isCompleted ? 1 : 0);
            const dayPlanned = 
              (day.meals.breakfast.foods.length > 0 ? 1 : 0) +
              (day.meals.lunch.foods.length > 0 ? 1 : 0) +
              (day.meals.dinner.foods.length > 0 ? 1 : 0);
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{day.day}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${day.meals.breakfast.foods.length > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-600">B</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${day.meals.lunch.foods.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-600">L</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${day.meals.dinner.foods.length > 0 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-600">D</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {`${dayTotal}/${dayPlanned}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;
