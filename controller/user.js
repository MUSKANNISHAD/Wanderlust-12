import User from "../models/user.js";

export const renderRegister = (req, res) => {
    res.render("./user/signup.ejs");
};

export const signup = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to the site!");
            res.redirect("/listings");
        });
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

export const login = (req, res) => {
    res.render("./user/login.ejs");
};

export const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/listings");
    });
};

export default {renderRegister,login,signup,logout};