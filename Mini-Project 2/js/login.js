const mysql = require("mysql");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(__dirname + "/public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

const connection = mysql.createConnection({
  multipleStatements: true,  
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "nodejs",
});

// connect to the database
connection.connect(function (error) {
  if (error) throw error;
  else console.log("connected to the database successfully!");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("login");
});

app.get("/dashboard", function (req, res) {
  res.render("dashboard");
});

app.get("/faculty", function (req, res) {
  var query = `select firstname, lastname, author_id from author`;
  connection.query(query, (err, names) => {
    if(err){
        throw err;
    }
    else{
        res.render("faculty", {
            authors : names
        });
    }
  })
});

app.get("/domains", function (req, res) {
  res.render("domains");
});

app.get("/publications/:id", function (req, res) {
  var query = `select * from conference_paper where author_id = "${req.params.id}"; select * from book_chapter where author_id = "${req.params.id}"; select * from journal where author_id = "${req.params.id}"`;
  connection.query(query, [1, 2, 3], (err, data) => {
    if (err) {
      throw err;
    } else {
      console.log(data[0]);
      res.render("publications", {
        conferencePaper : data[0],
        bookChapters : data[1],
        journals : data[2]
      });
    }
  });7
});

app.post("/", function (req, res) {
  console.log(req.body);
  var uname = req.body.username;
  var pass = req.body.password;
  console.log(uname);
  console.log(pass);
  var query = `select * from loginuser where user_name = "${uname}" && user_password = "${pass}"`;
  connection.query(query, function (error, data) {
    try {
      if (data.length > 0) {
        res.render("dashboard");
      } else {
        res.render("login");
      }
    } catch (error) {
      res.status(500);
    }
  });
});

app.listen(3000, () => {
  console.log("server running on port : 3000");
});
