const express = require('express');
const router = express.Router();
const { attendanceValidationRules, validate } = require('../middlewares/validator');
const controller = require('../controllers/attendanceController');

router.get('/', controller.getAttendance);
router.get('/:id([a-fA-F0-9]{24}$)', controller.getAttendanceById);
router.post('/', attendanceValidationRules(), validate, controller.createAttendance);
router.put('/:id', [attendanceValidationRules(), controller.recordExists], validate, controller.updateAttendance);
router.delete('/:id', controller.recordExists, validate, controller.deleteAttendance);

module.exports = router;