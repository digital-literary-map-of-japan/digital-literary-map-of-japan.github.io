// Viteのパス処理バグを回避するためのプラグイン
export default function fixVitePath() {
  return {
    name: 'fix-vite-path',
    enforce: 'pre',
    resolveId(id) {
      // client.mjs/ のようなパスを修正
      if (id.endsWith('.mjs/')) {
        return id.slice(0, -1);
      }
      if (id.endsWith('.js/')) {
        return id.slice(0, -1);
      }
      return null;
    },
    load(id) {
      // ファイルパスの末尾のスラッシュを削除
      if (id.endsWith('/') && !id.endsWith('node_modules/')) {
        const cleanId = id.slice(0, -1);
        if (cleanId.endsWith('.mjs') || cleanId.endsWith('.js')) {
          return this.load(cleanId);
        }
      }
      return null;
    }
  };
}