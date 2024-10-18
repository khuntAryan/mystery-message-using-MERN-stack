import dbConnect from "@/lib/dbconfig";
import UserModel from "@/models/userModel";
import { z } from "zod"
import { validateUserNameSchema } from "@/schemas/signUpSchema"

const usernameQuerySchema = z.object({
    username: validateUserNameSchema
})

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const quertParams = {
            username: searchParams.get('username')
        }
        const result = usernameQuerySchema.safeParse(quertParams)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "invalid formate"
            }, { status: 500 })
        }
        const { username } = result.data;
        const existingUser = await UserModel.findOne({ username, isVerified: true })
        if (existingUser) {
            return Response.json({
                suucess:false,
                Message:"username already taken"
            },{status:402})
        }
        return Response.json({
            success:true,
            message:"username is unique"
        },{
            status:200
        })
    } catch (error: any) {
        console.error("error verifying the username", error)
        return Response.json({
            success: false,
            message: "error checking the username"
        }, { status: 500 })
    }
}