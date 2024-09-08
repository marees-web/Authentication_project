const express=require('express');
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
const morgan=require('morgan');
app.use(morgan('dev'));
const createError=require('http-errors');
require('dotenv').config();
require('./support/init-mongodb');
require('./support/redis');
const{verifyAccessToken}=require('./support/token')

const authRoute=require('./Routes/route')
const PORT=process.env.PORT ||  2950;

app.get('/',verifyAccessToken,async(req,res,next)=>{
  
    res.send("welcome")
})
app.use("/mars",authRoute)

app.use(async(req,res,next)=>{
    next(createError.NotFound())
})
app.use((err,req,res,next)=>[
    res.status(err.status || 500),
    res.send({
        error:{
            status:err.status || 500,
            message:err.message,
        },
        
    })
])

app.listen(PORT,()=>{
    console.log(`server is listening on "${PORT}"`)
})