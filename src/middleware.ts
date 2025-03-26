import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
const authpaths = ["/login","/signup"]
const privatePath = ["/cart","/create-product","/coin","/account","/account-order","/account-password","/auction-list","/my-request"]


export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    console.log(pathname)
    const token = request.cookies.get("token");
    console.log("Token o day nay")

    console.log(token)
    if(privatePath.some(path => pathname.startsWith(path)) && !token){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if(authpaths.some(path => pathname.startsWith(path)) && token){
        return NextResponse.redirect(new URL('/', request.url))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login","/signup","/cart","/create-product","/coin","/account","/account-order","/account-password","/auction-list","/my-request"]
}