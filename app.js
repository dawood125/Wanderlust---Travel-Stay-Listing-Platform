const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session=require("express-session");
const flash=require("connect-flash");

const listings=require("./routes/listing");
const reviews=require("./routes/review");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);


const sessionOpitons={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized :true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};

app.use(session(sessionOpitons));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

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
