require('dotenv').config()

require('./db')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')

const postRouter = require('./routes/post')

const app = express()

const PORT = process.env.PORT;

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('../client/build'));
}


app.use('/api', postRouter)

app.post('/', function(req, res) {
    res.sendStatus(200)
})

app.listen(PORT ? PORT : 5000, () => console.log(`Server starting on port ${PORT}`));