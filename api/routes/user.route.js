import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

//req is what we sent to API
//res is what we get from API

router.get('/test', test);

export default router;