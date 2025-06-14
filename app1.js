// ESM-compatible version of your app.js

import express from "express";
import mongoose from "mongoose";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { config } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  config();
}
import dotenv from "dotenv";
dotenv.config();


import  Listings  from "./models/listings.js";
import  Reviews  from "./models/review.js";
import User from "./models/user.js";

import listingsRoutes from "./routes/listings.js";
import reviewRoutes from "./routes/reviews.js";
import userRoutes from "./routes/user.js";
import WrapAsync from "./utils/wrapAsync.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port =  3000;
 const db_Url=process.env.MONGO_API;

mongoose.set("strictQuery", true);

main()
.then(() =>
 console.log("connected to DB"))
.catch(err => console.log(err));




async function main() {
  await mongoose.connect(db_Url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

const isAuthenticate = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be signed in first!");
  res.redirect("/login");
};

app.get("/", (req, res) => {
  res.redirect("/listings");
});


app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Add error handling middleware and fallback route if needed

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
