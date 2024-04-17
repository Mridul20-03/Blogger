import express from 'express';
import { test , updateUser , deleteUser , signout ,getUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

//req is what we sent to API
//res is what we get from API

router.get('/test', test);
//put means we update something
//before calling udate we need to verify
router.put('/update/:userId',verifyToken,updateUser);

router.delete('/delete/:userId',verifyToken,deleteUser);
router.post('/signout',signout);
router.get('/getusers',verifyToken,getUsers);

export default router;