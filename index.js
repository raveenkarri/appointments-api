const express =  require("express"); 
const app = express();
const cors = require("cors");
require("dotenv").config();
const doctorRoutes = require("./routes/doctorRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8080;

app.use("/", doctorRoutes);
app.use("/",userRoutes)


app.listen(port, () => { 
    console.log(`Server is running on port ${port}`);
});