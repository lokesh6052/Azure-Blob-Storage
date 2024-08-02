import dotenv from "dotenv";
import connectDB from "./data/connectionDB.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then((result) => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("your error message :-> ", error);
    process.exit(1);
  });
