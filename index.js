const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require("./middlewares/authentication");
const app = express();
const PORT = 8001;

app.set("view engine",  "ejs");
app.set("views" , path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

mongoose.connect('mongodb://localhost:27017/blogify').then((e) => console.log("mongodb connected"));


app.get("/" , (req,res) => {
    res.render("home" , {
        user : req.user,
    });
})

app.use("/user" , userRoute);
app.use("/blog" , blogRoute);
app.listen(PORT , () => console.log(`Server started at PORT : ${PORT}`));