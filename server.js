
require('dotenv').config()
const express = require('express') // express js
const cors = require('cors')
const app = express()
app.use(cors())   ///middleware for network
app.use(express.json())  // middleware as well but this will make all responses with json type !
// app.listen(process.env.PORT_NUM, () => console.log(`Connected at port ${process.env.PORT_NUM}`))

app.get('/', (req, res) => res.json('dashboard'))
const userRouter = require('./routes/users')
app.use(process.env.USER_ROUTE_URL, userRouter)     //      /users/API/
const postRouter = require('./routes/posts')
app.use(process.env.POST_ROUTE_URL, postRouter)     //      /posts/API/

app.listen(process.env.PORT || 5000)

