const bcrypt = require('bcryptjs');
import User from "./Models/user"
const jwt = require("jsonwebtoken");
const express = require("express")
const mongoose = require("mongoose");

require('dotenv').config()

const app = express();
app.use(express.json())
const port = 3000;

let secretToken = "";

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to database");
    })
    .catch((error: any) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });

app.post('/signup', async (req: any, res: any) => {

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let user = new User({
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    })

    //check if email id already exists
    const existEmail = await User.findOne({ email: req.body.email })
    if (existEmail) {
        res.send("Email already exists")
    }
    else {
        const saveData = await user.save();
        res.send("Data saved")
    }


})


app.get('/login', async (req: any, res: any) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("User-id or password incorrect")

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("password incorrect");
    try {
        //creating token  
        let data = {
            _id: user._id,
            role: user.role
        }
        const token = jwt.sign(data, process.env.TOKEN_SECRET, {
            expiresIn: '100s'
        })
        secretToken = token;

        res.status(200).header("auth-token", token)
        res.send("login sucessful")
    }
    catch {

    }

})

app.get('/auth', async (req: any, res: any) => {
    const token = req.header("auth-token")
    try {
        const verify = jwt.verify(token, process.env.TOKEN_SECRET)
        console.log(verify)
        if (!verify) return res.status(400).send("Invalid token1")

        res.status(200).send(verify.role)
        // res.send("verification sucessful")

    } catch {
        res.status(400).send("Invalid token");
    }

})


app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})