import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
dotenv.config();
const app = express()
const PORT = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("server started on PORT:", PORT);
    });
});
