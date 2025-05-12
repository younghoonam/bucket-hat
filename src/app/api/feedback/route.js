import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request, response) {
  const body = await request.json();
  const { name, email, message } = body;
  try {
    const { data, error } = await resend.emails.send({
      from: "Patternea <onboarding@resend.dev>",
      to: ["nyounghoo@gmail.com"],
      subject: "Patternea Feedback",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="background:rgb(0, 0, 0); color: white; padding: 10px; text-align: center;">Patternea</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>`,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
