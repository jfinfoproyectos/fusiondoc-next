import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // 1. Inmunidad inmediata para archivos estáticos y rutas internas/auth
  // Esto previene que el Proxy consulte la DB para cada imagen o script
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/static') ||
    url.pathname.startsWith('/signin') ||
    url.pathname.startsWith('/signup') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/access-denied') ||
    url.pathname.includes('.') // Archivos con extensión
  ) {
    return NextResponse.next();
  }
  
  // 2. Extracción de subdominio (ignorando el puerto en entorno local)
  const host = hostname.split(':')[0];
  const parts = host.split('.');
  
  // Identificar el proyecto (subdominio o primer segmento del path)
  let subdomain = parts.length > 1 ? parts[0] : '';
  if (subdomain === 'localhost' || subdomain === 'www' || subdomain === '127' || subdomain === '192') {
    subdomain = '';
  }

  const projectId = decodeURIComponent(subdomain || url.pathname.split('/')[1]);
  
  // Si no hay proyecto identificado (ej. root /), dejar pasar
  if (!projectId || projectId === '') {
    return NextResponse.next();
  }

  try {
    // 3. Verificación de Curso Público (Frontmatter)
    // Obtenemos los proyectos para saber si este es público
    const { getAvailableProjects } = await import('@/lib/github');
    const { projects } = await getAvailableProjects();
    const project = projects.find(p => p.id === projectId);
    
    // Si el proyecto es público, ignorar login y grupos
    if (project?.isPublic) {
      return NextResponse.next();
    }

    // 4. Verificación de Autenticación
    const session = await auth.api.getSession({ headers: request.headers }).catch(err => {
      console.error("[Proxy Auth Error]:", err.message);
      return null;
    });
    
    if (!session) {
      const callbackUrl = encodeURIComponent(url.pathname);
      return NextResponse.redirect(new URL(`/signin?callbackUrl=${callbackUrl}`, request.url));
    }

    // 5. Bypass para Administradores
    if (session.user.role === 'admin') {
      return NextResponse.next();
    }

    // 6. Verificación de Acceso por Grupo
    // Buscamos si el proyecto está protegido por algún grupo
    const grantingGroups = await prisma.group.findMany({
      where: { docFolders: { has: projectId } },
      select: { id: true },
    }).catch(err => {
      console.error("[Proxy DB Error - Groups]:", err.message);
      return []; 
    });

    const isProtected = grantingGroups.length > 0;

    if (isProtected) {
      // Si está protegido, verificar si el usuario es miembro APPROVED
      const groupIds = grantingGroups.map(g => g.id);
      const membership = await prisma.groupMembership.findFirst({
        where: {
          userId: session.user.id,
          groupId: { in: groupIds },
          status: "APPROVED"
        }
      }).catch(err => {
        console.error("[Proxy DB Error - Membership]:", err.message);
        return null;
      });

      if (!membership) {
         // El usuario no tiene permiso redirigimos a la UI de acceso denegado
         return NextResponse.rewrite(new URL(`/${projectId}/access-denied`, request.url));
      }
    }
  } catch (globalErr) {
    console.error("[Proxy Global Error]:", globalErr);
    // En caso de error catastrófico de DB, redirigir a una página de error o denegar
    // return NextResponse.redirect(new URL('/500', request.url));
  }

  // 5. Reescribir la URL si es necesario (modo multi-tenant)
  if (subdomain) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-project-id', subdomain);

    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}${url.search}`, request.url), {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default proxy;
