import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚙ SERVER IS LISTENING ON PORT: ${port}`);
    });
  })
  .catch((error) => {
    console.log("DB CONNECTION FAILED: ", error);
  });

/*

CAN CONNECT DB LIKE THIS, BUT NOT RECOMMENDED IN PRODUCTION


const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", () => {
      console.error(error);
      throw error;
    });
    app.listen(`${port}`, () => {
      console.log(`Server is running on Port: ${port}`);
    });
  } catch (error) {
    console.error("DataBase Connection Failed: ", error);
    throw error;
  }
})();

*/
