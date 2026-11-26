// Run with: npm run seed   (from the project root or the server folder)
// Creates a demo admin, a demo user and 25 sample students so the dashboard looks good.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');

const courses = ['Computer Science', 'Software Engineering', 'Electrical Engineering', 'Business Administration', 'Data Science'];
const names = [
  'Ali Khan', 'Ayesha Noor', 'Bilal Ahmed', 'Sara Malik', 'Usman Tariq', 'Fatima Zahra', 'Hamza Shah',
  'Zainab Ali', 'Omar Farooq', 'Hira Aslam', 'Saad Iqbal', 'Maryam Javed', 'Daniyal Raza', 'Laiba Qureshi',
  'Hassan Mehmood', 'Noor Fatima', 'Talha Hussain', 'Iqra Saeed', 'Faizan Butt', 'Mahnoor Sheikh',
  'Adeel Siddiqui', 'Sana Yousaf', 'Kamran Akbar', 'Rabia Anwar', 'Junaid Hanif',
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await Student.deleteMany({});

    const admin = await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' });
    await User.create({ name: 'Demo User', email: 'user@example.com', password: 'user123', role: 'user' });

    const docs = names.map((name, i) => ({
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@student.edu`,
      rollNumber: `STU${String(1001 + i)}`,
      phone: `0300${String(1000000 + i * 7919).slice(0, 7)}`,
      course: courses[i % courses.length],
      semester: (i % 8) + 1,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      address: `House ${i + 10}, Street ${(i % 9) + 1}, Peshawar`,
      createdBy: admin._id,
      createdAt: new Date(Date.now() - i * 20 * 60 * 60 * 1000),
    }));
    await Student.insertMany(docs);

    console.log('Seed complete.');
    console.log('Admin  -> admin@example.com / admin123');
    console.log('User   -> user@example.com  / user123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
