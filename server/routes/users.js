import express from 'express';

import { signin, signup } from '../controllers/user.js'

const router = express.Router();

router.post('/signin', signin);  // post request because we'll have to send all the info form the login form to the backend and then backend does something
router.post('/signup', signup);  // post request because we'll have to send all the info form the login form to the backend and then backend does something

export default router;