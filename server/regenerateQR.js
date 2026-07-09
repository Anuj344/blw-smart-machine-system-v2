require("dotenv").config();

const mongoose = require("mongoose");
const QRCode = require("qrcode");

const Machine = require("./models/Machine");

async function regenerateQR() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");

        // Current Frontend URL
        const FRONTEND_URL = "http://10.249.218.161:5500";

        const machines = await Machine.find();

        for (const machine of machines) {

            const qrURL =
                `${FRONTEND_URL}/machine.html?id=${machine._id}`;

            const qrImage = await QRCode.toDataURL(qrURL, {

                errorCorrectionLevel: "H",

                margin: 2,

                width: 300

            });

            machine.qrCode = qrImage;

            await machine.save();

            console.log(`✅ Updated: ${machine.machine_name}`);

        }

        console.log("\n🎉 All QR Codes Updated Successfully");

        process.exit();

    }

    catch (err) {

        console.error(err);

        process.exit(1);

    }

}

regenerateQR();