const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const userRouter = require("./routes/user");
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter)
app.use("/api/post", postRouter)

app.listen(4000, () => console.log("Running on port 4000"));
