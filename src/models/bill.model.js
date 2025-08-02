const billSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    services: [
      {
        description: String,
        amount: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Online"],
    },
    paymentDate: Date,
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
