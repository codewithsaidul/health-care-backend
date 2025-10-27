// payment.controller.ts
import { NextFunction, Request, Response } from "express";
import { PaymentService } from "./payment.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { stripe } from "../../utils/stripe";
import { StatusCodes } from "http-status-codes";

export const PaymentController = {
  handleStripeWebhookEvent: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret =
        "whsec_86040bef45819befc771677ef10b03e48e773bfdb01462fdc12561f9a952276b";

      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      const result = await PaymentService.handleStripeWebhookEvent(event);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Webhook req send successfully",
        data: result,
      });
    }
  ),
};
