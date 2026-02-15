var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var artiklarRouter = require("./routes/artiklar");

var app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var mongoose = require("mongoose");

// Hämta URI från miljövariabel, fallback till din lokala dev om den inte finns
const mongoURI = process.env.MONGO_URI || "mongodb+srv://Michelle:Tazman2001@cluster0.ywzsmjh.mongodb.net/Artiklar?appName=Cluster0";

mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function (callback) {
	console.log("Kopplingen lyckades!");
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/artiklar", artiklarRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
