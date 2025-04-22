import LogoIcon from "@assets/icons/logo_icon.svg?react";
import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { resolveOriginal } from "../http/shortens";
import { useLinks } from "../store/links";

export function Redirect() {
  const { id: slug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isLoading = useLinks((state) => state.isLoading);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!slug || hasRedirected.current) return;
    hasRedirected.current = true;
    useLinks.setState({ isLoading: true });
    const doRedirect = async () => {
      try {
        const original = await resolveOriginal(slug);
        await new Promise((res) => setTimeout(res, 3000));
        window.location.replace(original);
        useLinks.getState().incrementAccessCount(slug);
        try {
          const bc = new BroadcastChannel("visits");
          bc.postMessage(slug);
          bc.close();
        } catch {}
      } catch {
        navigate("/404", { replace: true });
      } finally {
        useLinks.setState({ isLoading: false });
      }
    };
    doRedirect();
  }, [slug, navigate]);

  return (
    <div className="min-h-screen bg-gray-scale-200 flex items-center justify-center p-3 md:p-4">
      <div className="w-full max-w-xl rounded-xl flex items-center justify-center md:bg-gray-scale-100 md:p-6">
        <div className="bg-white rounded-lg w-full max-w-md p-6 md:p-8 flex flex-col items-center justify-center">
          <LogoIcon className="w-12 h-12 text-blue-base mb-6" />
          <h2 className="text-xl font-bold mb-4 text-gray-scale-600">
            Redirecionando...
          </h2>
          <p className="text-center text-gray-scale-500 mb-2">
            O link será aberto automaticamente em alguns instantes.
          </p>
          <p className="text-center text-gray-scale-500">
            Não foi redirecionado?{" "}
            <Link to={`/${slug}`} className="text-blue-base">
              Acesse aqui
            </Link>
          </p>
          {isLoading && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              {[0, 0.2, 0.4].map((delay) => (
                <motion.span
                  key={delay}
                  className="w-2 h-2 bg-blue-base rounded-full"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
