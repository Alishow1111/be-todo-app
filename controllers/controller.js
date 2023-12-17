const {fetchUsers, insertUser, selectUser} = require("../models/model.js");

exports.getUsers = (req,res,next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users});
    })
    .catch((err) => {
        //next(err);
        return err;
    })
}

exports.registerUser = (req,res,next) => {
    const user = req.body;

    insertUser(user).then(() => {
        res.status(201).send({msg:'User Created'});
    })
    .catch((err) => {
        if (err.code === '23505'){
            res.status(400).send({msg: 'Username already exists'})
        }
        else{
            res.status(400).send({msg: 'Invalid body in request'})

        }
    })
}

exports.loginUser = (req,res,next) => {
    const user = req.body;

    selectUser(user).then((user) => {
        res.status(200).send({msg: 'Login successful'})
    })
    .catch((err) => {
        if (err.code === 'Invalid password'){
            res.status(401).send({msg: err.code})
        }
        else if (err.code === 'User doesnt exist'){
            res.status(404).send({msg: err.code})
        }
        else{
            res.status(500).send({msg: 'Error Logging in'})
        }
    })
    
    
}