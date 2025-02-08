async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // 处理根路径，返回HTML页面
  if (url.pathname === "/" && request.method === "GET") {
    const html = await Deno.readTextFile("./dist/index.html");
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  }

  // 处理静态资源
  try {
    const extension = url.pathname.split(".").pop() || "";
    const contentType = {
      "js": "application/javascript",
      "css": "text/css",
      "png": "image/png",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "gif": "image/gif",
      "svg": "image/svg+xml",
    }[extension] || "text/plain";

    // 修改文件读取路径，统一从 dist 目录读取
    const file = await Deno.readFile(`./dist${url.pathname}`);
    return new Response(file, {
      headers: { "content-type": contentType },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

Deno.serve(handleRequest);
