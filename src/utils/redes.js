export const REDES_SOCIAIS = [
  "Instagram",
  "YouTube",
  "TikTok",
  "Facebook",
  "X",
  "Threads",
  "BlueSky",
  "Twitch",
  "Linktree",
  "IMDB",
  "Site",
].map((r) => ({ value: r, label: r }));

export const REDE_PLACEHOLDER = {
  Instagram: "Ex: philippemaiasuper",
  YouTube: "Ex: mutanocharles",
  TikTok: "Ex: philippemaiasuper",
  Facebook: "Ex: Dubladiando",
  X: "Ex: charles_weasley",
  Threads: "Ex: philippemaiasuper",
  BlueSky: "Ex: charlesweasley",
  Twitch: "Ex: DubladiandoTv",
  Linktree: "Ex: charles_weasley",
  IMDB: "Ex: nm0256459",
  Site: "Ex: https://www.cameo.fun",
};

export function gerarUrlRede(tipo, usuario) {
  if (!usuario?.trim()) return null;
  const h = usuario.trim();
  switch (tipo) {
    case "Instagram": return `https://www.instagram.com/${h}`;
    case "YouTube":   return `https://www.youtube.com/${h}`;
    case "TikTok":    return `https://www.tiktok.com/@${h}`;
    case "Facebook":  return `https://www.facebook.com/${h}`;
    case "X":         return `https://x.com/${h}`;
    case "Threads":   return `https://www.threads.net/@${h}`;
    case "BlueSky":   return `https://bsky.app/profile/${h.includes(".") ? h : h + ".bsky.social"}`;
    case "Twitch":    return `https://www.twitch.tv/${h}`;
    case "Linktree":  return `https://linktr.ee/${h}`;
    case "IMDB":      return `https://www.imdb.com/name/${h}`;
    case "Site":      return h;
    default:          return h;
  }
}