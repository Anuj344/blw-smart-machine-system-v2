const QRCode = require("qrcode");
const Machine = require("../models/Machine");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
// =========================
// ADD MACHINE
// =========================

const addMachine = async (req, res) => {

    try {

        // Base URL
        const baseURL =
            process.env.BASE_URL ||
            "http://192.168.1.22:5000";

        // Image Upload
        if (req.file) {

            req.body.image =
                `${baseURL}/uploads/${req.file.filename}`;

        }

        // Convert comma separated values into arrays

        if (req.body.applications) {

            req.body.applications = req.body.applications
                .split(",")
                .map(item => item.trim())
                .filter(item => item !== "");

        }

        if (req.body.safety) {

            req.body.safety = req.body.safety
                .split(",")
                .map(item => item.trim())
                .filter(item => item !== "");

        }

        if (req.body.maintenance) {

            req.body.maintenance = req.body.maintenance
                .split(",")
                .map(item => item.trim())
                .filter(item => item !== "");

        }

        if (req.body.parts) {

            req.body.parts = req.body.parts
                .split(",")
                .map(item => item.trim())
                .filter(item => item !== "");

        }

        // Create Machine

        const machine = await Machine.create(req.body);

        // Generate QR

        const qrURL =
            `${baseURL}/machine.html?id=${machine._id}`;

        const qrImage = await QRCode.toDataURL(

            qrURL,

            {

                errorCorrectionLevel: "H",

                margin: 2,

                width: 300

            }

        );

        machine.qrCode = qrImage;

        await machine.save();

        res.status(201).json({

            success: true,

            message: "Machine Added Successfully",

            machine

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =========================
// GET ALL MACHINES
// =========================

const getMachines = async (req, res) => {

    try {

        const machines = await Machine.find().sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            count: machines.length,

            machines

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =========================
// GET MACHINE BY ID
// =========================

const getMachineById = async (req, res) => {

    try {

        const machine = await Machine.findById(req.params.id);

        if (!machine) {

            return res.status(404).json({

                success: false,

                message: "Machine Not Found"

            });

        }

        res.status(200).json({

            success: true,

            machine

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =========================
// UPDATE MACHINE
// =========================

const updateMachine = async (req, res) => {

    try {

        const baseURL =
            process.env.BASE_URL ||
            "http://192.168.1.22:5000";

        // Update Image

        if (req.file) {

            req.body.image =
                `${baseURL}/uploads/${req.file.filename}`;

        }

        // Convert Arrays

        if (req.body.applications) {

            req.body.applications = req.body.applications

                .split(",")

                .map(item => item.trim())

                .filter(item => item !== "");

        }

        if (req.body.safety) {

            req.body.safety = req.body.safety

                .split(",")

                .map(item => item.trim())

                .filter(item => item !== "");

        }

        if (req.body.maintenance) {

            req.body.maintenance = req.body.maintenance

                .split(",")

                .map(item => item.trim())

                .filter(item => item !== "");

        }

        if (req.body.parts) {

            req.body.parts = req.body.parts

                .split(",")

                .map(item => item.trim())

                .filter(item => item !== "");

        }

        const machine = await Machine.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!machine) {

            return res.status(404).json({

                success: false,

                message: "Machine Not Found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Machine Updated Successfully",

            machine

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =========================
// DELETE MACHINE
// =========================

const deleteMachine = async (req, res) => {

    try {

        const machine = await Machine.findByIdAndDelete(req.params.id);

        if (!machine) {

            return res.status(404).json({

                success: false,

                message: "Machine Not Found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Machine Deleted Successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =========================
// EXPORT MACHINE PDF
// =========================

const exportMachinePDF = async (req, res) => {

    try {

        const machine = await Machine.findById(req.params.id);

        if (!machine) {

            return res.status(404).json({

                success: false,

                message: "Machine Not Found"

            });

        }

        const doc = new PDFDocument({

            margin: 40,

            size: "A4"

        });

        res.setHeader(

            "Content-Type",

            "application/pdf"

        );

        res.setHeader(

            "Content-Disposition",

            `attachment; filename=${machine.machine_name}.pdf`

        );

        doc.pipe(res);

        // Heading

        // ================= HEADER =================

// ===============================
// HEADER
// ===============================

doc.rect(0, 0, doc.page.width, 90)
    .fill("#0d6efd");

doc.fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text("BANARAS LOCOMOTIVE WORKS", 40, 22);

doc.fontSize(16)
    .font("Helvetica")
    .text("Smart QR Machine Information System", 40, 55);

// Reset

doc.fillColor("black");

doc.moveDown(4);

// ===============================
// MACHINE DETAILS CARD
// ===============================

doc.roundedRect(35, 115, 525, 190, 8)
    .lineWidth(1)
    .stroke("#cfcfcf");

doc.fillColor("#0d6efd")
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("Machine Details", 50, 130);

doc.fillColor("black");

let y = 165;

doc.font("Helvetica")
    .fontSize(12);

doc.text("Machine Name :", 50, y);
doc.text(machine.machine_name || "NA", 180, y);

y += 22;

doc.text("Machine Code :", 50, y);
doc.text(machine.machine_code || "NA", 180, y);

y += 22;

doc.text("Department :", 50, y);
doc.text(machine.department || "NA", 180, y);

y += 22;

doc.text("Manufacturer :", 50, y);
doc.text(machine.manufacturer || "NA", 180, y);

y += 22;

doc.text("Year :", 50, y);
doc.text(machine.year || "Not Available", 180, y);

y += 22;

doc.text("Operator :", 50, y);
doc.text(machine.operator || "NA", 180, y);

y += 22;

doc.text("Location :", 50, y);
doc.text(machine.location || "NA", 180, y);

y += 22;

doc.text("Status :", 50, y);
doc.text(machine.status || "NA", 180, y);

doc.moveDown(10);

// ===============================
// MACHINE IMAGE
// ===============================

if (machine.image) {

    try {

        const imageName = machine.image.split("/").pop();

        const imagePath = path.join(

            __dirname,

            "..",

            "uploads",

            imageName

        );

        if (fs.existsSync(imagePath)) {

            doc.image(

                imagePath,

                395,

                145,

                {

                    width: 140,

                    height: 110

                }

            );

        }

    }

    catch (err) {

        console.log("Image Error");

    }

}

// Move Cursor

doc.y = 330;

// ===============================
// DYNAMIC SECTION FUNCTION
// ===============================

function addSection(title, content) {

    // New page if required
    if (doc.y > 700) {

        doc.addPage();

    }

    const startY = doc.y;

    // Blue Header

    doc.roundedRect(40, startY, 515, 25, 4)
        .fill("#0d6efd");

    doc.fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(15)
        .text(title, 50, startY + 6);

    doc.fillColor("black");

    doc.moveDown(2);

    if (content) {

        doc.font("Helvetica")
            .fontSize(12)
            .text(content, {

                width: 500,

                align: "justify"

            });

    }

    doc.moveDown();

}

        // Introduction

        addSection(

    "Introduction",

    machine.introduction || "Not Available"

);

        // Working

addSection(

    "Working Principle",

    machine.working_principle || "Not Available"

);

// ===============================
// DYNAMIC LIST SECTION
// ===============================

function addListSection(title, list) {

    if (doc.y > 700) {
        doc.addPage();
    }

    const startY = doc.y;

    // Blue Header
    doc.roundedRect(40, startY, 515, 25, 4)
        .fill("#0d6efd");

    doc.fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(15)
        .text(title, 50, startY + 6);

    doc.fillColor("black");

    doc.moveDown(2);

    if (!list || list.length === 0) {

        doc.text("Not Available");

    } else {

        list.forEach(item => {

            if (doc.y > 730) {
                doc.addPage();
            }

            doc.circle(50, doc.y + 6, 2)
                .fill("#0d6efd");

            doc.fillColor("black")
                .fontSize(12)
                .text(item, 65, doc.y - 6, {
                    width: 470
                });

            doc.moveDown(0.6);

        });

    }

    doc.moveDown();

}
        // Applications

        addListSection(
    "Applications",
    machine.applications
);

        // Safety

   addListSection(
    "Safety ",
    machine.safety
);
        // Maintenance

       addListSection(
    "Maintenance",
    machine.maintenance
); 

        // Parts

        addListSection(
    "Main Parts",
    machine.parts
);
       
        doc.moveDown();

        // ===============================
// FOOTER LINE
// ===============================

doc.moveDown(2);

doc.strokeColor("#cccccc")
   .lineWidth(1)
   .moveTo(40, doc.y)
   .lineTo(555, doc.y)
   .stroke();

doc.moveDown();

// ===============================
// GENERATED DATE
// ===============================

const today = new Date();

doc.fillColor("gray")
   .font("Helvetica")
   .fontSize(10)
   .text(
      "Generated by BLW Smart QR Machine Information System",
      {
         align: "center"
      }
   );

doc.text(

    today.toLocaleDateString("en-IN") +

    "   " +

    today.toLocaleTimeString("en-IN"),

    {

        align: "center"

    }

);

doc.moveDown(0.5);

doc.text(

    "Banaras Locomotive Works (BLW)",

    {

        align: "center"

    }

);

        doc.end();

    }
catch(error){

    res.status(500).json({

        success:false,

        message:error.message

    });

}

};

// =========================
// EXPORT EXCEL
// =========================

const exportExcel = async (req, res) => {

    try {

        const machines = await Machine.find().sort({

            createdAt: -1

        });

        const workbook = new ExcelJS.Workbook();

        workbook.creator = "BLW Smart QR Machine Information System";

        workbook.created = new Date();

        const worksheet = workbook.addWorksheet("Machines");

        worksheet.columns = [

            {
                header: "Machine Name",
                key: "machine_name",
                width: 30
            },

            {
                header: "Machine Code",
                key: "machine_code",
                width: 20
            },

            {
                header: "Department",
                key: "department",
                width: 20
            },

            {
                header: "Manufacturer",
                key: "manufacturer",
                width: 25
            },

            {
                header: "Year",
                key: "year",
                width: 15
            },

            {
                header: "Operator",
                key: "operator",
                width: 20
            },

            {
                header: "Location",
                key: "location",
                width: 25
            },

            {
                header: "Status",
                key: "status",
                width: 18
            }

        ];

        // Header Style

        worksheet.getRow(1).font = {

            bold: true,

            color: {

                argb: "FFFFFFFF"

            }

        };

        worksheet.getRow(1).fill = {

            type: "pattern",

            pattern: "solid",

            fgColor: {

                argb: "0D6EFD"

            }

        };

        worksheet.getRow(1).alignment = {

            vertical: "middle",

            horizontal: "center"

        };

        // Data

        machines.forEach(machine => {

            worksheet.addRow({

                machine_name: machine.machine_name,

                machine_code: machine.machine_code,

                department: machine.department,

                manufacturer: machine.manufacturer,

                year: machine.year || "N/A",

                operator: machine.operator,

                location: machine.location,

                status: machine.status

            });

        });

        // Center Align

        worksheet.eachRow(row => {

            row.eachCell(cell => {

                cell.alignment = {

                    vertical: "middle",

                    horizontal: "center"

                };

            });

        });

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            "attachment; filename=BLW_Machines.xlsx"

        );

        await workbook.xlsx.write(res);

        res.end();

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =========================
// EXPORTS
// =========================

module.exports = {

    addMachine,

    getMachines,

    getMachineById,

    updateMachine,

    deleteMachine,

    exportMachinePDF,

    exportExcel

};