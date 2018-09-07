'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/file-controller');
const authService = require('../services/auth-service');

router.get('/:id', authService.authorize, controller.get);
router.get('/get/:id', authService.authorize, controller.getById);
router.post('/send/:id', authService.authorize, controller.post);
router.delete('/delete/:id', authService.authorize, controller.delete);

module.exports = router;