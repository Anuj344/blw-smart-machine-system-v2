const mongoose = require("mongoose");

const uri =
"mongodb+srv://blwadmin:admin12345@cluster0.ztutbuj.mongodb.net/blw?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
.then(() => {
    console.log("✅ Connected");
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});