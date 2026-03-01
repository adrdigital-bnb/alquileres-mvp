import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define qué rutas son públicas (incluye las de retorno de MP y webhooks)
const isPublicRoute = createRouteMatcher([
  '/', // Para que se pueda ver la página principal
  '/propiedades(.*)', // Para que se puedan ver las propiedades sin estar logueado
  '/reserva-exitosa(.*)',
  '/reserva-fallida(.*)',
  '/reserva-pendiente(.*)',
  '/api/(.*)', // ¡CRÍTICO! Para que los webhooks de Mercado Pago y Clerk puedan entrar
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect(); // <- Quitas los paréntesis de auth y agregas await
  }
});

export const config = {
  matcher: [
    // Protege todas las rutas excepto archivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre corre para rutas API
    '/(api|trpc)(.*)',
  ],
};