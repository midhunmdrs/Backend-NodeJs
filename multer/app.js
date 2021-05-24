const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const path = require('path')
//const ejsLint = require('ejs-lint');
const app= express();
const port = process.env.port || 3000

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/myupload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload =multer({
  storage:storage,
}).single("profilepic")





//setup for ejs
 app.set('view engine','ejs')
 //setup static folder

 app.use(express.static('./public'))

 app.get('/',(req,res) => {
  res.render("index")

})


//desc 
app.post('/upload',(req,res)=>{
  upload(req,res,error =>{
    if(error){
      res.render('index',{
        message:error
      }) 
    }else {
        res.render('index',{message:'sucessfully uploaded ....',
        filename:`myupload/${req.file.filename}`})
      }
    
  })
})


// set up for multer 



app.listen(port,()=> console.log('server is reunning at' + port ))
