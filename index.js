const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const mailId = process.env.Emaild;
const password = process.env.EmailPwd
const dbUrl = process.env.MONGO_URI
console.log(dbUrl)


app.listen(3000, async () => {
    console.log("Server running on port 3000");
    try {
        await mongoose.connect("mongodb+srv://gokulnath:Gnathsrdb%4001@cluster0.p4oqg.mongodb.net/portFolioDatas");
        console.log("Connected to MongoDB");
    } catch (e) { 
        console.error("MongoDB Connection Error:", e);
    } 
});

console.log(mailId,password)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: mailId,
        pass: password
    },
    tls: {
        rejectUnauthorized: false
    }
});

const clientSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    text: String,
});

const Client = mongoose.model("client", clientSchema);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/submit", async (req, res) => {
    const { clientName, clientEmail, clientSubject, clientText } = req.body;
    console.log(clientName, clientEmail, clientSubject, clientText);

    try {
        const newClient = new Client({
            name: clientName,
            email: clientEmail,
            subject: clientSubject,
            text: clientText,
        });

        await newClient.save();

        const mailOptions = {
            from: mailId, 
            to: mailId, 
            subject: `New Message from ${clientName}: ${clientSubject}`,
            text: `You received a new message:\n\nFrom: ${clientName} (${clientEmail})\n\nSubject: ${clientSubject}\n\nMessage: ${clientText}`,
        };
        console.log("Mail Options:", mailOptions);
        transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Email not sent", error: error.message });
            } else {
                console.log("Email sent:", response.response);
                return res.status(200).json({ message: "Form submitted and email sent successfully" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = app;
