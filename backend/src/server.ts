import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import groupRoutes from "./routes/groups";
import expenseRoutes from "./routes/expenses";
import approvalRoutes from "./routes/approvals";
import settlementRoutes from "./routes/settlements";
import dashboardRoutes from "./routes/dashboard";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));
app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);
app.use("/expenses", expenseRoutes);
app.use("/approvals", approvalRoutes);
app.use("/settlements", settlementRoutes);
app.use("/dashboard", dashboardRoutes);
