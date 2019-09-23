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

    hash(req.body.password).then(hash => {
        db.addUser(req.body.first, req.body.last, req.body.email, hash)
            .then(result => {
                console.log("result from adding user to db: ", result.rows[0]);
                res.json(result.rows[0]);
            })
            .catch(err => console.log("error on adding user to db: ", err));
    });
});

app.get("/scan", (req, res) => {
    // console.log("user_id", req.session);
    tesseract
        .recognize(__dirname + "/test.png", config)
        .then(text => {
            console.log("ocr result", text);

            const re = /\S+@\S+\.\S+/;

            text.match(re).forEach(function(email) {
                console.log("extracted email:", email);
                db.addEmail(email, user_id);
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
