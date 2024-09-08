const express=require('express');
const router=express.Router();
const authController= require('../Controllers/auth_controller')


router.post("/login",authController.login)

router.post("/register",authController.register)

router.post("/refresh-token",authController.refreshToken)

router.delete("/logout",authController.logout)

module.exports=router