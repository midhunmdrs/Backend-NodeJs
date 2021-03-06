const express= require('express')
const router= express.Router();
//extra
const mongoose = require('mongoose')
const passport = require("passport")

//load person model
const Person = require("../../models/Person")

//load Profile model
const Profile =require("../../models/Profile")

//@type       GET
//@route      /api/profile
//@desc       route personal user profile
//@access     PRIVATE


// router.get('/',(req,res)=> res.json({profile:"Profile is Success"}))

router.get('/',
passport.authenticate('jwt',{session:false}),(req,res) => {
    Profile.findOne({ user:req.user.id})
    .then(profile =>{
        if(!profile) {
            return res.status(404).json({profilenotfound:"No profile found "})
        }
        res.json(profile)
    })
    .catch(err => console.log("got some error"+err))
});

//@type       POST
//@route      /api/profile
//@desc       route UPDATING & SAVING personaluser profile
//@access     PRIVATE

router.post('/',
passport.authenticate('jwt',{session:false}),(req,res) => {
    const profileValues ={}
    profileValues.user =req.user.id;
    if(req.body.username) {profileValues.username = req.body.username;}
    if(req.body.website) {profileValues.website = req.body.website;}
    if(req.body.country) {profileValues.country = req.body.country;}
    if(req.body.portfolio) {profileValues.portfolio = req.body.portfolio;}
    if(typeof req.body.languages !== undefined){
        profileValues.languages = req.body.languages.split(",");
    }
//get social links
    profileValues.social={}

    if(req.body.youtube) {profileValues.social.youtube = req.body.youtube;}
    if(req.body.facebook) {profileValues.social.facebook = req.body.facebook;}
    if(req.body.Instagram) {profileValues.social.Instagram = req.body.Instagram;}

    // Do database stuff
    Profile.findOne({user:req.user.id})
        .then(profile => {
            if(profile){
                Profile.findOneAndUpdate(
                    {user:req.user.id},
                    {$set:profileValues},
                    {new:true}
                ).then(profile => res.json(profile))
                 .catch(err => console.log('problem in update'+err))
            } else{
                Profile.findOne({username:profileValues.username})
                    .then(profile =>{
                        if(profile){
                            res.status(400).json({username:"username already exists"})
                        }
                        // save user
                        new Profile(profileValues)
                            .save()
                            .then(profile => res.json(profile))
                            .catch(err => console.log("save user unsucessful "+err))
                    })
                    .catch(err => console.log("Internal server error "+err))
            }
        })
        .catch(err => console.log("problem in fetching profile"+err))
}
);

//@type       GET
//@route      /api/profile/:username
//@desc       route for getting user profile based on USERNAME
//@access     PUBLIC

router.get('/:username',(req,res) => {
    Profile.findOne({username:req.params.username})
     .populate('user',['name','profilepic'])
     .then(profile => {
         if(!profile){
             res.status(404).json({usernotfound:"user not found"})
         }
         res.json(profile)
     })
     .catch(err => console.log('error in fetching username'+err))
})
//Assignment
//@type       GET
//@route      /api/profile/find/id
//@desc       route for getting user profile based on USERID
//@access     PUBLIC 

router.get('/find/:id',(req,res) => {
    Profile.findOne({id:req.params.ObjectId})
     .populate('user',['name','profilepic'])
     .then(profile => {
         if(!profile){
             res.status(404).json({usernotfound:"id not found"})
         }
         res.json(profile)
     })
     .catch(err => console.log('error in fetching username'+err))
})

//@type       DELETE
//@route      /api/profile/
//@desc       route for deleting user by id
//@access     PUBLIC 

router.delete('/',passport.authenticate('jwt',{session:false},(req,res) => {
    Profile.findOne({user:req.user.id})
    Profile.findOneAndRemove({user:req.user.id})
        .then( () => {
            Person.findOneAndRemove({_id:req.user.id})
            .then(() =>res.json({delete:"delete was success"}))
            .catch(err => console.log(err))
        } )
        .catch(err => console.log(err))
    
}))

//@type       POST
//@route      /api/profile/workrole
//@desc       route for adding workrole of user 
//@access     PUBLIC 

router.post('/workrole' ,passport.authenticate('jwt',{session: false}),(req,res) =>{
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            const newWork = {
                role: req.body.role,
                company: req.body.company,
                country: req.body.country,
                from:req.body.from,
                to:req.body.to,
                current:req.body.current,
                details:req.body.details,
            }
        profile.workrole.unshift(newWork)//push(newWork)
        profile.save()
            .then(profile => res.json(profile))
            .catch(err => console.log(err))
        })
        .catch(err =>console.log(err))
}
)

//@type       DELETE
//@route      /api/profile/workrole/w_id
//@desc       route for deleting a specific workrole of user 
//@access     PRIVATE
router.delete('/workrole/:w_id',passport.authenticate('jwt',{session: false}),(req,res) =>{
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            const removethis = profile.workrole
            .map(item =>item.id)
            .indexOf(req.params.w_id)
            profile.workrole.splice(removethis,1);
            profile
              .save()
              .then(profile =>res.json(profile))
              .catch(err =>console.log(err))

        })
        .catch(err=>console.log(err))
    })

module.exports = router;