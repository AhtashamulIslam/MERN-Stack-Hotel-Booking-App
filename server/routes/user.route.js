import express from "express";
import {signOut,updateUser,deleteUser,getUser, storeRecentSearchedCities} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router()

router.get('/:userId',verifyToken,getUser)
router.put('/update/:userId',verifyToken,updateUser)
         // Once the user is verified, the next() will be invoked updateUser and user 
            // will be attatched to the request body as user.
router.delete('/delete/:userId',verifyToken,deleteUser)
router.post('/signout',signOut)
router.post('/store-recent-search/:userId',verifyToken,storeRecentSearchedCities)

export default router;