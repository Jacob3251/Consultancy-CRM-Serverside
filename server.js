import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("uploads"));
// routes
app.use(routes);

app.get("/", (req, res) => {
  res.send("Up and running");
});

app.listen(port, () => console.log(`Server Started on port ${port}`));
