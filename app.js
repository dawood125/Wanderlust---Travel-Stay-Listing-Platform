const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");


const listings=require("./routes/listing");
const reviews=require("./routes/review");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("Connection with database is successful.");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


app.get("/", (req, res) => {
  res.send("The root is working.");
});

app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);


app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(status).send(message);
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(port, () => {
  console.log(`The app is listening on ${port}`);
});
