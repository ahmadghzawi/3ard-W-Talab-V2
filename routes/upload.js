/**
 * description: upload files using multer
 *
 */
const express = require('express')
const route = express.Router()

const multer = require('multer')
// const upload = multer({dest: 'upload/'})
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./upload/")
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, response) => {
    arr = file.mimetype.split("/")
    if (arr[0] === 'image') {
        response(null, true)
    }
    else {
        response(new Error ('unaccepted format'), false)
    }
}
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter
})
route.use('/', express.static('upload'))
route.post('/', upload.single('image'), (request, response) => {
    response.json(request.file)
})
module.exports = route

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/png') {
//         cb(null, true)
//     } else {
//         cb(new Error, false)
//     }
// }