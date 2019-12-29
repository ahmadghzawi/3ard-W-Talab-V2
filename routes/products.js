/**
 * description: this is a  micro service for products and services
 *  200 OK
 *  201 successfully create an object
    202 Accepted 
    204 No Content
    400 Bad Request
    404 Not Found
 */
const express = require("express"); // express js
const cors = require("cors");
const router = express.Router();
router.use(cors()); ///middleware for network
router.use(express.json()); // middleware as well but this will make all responses with json type !
const productsDB = require("../models/productsDatabase");

router.get("/categories", async (req, res) => {
  try {
    let categories = await productsDB.distinct("product_category");
    res.status(200).json(categories);
  } catch {
    response.status(500).json({ message: err.message });
  }
});

router.get("/getProductsByCategory/:category", async (req, res) => {
  try {
    let products = await productsDB.find({
      product_category: req.params.category
    });
    res.status(200).json(products);
  } catch {
    response.status(500).json({ message: err.message });
  }
});

/*<===========================this method to fetch all post data ===========================*/
router.get("/data", async (request, response) => {
  try {
    let data = await productsDB.find();
    response.status(200).json(data);
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});
/*<=========================== END.  fetch all   func.===========================>*/

/*<=====================this path will take the root path======================>*/
/*<===========================this method to search and sort categories all post  ===========================*/
router.get("/", async (request, response) => {
  var arr = [];
  if (Object.keys(request.query).length !== 0) {
    if (request.query.q != null) {
      arr = await searchFunc(request.query.q);
    }
    if (request.query.q === undefined) {
      arr = await categoriesFunc(request.query);
    }
  }
  arr = arr.length === 0 ? "no request data found" : arr;
  response.json(arr);
});
/*<=========================== START. sort in Category has been applied in following func.===========================>*/
/*  params:
        postCategories
        location
        name
        additionalInfo 
        BIG n * 4
*/
async function categoriesFunc(name) {
  let Data = await productsDB.find(name);
  return Data;
}
/*<=========================== END. sort in Category  func.===========================>*/
/*<=========================== START. search operation has been applied in following func.===========================>*/
/*  params:
        {q:''}
*/
async function searchFunc(target) {
  // console.log('target', target) // {postCategories: '' }  {location: ''}name additionalInfo etc.
  let arr = target ? [] : "no data found";
  let data = productsDB.find();
  await data
    .then(DATA => {
      if (target)
        DATA.map(post => {
          Object.values(post._doc).map(nested => {
            if (typeof nested === "string" && nested != null && target != null)
              if (nested.toLowerCase().includes(target.toLowerCase())) {
                // console.log(post._doc)
                arr.push(post._doc);
              }
          });
        });
    })
    .catch(err => {
      return { message: err.message };
    });
  return arr;
}
/*<=========================== END. Search  func.===========================>*/

/*<=========================== START.get products API has been applied in following func.===========================>*/

router.get("/getOffers", async (request, response) => {
  response.json(
    request.query.seller_id != null
      ? await sellerOffers(request.query.seller_id)
      : await buyerOffers(request.query.buyer)
  );
});

async function sellerOffers(seller_id) {
  let arr = [];
  if (seller_id != null) {
    let data = productsDB.find();
    await data
      .then(DATA => {
        DATA.map(post => {
          if (post._doc.seller_id === seller_id) {
            Object.keys(post._doc).map(key => {
              if (post._doc[key].price != null) {
                arr.push({
                  image_path: post._doc.image_path,
                  price: post._doc[key].price,
                  status: post._doc[key].status,
                  title: post._doc.title,
                  product_category: post._doc.product_category,
                  location: post._doc.location,
                  key,
                  buyer: key,
                  post_id: post._doc[key]._id,
                  info: post._doc.info
                });
              }
            });
          }
        });
        arr = arr.length === 0 ? [] : arr;
      })
      .catch(err => {
        return { message: err.message };
      });
  }
  return arr;
}
async function buyerOffers(buyer) {
  let arr = [];
  let data = productsDB.find();
  await data
    .then(DATA => {
      DATA.map(post => {
        if (post._doc[buyer] != null) {
          let newObj = post._doc[buyer];
          newObj["image_path"] = post._doc.image_path;
          newObj["_id"] = post._doc._id;
          newObj["title"] = post._doc.title;
          newObj["product_category"] = post._doc.product_category;
          newObj["location"] = post._doc.location;
          newObj["info"] = post._doc.info;
          arr.push(newObj);
        }
      });
      arr = arr.length === 0 ? [] : arr;
    })
    .catch(err => {
      return { message: err.message };
    });

  return arr;
}
/*<=========================== END.get products API   func.===========================>*/

/*<=========================== START.add new products API has been applied in following func.===========================>*/
router.post("/newProduct", async (request, response) => {
  // console.log(request.body)
  let {
    seller_id,
    product_category,
    location,
    title,
    info,
    image_path,
    bid
  } = request.body;
  if (
    seller_id != null &&
    product_category != null &&
    location != null &&
    title != null &&
    info != null &&
    image_path != null &&
    bid != null
  ) {
    try {
      await productsDB.create(request.body, (err, doc) => {
        if (err) {
          response.status(400).json({ message: err.message });
        } else response.status(201).json(doc);
      });
    } catch (err) {
      response.status(500).json(err);
    }
  }
});

/*<=========================== END. add new products  func.===========================>*/
/*<=========================== START.add new offer to particular post   func.===========================>*/
router.get("/postOffers", async (request, response) => {
  let { _id, buyer, offer } = request.query;
  let newObj = {
    bid: offer,
    [buyer]: { price: offer, date: Date(Date.now()), status: "pending" }
  };
  try {
    await productsDB.findByIdAndUpdate(_id, newObj, (err, doc) => {
      if (err) {
        response.status(400).json({ message: err.message });
      } else response.status(201).json(doc);
    });
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});
/*<=========================== END. add new products  func.===========================>*/
/*<=========================== START. DELETE a Post  func.===========================>*/
let IdsForDeleteArray = [];
router.delete("/deleteAtSpecificTime/:id", async (request, response) => {
  let ids = request.params.post_id;
  IdsForDeleteArray.push(ids);
  if (IdsForDeleteArray.length !== 0) {
    DeleteTimer;
  }
  response.json("it will be deleted at 12 AM");
});

const DeleteAtSpecificTime = async id => {
  let output = null;
  try {
    await productsDB.findByIdAndDelete(id, (err, doc) => {
      if (err) {
        output = { message: err.message };
      } else {
        output = { deletion: doc };
        IdsForDeleteArray.shift();
      }
    });
  } catch (error) {
    output = { message: error.message };
  }
  return output;
};

const DeleteTimer = setInterval(() => {
  var date = new Date();
  if (date.getHours() === 0 && date.getMinutes() === 0) {
    IdsForDeleteArray.forEach(async id => {
      await DeleteAtSpecificTime(id);
      console.log("deleted items", await DeleteAtSpecificTime());
    });
  }
}, 20000);

router.put("/acceptOffer/", async (request, response) => {
  await productsDB.findById(request.body.postId, async (err, doc) => {
    if (err) response.status(401).json(err);
    else {
      let post = doc._doc;
      let newObj = {};
      for (key in post) {
        if (typeof post[key] === "object" && key !== "_id") {
          if (key === request.body.offerMaker) {
            post[key].status = ["Accepted", request.body.contactNumber];
          } else {
            post[key].status = "Rejected";
          }
          newObj[key] = post[key];
        }
      }
      try {
        await productsDB.findByIdAndUpdate(
          request.body.postId,
          newObj,
          (err, doc) => {
            if (err) {
              response.status(400).json({ message: err.message });
            } else response.status(201).json(doc);
          }
        );
      } catch (err) {
        response.status(500).json({ message: err.message });
      }

      // response.json(newObj)
    }
  });
});

router.put("/deniedOffer/", async (request, response) => {
  // let { offerMaker, postId } = request.body
  let query = request.body.offerMaker + ".status";
  try {
    await productsDB.updateOne(
      { _id: request.body.postId },
      { $set: { [query]: "Rejected" } },
      (err, doc) => {
        if (err) {
          response.status(400).json({ message: err.message });
        } else response.json(doc);
      }
    );
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

router.put("/deleteOffer/", async (request, response) => {
  let { buyer, _id } = request.body;
  await productsDB.updateOne({ _id }, { $unset: [buyer] }, error => {
    if (error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(200).json("ok");
    }
  });

  // let data = await productsDB.findById(_id);
  // let deleteOffer = { [buyer]: data._doc[buyer] };
  // try {
  //   let data2 = await productsDB.update(
  //     { _id },
  //     { $unset: deleteOffer }
  //   );
  //   response.status(201).json(data2["ok"]);
  // } catch {
  //   response.status(500).json({ message: err.message });
  // }
});
/*<=========================== END. DELETE a Post  func.===========================>*/
router.get("/getUserProducts", async (request, response) => {
  try {
    let { seller_id } = request.query;
    let data = await productsDB.find({ seller_id });
    response.json(data);
  } catch {
    response.status(500).json({ err: err.message });
  }
});

router.delete("/deletePost/:id", async (request, response) => {
  try {
    await productsDB.findByIdAndDelete(request.params.id, (err, doc) => {
      if (err) {
        response.status(404).json(err);
      } else {
        response.status(200).json(doc);
      }
    });
  } catch {
    response.status(500).json(err);
  }
});
router.delete("/deleteUserproducts/:id", async (request, response) => {
  try {
    await productsDB.deleteMany(
      { sellerID: `${request.params.id}` },
      (err, doc) => {
        if (err) {
          response.status(204).json({ err: err.message });
        }
        // else { response.status(201).json(doc) }
      }
    );
  } catch (err) {
    // response.status(500).json({ message: err.message })
  }
  try {
    await productsDB.updateMany(
      {},
      { $unset: { [request.params.id]: {} } },
      (err, doc) => {
        if (err) {
          response.status(400).json({ message: err.message });
        } else {
          response.status(201).json(doc.nModified);
        }
      }
    );
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});
module.exports = router;
