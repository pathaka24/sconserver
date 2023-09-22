import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI)

        console.log(`Server connected to database ${connection.host.name}`)
    }
    catch (error) {
        console.log("some error ", error)
        process.exit(1)
    }
}