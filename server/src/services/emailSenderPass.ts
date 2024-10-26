import { createToken } from "../utils/token";
import sendEmail from "./sendEmail";

const createEmailToRecoverPassword = async (id: string, email: string, definedTheme: boolean) => {
    const token = createToken({ id , email, definedTheme } , { expiresIn: '15min' });

    const html = `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
    </head>
    <body>
      <table bgcolor="#ffffff" width="600" cellspacing="0" cellpadding="0" style="margin: auto;">
        <thead bgcolor="#dfe4ea">
          <tr>
            <th style="padding: 40px 0 24px; text-align: center;"><h1 style="margin: 0; color: #30336b;">Reset Password</h1></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-family: sans-serif; text-align: center; padding: 24px;">
              <a href="${process.env.CLIENT_URL}/reset-password/${token}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px;">Click Here</a>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`

    const subject = 'Reset password';
    await sendEmail(email, subject, html);
}

export default createEmailToRecoverPassword;