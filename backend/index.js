const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");


const mongodbUrl = 'mongodb://localhost:27017/DOCO';
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});


const app = express();
app.use(bodyParser.json());
const router = express.Router();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


const usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    category: { type: String, required: true }
});


const meetingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    meetId: { type: Number, required: true },
});

usersSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

const userModel = mongoose.model("Users", usersSchema);
const meetModel = mongoose.model("Meeting", meetingSchema);


router.get("/doco/adminDashboard", async (req, res) => {
    const users = await userModel.find();
    res.send(users);
});


router.get("/doco/profile", async (req, res) => {
    const user = await userModel.findOne({ _id: req.params.id });
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: "User Not Found." });
    }
});







app.listen(5000, () => { console.log('MongoDB Server started at http://localhost:5000'); });