let htmlContent = "";
try {
  // 尝试 1：寻找同级目录
  htmlContent = await Deno.readTextFile(new URL("./index.html", import.meta.url));
} catch (e) {
  try {
    // 尝试 2：寻找上一级目录（应对 main.ts 被放到了 src 文件夹里的情况）
    htmlContent = await Deno.readTextFile(new URL("../index_cloud.html", import.meta.url));
  } catch (e2) {
    try {
      // 尝试 3：直接从根目录找
      htmlContent = await Deno.readTextFile("index.html");
    } catch (e3) {
      console.error("依然找不到 index.html，请检查 GitHub 仓库里的文件位置！");
      htmlContent = "<h1>Error: index.html not found</h1>";
    }
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === 'GET' && url.pathname === '/') {
    return new Response(htmlContent, { 
      headers: { 'Content-Type': 'text/html; charset=utf-8' } 
    });
  }

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
      return new Response(data, { let htmlContent = "";
try {
  // 尝试 1：寻找同级目录
  htmlContent = await Deno.readTextFile(new URL("./index.html", import.meta.url));
} catch (e) {
  try {
    // 尝试 2：寻找上一级目录（应对 main.ts 被放到了 src 文件夹里的情况）
    htmlContent = await Deno.readTextFile(new URL("../index.html", import.meta.url));
  } catch (e2) {
    try {
      // 尝试 3：直接从根目录找
      htmlContent = await Deno.readTextFile("index_cloud.html");
    } catch (e3) {
      console.error("依然找不到 index.html，请检查 GitHub 仓库里的文件位置！");
      htmlContent = "<h1>Error: index.html not found</h1>";
    }
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === 'GET' && url.pathname === '/') {
    return new Response(htmlContent, { 
      headers: { 'Content-Type': 'text/html; charset=utf-8' } 
    });
  }

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