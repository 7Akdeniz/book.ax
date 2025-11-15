import nodemailer from 'nodemailer';
import { logger } from '@/lib/logger';

/**
 * Email Transporter für lokale Entwicklung (Mailhog) und Production (SMTP)
 */

const isDevelopment = process.env.NODE_ENV === 'development';

// Mailhog für lokale Entwicklung (127.0.0.1:1025)
const createTransporter = () => {
  const config = {
    host: process.env.MAILER_HOST || '127.0.0.1',
    port: parseInt(process.env.MAILER_PORT || '1025'),
    secure: false, // Mailhog nutzt kein TLS
    auth: process.env.MAILER_PASSWORD ? {
      user: process.env.MAILER_USERNAME || 'user',
      pass: process.env.MAILER_PASSWORD || '',
    } : undefined,
    tls: {
      rejectUnauthorized: false, // Für lokale Entwicklung
    },
  };

  if (isDevelopment) {
    logger.info('Email Transporter initialized', {
      context: 'Mailer',
      data: {
        host: config.host,
        port: config.port,
        mailhogUI: 'http://127.0.0.1:8025',
      },
    });
  }

  return nodemailer.createTransport(config);
};

const transporter = createTransporter();

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

/**
 * Email senden (via Mailhog lokal, SMTP in Production)
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    const from = options.from || 
      `${process.env.MAILER_FROM_NAME || 'Book.ax'} <${process.env.MAILER_FROM || 'noreply@book.ax'}>`;

    logger.info(`Sending email to: ${options.to}`, {
      context: 'Email Service',
      data: {
        to: options.to,
        subject: options.subject,
        from,
      },
    });

    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html),
      replyTo: options.replyTo,
    });

    if (isDevelopment) {
      logger.success('Email sent successfully! 📧', {
        context: 'Email Service',
        data: {
          messageId: info.messageId,
          to: options.to,
          subject: options.subject,
          viewInMailhog: 'http://127.0.0.1:8025',
        },
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧  Email wurde an Mailhog gesendet!');
      console.log('🌐  Öffne: http://127.0.0.1:8025');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    return true;
  } catch (error) {
    logger.error('Failed to send email', error as Error, {
      context: 'Email Service',
      data: {
        to: options.to,
        subject: options.subject,
      },
    });
    return false;
  }
}

/**
 * Strip HTML Tags für Text-Version
 */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>.*<\/style>/gm, '')
    .replace(/<[^>]+>/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Teste Email-Connection (optional für Health Checks)
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    logger.success('Email connection verified', {
      context: 'Mailer',
    });
    return true;
  } catch (error) {
    logger.error('Email connection failed', error as Error, {
      context: 'Mailer',
    });
    return false;
  }
}
