import mongoose from "mongoose";
import { dataBaseName } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${dataBaseName}`
    );
    console.log(connectionInstance.connection.host);
  } catch (error) {
    console.log("your error message :-> ", error);
    process.exit(1);
  }
};

export default connectDB;
