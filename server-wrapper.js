const http = require("http")
const { spawn } = require("child_process")

const appPort = Number.parseInt(process.env.PORT || "3000", 10)
const publicPort = Number.parseInt(process.env.PUBLIC_PORT || "3000", 10)
const hostname = process.env.HOSTNAME || "0.0.0.0"

const child = spawn("node", ["server.js"], {
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: String(appPort),
    HOSTNAME: hostname,
  },
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    child.kill(signal)
  })
}

if (publicPort !== appPort) {
  const proxy = http.createServer((clientReq, clientRes) => {
    const upstreamReq = http.request(
      {
        hostname: "127.0.0.1",
        port: appPort,
        path: clientReq.url,
        method: clientReq.method,
        headers: clientReq.headers,
      },
      (upstreamRes) => {
        clientRes.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers)
        upstreamRes.pipe(clientRes)
      }
    )

    upstreamReq.on("error", () => {
      clientRes.writeHead(503, { "content-type": "text/plain" })
      clientRes.end("Service unavailable")
    })

    clientReq.pipe(upstreamReq)
  })

  proxy.listen(publicPort, hostname, () => {
    console.log(`Proxy listening on http://${hostname}:${publicPort}`)
  })
}
