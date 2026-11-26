const Student = require('../models/Student');
const User = require('../models/User');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/students?search=&page=1&limit=10
exports.getStudents = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const search = (req.query.search || '').trim();

    const filter = {};
    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: rx }, { email: rx }, { rollNumber: rx }, { course: rx }];
    }

    const [students, total] = await Promise.all([
      Student.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Student.countDocuments(filter),
    ]);

    res.json({ students, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/stats
exports.getStats = async (req, res, next) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [total, thisWeek, recent, byCourse, totalUsers] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ createdAt: { $gte: weekAgo } }),
      Student.find().sort({ createdAt: -1 }).limit(5),
      Student.aggregate([{ $group: { _id: '$course', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      User.countDocuments(),
    ]);

    res.json({
      total,
      thisWeek,
      totalCourses: byCourse.length,
      totalUsers,
      recent,
      byCourse: byCourse.map((c) => ({ course: c._id, count: c.count })),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/:id
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('createdBy', 'name email');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

const pick = (body) => {
  const { name, email, rollNumber, phone, course, semester, gender, address } = body;
  return { name, email, rollNumber, phone, course, semester, gender, address };
};

// POST /api/students
exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create({ ...pick(req.body), createdBy: req.user._id });
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

// PUT /api/students/:id
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/students/:id  (admin only)
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    next(err);
  }
};
