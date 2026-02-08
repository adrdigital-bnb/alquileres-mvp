// app/layout.tsx
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 👇 Sin claves manuales, Clerk las buscará solo en las variables de entorno
    <ClerkProvider>
      <html lang="es">
        <body>
          {/* ... tu header y resto del código igual ... */}
          <header className="p-4 border-b flex justify-between items-center">
             <h1 className="font-bold">Alquileres MVP</h1>
             <div>
               <SignedOut>
                 <SignInButton mode="modal">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Iniciar Sesión</button>
                 </SignInButton>
               </SignedOut>
               <SignedIn>
                 <UserButton />
               </SignedIn>
             </div>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}