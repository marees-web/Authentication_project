const createError=require('http-errors');
const user=require('../models/db');
const {authSchema}=require('../support/validate');
const {signAccessToken,signRefreshToken,verifyRefreshToken}=require('../support/token')
const client=require('../support/redis')


module.exports={
    register: async(req,res,next)=>{
   
        try {
              //  const{email,password }=req.body
            // if(!email||!password) throw createError.BadRequest()
            const result= await authSchema.validateAsync(req.body)
             const doesExist=   await user.findOne({email: result.email})
             if(doesExist) throw createError.Conflict(`${result.email} is already registered`)
    
             const User=new user(result)
             const savedUser= await User.save()
             const accessToken = await signAccessToken(savedUser.id)
             const refreshToken=await signRefreshToken(savedUser.id)
             res.send({accessToken,refreshToken})
    
        } catch (error) {
            if(error.isJoi === true)error.status = 422
            next(error)
        }
    },
    login: async(req,res,next)=>{
        try{
         
            const result =await authSchema.validateAsync(req.body)
            const User=await user.findOne({email:result.email})
            if(!User) throw createError.NotFound(`${result.email} not registered`)
    
             const isMatch=await User.isValidPassword(result.password)
             if(!isMatch) throw createError.Unauthorized('username/password not valid')
    
            const accessToken=await signAccessToken(User.id)
            const refreshToken=await signRefreshToken(User.id)
    
            res.send({accessToken,refreshToken})
        }
        catch(error){
            if(error.isJoi===true){
                return next(createError.BadRequest("Invalid Username/password"))
            }
            next(error)
        }
    
        
    },
    refreshToken: async(req,res,next)=>{
        try{
            const { refreshToken }=req.body
            if(!refreshToken) throw createError.BadRequest()
             const userId=   await verifyRefreshToken(refreshToken)
            const accessToken = await signAccessToken(userId)
            const refToken =await signRefreshToken(userId)
            res.send({accessToken: accessToken,refreshToken: refToken})
    
    
        }catch(error){
            next(error)
        }
    },
    logout: async(req,res,next)=>{
        try{
           const { refreshToken } =req.body
           if(!refreshToken) throw createError.BadRequest()
            const userId= await verifyRefreshToken(refreshToken)
            client.DEL(userId,(err,val)=>{
                if(err){
                    console.log(err.message)
                    throw createError.InternalServerError()
                }
                console.log(val)
                res.sendStatus(204)
            })
        }catch(error){
            next(error)
        }
    }
}