const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    dob: {type: String},
    id: {type: String},
    father: {
        first_name: {type: String},
        last_name: {type: String},
        dob: {type: String},
        id: {type: String}
    },
    mother: {
        first_name: {type: String},
        last_name: {type: String},
        dob: {type: String},
        id: {type: String}
    },
    spouse: {
        first_name: {type: String},
        last_name: {type: String},
        dob: {type: String},
        id: {type: String}
    },
    children: [{
        first_name: {type: String},
        last_name: {type: String},
        dob: {type: String},
        id: {type: String}
    }]
})

module.exports = mongoose.model("Person", schema)