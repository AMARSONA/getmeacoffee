import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import Razorpay from "razorpay";
import connectDB from "@/db/connectDB";
import User from "@/models/User";

export const POST = async (request) => {
    await connectDB();
    let body = await request.formData()
    body = Object.fromEntries(body);


    // Check if razorpay orderid is present in the server
    let p = await Payment.findOne({ oid: body.razorpay_order_id });
    if (!p) {
        return NextResponse.json({ success: false, message: "Order ID not Found" });
    }


    // fetch the secret of the user who is getting the payment 
    let user = await User.findOne({username: p.to_user})
    const secret = user.razorpaysecret

    // Verify the payment
    let xx = validatePaymentVerification({
        "order_id": body.razorpay_order_id,
        "payment_id": body.razorpay_payment_id
    },
        body.razorpay_signature,
        secret);


    if (xx) {
        //Update the payment status
        const updatedPayment = await Payment.findOneAndUpdate(
            { oid: body.razorpay_order_id },
            { done: "true" },
            { new: true }
        );
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`);
    }
    else {
        // If verification fails, return an error response
        return NextResponse.json({ success: false, message: "Payment verification failed" });
    }


}
