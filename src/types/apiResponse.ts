import { Message } from "@/models/userModel";

export interface Response{
    message: string;
    success: boolean;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>
}