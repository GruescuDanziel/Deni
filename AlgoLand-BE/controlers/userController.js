/** 
* @module userController 
* @Summary A controller for the user's account, able to do CRUD operations and more.
*/

const express     = require('express');
const router      = express.Router();
const db          = require('../database/database')
const usermdl     = require('../database/models/user')
const bodyParser  = require('body-parser')
const bcrypt      = require('bcrypt')
const { create }  = require('../managers/jwtManager')

function validateEmail(text) { 
    var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
}

/** 
* Get an user using an email or an username
* @async
* @param {string} userSearchTerm - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
* @return {object} JSON Object of the User's data (from the DB)
* @example getUser('JohnDoe')
*/
async function getUser(userSearchTerm){
    let foundUser;
    if(!validateEmail(userSearchTerm)){
        foundUser = usermdl.findOne({username: userSearchTerm})
            .then((dataRes)=>{
                if(dataRes != null){return dataRes}
            })
    return foundUser}
    else{
    foundUser = usermdl.findOne({email: userSearchTerm.toLowerCase()})
            .then((dataRes)=>{
                if(dataRes != null){return dataRes}
            })

    return foundUser}
}


/**
 * Make a userObject ready for saving inside the database
 * @param {object} userData - Gets a json with he data for the user 
 * @return {object} Mongoose model that is the user to save
 *
 */
function makeUser(userData){
    return new usermdl({
        email:        userData.email,
        username:     userData.username,
        password:     userData.password})
}

function createUser(req,res){
    let userData = req.body;
    getUser(userData.email).then(user => {
        if(!user){
            encrypt(userData.password).then(encryptedPassword => {
                userData.password = encryptedPassword;
                const newUser = makeUser(userData);
                newUser.save()
                res.sendStatus(200);
            });
        }else{res.send("account was taken")}

    })
      }

function makeCookies(cookieName, cookieValue, expiration, httpOnlyState, secureState, res){
    res.cookie(
        cookieName, 
        cookieValue, 
        {   maxAge  : expiration, 
            httpOnly:httpOnlyState, 
            secure: secureState
        })
}

async function loginUser(req, res){
     await getUser(req.query.email).then(user =>{
    if(user){
        console.log(user);
        res.send(user);
    }
         else{
             res.sendStatus(404);}
    })
}
/** 
* Hashes a password using BCrypt
* @param {string} newPassword - Password to hash
* @return {string} Hashed password
*/
async function encrypt(newPassword){
  let hashData = '';
  await bcrypt.hash(newPassword, 10).then(data =>{hashData = data})
  return hashData
}


/** 
* Sends an email to the user with a reset code and then, if the code is valid, 
* it resets the user's password
* @summary Resets user's password
* @param  {object} req - Web request, sent by the client
* @param  {object} res - Web request, sent by the server
*/
function resetPassword(req, res){
  const resToken = req.cookies.resToken
  const verifiedToken = jwtManager.verify(resToken);
  if(verifiedToken){
    encrypt(req.body.password).then(hash =>{
      getUser(verifiedToken.email).then(usr =>{
        console.log(usr);
        usr.password = hash;
        usr.save();
        res.sendStatus(200)
      });
    })  
  }
}

function generateResetCode(){
      return Math.floor(Math.random() * (999999 - 100000) + 100000)
}

function sendPasswordEmail(req, res){
    getUser(req.body.email || req.body.username)
        .then(usr => {
            const resetCode = generateResetCode();
            const userEmail = usr.email;
            const jwtData = {
                "resetCode" : resetCode,
                "userEmail" : userEmail};
            const userJwt = create(jwtData);
            makeCookies('resToken', userJwt, 2592000, true, true, res);
        })
}

module.exports = {
    registerUser : createUser,
    loginUser : loginUser,
    resetPassword : resetPassword,
    sendPasswordEmail : sendPasswordEmail
}
