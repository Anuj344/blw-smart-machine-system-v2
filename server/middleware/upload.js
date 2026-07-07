const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, path.join(__dirname, "../uploads"));

    },

    filename: function (req, file, cb) {

        const uniqueName =

            Date.now() +

            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

const fileFilter = (req, file, cb) => {

    if (

        file.mimetype === "image/png" ||

        file.mimetype === "image/jpeg" ||

        file.mimetype === "image/jpg"

    ) {

        cb(null, true);

    }

    else {

        cb(new Error("Only Images Allowed"), false);

    }

};

const upload = multer({

    storage,

    fileFilter

});

module.exports = upload;