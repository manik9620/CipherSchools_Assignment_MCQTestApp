const mongoose = require("mongoose");
const colors=require("colors")

const uri =
  "mongodb+srv://<username>:<password>@nodepractice.hcpg4zr.mongodb.net/<dbname>?appName=CipherSchoolAssignment";

let dbURL = uri;
dbURL = dbURL.replace("<username>", process.env.DB_USERNAME);
dbURL = dbURL.replace("<password>", process.env.DB_PASSWORD);
dbURL = dbURL.replace("<dbname>", process.env.DB_NAME);

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("<-------Database connected-------->".bgYellow.white);
  })
  .catch((err) => {
    console.log("Db connection failed".bgRed.white);
    console.log(err);
  });