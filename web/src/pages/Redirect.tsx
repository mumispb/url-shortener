import LogoIcon from "@assets/icons/logo_icon.svg?react";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLinks } from "../store/links";
import { resolveOriginal } from "../http/shortens";

export function Redirect() {
  const { id } = useParams<{ id: string }>();
  const [redirecting, setRedirecting] = useState(true);
  const incrementAccessCount = useLinks((state) => state.incrementAccessCount);
  const navigate = useNavigate();

  const handleRedirect = async () => {
    if (!id) return;
    try {
      const original = await resolveOriginal(id);
      window.location.replace(original);
    } catch (err) {
      console.error(err);
      navigate("/404", { replace: true });
    } finally {
      setRedirecting(false);
      incrementAccessCount(id);
    }
  };

  useEffect(() => {
    handleRedirect();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-scale-200 flex items-start md:items-center justify-center p-4">
      <div className="bg-gray-scale-100 w-full max-w-xl rounded-xl p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg max-w-md w-full p-8 flex flex-col items-center justify-center">
          <LogoIcon className="w-12 h-12 text-blue-base mb-4" />

          <h2 className="text-xl font-bold mb-2">Redirecionando...</h2>

          <p className="text-center text-gray-scale-500 mb-4">
            O link será aberto automaticamente em alguns instantes.
          </p>
          <p className="text-center text-gray-scale-500">
            Não foi redirecionado?{" "}
            <Link to={`/${id}`} className="text-blue-base">
              Acesse aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
