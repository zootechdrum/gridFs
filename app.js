const express = require("express");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");

const Person = require("./model/user");

const app = express();

// app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Mongo URI
const mongoURI = "mongodb://localhost/imageInfo";

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

app.get("/", async (req, res) => {
  const conn = mongoose.connect(
    process.env.MONGODB_URIS || "mongodb://localhost/imageInfo"
  );
  const l = await Person.find().then(data => res.render("index", { files: data[0].image }))


});

app.post("/upload",upload.single('file'), (req, res) => {
  const conn = mongoose.connect(
    process.env.MONGODB_URIS || "mongodb://localhost/imageInfo"
  );
  // const Book = conn.model('Book');
  const {filename} = req.file || ""

  Person.create({ name: "cesar", image: filename})
    .then((resp) => {
      console.log("saved");
      res.redirect("/");
    })
    .catch((e) => {
      console.error(e);
    });
});

// app.get("/files", (req, res) => {
//   Image.find().then((image) => {
//     console.log(image);
//     res.status(200).json({
//       success: true,
//       image,
//     });
//   });
// });

// app.get("/files/:filename", (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     if (!file || file.length === 0) {
//       return res.status(404).json({ err: "no files exist" });
//     }
//     res.json(file);
//   });
// });

//Get Image and Filename

// app.get("/image/:filename", (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     if (!file || file.length === 0) {
//       return res.status(404).json({ err: "no files exist" });
//     }
//     //Check if image

//     if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
//       //Read output to browser

//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.status(404).json({
//         err: "not an image",
//       });
//     }
//   });
// });
const port = 3000;

app.listen(port, () => {
  console.log("server is running");
});
