const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Workout title is required'],
    trim: true,
    maxlength: 100,
  },
  type: {
    type: String,
    required: true,
    enum: ['cardio', 'strength', 'yoga', 'hiit', 'cycling', 'swimming', 'running', 'walking', 'other'],
  },
  duration: {
    type: Number, // minutes
    required: [true, 'Duration is required'],
    min: 1,
    max: 600,
  },
  caloriesBurnt: {
    type: Number,
    required: [true, 'Calories burnt is required'],
    min: 0,
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  notes: { type: String, maxlength: 500 },
  date: {
    type: Date,
    default: Date.now,
  },
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      weight: Number, // kg
    }
  ],
}, { timestamps: true });

// Index for fast user+date queries
workoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);
