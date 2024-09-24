const express = require("express");

const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3500;


app.use(logger);
// custom middleware logger
const whiteList = ["https://www.odafe.com", "http://127://.0.0.1:5500", "https://localhost:3500"];
const corsOption = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
}

// Cross Origin Resource Sharing
app.use(cors(corsOption));

// Middleware
// Three types : built-in, custom and third-party(ies)

// builtin used to hanle urlencoded data
// In other words, form data:
// "content-type: application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: false }));


// built-in middleware for json
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "/public")));



app.get("^/$|index(.html)?", (req, res) => {
    // res.sendFile("./views/index.html", { root: __dirname });
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"));
});
app.get("/old-page(.html)?", (req, res) => {
    res.redirect(301, "/new-page.html");
});

// Route Handlers
app.get("./hello(.html)?", (req, res, next) => {
    console.log("Attempted to load hello.html");
    next();
}, (req, res) => {
    res.send("Finished!")
})

const one = (req, res, next) => {
    console.log("one")
    next();
}
const two = (req, res, next) => {
    console.log("two")
    next();
}
const three = (req, res, next) => {
    console.log("three")
    res.send("Dinished!");
}

app.get("./chain(.html)?", [one, two, three])

app.all("*", (req, res) => {
    res.status(404)
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else if (req.accepts("json")) {
        res.json({error: "404 Not Found"})
    } else {
        res.type('txt').send("404 Not Found")
    }
})


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});


