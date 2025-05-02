import { NextResponse } from 'next/server';
import * as jwt from 'jose';

const protectedAdminRoutes = ['/api/events', '/api/events/:path*'];
const publicRoutes = ['/api/auth/login', '/api/v1/public/:path*']; // Routes publiques, comme la connexion
const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET),
};

export async function middleware(req: any) {
  const urlPath = req.nextUrl.pathname;

  // Handle CORS OPTIONS requests
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }

  // Allow public routes without authentication
  if (publicRoutes.some((route) => urlPath.startsWith(route))) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (protectedAdminRoutes.some((route) => urlPath.startsWith(route))) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return unauthorizedResponse('No token provided');
    }

    try {
      const { payload } = await jwt.jwtVerify(token, jwtConfig.secret);
      if (!payload.adminId) {
        return unauthorizedResponse('Invalid token payload');
      }

      // Attach adminId to request for use in routes
      (req as any).adminId = payload.adminId;
      return NextResponse.next();
    } catch (error) {
      console.error('Error on authorization:', error);
      return unauthorizedResponse('Invalid or expired token');
    }
  }

  // Allow other routes (if any) to proceed
  return NextResponse.next();
}

// Réponse d'autorisation refusée avec CORS
function unauthorizedResponse(message: string) {
    return NextResponse.json(
      { message, success: false },
      {
        status: 401,
        headers: corsHeaders(),
      }
    );
  }
  
  // Gérer les requêtes OPTIONS pour CORS
  function handleOptions() {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }
  
  // En-têtes CORS communs
  function corsHeaders() {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-token",
    };
  }
  
  // Limiter le middleware aux chemins commençant par `/api/`
  export const config = {
    matcher: "/api/:path*",
  };
  