const express = require('express')
const bodyparser =require('body-parser')
const app = express();
app.use(bodyparser.urlencoded({extended:false}))
app.use('/login',express.static(__dirname +'/public'))
app.get('/',(req,res)=> {
    res.send('hello my application')
})
app.post('/login',(req,res)=>{
    console.log(req.body.email)

    // do some data base processing
    res.redirect('/')
})

app.listen(3000,()=>{console.log('server is running at 3000....')})