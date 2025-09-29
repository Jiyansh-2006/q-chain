import express from "express";
import cors from "cors";
import shorRouter from "./routes/shor.js";

const app = express();
app.use(express.json());

// ✅ Enable CORS for all origins (or restrict to your frontend URL)
app.use(cors());

// Routes
app.use("/api", shorRouter);

app.listen(5000, () => console.log("Backend listening on :5000"));