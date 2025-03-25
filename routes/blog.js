// const { Router } = require("express");
// const multer = require("multer");
// const path = require("path");
// const router = Router();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.resolve(`/public/uploads/`));
//     },
//     filename: function (req, file, cb) {
//       const filename = `${Date.now()} - ${file.originalname}`
//       cb(null , filename);
//     }
//   })

// const upload = multer({ storage: storage });

// router.get("/add-new", (req, res) => {
//     return res.render("addblog", {
//         user: req.user,
//     });
// });

// router.post("/", upload.single("coverImage") , (req, res) => {
//     console.log(req.body);
//     console.log(req.file);
//     return res.redirect("/");
// });

// module.exports = router;

const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");  //fs is the file scheduling
const router = Router();

// Correct path resolution
const uploadsDir = path.resolve(__dirname, '..', 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()} - ${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addblog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  return res.redirect("/");
});

module.exports = router;