const { error } = require("console");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");
const { Schema , model } = require("mongoose");

const userSchema = new Schema({
    fullName:{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    salt : {    //using salt , we are going to hash our password .. using salt and pepper technique
        type : String,
    },
    password:{
        type : String,
        required : true,
    },
    publicImageURL : {
        type: String,
        default : "/images/avatar.png",
    },
    role:{
        type: String,
        enum: ["USER" , "ADMIN"],  //enum is like that role can have only 2 values .. that is User and Admin .. and if there will be any other role other than User and Admin , then the mongoose will throw an error ..
        default: "USER",
    },
})

userSchema.pre("save", function(next) {
    const user = this;

    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    //salt is nothing , the random string used to secure the user's password , .. by concantenating in the user's password string 
    //here the salt is of 16 bytes string .. basically salt saves the password frpom hacking ..
    const hashedPassword = createHmac("sha256" , salt).update(user.password).digest("hex");
    //sha256 is the algorithm of using hashing for password security ..
    
    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static("matchPasswordAndGenerateToken" , async function(email , password){
    const user = await this.findOne({ email });
    if(!user) throw new Error("User Not Found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256" , salt).update(password).digest("hex");

    if(userProvidedHash !== hashedPassword){
        throw new Error("Incorrect Password");
    }
    const token = createTokenForUser(user);
    return token;
})

const User = model("user" , userSchema);
module.exports = User;