import { jwtVerify, SignJWT } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function signToken(payload: object) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET)
  return payload
}