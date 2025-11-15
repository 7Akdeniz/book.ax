/**
 * Development Logger für bessere Fehlerausgabe
 */

const isDevelopment = process.env.NODE_ENV === 'development';

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

interface LogOptions {
  context?: string;
  data?: any;
  stack?: string;
}

const colors = {
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[35m',   // Magenta
  success: '\x1b[32m', // Green
  reset: '\x1b[0m',
};

const icons = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  debug: '🔍',
  success: '✅',
};

function formatLog(level: LogLevel, message: string, options?: LogOptions) {
  if (!isDevelopment) {
    // In production, nur console.log ohne Farben
    console.log(JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      ...options,
    }));
    return;
  }

  const color = colors[level];
  const icon = icons[level];
  const timestamp = new Date().toLocaleTimeString('de-DE');
  
  console.log(
    `${color}${icon} [${timestamp}]${colors.reset}`,
    `${color}${message}${colors.reset}`
  );

  if (options?.context) {
    console.log(`${color}   Context:${colors.reset}`, options.context);
  }

  if (options?.data) {
    console.log(`${color}   Data:${colors.reset}`);
    console.dir(options.data, { depth: null, colors: true });
  }

  if (options?.stack) {
    console.log(`${color}   Stack:${colors.reset}`);
    console.log(options.stack);
  }
}

export const logger = {
  info: (message: string, options?: LogOptions) => {
    formatLog('info', message, options);
  },

  warn: (message: string, options?: LogOptions) => {
    formatLog('warn', message, options);
  },

  error: (message: string, error?: Error | unknown, options?: LogOptions) => {
    const errorOptions: LogOptions = {
      ...options,
    };

    if (error instanceof Error) {
      errorOptions.data = {
        name: error.name,
        message: error.message,
        ...(options?.data || {}),
      };
      errorOptions.stack = error.stack;
    } else if (error) {
      errorOptions.data = {
        error,
        ...(options?.data || {}),
      };
    }

    formatLog('error', message, errorOptions);
  },

  debug: (message: string, options?: LogOptions) => {
    if (isDevelopment) {
      formatLog('debug', message, options);
    }
  },

  success: (message: string, options?: LogOptions) => {
    formatLog('success', message, options);
  },

  // API Request Logger
  request: (method: string, url: string, data?: any) => {
    if (isDevelopment) {
      console.log(
        `${colors.info}➡️  [${method}]${colors.reset}`,
        url
      );
      if (data) {
        console.log(`${colors.info}   Body:${colors.reset}`);
        console.dir(data, { depth: null, colors: true });
      }
    }
  },

  // API Response Logger
  response: (method: string, url: string, status: number, data?: any) => {
    if (isDevelopment) {
      const isError = status >= 400;
      const color = isError ? colors.error : colors.success;
      const icon = isError ? '❌' : '✅';
      
      console.log(
        `${color}${icon} [${status}] [${method}]${colors.reset}`,
        url
      );
      
      if (data && isError) {
        console.log(`${color}   Response:${colors.reset}`);
        console.dir(data, { depth: null, colors: true });
      }
    }
  },

  // Database Query Logger
  db: (operation: string, table: string, details?: any) => {
    if (isDevelopment) {
      console.log(
        `${colors.debug}🗄️  [DB ${operation}]${colors.reset}`,
        table
      );
      if (details) {
        console.dir(details, { depth: null, colors: true });
      }
    }
  },
};

// Unhandled rejection handler für bessere Fehlerausgabe
if (isDevelopment) {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', reason as Error, {
      context: 'Unhandled Promise Rejection',
      data: { promise },
    });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error, {
      context: 'Uncaught Exception - Server will exit',
    });
    process.exit(1);
  });
}
