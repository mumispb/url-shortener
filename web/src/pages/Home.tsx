import Logo from "@assets/icons/logo.svg?react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState, useEffect } from "react";
import { useLinks } from "../store/links";
import { useShallow } from "zustand/shallow";

interface LinkItem {
  id: string;
  shortUrl: string;
  originalUrl: string;
  accessCount: number;
}

export function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const {
    links: linksMap,
    createLink,
    loadLinks,
    deleteLink,
  } = useLinks(
    useShallow((state) => ({
      links: state.links,
      createLink: state.createLink,
      deleteLink: state.deleteLink,
      loadLinks: state.loadLinks,
    }))
  );

  const links = Array.from(linksMap.values());
  const hasLinks = links.length > 0;

  useEffect(() => {
    loadLinks().catch(console.error);
  }, [loadLinks]);

  const handleSaveLink = () => {
    if (!originalUrl) return;

    createLink(originalUrl).catch(console.error);
    setOriginalUrl("");
    setShortUrl("");
  };

  return (
    <div className="min-h-screen bg-gray-scale-200 flex items-start md:items-center justify-center p-4">
      <div className="bg-gray-scale-100 w-full max-w-6xl rounded-xl p-6">
        <div className="flex justify-center mb-6">
          <Logo className="h-8 text-blue-base" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Novo link</h2>

            <div className="space-y-4">
              <Input
                label="LINK ORIGINAL"
                placeholder="www.exemplo.com.br"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />

              <Input
                label="LINK ENCURTADO"
                placeholder="brev.ly/"
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
              />

              <Button onClick={handleSaveLink} className="mt-4 w-full">
                Salvar link
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Meus links</h2>
              <button
                type="button"
                className="text-gray-scale-500 hover:text-blue-base"
              >
                Baixar CSV
              </button>
            </div>

            {hasLinks ? (
              <div className="space-y-4">
                {links.map((link) => (
                  <div key={link.id} className="border-b pb-2">
                    <div className="font-medium text-blue-base">
                      {link.shortUrl}
                    </div>
                    <div className="text-sm text-gray-scale-500 truncate">
                      {link.originalUrl}
                    </div>
                    <div className="text-xs text-gray-scale-400">
                      {link.accessCount} acessos
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button
                        type="button"
                        className="text-gray-scale-400 hover:text-blue-base"
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <title>Copy URL</title>
                          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLink(link.id)}
                        className="text-gray-scale-400 hover:text-red-500"
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <title>Delete URL</title>
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                          <path
                            fillRule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  className="text-gray-scale-300 mb-4"
                  aria-hidden="true"
                >
                  <title>Empty links</title>
                  <path
                    d="M24 6.5C14.34 6.5 6.5 14.34 6.5 24C6.5 33.66 14.34 41.5 24 41.5C33.66 41.5 41.5 33.66 41.5 24C41.5 14.34 33.66 6.5 24 6.5ZM24 11.5C26.76 11.5 29 13.74 29 16.5C29 19.26 26.76 21.5 24 21.5C21.24 21.5 19 19.26 19 16.5C19 13.74 21.24 11.5 24 11.5ZM24 36.7C19.5 36.7 15.52 34.42 13.5 31C13.5 28 19.5 26.35 24 26.35C28.5 26.35 34.5 28 34.5 31C32.48 34.42 28.5 36.7 24 36.7Z"
                    fill="currentColor"
                  />
                </svg>
                <p className="text-center text-gray-scale-400">
                  AINDA NÃO EXISTEM LINKS CADASTRADOS
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
