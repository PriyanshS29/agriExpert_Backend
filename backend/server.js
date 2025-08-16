import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import expertRouter from "./routes/expertRoute.js"
import adminRouter from "./routes/adminRoute.js"
import path from "path";
import { fileURLToPath } from "url";

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
// middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, "/dist")));
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/expert", expertRouter)

// app.get("/", (req, res) => {
//   res.send("API Working")
// });
// /admin/*
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});


app.listen(port, () => console.log(`Server started on PORT:${port}`))