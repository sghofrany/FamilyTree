const express = require('express')
const postRouter = express.Router()

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

postRouter.post('/', function(req, res) {
    console.log(req.body.test)
    res.sendStatus(200)
})

module.exports = postRouter