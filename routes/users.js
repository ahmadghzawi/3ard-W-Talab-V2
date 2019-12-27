/**
 * description: this is a  micro service for users and services
 *  200 OK
 *  201 successfully create an object
    202 Accepted
    204 No Content
    400 Bad Request
    404 Not Found

 */
const express = require('express')
const router = express.Router()
const userDB = require('./../models/UsersDatabase')
router.use(express.json())
/*<=========================== START.fetch all users  func.===========================>*/
router.get('/data', async (request, response) => {
    try {
        const users = await userDB.find()
        response.status(200).json(users)
    }
    catch (error) {
        response.status(500).json({ message: error.message })
    }
})
/*<=========================== fetch  user by id  ===========================>*/
router.get('/data/:id', async (request, response) => {
    try {
        const users = await userDB.findById(request.params.id,(err,res)=>{
            if (err){
            response.status(404).json({ message: error.message })
            }
            else{
                response.json(res)
            }
        })
      
    }
    catch (error) {
        response.status(500).json({ message: error.message })
    }
})

/*<=========================== End.fetch all users  func.===========================>*/
/*<=========================== START.create new user  func.===========================>*/
async function verifyToCreateAccount(email) {
    const users = await userDB.find()
    let verified = true
    users.forEach(item => {
        if (item.email === email) {
            verified = false
        }
    })
    return verified
}
router.post('/new', async (request, response) => {
    let { name, email, password , phoneNumber } = request.body
    email = email.toLowerCase()
    if (await verifyToCreateAccount(email)) {
        const user = new userDB({
            name : name.toLowerCase(), 
            email : email.toLowerCase(),
            password : password.toLowerCase(),
            phoneNumber
        })
        try {
            const newUser = await user.save()
            response.status(201).json(newUser)
        }
        catch (error) {
            response.status(204).json({ message: error.message })
            // response.status(400).json({  message : 'please use forget my password',rejection : 'email is already exist'   })
        }
    }
    else  {
        response.status(400).json({  message : 'please use forget my password',rejection : 'email is already exist'   })

    }
})
/*<=========================== End.create new user  func.===========================>*/

/*<=========================== Start .verify an existence user  func.===========================>*/
async function verifyAccount(user) {
    const users = await userDB.find()
    let p = new Promise((resolve, reject) => {
        users.forEach(usr => {
            if (usr.email === user.email && usr.password === user.password) {
                resolve({userId : usr._id ,username : usr.name , phoneNumber : usr.phoneNumber, email : usr.email })
            }
        })
        reject('no user found')
    })
    return p
}

router.get('/auth', async (request, response) => {
    await verifyAccount(request.query)
        .then((userId) => response.status(202).json(userId))
        .catch((error) => response.status(400).json({ message: error }))
})
/*<=========================== End .verify an existence user  func.===========================>*/

/*<=========================== Start .delete an existence user  func.===========================>*/
router.delete('/delete/:id', async (request, response) => {
    try {
        await userDB.findByIdAndDelete(request.params.id, (err, doc) => {
            if(err){response.status(400).json({message : err.message})}
            else {response.status(202).json( { deletion : doc})}
        })
    }
    catch(error) {
        response.status(500).json({message : error.error})
    }
   
})
/*<=========================== Start .delete an existence user  func.===========================>*/

module.exports = router