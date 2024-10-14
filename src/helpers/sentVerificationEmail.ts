import { Response } from "@/types/apiResponse";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";

export async function verifyEmail(
    email: string,
    username:string,
    verifyCode:string
): Promise<Response>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'mystry message || verification email',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return {
            success:true,
            message:'successFully sent verify email'
        }
    } catch (emailError) {
        console.log("error send the verify email",emailError)
        return {
            success:false,
            message:'error while sending verify email'
        }
    }
}