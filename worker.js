export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      // 优先从打包好的静态资源目录 dist 中获取文件
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  },
};
