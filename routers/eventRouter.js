const express = require('express');
const router = express.Router();
const { eventValidationRules, validate } = require('../middlewares/validator');
const controller = require('../controllers/eventController');

router.get('/', controller.getEvents);
router.get('/:id([a-fA-F0-9]{24}$)', controller.getEventById);
router.get('/search', controller.getEventBySearch);
router.get('/export', controller.recordExists, controller.getEventExport);
router.post('/', eventValidationRules(), validate, controller.createEvent);
router.put('/:id', [eventValidationRules(), controller.recordExists], validate, controller.updateEvent);
router.delete('/:id', controller.recordExists, controller.deleteEvent);

module.exports = router;