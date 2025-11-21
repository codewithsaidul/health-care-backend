import cors from "cors";
import express, { Application, Request, Response } from "express";
import cron from "node-cron";
import { envVars } from "./app/config/env";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { AppointmentServices } from "./app/modules/appointment/appointment.service";
import { PaymentController } from "./app/modules/payment/payment.controller";
import router from "./app/routes/index.route";

const app: Application = express();

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Schedule a task to run every minute
cron.schedule("* * * * *", () => {
  try {
    AppointmentServices.cancelUnpaidAppointments();
    console.log("running a task every minute");
  } catch (error) {
    console.log("🚀 App.TS ~ error:", error);
  }
});

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Server is running..",
    environment: envVars.NODE_ENV,
    uptime: process.uptime().toFixed(2) + " sec",
    timeStamp: new Date().toISOString(),
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
