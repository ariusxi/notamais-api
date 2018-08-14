'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/user-controller');

//definindo cada tipo de requisição
router.get('/fetch-all', controller.get);
router.post('/create', controller.post);
router.post('/auth', controller.authenticate);
router.post('/refresh-token', controller.refreshToken);

module.exports = router;