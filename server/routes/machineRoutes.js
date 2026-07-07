const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {

    addMachine,
    getMachines,
    getMachineById,
    updateMachine,
    deleteMachine,
    exportMachinePDF,
    exportExcel

} = require("../controllers/machineController");

// Public Routes
router.get("/", getMachines);
router.get("/:id", getMachineById);
router.get("/pdf/:id", exportMachinePDF);
router.get("/excel", exportExcel);

// Protected Routes
router.post(
    "/",
    protect,
    upload.single("image"),
    addMachine
);

router.put(
    "/:id",
    protect,
    upload.single("image"),
    updateMachine
);

router.delete(
    "/:id",
    protect,
    deleteMachine
);

module.exports = router;