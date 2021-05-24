const express= require('express')
const app = express();

var myconsolelog = function(req,res,next){
    console.log('I am  a MIDDLEWARE')
    next();
}

var servertime = function (req,res,next){
    req.reqestTime =Date.now()
    next()
}

app.use(servertime)

app.get('/',(req,res,)=>{
    res.send("hello midhun" + "time is : "+req.reqestTime)
    console.log("hello world from /'")
})


app.listen(3000,() => console.log('server is running at 3000'))