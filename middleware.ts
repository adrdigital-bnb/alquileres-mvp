import { clerkMiddleware } from "@clerk/nextjs/server";

// 👇 Dejamos esto VACÍO.
// Al no pasar argumentos, se arregla el error de TypeScript (pantalla roja).
// Clerk leerá tu Secret Key automáticamente desde las variables de Vercel.
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};