const express = require("express");
const app = express();
const compression = require("compression");
const csurf = require("csurf");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
const tesseract = require("node-tesseract-ocr");
const fs = require("fs");

const nodemailer = require("nodemailer");

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

app.post("/login", (req, res) => {
    db.getPassword(req.body.email)
        .then(result => {
            compare(req.body.password, result[0].password)
                .then(match => {
                    console.log("match", match);
                    if (match) {
                        req.session.userId = result[0].id;
                        console.log("response from db on login", result[0].id);
                        res.json(req.session.userId);
                    } else {
                        console.log("password wrong");
                        res.json("Your password is wrong.");
                    }
                })
                .catch(err => {
                    console.log("error on login", err);
                });
        })
        .catch(err => {
            console.log("error on login", err);
            res.json("error on login");
        });
});

app.post("/scan", (req, res) => {
    // console.log("user_id", req.session.userId);
    // console.log("img", req.body.imageSrc);
    const imgBase64 = req.body.imageSrc;
    const imgFile = imgBase64.replace(/^data:image\/jpeg;base64,/, "");
    // console.log("stripped image data", imgFile);
    const imageBuffer = Buffer.from(imgFile, "base64");
    fs.writeFile(
        "uploads/img.jpeg",
        imageBuffer,
        { encoding: "base64" },
        err => {
            if (err) {
                console.log("error on saving file", err);
            }
            console.log("File saved");
            tesseract
                .recognize(__dirname + "/uploads/img.jpeg", config)
                .then(text => {
                    console.log("ocr result", text);

                    const re = /\S+@\S+\.\S+/;

                    const email = text.match(re);

                    email &&
                        email.forEach(function(email) {
                            console.log("extracted email:", email);
                            db.addEmail(req.session.userId, email)
                                .then(result => {
                                    console.log(
                                        "result from adding email to db",
                                        result
                                    );
                                    res.json(email);
                                })
                                .catch(err => {
                                    console.log(
                                        "err on adding email to db",
                                        err
                                    );
                                });
                        });
                })
                .catch(err => console.log("error on ocr", err));
        }
    );
});

app.post("/send", (req, res) => {
    let receiverEmail = req.body.email;

    async function main() {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,

            auth: {
                user: require("./secrets.json").mailUser,
                pass: require("./secrets.json").mailPwd
            }
        });

        let info = await transporter.sendMail({
            from: '"Hello Spiced!" <spicedsassafras@gmail.com>',
            to: receiverEmail,
            subject: "Hello from Business Card Scanner",
            text: "Hello! Your business card is received. Thank you!",
            html:
                "<b>Hello! Your business card is received. Thank you! Now we can be friends or spouses or just make business together. Awesome!</b></div>"
        });

        console.log("Message sent: %s", info.messageId);
        res.json("Message sent");
    }

    main().catch(console.error);
});

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

//server
app.listen(8080, function() {
    console.log("I'm listening.");
});
