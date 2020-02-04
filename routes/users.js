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
router.use(express.json());
const usersDB = require("./../models/UsersDatabase");

router.post("/dashboardLogin", (request, res) => {
  const { username, password } = request.body;
  usersDB.findOne({ username, password }, { password: 0 }, (error, doc) => {
    if (error) res.status(500).json({ message: error.message });
    else res.status(200).json(doc);
  });
});

router.post("/dashboardAdd", (request, res) => {
  const { username, password, role } = request.body;
  usersDB.findOne({ username }, (error, doc) => {
    if (error) res.status(500).json({ message: error.message });
    else {
      if (!doc) {
        usersDB.create({ username, password, role }, (error, doc) => {
          if (error) res.status(500).json({ message: error.message });
          else res.status(200).json(doc);
        });
      } else res.status(200).json("user already exists");
    }
  });
});

router.post("/editAdmin", (request, res) => {
  const { _id, username, password, role } = request.body;
  usersDB.updateOne({ _id }, { $set: { username, password, role } }, error => {
    if (error) res.status(500).json({ message: error.message });
    else res.status(200).json("ok");
  });
});

router.put(
  "/editProfile/:user_id/:name/:email/:phone_number",
  (request, res) => {
    const { user_id, name, email, phone_number } = request.params;
    usersDB.updateOne(
      { _id: user_id },
      { $set: { name, email, phone_number } },
      error => {
        if (error) res.status(500).json({ message: error.message });
        else res.status(200).json("ok");
      }
    );
  }
);

router.get("/data", async (request, response) => {
  usersDB.find({}, (error, docs) => {
    if (error) response.status(500).json({ message: error.message });
    else response.status(200).json(docs);
  });
});

router.get("/data/:_id", (request, response) => {
  const { _id } = request.params;
  usersDB.findOne({ _id }, (err, res) => {
    if (err) response.status(404).json({ message: error.message });
    else response.json(res);
  });
});

router.post("/new", (request, response) => {
  const { name, email, password, phone_number } = request.body;
  usersDB.findOne({ email }, (error, doc) => {
    if (error) {
      response.status(404).json({ message: error.message });
    } else {
      if (!doc) {
        usersDB.create(
          { name, email, password, phone_number },
          (error, doc) => {
            if (error) response.status(500).json({ message: error.message });
            else response.status(200).json(doc);
          }
        );
      } else response.status(200).json("user already exists");
    }
  });
});

router.get("/auth", (request, response) => {
  const { email, password } = request.params;
  usersDB.findOne({ email, password }, { password: 0 }, (error, doc) => {
    if (error) response.status(404).json({ message: error.message });
    else if (doc == null) response.status(404).json({ message: error.message });
    else response.status(200).json(doc);
  });
});

router.delete("/delete/:id", (request, response) => {
  const _id = request.params.id;
  usersDB.deleteOne({ _id }, err => {
    if (err) response.status(400).json({ message: error.message });
    else response.status(202).json("ok");
  });
});

module.exports = router;
