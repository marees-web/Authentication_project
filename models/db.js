
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bcrypt=require('bcryptjs')


const userSchema=new Schema({
    email:{
       type:String,
       required:true,
       unique:true,
       lowercase:true
    },
    password:{
        type:String,
        required:true
    }
})
userSchema.pre('save',async function(next){
    try {
        const salt= await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(this.password,salt)
        this.password=hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})
userSchema.methods.isValidPassword =async function(password){
    try{
      return  await bcrypt.compare(password,this.password)

    }catch(error){
     throw(error)
    }
}

const userDB=mongoose.model('Userdetails',userSchema)
module.exports=userDB;