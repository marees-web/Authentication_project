const mongoose=require('mongoose');



mongoose.connect(process.env.MONGO_URL,
    {dbName:"authentication_project",
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("Mongodb is Connected")
})
.catch((err)=>{
    console.log("Failed to Connected")
})

mongoose.connection.on('connected',()=>{
    console.log("mongoose conneceted to db")
})
mongoose.connection.on('error',(err)=>{
    console.log(err.message)
})
mongoose.connection.on('disconnected',()=>{
    console.log("Mongoose connection is disconnected")
})

process.on('SIGINT',async()=>{
    await mongoose.connection.close();
    process.exit(0)
})