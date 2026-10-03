import assert from "node:assert/strict"
import { afterEach, test } from "node:test"
import { NextRequest } from "next/server"
import { proxy } from "../proxy"

const originalEnvironment = process.env.NODE_ENV
afterEach(() => {
  if (originalEnvironment === undefined) Reflect.deleteProperty(process.env, "NODE_ENV")
  else Object.assign(process.env, { NODE_ENV: originalEnvironment })
})

function pageResponse(environment: string) {
  Object.assign(process.env, { NODE_ENV: environment })
  return proxy(new NextRequest("http://localhost:3000/events"))
}

test("development scripts and styles can run without forcing localhost to HTTPS", () => {
  const response = pageResponse("development")
  const policy = response.headers.get("Content-Security-Policy")!
  assert.match(policy, /script-src [^;]*'unsafe-eval'/)
  assert.match(policy, /style-src 'self' 'unsafe-inline'/)
  assert.doesNotMatch(policy, /upgrade-insecure-requests/)
})

test("production retains strict script and style policies with a fresh shared nonce", () => {
  const response = pageResponse("production")
  const policy = response.headers.get("Content-Security-Policy")!
  const nonce = response.headers.get("x-middleware-request-x-nonce")!
  assert.ok(nonce)
  assert.ok(policy.includes(`script-src 'self' 'nonce-${nonce}'`))
  assert.ok(policy.includes(`style-src 'self' 'nonce-${nonce}'`))
  assert.doesNotMatch(policy, /unsafe-eval/)
  assert.match(policy, /upgrade-insecure-requests/)
  assert.equal(response.headers.get("x-middleware-request-content-security-policy"), policy)
  assert.notEqual(pageResponse("production").headers.get("x-middleware-request-x-nonce"), nonce)
})
