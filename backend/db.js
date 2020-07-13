
console.log(process.env.MONGO_USER, process.env.MONGO_PASS, process.env.MONGO_DB)

const mongoose = require('mongoose')

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.d2x4y.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

mongoose.connect(MONGO_URL, { useNewUrlParser: true });

function databaseConnection() {

    mongoose.connection
    .once('open', () => {
        console.log("Connected");
    })
    .on('error', (error) => {
        console.log("[ERROR]", error);
    });

}

databaseConnection()