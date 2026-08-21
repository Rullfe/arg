export default {
  async fetch(request, env, ctx) {
    const reqUrl = new URL(request.url);

    if (reqUrl.pathname !== "/api/verify") {
      return Response.json({ success: false, msg: "404 资源不存在" }, { status: 404 });
    }
    if (request.method.toUpperCase() !== "POST") {
      return Response.json({ success: false, msg: "仅支持POST请求" }, { status: 405 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch (err) {
      return Response.json({ success: false, msg: "请求解析失败" });
    }

    const inputToken = (payload.token ?? "").trim().toLowerCase();
    const kvContent = await env.arg_use_emm.get(inputToken);

    if (!kvContent) {
      return Response.json({
        success: false,
        msg: "令牌无效。ERR_0x8001：拒绝访问"
      });
    }

    return Response.json({
      success: true,
      msg: "令牌校验通过，正在读取受限数据……",
      content: kvContent
    });
  }
};
