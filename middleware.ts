import { clerkMiddleware } from "@clerk/nextjs/server";

// 👇 AGREGAMOS LAS CLAVES AQUÍ DIRECTAMENTE
// Reemplaza los textos entre comillas con tus claves reales de .env.local
export default clerkMiddleware(undefined, {
  publishableKey: "pk_test_cHJvcGVyLXN0dWQtMjQuY2xlcmsuYWNjb3VudHMuZGV2JA",
  secretKey: "sk_test_rKNwn5jrtuafxDhpgVr5dJ2sBJF5RQQQag8AiNSXa5"
});

export const config = {
  matcher: [
    // Protege todas las rutas excepto los estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre corre para rutas API
    '/(api|trpc)(.*)',
  ],
};