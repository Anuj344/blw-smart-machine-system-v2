const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
{
    machine_name:{
        type:String,
        required:true
    },

    machine_code:{
        type:String,
        default:""
    },

    department:{
        type:String,
        required:true
    },

    manufacturer:{
        type:String
    },

    year:{
        type:Number
    },

    operator:{
        type:String
    },

    location:{
        type:String
    },

    status: {
    type: String,
    enum: ["Working", "Maintenance", "Breakdown"],
    default: "Working"
},

    introduction:{
        type:String
    },

    working_principle:{
        type:String
    },

    applications:[
        String
    ],

    safety:[
        String
    ],

    maintenance:[
        String
    ],

    parts:[
        String
    ],

    image:{
        type:String
    },

    qrCode:{
        type:String
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Machine",machineSchema);