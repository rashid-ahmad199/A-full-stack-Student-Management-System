const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    rollNumber: { type: String, required: [true, 'Roll number is required'], unique: true, trim: true, uppercase: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true, match: [/^[0-9+\-\s]{7,15}$/, 'Invalid phone number'] },
    course: { type: String, required: [true, 'Course is required'], trim: true },
    semester: { type: Number, min: 1, max: 12, default: 1 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    address: { type: String, trim: true, maxlength: 200, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
