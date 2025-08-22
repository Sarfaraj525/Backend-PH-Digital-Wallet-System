/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import { AdminRoutes } from "./app/modules/admin/admin.route";
import { TransactionRoutes } from "./app/modules/transaction/transaction.route";
import { envVars } from "./app/config/env";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: envVars.FRONTEND_URL,
  credentials: true,
}));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Digital Wallet API System Backend",
  });
});

app.use("/api/v1/admin", AdminRoutes);


app.use('/api/v1/transaction', TransactionRoutes);

 
app.use(globalErrorHandler);

app.use(notFound);

export default app;
