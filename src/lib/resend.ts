import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

//here we are configuring the resend api key 