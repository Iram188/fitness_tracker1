const express = require('express');
const Goal = require('../models/Goal');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/goals
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch goals.' });
  }
});

// POST /api/goals
router.post('/', async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user._id });
    res.status(201).json(goal);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Failed to create goal.' });
  }
});

// PUT /api/goals/:id
router.put('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ error: 'Goal not found.' });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update goal.' });
  }
});

// DELETE /api/goals/:id
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ error: 'Goal not found.' });
    res.json({ message: 'Goal deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete goal.' });
  }
});

module.exports = router;
