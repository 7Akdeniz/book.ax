// Custom Error Classes

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'You do not have permission to perform this action') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, 429);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(message || `External service error: ${service}`, 502);
  }
}

// Error handler for API routes
export const handleApiError = (error: unknown): { error: string; status: number } => {
  if (error instanceof AppError) {
    return {
      error: error.message,
      status: error.statusCode,
    };
  }

  if (error instanceof Error) {
    // Log unexpected errors
    console.error('Unexpected error:', error);
    
    return {
      error: 'An unexpected error occurred',
      status: 500,
    };
  }

  return {
    error: 'An unknown error occurred',
    status: 500,
  };
};

// Error response handler for Next.js API routes (returns NextResponse)
export const handleApiErrorResponse = (error: unknown) => {
  const { error: message, status } = handleApiError(error);
  
  const NextResponse = require('next/server').NextResponse;
  
  return NextResponse.json(
    { error: message },
    { status }
  );
};

// Format error for client response
export const formatErrorResponse = (error: unknown) => {
  const { error: message, status } = handleApiError(error);
  
  return {
    error: message,
    status,
    timestamp: new Date().toISOString(),
  };
};

// Validation error formatter
export const formatValidationErrors = (errors: any[]): string => {
  return errors.map(err => err.message).join(', ');
};

// Check if error is operational (safe to send to client)
export const isOperationalError = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

// Database error handler
export const handleDatabaseError = (error: any): AppError => {
  // PostgreSQL error codes
  if (error.code === '23505') {
    return new ConflictError('A record with this data already exists');
  }
  
  if (error.code === '23503') {
    return new ValidationError('Referenced record does not exist');
  }
  
  if (error.code === '23502') {
    return new ValidationError('Required field is missing');
  }

  // Supabase specific errors
  if (error.message?.includes('JWT')) {
    return new AuthenticationError('Invalid or expired token');
  }

  console.error('Database error:', error);
  return new AppError('Database operation failed', 500, false);
};

// Async error wrapper for API routes
export const asyncHandler = (fn: Function) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw error;
    }
  };
};

// Error logger
export const logError = (error: unknown, context?: Record<string, any>) => {
  const timestamp = new Date().toISOString();
  
  console.error({
    timestamp,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    context,
  });

  // In production, send to error tracking service (Sentry, etc.)
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorTracking(error, context);
  }
};
