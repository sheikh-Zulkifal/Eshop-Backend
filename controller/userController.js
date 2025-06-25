const express = require("express");
const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
 try {
     const { name, email, password } = req.body;
  const userEmail = await User.findOne({ email });
  if (userEmail) {
    const filename = req.file.filename;
    const filePath = `uploads/${filename}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error while deleting files" });
      } else {
        console.log("File Deleted Successfully");
      }
    });

    return next(new ErrorHandler("User already exists", 400));
  }
  const filename = req.file.filename;
  const fileUrl = path.join(filename);
  const user = {
    name,
    email,
    password,
    avatar: fileUrl,
  };
  
  const activationToken = createActivationToken(user);
  const activationUrl = `hhtp://localhost:4000/activatation/${activationToken }` ;

 } catch (error) {
    return next(new ErrorHandler(error.message, 500));
 }
});
// create activation Token

const activationToken = (user)=>{
    return jwt.sign(user, process.env.ACTIVATION_SECRET,{
        expiresIn: "5m"
    })

}
module.exports = router;
