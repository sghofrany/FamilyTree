const express = require('express')
const postRouter = express.Router()
const Person = require('../models/Person')
const { v4: uuidv4 } = require('uuid')

/**
 * This is run everytime any of the routes bellow are called.
 */
postRouter.use(function(req, res, next) {

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
    var id = uuidv4()

    var person = new Person({
        first_name: firstName,
        last_name: lastName,
        dob: dob,
        id: id,
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
        spouse: {
            first_name: "",
            last_name: "",
            dob: "",
            id: ""
        },
        children: []
    })

    person.save(function(err) {
        if(err) {
            console.log("error while creating a new document", err)
            res.sendStatus(400)
            return
        }
 
        console.log("Document saved successfully!")

    })

    res.send({status: 200, id: id})
})

postRouter.post('/update/:id', function(req, res) {
  
    let spouse = req.body.spouse
    let father = req.body.father
    let mother = req.body.mother
    let children = req.body.children


    Person.find({id: req.params.id}, (err, result) => {
    
        if(result.length > 0) {

            let arr = cleanArray(children)

            const update = {
                spouse: spouse,
                father: father,
                mother: mother,
                children: arr
            }

            Person.findOneAndUpdate({id: req.params.id}, update, {
                new: true
            },
            function(err, response) {
                if(err) {
                    return res.sendStatus(400)
                }
        
                res.send(response)
            });

        }

    }).catch((err) => {
        console.log(err)
    })




})

postRouter.get('/:id', function(req, res) {
 
    Person.find({id: req.params.id}, (err, result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })

})

postRouter.get('/search/:first/:last/:dob', function(req, res) {

    Person.find({first_name: { "$regex": req.params.first, "$options": "i" }}, (err, result) => { 
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })

})

function handleEmptyId(data) {

    console.log(data)

    if(data.length === 0) {
        return uuidv4()
    }

    return data
}

const combinedArray = (arr1, arr2) => {

    let val = arr2.slice()


    //if editArray is length 0 return children

    if(arr1.length === 0) return arr2

    //if children is length 0 return editArray

    if(arr2.length === 0) return arr1

    for(var i = 0; i < arr1.length; i++) {

        let curr = arr1[i]

        for(var j = 0; j < arr2.length; j++) {

            let add = arr2[j]

            if(curr.id !== add.id) {
                val.push(curr)
            }

            
        }

    }

    return val

}

const doesArrayContain = (arr, id) => {

    for(var i = 0; i < arr.length; i++) {
        if(arr[i].id === id) {
            return true
        }
    }

    return false
}

const cleanArray = (arr) => {
    
    let val = []

    if(arr.length === 0) {
        console.log("arr length is 0")
        return []
    }

    for(var i = 0; i < arr.length; i++) {

        var id = arr[i].id

        if(!doesArrayContain(val, id)) {
            console.log("doesnt contain", id)
            val.push(arr[i])
        } else {
            console.log("contains", id)
        }

    }

    console.log(val)

    return val

}

module.exports = postRouter