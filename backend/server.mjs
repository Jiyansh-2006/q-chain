import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Q-Chain backend is running 🚀");
});

app.listen(5000, () => console.log("Backend running at http://localhost:5000"));
