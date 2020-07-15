const express = require('express')
const postRouter = express.Router()
const Person = require('../models/Person')
const { v4: uuidv4 } = require('uuid')

/**
 * This is run everytime any of the routes bellow are called.
 */
postRouter.use(function(req, res, next) {

    console.log("middleware for authentication goes here.")

    /**
     * if(some form of auth) { next() } else { res.sendStatus(403) }
     */

    /**
     * the next() function determines if we should go to the next route after our middleware functions have ran.
     *  -ex: if user and password are incorrect, don't call next() because they are not autheticated, instead res.send/sendStatus something else like 'not auth'
     */
    next()
})

postRouter.post('/create', function(req, res) {

    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var dob = req.body.dob

    var person = new Person({
        first_name: firstName,
        last_name: lastName,
        dob: dob,
        id: uuidv4(),
        father: {
            first_name: "",
            last_name: "",
            dob: "",
            id: ""
        },
        mother: {
            first_name: "",
            last_name: "",
            dob: "",
            id: ""
        },
        siblings: []
    })

    person.save(function(err) {
        if(err) {
            console.log("error while creating a new document", err)
            res.sendStatus(400)
            return
        }
 
        console.log("Document saved successfully!")

    })

    res.sendStatus(200)
})

module.exports = postRouter