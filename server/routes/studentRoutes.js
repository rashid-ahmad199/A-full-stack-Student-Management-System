const router = require('express').Router();
const c = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats', c.getStats);
router.route('/').get(c.getStudents).post(c.createStudent);
router
  .route('/:id')
  .get(c.getStudent)
  .put(c.updateStudent)
  .delete(authorize('admin'), c.deleteStudent);

module.exports = router;
