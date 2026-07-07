const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================

const register = async (req, res) => {

    try {

        const { username, password } = req.body;

        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {

            return res.status(400).json({
                message: "Admin already exists"
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({

            username,

            password: hashedPassword

        });

        res.status(201).json({

            success: true,

            message: "Admin Registered Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ================= LOGIN =================

const login = async (req, res) => {

    try {

        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });

        if (!admin) {

            return res.status(400).json({

                message: "Invalid Username"

            });

        }

        const match = await bcrypt.compare(password, admin.password);

        if (!match) {

            return res.status(400).json({

                message: "Invalid Password"

            });

        }

        const token = jwt.sign(

            {

                id: admin._id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1d"

            }

        );

        res.status(200).json({

            success: true,

            token

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    register,

    login

};