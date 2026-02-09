import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // 1. Verificar el secreto del Webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // 2. Obtener los headers de Svix
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Si falta algún header, error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // 3. Obtener el cuerpo del mensaje
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // 4. Verificar la firma
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // 5. Guardar el usuario en la base de datos
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses?.[0]?.email_address;
    
    if (email) {
        const fullName = `${first_name || ''} ${last_name || ''}`.trim();

        await prisma.users.upsert({
          where: { clerkId: id },
          update: {
            email: email,
            full_name: fullName,
            avatar_url: image_url,
          },
          create: {
            clerkId: id,
            email: email,
            full_name: fullName,
            avatar_url: image_url,
          },
        });
    }
  }

  return new Response('', { status: 200 })
}