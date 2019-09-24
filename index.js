const express = require("express");
const app = express();
const compression = require("compression");
const csurf = require("csurf");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
const tesseract = require("node-tesseract-ocr");

const config = {
    lang: "eng",
    oem: 1,
    psm: 3
};

//file upload boiler plate
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152 //ca. 2 MB
    }
});
//end of upload boiler plate

//compress
app.use(compression());

//get req.body
app.use(express.json());

//connect public
app.use(express.static("./public"));

//cookies
app.use(
    require("cookie-session")({
        maxAge: 1000 * 60 * 60 * 24 * 385.25 * 1000,
        secret:
            process.env.NODE_ENV == "production"
                ? process.env.SESS_SECRET
                : require("./secrets.json").sessionSecret
    })
);

//security
app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//production or development
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//routes
app.get("/", (req, res) => {
    res.redirect("/welcome");
});

app.post("/register", (req, res) => {
    console.log("request from post register: ", req.body);

    hash(req.body.password)
        .then(hash => {
            db.addUser(req.body.first, req.body.last, req.body.email, hash)
                .then(result => {
                    console.log(
                        "result from adding user to db: ",
                        result.rows[0]
                    );
                    req.session.userId = result.rows[0].id;
                    res.json(result.rows[0]);
                })
                .catch(err => {
                    console.log("error on adding user to db: ", err);
                    res.json(err);
                });
        })
        .catch(err => {
            console.log("error on hashing: ", err);
            res.json(err);
        });
});

app.post("/scan", uploader.single("file"), (req, res) => {
    console.log("img", req.file);
    console.log("user_id", req.session.userId);
    tesseract
        .recognize(__dirname + "/test.png", config)
        .then(text => {
            console.log("ocr result", text);

            const re = /\S+@\S+\.\S+/;

            text.match(re).forEach(function(email) {
                console.log("extracted email:", email);
                db.addEmail(req.session.userId, email)
                    .then(result => {
                        console.log("result from adding email to db", result);
                    })
                    .catch(err => {
                        console.log("err on adding email to db", err);
                    });
            });
        })
        .catch(err => console.log("error on ocr", err));
});

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

//server
app.listen(8080, function() {
    console.log("I'm listening.");
});
