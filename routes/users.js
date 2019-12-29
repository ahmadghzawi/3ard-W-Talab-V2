/**
 * description: this is a  micro service for users and services
 *  200 OK
 *  201 successfully create an object
    202 Accepted
    204 No Content
    400 Bad Request
    404 Not Found
 */
const express = require("express");
const router = express.Router();
const usersDB = require("./../models/UsersDatabase");
router.use(express.json());

router.put("/editProfile", (req, res) => {
  let { user_id, name, email, phone_number } = req.body;
  try {
    const user = usersDB.findByIdAndUpdate(
      { _id: user_id },
      { name, email, phone_number } 
    );
    res.status(200).json(req.body);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*<=========================== START.fetch all users  func.===========================>*/
router.get("/data", async (request, response) => {
  try {
    const users = await usersDB.find();
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

/*<=========================== fetch  user by id  ===========================>*/
router.get("/data/:id", async (request, response) => {
  try {
    const users = await usersDB.findById(request.params.id, (err, res) => {
      if (err) {
        response.status(404).json({ message: error.message });
      } else {
        response.json(res);
      }
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

/*<=========================== End.fetch all users  func.===========================>*/
/*<=========================== START.create new user  func.===========================>*/
async function verifyToCreateAccount(email) {
  const users = await usersDB.find();
  let verified = true;
  users.forEach(item => {
    if (item.email === email) {
      verified = false;
    }
  });
  return verified;
}

router.post("/new", async (request, response) => {
  const { name, email, password, phone_number } = request.body;

  if (await verifyToCreateAccount(email)) {
    const user = new usersDB({
      name,
      email,
      password,
      phone_number
    });

    try {
      const newUser = await user.save();
      response.status(201).json(newUser);
    } catch (error) {
      response.status(204).json({ message: error.message });
    }
  } else {
    response.status(400).json({
      message: "please use forget my password",
      rejection: "email already exists"
    });
  }
});
/*<=========================== End.create new user  func.===========================>*/

/*<=========================== Start .verify an existence user  func.===========================>*/
async function verifyAccount(user) {
  const users = await usersDB.find({});
  let p = new Promise((resolve, reject) => {
    users.forEach(({ _id, name, email, password, phone_number }) => {
      if (email === user.email && password === user.password) {
        resolve({ _id, name, phone_number, email });
      }
    });
    reject("no user found");
  });
  return p;
}
router.get("/auth", async (request, response) => {
  await verifyAccount(request.query)
    .then(user => response.status(202).json(user))
    .catch(error => response.status(400).json({ message: error }));
});
/*<=========================== End .verify an existence user  func.===========================>*/

/*<=========================== Start .delete an existence user  func.===========================>*/
router.delete("/delete/:id", async (request, response) => {
  try {
    await usersDB.findByIdAndDelete(request.params.id, (err, doc) => {
      if (err) {
        response.status(400).json({ message: err.message });
      } else {
        response.status(202).json({ deletion: doc });
      }
    });
  } catch (error) {
    response.status(500).json({ message: error.error });
  }
});
/*<=========================== Start .delete an existence user  func.===========================>*/

module.exports = router;
