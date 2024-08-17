const userModel = require('../models/userModel');

//login user
const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({ username, password, verified: true });
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error);
    }
};


//register
const registerController = async (req, res) => {
    try {
        const newUser = new userModel({...req.body, verified:true});
        await newUser.save();
        res.status(201).send("New user added Successfully");
    } catch (error) {
        res.status(400).send(`Error: ${error.message}`);
        console.log(error);
    }
};


module.exports = {loginController, registerController};  //export the function to be used in routes.js file