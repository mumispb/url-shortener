import Logo from "@assets/icons/logo.svg?react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState, useEffect } from "react";
import { useLinks } from "../store/links";
import { exportShortens } from "../http/shortens";
import { z } from "zod";
import type { ZodIssue } from "zod";
import { Copy, Trash, DownloadSimple } from "@phosphor-icons/react";

const linkInputSchema = z.object({
  originalUrl: z
    .string()
    .nonempty("Infome uma URL válida")
    .url("Infome uma URL válida"),
  slug: z
    .string()
    .nonempty("Informe uma URL minúscula e sem espaço/caracter especial")
    .regex(
      /^[a-z0-9]+$/,
      "Informe uma URL minúscula e sem espaço/caracter especial"
    ),
});

export function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [originalUrlError, setOriginalUrlError] = useState<string>();
  const [slugError, setSlugError] = useState<string>();
  const linksMap = useLinks((state) => state.links);
  const isLoading = useLinks((state) => state.isLoading);
  const createLink = useLinks((state) => state.createLink);
  const loadLinks = useLinks((state) => state.loadLinks);
  const deleteLink = useLinks((state) => state.deleteLink);

  const links = Array.from(linksMap.values());
  const hasLinks = links.length > 0;

  useEffect(() => {
    loadLinks().catch(console.error);
  }, [loadLinks]);

  // Listen for visit updates from other tabs
  useEffect(() => {
    const bc = new BroadcastChannel("visits");
    bc.onmessage = (event) => {
      const visitSlug = event.data as string;
      useLinks.getState().incrementAccessCount(visitSlug);
    };
    return () => bc.close();
  }, []);

  const handleSaveLink = async () => {
    // clear previous errors
    setOriginalUrlError(undefined);
    setSlugError(undefined);

    // prepare URL with protocol
    const fullOriginalUrl = originalUrl.startsWith("http")
      ? originalUrl
      : `https://${originalUrl}`;

    // validate using zod schema
    const result = linkInputSchema.safeParse({
      originalUrl: fullOriginalUrl,
      slug,
    });
    if (!result.success) {
      result.error.issues.forEach((issue: ZodIssue) => {
        if (issue.path[0] === "originalUrl") {
          setOriginalUrlError(issue.message);
        }
        if (issue.path[0] === "slug") {
          setSlugError(issue.message);
        }
      });
      return;
    }

    // all good, proceed with creation
    console.log("handleSaveLink:", result.data);
    try {
      await createLink(result.data.originalUrl, result.data.slug);
      setOriginalUrl("");
      setSlug("");
    } catch (err) {
      console.error("Error saving link:", err);
      alert("Erro ao salvar link");
    }
  };

  const handleExportCsv = async () => {
    try {
      const url = await exportShortens();
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Erro ao exportar CSV");
    }
  };

  return (
    <div className="min-h-screen bg-gray-scale-200 flex items-start md:items-center justify-center p-4">
      <div className="bg-gray-scale-100 w-full max-w-6xl rounded-xl p-6">
        <div className="flex justify-center mb-6">
          <Logo className="h-8 text-blue-base" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 flex flex-col">
            <h2 className="text-lg font-bold text-gray-scale-600 mb-4">
              Novo link
            </h2>

            <div className="space-y-4">
              <Input
                label="LINK ORIGINAL"
                placeholder="www.exemplo.com.br"
                value={originalUrl}
                onChange={(e) => {
                  setOriginalUrl(e.target.value);
                  if (originalUrlError) setOriginalUrlError(undefined);
                }}
                state={originalUrlError ? "error" : "default"}
                error={originalUrlError}
              />

              <Input
                label="LINK ENCURTADO"
                prefix="brev.ly/"
                placeholder="meu-link"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.replace(/\s+/g, ""));
                  if (slugError) setSlugError(undefined);
                }}
                state={slugError ? "error" : "default"}
                error={slugError}
              />

              <Button
                onClick={handleSaveLink}
                className="mt-4 w-full"
                disabled={!isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar link"}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 flex flex-col">
            {isLoading && (
              <div className="w-full h-1 mb-2 overflow-hidden rounded bg-gray-scale-200">
                <div className="w-full h-full animate-pulse bg-blue-base" />
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-scale-600">
                Meus links
              </h2>
              <Button
                variant="secondary"
                leftIcon={<DownloadSimple size={16} />}
                onClick={handleExportCsv}
              >
                Baixar CSV
              </Button>
            </div>

            {hasLinks ? (
              <div className="space-y-4 overflow-y-auto max-h-80 pr-1">
                {links.map((link) => {
                  const linkSlug = link.shortUrl.split("/").pop() ?? link.id;
                  const friendlyUrl = `${window.location.host}/${linkSlug}`;

                  return (
                    <div
                      key={linkSlug}
                      className="border-b pb-2 flex items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <a
                          href={`/${linkSlug}`}
                          className="font-medium text-blue-base hover:underline break-all"
                        >
                          {friendlyUrl}
                        </a>
                        <div className="text-sm text-gray-scale-500 truncate">
                          {link.originalUrl.replace(/^https?:\/\//, "https://")}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-xs text-gray-scale-500 whitespace-nowrap mr-4">
                          {link.accessCount} acessos
                        </span>
                        <Button
                          type="button"
                          variant="icon"
                          className="text-gray-scale-600 hover:text-blue-base"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `https://${friendlyUrl}`
                            )
                          }
                          leftIcon={<Copy size={16} />}
                        >
                          {/* Icon is now passed via leftIcon */}
                        </Button>
                        <Button
                          type="button"
                          variant="icon"
                          leftIcon={<Trash size={16} />}
                          className="text-gray-scale-600 hover:border-error"
                          onClick={() => deleteLink(linkSlug)}
                        />
                      </div>
                    </div>
                  );
                })}
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
