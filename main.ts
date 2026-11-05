Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 1. 如果访问首页，读取并返回网页
  if (req.method === 'GET' && url.pathname === '/') {
    try {
      // 尝试找同级
      const html = await Deno.readTextFile(new URL("./index.html", import.meta.url));
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    } catch (e) {
      try {
        // 尝试找上一级（防止 main.ts 放进了子文件夹）
        const html = await Deno.readTextFile(new URL("../index.html", import.meta.url));
        return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      } catch (e2) {
        return new Response(`<h1>报错：找不到 index.html 文件</h1><p>请检查 GitHub 仓库里的文件名是否叫 index.html，并且和 main.ts 放在同一个目录下。</p>`, { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    }
  }

  // 2. 代理 AI 请求
  if (req.method === 'POST' && url.pathname === '/api/proxy') {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    
    try {
      const body = await req.json();
      const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
      
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