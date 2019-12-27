/**
 * Created by Asem Qaffaf
 * https://github.com/asemqaffaf
 *
 * description: database
 *
 */
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection
db.on('error', (err) => console.err(err))
db.once('open', () => console.log(`Connected to users database`))

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber :{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('users',usersSchema)