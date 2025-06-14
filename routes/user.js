import express from "express";
const router = express.Router();

import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import userController from "../controller/user.js";

router.route("/signup")
  .get(userController.renderRegister)
  .post(wrapAsync(userController.signup));

router.route("/login")
  .get(userController.login)
  .post(saveRedirectUrl, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash("error", "Invalid username or password");
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome back!");
        return res.redirect(res.locals.redirectUrl || "/listings");
      });
    })(req, res, next);
  });

// logout route
router.get("/logout", userController.logout);

export default router;
