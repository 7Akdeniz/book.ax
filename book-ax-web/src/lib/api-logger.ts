import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * API Route Wrapper mit automatischem Logging
 */
export function withLogging(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const method = req.method;
    const url = req.url;
    const startTime = Date.now();

    // Log Request
    if (isDevelopment) {
      logger.request(method, url);
      
      // Log Request Body für POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
          const body = await req.clone().json();
          // Verstecke sensitive Daten
          const sanitizedBody = sanitizeBody(body);
          console.log('📦 Request Body:', sanitizedBody);
        } catch {
          // Kein JSON Body
        }
      }
    }

    try {
      // Execute Handler
      const response = await handler(req);
      const duration = Date.now() - startTime;
      
      // Log Response
      if (isDevelopment) {
        const status = response.status;
        logger.response(method, url, status);
        console.log(`⏱️  Duration: ${duration}ms`);
        
        // Log Response Body bei Errors
        if (status >= 400) {
          try {
            const responseClone = response.clone();
            const body = await responseClone.json();
            console.log('📦 Response Body:', body);
          } catch {
            // Kein JSON Response
          }
        }
      }

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log Error
      if (isDevelopment) {
        logger.error(`API Error in ${method} ${url}`, error as Error, {
          context: 'API Route Handler',
          data: { duration: `${duration}ms` },
        });
      }

      throw error;
    }
  };
}

/**
 * Sanitize Request Body - verstecke Passwörter, Tokens, etc.
 */
function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveKeys = [
    'password',
    'passwordHash',
    'password_hash',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey',
    'api_key',
    'creditCard',
    'cvv',
    'cardNumber',
  ];

  const sanitized = { ...body };

  for (const key in sanitized) {
    if (sensitiveKeys.some(sensitive => 
      key.toLowerCase().includes(sensitive.toLowerCase())
    )) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeBody(sanitized[key]);
    }
  }

  return sanitized;
}
