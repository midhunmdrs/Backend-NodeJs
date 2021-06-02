const express= require('express')
const router= express.Router();

// router.get('/',(req,res)=> res.json({Question:"Question is success"}))

//extra
const mongoose = require('mongoose')
const passport = require("passport")

//load person model
const Person = require("../../models/Person");
const Profile = require('../../models/Profile');

//load Question model
const Question = require("../../models/Question")

//@type       POST
//@route      /api/questions
//@desc       route personal user question
//@access     PRIVATE



router.post('/',
passport.authenticate('jwt',{session:false}),(req,res) => {
    const newQuestion = new Question({
        textone:req.body.textone,
        texttwo:req.body.texttwo,
        user:req.user.id,
        name:req.user.name
    });
    newQuestion.save().then(question => res.json(question)).catch(err =>console.log("unable to save"))
})
//@type       GET
//@route      /api/questions
//@desc       route for showing all questions
//@access     PUBLIC

router.get('/',(req,res) => {
    Question.find()
        .sort({date:"desc"})
        .then(questions => res.json(questions))
        .catch(err =>res.json({noquestions:"NO Questions"}))
})

//@type       POST
//@route      /api/questions/answers/:id
//@desc       route for showing all questions
//@access     PRIVATE

router.post('/answers/:id',passport.authenticate('jwt',{session:false}),(req,res) => {
    Question.findById(req.params.id)
    .then(question =>{

    const newAnswer = {
        user: req.user.id,
        text: req.body.text,
        name: req.body.name,
        date: req.body.date,

    };
    question.answers.unshift(newAnswer)
    question
        .save()
        .then(question =>res.json(question))
        .catch(err => console.log(err))
})

.catch(err => console.log(err))    
    
})

//@type       POST
//@route      /api/questions/upvote/:id
//@desc       route for showing all questions
//@access     PRIVATE
router.post('/upvote/:id',passport.authenticate('jwt',{session:false},(req,res) => {
    Profile.findOne({user:req.user.id})
        .then(profile => {
            Question.findById(req.params.id)
              .then(question => {
                  if(question.upvotes.filter(upvote =>upvote.user.toString()===req.user.id.toString()).length >0){
                      return res.status(400).json({noupvote:"User Already upvoted"})
                  }
                  question.upvotes.unshift({user:req.user.id})
                  question
                  .save()
                  .then(question =>res.json(question))
                  .catch(err => console.log(err))
              })
              .catch(err =>console.log(err))
        })
        .catch(err => console.log(err))
}))
module.exports = router;