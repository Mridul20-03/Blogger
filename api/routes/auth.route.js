import express from 'express';
import { signUp , signIn , google } from '../controllers/auth.contoller.js';

const router  = express.Router();

// It's a post request because we create something here

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google',google);

export default router;