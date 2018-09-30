'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/file-controller');
const authService = require('../services/auth-service');

router.get('/user/:id', authService.authorize, controller.get);
router.get('/get/:id', authService.authorize, controller.getById);
router.get('/fetch-all', authService.isAdmin, controller.getAdmin);
router.get('/danfe/:id', authService.authorize, controller.generateDanfe);
router.get('/generate-company/:id', authService.authorize, controller.generateCompany);
router.get('/nfe/:id', authService.authorize, controller.generateNfe);
router.post('/send/:id', authService.authorize, controller.post);
router.delete('/delete/:id', authService.authorize, controller.delete);

module.exports = router;