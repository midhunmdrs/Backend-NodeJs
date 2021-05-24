const express= require('express')
const app = express();

app.get('/',(req,res) => { 
    res.send('Hello Midhun ');

});
app.get('/about',(req,res) =>{ 
    res.send('Hello About midhun')
})

app.get('/contact',(req,res) =>{ 
    res.send('Hello About midhun')
})
app.get('/services',(req,res) =>{ 
    res.sendFile('C:/Users/USER/Desktop/BackEnd/03expressbasics/services.html')
})
app.post('/login',(req,res) => {
    res.send('login success')
})
app.delete('/remove',(req,res)=>{
    res.send('delete sucesss')
})

app.get('/user/:id/status/:status_id',(req,res)=>{
    res.send(req.params)
})
app.listen(3000,() => console.log('server is running at 3000'))

// app.get('/about-user',(req,res)=>{res.status(200).json({name:'shyam',credit:'5000',id:'sm1234'})})

app.get('/about-user',(req,res)=>{res.status(500).json({name:'shyam',credit:'5000',id:'sm1234'})})
