const redis=require('redis');

const client=redis.createClient({
    port: 6379,
    host:"127.0.0.1"
})
client.connect()
.then(()=>{
    console.log("Redis connected")
})
.catch((err)=>{
    console.log(err.message)
})

client.on('connect',()=>{
    console.log("Client is Connected to redis...")
})
client.on('ready',()=>{
    console.log("Client is Connected to redis and ready to use...")
})

client.on('error',()=>{
    console.log(err.message)
})

client.on('end',()=>{
    console.log("client is disconnected from redis")
})

process.on('SIGINT',()=>{
    client.quit()
})

module.exports=client