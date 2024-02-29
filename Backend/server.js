const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const mysql = require('mysql');
const nodemailer = require('nodemailer');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/data', (req, res) => {
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "*****",
    database: "*****"
  });
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM todoList.toDo", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });
});

app.post('/data', (req, res) => {
  const request = req.body;
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "*****",
    database: "*****"
  });
  con.connect(function(err) {
    if (err) throw err;
    con.query(`INSERT INTO todoList.toDo (id, title, guid) VALUES (${request.id}, "${request.title}", "${request.guid}")`, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });
});

app.put('/data', (req, res) => {
  const request = req.body;
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "*****",
    database: "*****"
  });
  con.connect(function(err) {
    if (err) throw err;
    if (request.method === "Delete") {
      con.query(`DELETE FROM todoList.toDo WHERE id = ${request.id}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    } else if (request.method === "Email") {
      let msgText = "";
      request.data.map((item) => {
        msgText = msgText === "" ? item.title : msgText + ', ' + item.title
      });
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '*****',
          pass: '*****'
        }
      });
      
      var mailOptions = {
        from: '*****',
        to: '*****',
        subject: 'Pending Items',
        text: msgText
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }else {
      con.query(`UPDATE todoList.toDo SET title = "${request.title}" WHERE id = ${request.id}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    }
  });
});
 
app.listen(port, (req, res) => {
  console.log(`Server is running on port: ${port}`);
});