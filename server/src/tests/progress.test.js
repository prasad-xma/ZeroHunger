import request from 'supertest';
import express from 'express';
import progressRoutes from '../modules/weekly_planner_prediction/progress.routes';
import WeeklyMeal from '../modules/weekly_meal_planner/weeklyMeal.model';
import Progress from '../modules/weekly_planner_prediction/progress.model';

// INTEGRATION TESTING - Testing progress tracker with meal plan integration
const app = express();
app.use(express.json());
app.use('/api/progress', progressRoutes);

describe('Progress Tracker - Integration Tests', () => {
  // Test: Progress save with meal plan performance calculation
  describe('POST /api/progress', () => {
    it('should save progress and calculate performance based on meal plan', async () => {
      // Create meal plan first
      await WeeklyMeal.create({
        userId: 'test_user',
        weekStartDate: '2024-01-01T00:00:00.000Z',
        goal: 'Weight Loss',
        days: [{
          day: 'Monday',
          meals: {
            breakfast: { foods: [{ name: 'Oatmeal', grams: 50 }], isCompleted: true },
            lunch: { foods: [{ name: 'Salad', grams: 100 }], isCompleted: true },
            dinner: { foods: [{ name: 'Chicken', grams: 150 }], isCompleted: false }
          }
        }]
      });

      const progressData = {
        weekStartDate: '2024-01-01T00:00:00.000Z',
        weight: 75.5
      };

      const response = await request(app)
        .post('/api/progress')
        .send(progressData)
        .expect(201);

      // Performance: 2 completed / 3 planned = 66.67%
      expect(response.body.performance).toBeCloseTo(66.67, 1);
      expect(response.body.weight).toBe(75.5);
    });

    it('should handle progress with no meal plan (0% performance)', async () => {
      const progressData = {
        weekStartDate: '2024-01-08T00:00:00.000Z', // No meal Plan
        weight: 74.0
      };

      const response = await request(app)
        .post('/api/progress')
        .send(progressData)
        .expect(201);

      expect(response.body.performance).toBe(0);
      expect(response.body.weight).toBe(74.0);
    });
  });

  // Test: Progress history retrieval
  describe('GET /api/progress/history', () => {
    it('should get all progress entries in descending order', async () => {
      // Create progress entries
      await Progress.create([
        { weekStartDate: '2024-01-01T00:00:00.000Z', weight: 80.0 },
        { weekStartDate: '2024-01-15T00:00:00.000Z', weight: 78.0 },
        { weekStartDate: '2024-01-08T00:00:00.000Z', weight: 74.0 }
      ]);

      const response = await request(app)
        .get('/api/progress/history')
        .expect(200);

      expect(response.body).toHaveLength(3);
      // Should be newest first
      expect(new Date(response.body[0].weekStartDate).getTime())
        .toBeGreaterThan(new Date(response.body[1].weekStartDate).getTime());
    });
  });

  // Test: Error handling
  describe('Error Handling', () => {
    it('should handle invalid weight values', async () => {
      const invalidData = {
        weekStartDate: '2024-01-01T00:00:00.000Z',
        weight: -5 // Invalid negative weight
      };

      const response = await request(app)
        .post('/api/progress')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toContain('Invalid weight value');
    });

    it('should handle missing required fields', async () => {
      const incompleteData = {
        weight: 75.0 // Missing weekStartDate
      };

      const response = await request(app)
        .post('/api/progress')
        .send(incompleteData)
        .expect(400);

      expect(response.body.message).toContain('Missing required fields');
    });
  });
});
