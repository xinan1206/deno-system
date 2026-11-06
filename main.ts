Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 1. 处理网页访问
  if (req.method === 'GET' && url.pathname === '/') {
    try {
      const html = await Deno.readTextFile(new URL("./index.html", import.meta.url));
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    } catch (e) {
      try {
        const html = await Deno.readTextFile(new URL("../index.html", import.meta.url));
        return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      } catch (e2) {
        return new Response("找不到 index.html 文件，请检查 GitHub 仓库的文件名！", { status: 500 });
      }
    }
  }

  // 2. 处理 AI 代理请求
  if (req.method === 'POST' && url.pathname === '/api/proxy') {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    
    try {
      const body = await req.json();
      const apiKey = Deno.env.get('zhinengketangcloud');
      
      const resp = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });
      
      const data = await resp.text();
      return new Response(data, { 
        status: resp.status, 
        headers: { ...cors, 'Content-Type': 'application/json' } 
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500, 
        headers: { ...cors, 'Content-Type': 'application/json' } 
      });
    }
  }

  return new Response('Not Found', { status: 404 });
});
