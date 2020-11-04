const express = require('express');
const router = express.Router();
const { memberValidationRules, validate } = require('../middlewares/validator');
const controller = require('../controllers/memberController');

router.get('/', controller.getMembers);
router.get('/:id([a-fA-F0-9]{24}$)', controller.getMemberById);
router.get('/search', controller.getMemberBySearch);
router.post('/', memberValidationRules(), validate, controller.createMember);
router.put('/:id', [memberValidationRules(), controller.recordExists], validate, controller.updateMember);
router.delete('/:id', controller.recordExists, controller.deleteMember);

module.exports = router;