import Link from "next/link";

export default function IncompleteProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Perfil Incompleto</h1>
      <p className="text-lg text-gray-600 text-center max-w-md mb-6">
        Tu perfil está incompleto. Por favor, contacta al administrador para completar tu información.
      </p>
      <Link
        href="/home" 
        className="mt-4 text-white bg-primary px-4 py-2 rounded-md hover:bg-primary/90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}