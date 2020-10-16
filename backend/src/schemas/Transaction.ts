import mongoose from "mongoose";
interface ITransaction extends mongoose.Document {
  state: string;
}
const TransactionSchema = new mongoose.Schema({
  state: {
    type: String,
  }
});
const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
