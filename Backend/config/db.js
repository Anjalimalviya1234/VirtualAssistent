import mongoose from "mongoose";

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log("✅ DB connected");
    } catch (error) {
        console.error("❌ DB connection error:", error.message);
    }
};

export default connectdb;
