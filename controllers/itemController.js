const itemModel = require('../models/itemModel');

//get items
const getItemController = async(req,res) =>{
    try {
        const items = await itemModel.find();
        res.status(200).send(items);
    } catch (error) {
        console.log(error);
    }
};

//add items
const addItemController = async (req, res) => {
    try {
        const newItem = new itemModel(req.body);
        await newItem.save();
        res.status(201).send("Item Created Successfully");
    } catch (error) {
        res.status(400).send(`Error: ${error.message}`);
        console.log(error);
    }
};

//update item
const editItemController = async(req,res) =>{
    try {
        await itemModel.findOneAndUpdate({_id: req.body.itemId}, req.body);
        res.status(201).send("Item Updated!");
    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }
};

//delete item
const deleteItemController = async(req,res) =>{
    try {
        await itemModel.findOneAndDelete({_id: req.body.itemId});
        res.status(200).send("Item Deleted!");
    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }
};

module.exports = {getItemController, addItemController, editItemController, deleteItemController};  //export the function to be used in routes.js file