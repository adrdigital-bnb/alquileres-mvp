import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 👇 OJO AQUÍ: Asegúrate de que NO haya espacios dentro de las comillas.
    // Debe ser algo como: publishableKey="pk_test_aBcD123..."
    <ClerkProvider publishableKey="pk_test_cHJvcGVyLXN0dWQtMjQuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <html lang="es">
        <body>
          <header className="p-4 border-b flex justify-between items-center">
             <h1 className="font-bold">Alquileres MVP</h1>
             <div>
               <SignedOut>
                 <SignInButton mode="modal">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                      Iniciar Sesión
                    </button>
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