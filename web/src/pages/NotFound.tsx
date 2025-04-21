import NotFoundSVG from "@assets/icons/404.svg?react";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-scale-200 flex items-start md:items-center justify-center p-4">
      <div className="bg-gray-scale-100 w-full max-w-xl rounded-xl p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg max-w-md w-full p-8 flex flex-col items-center justify-center">
          <NotFoundSVG className="w-32 h-32 mb-4" />

          <h2 className="text-xl font-bold mb-2">Link não encontrado</h2>

          <p className="text-center text-gray-scale-500 mb-4">
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
