'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/user-controller');

//definindo cada tipo de requisição
router.get('/user', controller.get);

module.exports = router;