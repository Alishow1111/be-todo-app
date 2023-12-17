const express = require("express");
const cors = require('cors');
const app = express();
const {getUsers, registerUser, loginUser} = require("./controllers/controller.js");

app.use(cors());
app.use(express.json());

app.get("/api/users", getUsers)
app.post("/api/register", registerUser);
app.post("/api/login", loginUser)

app.all("*", (req,res) => {
    return res.status(404).send({msg:"Not Found!"});
})

module.exports = app;