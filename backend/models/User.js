// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Cart sub-schema
const cartSchema = new mongoose.Schema({
book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
quantity: { type: Number, default: 1 },
});

// User schema
const userSchema = new mongoose.Schema(
{
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },


// 🔑 Role: can be "user", "author", "publisher", "admin"
role: { type: String, default: "user" },

// 🛒 Cart
cart: [cartSchema],

// ❤️ Wishlist
wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],

// 📚 Books authored (only used if role = "author")
books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],


},
{ timestamps: true }
);

// ✅ Hash password before save
userSchema.pre("save", async function (next) {
if (!this.isModified("password")) return next();
this.password = await bcrypt.hash(this.password, 10);
next();
});

// ✅ Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
