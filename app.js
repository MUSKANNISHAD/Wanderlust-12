import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}


import express from 'express';
const app=express();
import mongoose from 'mongoose';
import Listings from './models/listings.js';
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import WrapAsync from './utils/wrapAsync.js';
import review from './controller/reviews.js';
import Review from './models/review.js';
import session from 'express-session';
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from 'passport';
import LocalStrategy from "passport-local";
import passportMongoose from "passport-local-mongoose";
import User from './models/user.js';
// const port = process.env.PORT || 3000;
import { fileURLToPath } from "url";


import listingsRoutes from "./routes/listings.js";
import reviews from './routes/reviews.js';
import userRoutes from "./routes/user.js";


import { cloudinary } from "./cloudConfigure.js";

app.get("/test-cloudinary", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload("public/test.jpg", {
      folder: "Wanderlust_Dev",
    });
    console.log("✅ Upload Success:", result.secure_url);
    res.send(`Uploaded successfully: <a href="${result.secure_url}" target="_blank">${result.secure_url}</a>`);
  } catch (err) {
    console.error("❌ Cloudinary Error:", err.message);
    res.status(500).send("Cloudinary Error: " + err.message);
  }
});



// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
 const db_Url=process.env.ATLAS_KEY;

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

// async function main(){
//   await mongoose.connect(MONGO_URL);
// }


async function main() {
  await mongoose.connect(db_Url);
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
  mongoUrl:process.env.ATLAS_KEY,
  crypto:{
    secret:process.env.SECRET
  },
  touchafter:24*60*60,
})
store.on("error",()=>{
  console.log("error in session store",err);
})

 const sessionOption={
   store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.get("/", (req, res) => {
    res.send("Hii, I am root"); // 
});
 


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// app.get("/registerUser",async(req,res)=>{
//     let fakeUser=new User({
//         username:"muskankumarinishad",
//         email:"muskan@gmail.com",
//     });
//     let registerUser=await User.register(fakeUser,"muskannishad");
//     res.send(registerUser);
// })

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});




const isAuthenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be signed in first!");
  res.redirect("/login");
};

// then use it on routes:
app.use("/listings",  listingsRoutes);

// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
//     console.log(res.locals.success);
// })


app.use("/listings/:id/reviews",reviews);
app.use("/",userRoutes);

/*app.get("/ListingsSample", async (req, res) => {
    await Listings.insertMany(sampleListings);
    console.log("Sample listings were saved");
    res.send("Success");
  });
  */

  
 /* app.all("*", (req, res, next) => {
    console.log(`Unhandled route: ${req.originalUrl}`);
    next(new expressError(404, "page not found"));
  });
  
    app.use((err, req, res, next) => {
        let { statusCode = 500, message = "Something went wrong!" } = err;
        res.status(statusCode).send(message);
    });
    */



app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});
