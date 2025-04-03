// const { error } = require("console");
// const { createHmac, randomBytes } = require("crypto");
// const { createTokenForUser } = require("../services/authentication");
// const mongoose = require("mongoose"); // Importing mongoose to create a model for the user
// // Importing the crypto module to use for hashing passwords and generating salts
// const { Schema , model } = require("mongoose");

// const userSchema = new Schema({
//     fullName:{
//         type : String,
//         required : true,
//     },
//     email:{
//         type : String,
//         required : true,
//         unique : true,
//     },
//     salt : {    //using salt , we are going to hash our password .. using salt and pepper technique
//         type : String,
//     },
//     password:{
//         type : String,
//         required : true,
//     },
//     publicImageURL : {
//         type: String,
//         default : "/images/avatar.png",
//     },
//     role:{
//         type: String,
//         enum: ["USER" , "ADMIN"],  //enum is like that role can have only 2 values .. that is User and Admin .. and if there will be any other role other than User and Admin , then the mongoose will throw an error ..
//         default: "USER",
//     },
// })

// userSchema.pre("save", function(next) {
//     const user = this;

//     if(!user.isModified("password")) return;
//     const salt = randomBytes(16).toString("hex");
//     //salt is nothing , the random string used to secure the user's password , .. by concantenating in the user's password string 
//     //here the salt is of 16 bytes string .. basically salt saves the password frpom hacking ..
//     const hashedPassword = createHmac("sha256" , salt).update(user.password).digest("hex");
//     //sha256 is the algorithm of using hashing for password security ..
    
//     this.salt = salt;
//     this.password = hashedPassword;

//     next();
// })

// userSchema.static("matchPasswordAndGenerateToken" , async function(email , password){
//     const user = await this.findOne({ email });
//     if(!user) throw new Error("User Not Found");

//     const salt = user.salt;
//     const hashedPassword = user.password;

//     const userProvidedHash = createHmac("sha256" , salt).update(password).digest("hex");

//     if(userProvidedHash !== hashedPassword){
//         throw new Error("Incorrect Password");
//     }
//     const token = createTokenForUser(user);
//     return token;
// })

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// module.exports = User;

// const { createHmac, randomBytes } = require("crypto");
// const { createTokenForUser } = require("../services/authentication");
// const mongoose = require("mongoose"); // ✅ Fix: Import mongoose
// const { Schema, model } = mongoose; // ✅ Fix: Use mongoose.Schema and mongoose.model

// const userSchema = new Schema({
//     fullName: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     salt: {    // using salt, we are going to hash our password using the salt and pepper technique
//         type: String,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     publicImageURL: {
//         type: String,
//         default: "/images/avatar.png",
//     },
//     role: {
//         type: String,
//         enum: ["USER", "ADMIN"],  // enum ensures that role can have only 2 values: USER and ADMIN. Any other value will throw an error.
//         default: "USER",
//     },
// });

// userSchema.pre("save", function (next) {
//     const user = this;

//     if (!user.isModified("password")) return next();  // ✅ Fix: Add next() to prevent hanging
    
//     const salt = randomBytes(16).toString("hex");
//     // salt is a random string used to secure the user's password by concatenating it with the password string.
//     // here the salt is a 16-byte string, which helps protect the password from hacking.

//     const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");
//     // sha256 is the hashing algorithm used for password security.

//     user.salt = salt;  // ✅ Fix: Assign to user.salt instead of this.salt
//     user.password = hashedPassword;

//     next();
// });

// userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
//     const user = await this.findOne({ email });
//     if (!user) throw new Error("User Not Found");

//     const salt = user.salt;
//     const hashedPassword = user.password;

//     const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

//     if (userProvidedHash !== hashedPassword) {
//         throw new Error("Incorrect Password");
//     }
//     const token = createTokenForUser(user);
//     return token;
// });

// const User = mongoose.models.User || model("User", userSchema); // ✅ Fix: Ensure model is not redefined

// module.exports = User;


const mongoose = require("mongoose");  // ✅ Ensure mongoose is required
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

// Destructuring Schema and model from mongoose
const { Schema, model } = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true, // Full name is required
    },
    email: {
        type: String,
        required: true,  // Email is required
        unique: true,  // Email must be unique for each user
    },
    salt: {    
        // Using salt, we are going to hash our password using salt and pepper technique
        type: String,
    },
    password: {
        type: String,
        required: true,  // Password is required
    },
    publicImageURL: {
        type: String,
        default: "/images/avatar.png",  // Default avatar if user doesn't upload an image
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],  // The role can only have two values: USER or ADMIN
        default: "USER",  // Default role is USER
    },
});

// Middleware to hash the password before saving it to the database
userSchema.pre("save", function (next) {
    const user = this;

    // If the password is not modified, proceed to next middleware
    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex");  
    // Salt is a random string used to secure the user's password using the salt and pepper technique.
    // Here, the salt is a 16-byte random string. It helps in protecting the password from hacking.

    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");
    // SHA256 is the hashing algorithm used for password security.

    user.salt = salt;
    user.password = hashedPassword;  // Store the hashed password instead of plain text

    next();  // Move to the next middleware
});

// Static method to verify the password and generate a token for authentication
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User Not Found");  // If user does not exist, throw an error

    const userProvidedHash = createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");

    if (userProvidedHash !== user.password) {
        throw new Error("Incorrect Password");  // If password doesn't match, throw an error
    }

    const token = createTokenForUser(user);  // Generate a JWT token for the user
    return token;
});

// ✅ Ensure mongoose model is correctly registered
const User = mongoose.models.User || model("User", userSchema);

module.exports = User;  // Exporting User model for use in other parts of the application
