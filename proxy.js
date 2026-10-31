export { default } from 'next-auth/middleware'



export const config = { matcher: ['/beer', "/beer/:path", '/beer/search/:path', '/beer/search'] }