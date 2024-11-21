const express = require("express");
const cors = require("cors");
//INSTALL NODEMAILER
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
//Connecting to mongodb
mongoose
  .connect("mongodb+srv://sweatha:123@cluster0.iv45s.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
  .then(function () {
    console.log("Connected to DB");
  })
  .catch(function () {
    console.log("Failed to connect");
  });
//creating an model
const credential = mongoose.model(
  "credential",
  {
    /*schema name here (passkey) need not to be mention as of we just going to insert the value from the db*/
  },
  "bulkmail"
) /*collection name-bulkmail*/

//nodemailer

app.post("/sendemail", function (req, res) {
  var message = req.body.msg;
  var emailList = req.body.emailList;
  console.log(message);

  credential
  .find()
  .then(function (data) {
    console.log(data[0].toJSON());

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
      tls: {
        rejectUnauthorized: false, // Disable certificate validation
      },
    });

    new Promise(async function (resolve, reject) {
      try {
        for (var i = 0; i < emailList.length; i++) {
          await transporter.sendMail({
            from: "sweathams27@gmail.com",
            to: emailList[i],
            subject: "A message from Bulkmail app",
            text: message,
          });
          console.log("Email sent to:" + emailList[i]);
        }
        resolve("success");
      } catch (error) {
        reject("failed");
      }
    })
      .then(function () {
        res.send(true);
      })
      .catch(function () {
        res.send(false);
      });
  })
  .catch(function (error) {
    console.log(error);
  })
})

 

app.listen(5000, function(){
  console.log("server starts")
})
