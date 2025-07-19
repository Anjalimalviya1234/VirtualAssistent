import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import auth from "./routes/auth.route.js";
import cookieParser from "cookie-parser"; // needed to read cookies
import cors from "cors"
import userRoute from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";
dotenv.config();
const app = express();
app.use(cors({
origin:"http://localhost:5173",
credentials: true
}))
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectdb();

// Middleware
app.use(express.json()); 
app.use(cookieParser()); 

// Routes
app.use("/api/auth", auth);
app.use("/api/user",userRoute)
app.get("/",async (req,res)=>
{
  let prompt=req.query.prompt
 let data=  await geminiResponse(prompt)
res.json(data)
})


app.listen(port, () => {
  console.log("Server is running on port", port);
});
