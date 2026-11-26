const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const userPayload = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || name.trim().length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters' });
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Please provide a valid email' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email is already registered' });

    // The very first account becomes the Admin, everyone else is a normal User
    const isFirst = (await User.countDocuments()) === 0;
    const user = await User.create({ name, email, password, role: isFirst ? 'admin' : 'user' });

    res.status(201).json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.me = (req, res) => {
  res.json({ user: userPayload(req.user) });
};
