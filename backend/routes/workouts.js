const express = require('express');
const Workout = require('../models/Workout');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect); // All workout routes require auth

// GET /api/workouts — List all workouts for user (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { type, startDate, endDate, limit = 50, page = 1 } = req.query;
    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [workouts, total] = await Promise.all([
      Workout.find(filter).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
      Workout.countDocuments(filter),
    ]);

    res.json({ workouts, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workouts.' });
  }
});

// GET /api/workouts/stats — Aggregated stats for charts
router.get('/stats', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    // Daily calories for bar chart
    const dailyCalories = await Workout.aggregate([
      { $match: { user: req.user._id, date: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          calories: { $sum: '$caloriesBurnt' },
          duration: { $sum: '$duration' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Totals
    const totals = await Workout.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$caloriesBurnt' },
          totalDuration: { $sum: '$duration' },
          totalWorkouts: { $sum: 1 },
        },
      },
    ]);

    // By type
    const byType = await Workout.aggregate([
      { $match: { user: req.user._id, date: { $gte: since } } },
      { $group: { _id: '$type', count: { $sum: 1 }, calories: { $sum: '$caloriesBurnt' } } },
      { $sort: { calories: -1 } },
    ]);

    res.json({
      dailyCalories,
      totals: totals[0] || { totalCalories: 0, totalDuration: 0, totalWorkouts: 0 },
      byType,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// GET /api/workouts/:id — Get single workout
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ error: 'Workout not found.' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workout.' });
  }
});

// POST /api/workouts — Create workout
router.post('/', async (req, res) => {
  try {
    const workout = await Workout.create({ ...req.body, user: req.user._id });
    res.status(201).json(workout);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Failed to create workout.' });
  }
});

// PUT /api/workouts/:id — Update workout
router.put('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!workout) return res.status(404).json({ error: 'Workout not found.' });
    res.json(workout);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Failed to update workout.' });
  }
});

// DELETE /api/workouts/:id — Delete workout
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ error: 'Workout not found.' });
    res.json({ message: 'Workout deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workout.' });
  }
});

module.exports = router;
