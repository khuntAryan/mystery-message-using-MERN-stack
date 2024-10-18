import dbConnect from "@/lib/dbconfig";
import UserModel from "@/models/userModel";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 401 })
        }
        const verifiedCode = user.verifyCode === code
        const expiryCheck = new Date(user.verifyCodeExpiry) > new Date()
        if (verifiedCode && expiryCheck) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "user verified successfully"
            }, { status: 200 })
        } else if (!expiryCheck) {
            return Response.json({
                success: false,
                message: "code has been expired , sign-up again"
            }, {
                status: 400
            })
        } else {
            return Response.json({
                success: false,
                message: "incorrect verification code"
            }, {
                status: 400
            })
        }
    } catch (error: any) {
        console.error("error verifying the user", error)
        return Response.json({
            success: false,
            message: "error verofying the code of the user"
        }, { status: 500 })
    }
}