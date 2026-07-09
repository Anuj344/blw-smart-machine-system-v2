const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const Machine = require("./models/Machine");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

async function importMachines() {
  try {
    let data = JSON.parse(fs.readFileSync("./machines.json", "utf8"));

    // Clean MongoDB export fields
    data = data.map(machine => {
      delete machine._id;
      delete machine.__v;
      delete machine.createdAt;
      delete machine.updatedAt;
      return machine;
    });

    await Machine.deleteMany({});
    await Machine.insertMany(data);

    console.log(`${data.length} Machines Imported Successfully`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

importMachines();