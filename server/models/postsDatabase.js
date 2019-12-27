/**
 * Created by Asem Qaffaf
 * https://github.com/asemqaffaf
 *
 * description: database
 *
 */
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.err(error))
db.once('open', () => console.log(`Connected to Posts database`))


const postFormSchema = new mongoose.Schema({
    User_id: { type: String },
    LongTime: { type: String }
}, { strict: false })

module.exports = mongoose.model('posts', postFormSchema);