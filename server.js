require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.options("*", cors());

app.use((request, response, next) => {
  response.header(`Access-Control-Allow-Origin`, `*`);
  response.header(
    `Access-Control-Allow-Headers`,
    `Origin, X-Requested-with, Content-Type, Accept`
  );
  next();
});

app.use(express.json());

app.get("/", (req, res) => res.json("test working"));


const userRouter = require("./routes/users");
const postRouter = require("./routes/products");

app.use(process.env.USER_ROUTE_URL, userRouter);
app.use(process.env.POST_ROUTE_URL, postRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dashboard/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dashboard", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
