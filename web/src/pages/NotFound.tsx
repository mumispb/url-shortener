import NotFoundSVG from "@assets/icons/404.svg?react";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-scale-200 flex items-center justify-center p-3 md:p-4">
      <div className="w-full max-w-xl rounded-xl flex items-center justify-center md:bg-gray-scale-100 md:p-6">
        <div className="bg-white rounded-lg w-full max-w-md p-6 md:p-8 flex flex-col items-center justify-center">
          <NotFoundSVG className="w-32 h-32 mb-6" />
          <h2 className="text-xl font-bold mb-4">Link não encontrado</h2>
          <p className="text-center text-gray-scale-500">
            O link que você está tentando acessar não existe, foi removido ou é
            uma URL inválida. Saiba mais em{" "}
            <Link to="/" className="text-blue-base">
              brev.ly
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
