export type EmbedInfo =
  | { provider: 'youtube'; id: string; embedUrl: string; thumbnail: string }
  | { provider: 'vimeo'; id: string; embedUrl: string; thumbnail: string }
  | null;

export function parseVideoUrl(url: string | undefined): EmbedInfo {
  if (!url) return null;

  // YouTube : youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) {
    const id = yt[1];
    return {
      provider: 'youtube',
      id,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  // Vimeo : vimeo.com/ID
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    const id = vimeo[1];
    return {
      provider: 'vimeo',
      id,
      embedUrl: `https://player.vimeo.com/video/${id}`,
      thumbnail: '', // Vimeo ne fournit pas de thumbnail public sans API
    };
  }

  return null;
}