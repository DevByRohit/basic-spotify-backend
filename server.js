require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/database/db");

//connect to database
connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
