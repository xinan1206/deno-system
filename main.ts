// 读取同目录下的 index.html
const htmlContent = await Deno.readTextFile(new URL("./index.html", import.meta.url));

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 1. 如果访问首页，返回网页
  if (req.method === 'GET' && url.pathname === '/') {
    return new Response(htmlContent, { 
      headers: { 'Content-Type': 'text/html; charset=utf-8' } 
    });
  }

  // 2. 如果前端请求 AI 代理，转发给 DeepSeek
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

  // 其他路径返回 404
  return new Response('Not Found', { status: 404 });
});