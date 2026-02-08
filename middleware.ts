import { clerkMiddleware } from "@clerk/nextjs/server";

// 👇 CAMBIO: En vez de 'undefined', ponemos una función vacía '() => {}'
// IMPORTANTE: Asegúrate de que las claves "pk_test" y "sk_test" sean las REALES
export default clerkMiddleware(() => {}, {
  publishableKey: "pk_test_cHJvcGVyLXN0dWQtMjQuY2xlcmsuYWNjb3VudHMuZGV2JA", 
  secretKey: "sk_test_rKNwn5jrtuafxDhpgVr5dJ2sBJF5RQQQag8AiNSXa5"
});

export const config = {
  matcher: [
    // Protege todas las rutas excepto los archivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre corre para rutas API
    '/(api|trpc)(.*)',
  ],
};