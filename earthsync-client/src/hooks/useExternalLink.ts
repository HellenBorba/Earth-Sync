// src/hooks/useExternalLink.ts
export function useExternalLink() {
  function openExternalLink(url?: string) {
    if (!url) {
      console.error("URL inválida ao tentar abrir link externo.");
      return;
    }
    // abrir em nova aba com segurança
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return { openExternalLink };
}
