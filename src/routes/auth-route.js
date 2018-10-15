'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/auth-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/', authService.isAdmin, controller.get);
router.get('/user/:id', authService.isAdmin, controller.getByUser);

module.exports = router;