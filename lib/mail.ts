// lib/mail.ts
import { Resend } from 'resend';

// Inicializamos Resend con la clave de tu .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmailCancelacion(emailDestino: string, nombreHuesped: string, nombrePropiedad: string) {
  try {
    const data = await resend.emails.send({
      // Resend te da este correo temporal para pruebas en su capa gratuita
      from: 'Alquileres MVP <onboarding@resend.dev>', 
      to: [emailDestino],
      subject: `Reserva Cancelada - ${nombrePropiedad}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; padding: 20px;">
          <h2 style="color: #e11d48; text-align: center;">Reserva Cancelada</h2>
          <p style="font-size: 16px; color: #333;">Hola <strong>${nombreHuesped}</strong>,</p>
          <p style="font-size: 16px; color: #555;">
            Te confirmamos que tu reserva en <strong>${nombrePropiedad}</strong> ha sido cancelada exitosamente a través de la plataforma.
          </p>
          <p style="font-size: 16px; color: #555;">
            Las fechas han sido liberadas en nuestro calendario.
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 14px; color: #888; text-align: center;">
            Saludos,<br/>El equipo de Alquileres MVP
          </p>
        </div>
      `
    });
    
    console.log("🟢 EMAIL ENVIADO CON ÉXITO:", data);
    return { success: true, data };
  } catch (error) {
    console.error("🔴 ERROR ENVIANDO EMAIL:", error);
    return { success: false, error };
  }
}