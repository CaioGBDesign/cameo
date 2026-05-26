export function checkPageAccess(config, { modoTesteKey, habilitadoKey, query }) {
  if (config[modoTesteKey] === true) {
    const token = process.env.PREVIEW_TOKEN;
    if (!token || query.preview !== token) return { notFound: true };
  } else if (config[habilitadoKey] === false) {
    return { notFound: true };
  }
  return null;
}