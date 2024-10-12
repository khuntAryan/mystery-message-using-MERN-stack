import mongoose, { Schema, Document } from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
}
const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isAcceptingMessage: boolean;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean
    messages: Message[];
}
const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    verifyCode: {
        type: String
    },
    verifyCodeExpiry: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    messages: [messageSchema]
}, { timestamps: true });


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",userSchema)
export default UserModel