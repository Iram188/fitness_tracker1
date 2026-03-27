const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: 100,
  },
  type: {
    type: String,
    enum: ['calories', 'workouts', 'duration', 'weight'],
    required: true,
  },
  targetValue: {
    type: Number,
    required: true,
    min: 0,
  },
  currentValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  unit: { type: String, default: '' },
  deadline: { type: Date },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
