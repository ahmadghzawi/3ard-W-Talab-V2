/**
 * description: this is a  micro service for products and services
 *  200 OK
 *  201 successfully create an object
    202 Accepted 
    204 No Content
    400 Bad Request
    404 Not Found
 */
const express = require('express') // express js
const cors = require('cors')
const router = express.Router()
router.use(cors())   ///middleware for network
router.use(express.json())  // middleware as well but this will make all responses with json type !
const productsData = require('../models/productsDatabase')


/*<===========================this method to fetch all post data ===========================*/
router.get('/data', async (request, response) => {
    try {
        let data = await productsData.find()
        response.status(200).json(data)
    } catch (err) {
        response.status(500).json({ message: err.message })
    }
})
/*<=========================== END.  fetch all   func.===========================>*/

/*<=====================this path will take the root path======================>*/
/*<===========================this method to search and sort categories all post  ===========================*/
router.get('/', async (request, response) => {
    var arr = []
    if (Object.keys(request.query).length !== 0) {
        if (request.query.q != null) {
            arr = await searchFunc(request.query.q)
        }
        if (request.query.q === undefined) {
            arr = await categoriesFunc(request.query)
        }
    }
    arr = (arr.length === 0 ? 'no request data found' : arr)
    response.json(arr)
})
/*<=========================== START. sort in Category has been applied in following func.===========================>*/
/*  params:
        postCategories
        location
        name
        additionalInfo 
        BIG n * 4
*/
async function categoriesFunc(name) {
    let Data = await productsData.find(name)
    return Data
}
/*<=========================== END. sort in Category  func.===========================>*/
/*<=========================== START. search operation has been applied in following func.===========================>*/
/*  params:
        {q:''}
*/
async function searchFunc(target) {
    // console.log('target', target) // {postCategories: '' }  {location: ''}name additionalInfo etc.
    let arr = (target ? [] : 'no data found')
    let data = productsData.find()
    await data.then(DATA => {
        if (target)
            DATA.map((post) => {
                Object.values(post._doc).map((nested) => {
                    if (typeof nested === 'string' && nested != null && target != null)
                        if (nested.toLowerCase().includes(target.toLowerCase())) {
                            // console.log(post._doc)
                            arr.push(post._doc)
                        }

                })
            })
    })
        .catch(err => {
            return { message: err.message }
        })
    return arr
}
/*<=========================== END. Search  func.===========================>*/

/*<=========================== START.get products API has been applied in following func.===========================>*/
/*  params: {sellerID: ''} 
            {buyerOffers: ''}  */
router.get('/getOffers', (async (request, response) => {
    // console.log(request.query.buyerOffers)
    response.json(request.query.sellerID != null ?
        await sellerOffers(request.query.sellerID) :
        await buyerOffers(request.query.buyerOffers)
    )
})) /// asem@qaffaf.com
async function sellerOffers(sellerID) {
    let arr = [] /// Asem or hello
    if (sellerID != null) {
        let data = productsData.find()
        await data.then(DATA => {
            DATA.map((post) => {
                if (post._doc.sellerID === sellerID) {
                    Object.keys(post._doc).map(key => {
                        if (post._doc[key].price != null) {
                            arr.push({ imgUrl: post._doc.imgUrl, price: post._doc[key].price, status: post._doc[key].status, name: post._doc.name, postCategories: post._doc.postCategories, location: post._doc.location, key, offerMaker: key, postId: post._doc[key].id, additionalInfo: post._doc.additionalInfo })
                        }
                    })
                }
            })
            arr = (arr.length === 0 ? [] : arr)
        })
            .catch(err => {
                return { message: err.message }
            })
    }
    return arr
}
async function buyerOffers(buyerName) {
    let arr = []
    let data = productsData.find()
    await data.then((DATA) => {
        DATA.map(post => {
            if (post._doc[buyerName] != null) {
                let newObj = post._doc[buyerName]
                newObj['imgUrl'] = post._doc.imgUrl
                newObj['id'] = post._doc._id
                newObj['name'] = post._doc.name
                newObj['postCategories'] = post._doc.postCategories
                newObj['location'] = post._doc.location
                newObj['additionalInfo'] = post._doc.additionalInfo
                arr.push(newObj)
            }
        })
        arr = (arr.length === 0 ? [] : arr)
    })
        .catch(err => {
            return { message: err.message }
        })

    return arr
}
/*<=========================== END.get products API   func.===========================>*/

/*<=========================== START.add new products API has been applied in following func.===========================>*/
router.post('/newProduct', async (request, response) => {
    // console.log(request.body)
    let { seller_id, product_category, location, title, info, image_path, bid } = request.body
    if (seller_id != null && product_category != null && location != null && title != null && info != null && image_path != null && bid != null) {
        try {
            await productsData.create(request.body, (err, doc) => {
                if (err) {
                    response.status(400).json({ message: err.message })
                } else
                    response.status(201).json(doc)
            })
        }
        catch (err) {
            response.status(500).json(err)
        }
    }
})

/*<=========================== END. add new products  func.===========================>*/
/*<=========================== START.add new offer to particular post   func.===========================>*/
router.get('/postOffers', async (request, response) => {
    // console.log(request.query)
    let { id } = request.query
    let offerMaker = Object.keys(request.query)[1]
    let offerPrice = request.query[offerMaker]
    // console.log(offerPrice)
    let newObj = { [offerMaker]: { price: offerPrice, date: Date(Date.now()), status: "pending", id } }
    try {
        await productsData.findByIdAndUpdate(id, newObj, (err, doc) => {
            if (err) { response.status(400).json({ message: err.message }) }
            else response.status(201).json(doc)

        })
    }
    catch (err) {
        response.status(500).json({ message: err.message })
    }

})
/*<=========================== END. add new products  func.===========================>*/
/*<=========================== START. DELETE a Post  func.===========================>*/
let IdsForDeleteArray = []
router.delete('/deleteAtSpecificTime/:id', async (request, response) => {
    let ids = request.params.id
    IdsForDeleteArray.push(ids)
    // console.log(IdsForDeleteArray)
    if (IdsForDeleteArray.length !== 0) {
        DeleteTimer
    }
    response.json("it will have been deleted at 12 AM")
})
const DeleteAtSpecificTime = async (id) => {
    let output = null
    try {
        await productsData.findByIdAndDelete(id, (err, doc) => {
            if (err) { output = { message: err.message } }
            else {
                output = { deletion: doc }
                IdsForDeleteArray.shift()
            }
        })
    }
    catch (error) {
        output = { message: error.message }
    }
    return output
}
const DeleteTimer = setInterval(() => {
    var date = new Date();
    if (date.getHours() === 0 && date.getMinutes() === 0) {
        IdsForDeleteArray.forEach(async id => {
            await DeleteAtSpecificTime(id)
            console.log("deleted items", await DeleteAtSpecificTime())
        })
    }
}, 20000)
router.put('/acceptOffer/', async (request, response) => {

    await productsData.findById(request.body.postId, async (err, doc) => {
        if (err) response.status(401).json(err)
        else {
            let post = doc._doc
            let newObj = {}
            for (key in post) {
                if (typeof post[key] === 'object' && key !== '_id') {
                    if (key === request.body.offerMaker) {
                        post[key].status = ['Accepted', request.body.contactNumber]
                    }
                    else {
                        post[key].status = 'Rejected'
                    }
                    newObj[key] = post[key]
                }

            }
            try {
                await productsData.findByIdAndUpdate(request.body.postId, newObj, (err, doc) => {
                    if (err) { response.status(400).json({ message: err.message }) }
                    else response.status(201).json(doc)

                })
            }
            catch (err) {
                response.status(500).json({ message: err.message })
            }



            // response.json(newObj)
        }
    })


})
router.put('/deniedOffer/', async (request, response) => {
    // let { offerMaker, postId } = request.body
    let query = request.body.offerMaker + '.status'
    try {
        await productsData.updateOne({ _id: request.body.postId }, { $set: { [query]: "Rejected" } }, (err, doc) => {
            if (err) { response.status(400).json({ message: err.message }) }
            else response.json(doc)
        })
    }
    catch (err) {
        response.status(500).json({ message: err.message })
    }
})
router.put('/deleteOffer/', async (request, response) => {
    let { offerMaker, postId } = request.body
    // console.log(request.body)
    let data = await productsData.findById(postId)
    let deleteOffer = { [offerMaker]: data._doc[offerMaker] }
    try {
        let data2 = await productsData.update({ "_id": postId }, { $unset: deleteOffer })
        response.status(201).json(data2['ok'])
    }
    catch{
        response.status(500).json({ message: err.message })
    }
})
/*<=========================== END. DELETE a Post  func.===========================>*/
router.get('/getUserproducts', async (request, response) => {
    try {
        let data = await productsData.find(request.query)
        response.json(data)
    }
    catch{
        response.status(500).json({ err: err.message })
    }
})
router.delete('/deletePost/:id', async (request, response) => {
    try {
        await productsData.findByIdAndDelete(request.params.id, (err, doc) => {
            if (err) {
                response.status(404).json(err)
            } else {
                response.status(200).json(doc)
            }
        })
    } catch{
        response.status(500).json(err)
    }
})
router.delete('/deleteUserproducts/:id', async (request, response) => {
    try {
        await productsData.deleteMany({ sellerID: `${request.params.id}` }, (err, doc) => {
            if (err) { response.status(204).json({ err: err.message }) }
            // else { response.status(201).json(doc) }
        })
    }  catch (err) {
        // response.status(500).json({ message: err.message })
    }try{
        await productsData.updateMany({}, { $unset: { [request.params.id]: {} } }, (err, doc) => {
            if (err) {response.status(400).json({ message: err.message })}
            else{response.status(201).json(doc.nModified)}
        })
    }
    catch (err) {
        response.status(500).json({ message: err.message })
    }

})
module.exports = router