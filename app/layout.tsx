import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 👇 AQUÍ ESTÁ EL CAMBIO CLAVE:
    // Agregamos 'publishableKey' para obligar a Vercel a leer la variable.
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="es">
        <body>
          {/* Barra de navegación temporal para probar el Login */}
          <header className="p-4 border-b flex justify-between items-center">
             <h1 className="font-bold">Alquileres MVP</h1>
             <div>
               <SignedOut>
                 {/* Si NO está logueado, muestra botón de entrar */}
                 <SignInButton mode="modal">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                      Iniciar Sesión
                    </button>
                 </SignInButton>
               </SignedOut>
               <SignedIn>
                 {/* Si ESTÁ logueado, muestra el avatar del usuario */}
                 <UserButton />
               </SignedIn>
             </div>
          </header>

          <main>{children}</main>
        </body>
      </html >
    </ClerkProvider>
  )
}