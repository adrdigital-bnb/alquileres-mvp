import { clerkMiddleware } from "@clerk/nextjs/server";

// 👇 TRUCO TÉCNICO:
// 1. El primer argumento `(auth, req) => {}` es una función vacía para que TypeScript no se queje.
// 2. El segundo argumento `{ ... }` inyecta las claves explícitamente leyendo de Vercel.
export default clerkMiddleware((auth, req) => {}, {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};