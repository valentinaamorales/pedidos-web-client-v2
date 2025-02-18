import Link from "next/link";

export default function UnauthorizedPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">No Autorizado</h1>
        <p className="text-lg text-gray-600">
          No tienes permiso para acceder a esta página.
        </p>
        <Link
          href="/home" 
          className="mt-4 text-white bg-primary px-4 py-2 rounded-md"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }