/**
 * Connects to the database
 */

require('./db')

const mongoose = require('mongoose')

mongoose.connection.on('connected', () => {
    
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names);
    });

})