const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(express.static(`public`));

const PORT = 4000;

app.get("/", (req, res) => {
  res.status(200).send("welcome to our API");
});

const {
  userRouter,
  userDetailRouter,
  contentRouter,
  contentDetailRouter,
} = require("./router");
app.use("/users", userRouter);
app.use("/user-profile", userDetailRouter);
app.use("/content", contentRouter);
app.use("/comment", contentDetailRouter);

app.listen(PORT, () => console.log("Api running on port " + PORT));
