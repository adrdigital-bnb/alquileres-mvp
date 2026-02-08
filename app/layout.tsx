import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 👇 AQUÍ ESTÁ LA SOLUCIÓN:
    // Pega tu clave pk_test_... REAL entre comillas.
    // Esto garantiza que el Build no falle nunca más por "Missing key".
    <ClerkProvider publishableKey="pk_test_AQUI_PEGA_TU_CODIGO_LARGO_QUE_EMPIEZA_CON_PK_TEST">
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