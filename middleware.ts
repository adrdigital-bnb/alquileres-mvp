// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

// 👇 Usamos la función vacía, pero SIN pasarle las claves.
// Clerk las leerá automáticamente de Vercel (Environment Variables).
export default clerkMiddleware();

export const config = {
  matcher: [
    // Protege todas las rutas excepto los archivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre corre para rutas API
    '/(api|trpc)(.*)',
  ],
};