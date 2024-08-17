const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    customerName:{
        type:String,
        required: true
    },
    customerNumber:{
        type:Number,
        required: true
    },
    totalAmount:{
        type:String,
        required: true
    },
    subTotal:{
        type:String,
        required: true
    },
    discount:{
        type: String,
        required: true
    },
    paymentMode:{
        type: String,
        required: true
    },
    cartItems:{
        type: Array,
        required: true
    },
    date:{
        type: String,
        required: true,
    }
}, {timestamp: true});

const Bills = mongoose.model("Bills", billSchema);

module.exports = Bills;