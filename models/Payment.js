import mongoose from "mongoose";
const { Schema, model,models } = mongoose;

const PaymentSchema = new Schema({
    name: { type: String, required: true },
    to_user: { type: String, required: true },
    oid: { type: String, required: true },
    message: { type: String },
    amount: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    done: { type: Boolean, default: false }
});
// const Payment = model("Payment", paymentSchema);
export default models.Payment || model("Payment", PaymentSchema);