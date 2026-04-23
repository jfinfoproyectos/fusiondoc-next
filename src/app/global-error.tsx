'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">¡Algo salió mal!</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Ha ocurrido un error crítico en la aplicación. Por favor, intenta recargar la página.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
