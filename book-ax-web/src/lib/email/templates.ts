/**
 * Email Templates für Book.ax
 * Responsive HTML Emails mit Inline CSS
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://book.ax';
const APP_NAME = 'Book.ax';

interface BaseTemplateProps {
  title: string;
  content: string;
  preheader?: string;
}

/**
 * Base Email Template (Wrapper für alle Emails)
 */
function baseTemplate({ title, content, preheader }: BaseTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}
  
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ${APP_NAME}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                ${APP_NAME} - Ihre Hotel-Buchungsplattform
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Book.ax. Alle Rechte vorbehalten.
              </p>
              <div style="margin-top: 20px;">
                <a href="${APP_URL}/de/help" style="color: #0066cc; text-decoration: none; font-size: 12px; margin: 0 10px;">Hilfe</a>
                <a href="${APP_URL}/de/privacy" style="color: #0066cc; text-decoration: none; font-size: 12px; margin: 0 10px;">Datenschutz</a>
                <a href="${APP_URL}/de/terms" style="color: #0066cc; text-decoration: none; font-size: 12px; margin: 0 10px;">AGB</a>
              </div>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Button Component für Emails
 */
function emailButton(text: string, url: string): string {
  return `
    <table role="presentation" style="margin: 30px 0;">
      <tr>
        <td>
          <a href="${url}" style="display: inline-block; padding: 14px 40px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Verification Email Template
 */
export interface VerificationEmailProps {
  firstName: string;
  verificationUrl: string;
}

export function verificationEmail({ firstName, verificationUrl }: VerificationEmailProps): string {
  const content = `
    <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px;">
      Willkommen bei ${APP_NAME}! 👋
    </h2>
    
    <p style="margin: 0 0 15px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hallo ${firstName},
    </p>
    
    <p style="margin: 0 0 15px; color: #374151; font-size: 16px; line-height: 1.6;">
      vielen Dank für deine Registrierung bei <strong>${APP_NAME}</strong>! 
      Um dein Konto zu aktivieren, bestätige bitte deine E-Mail-Adresse.
    </p>
    
    ${emailButton('E-Mail-Adresse bestätigen', verificationUrl)}
    
    <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:<br>
      <a href="${verificationUrl}" style="color: #0066cc; word-break: break-all;">${verificationUrl}</a>
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
        <strong>Hinweis:</strong> Dieser Link ist 24 Stunden gültig. 
        Falls du dich nicht registriert hast, ignoriere diese E-Mail einfach.
      </p>
    </div>
  `;

  return baseTemplate({
    title: 'E-Mail-Adresse bestätigen',
    content,
    preheader: `Bestätige deine E-Mail-Adresse bei ${APP_NAME}`,
  });
}

/**
 * Welcome Email (nach erfolgreicher Verification)
 */
export interface WelcomeEmailProps {
  firstName: string;
  role: 'guest' | 'hotelier';
}

export function welcomeEmail({ firstName, role }: WelcomeEmailProps): string {
  const isHotelier = role === 'hotelier';
  
  const content = `
    <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px;">
      Dein Konto ist aktiviert! 🎉
    </h2>
    
    <p style="margin: 0 0 15px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hallo ${firstName},
    </p>
    
    <p style="margin: 0 0 15px; color: #374151; font-size: 16px; line-height: 1.6;">
      deine E-Mail-Adresse wurde erfolgreich bestätigt. 
      ${isHotelier 
        ? 'Du kannst jetzt dein Hotelier-Dashboard nutzen und deine Hotels verwalten!' 
        : 'Du kannst jetzt mit der Hotelsuche beginnen und deine erste Buchung vornehmen!'
      }
    </p>
    
    ${emailButton(
      isHotelier ? 'Zum Dashboard' : 'Hotels suchen',
      isHotelier ? `${APP_URL}/de/panel` : `${APP_URL}/de/search`
    )}
    
    ${isHotelier ? `
      <div style="margin-top: 30px; padding: 20px; background-color: #f0f9ff; border-left: 4px solid #0066cc; border-radius: 4px;">
        <p style="margin: 0 0 10px; color: #1e40af; font-size: 14px; font-weight: 600;">
          🎁 Hotelier-Vorteile:
        </p>
        <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
          <li>Vollständiges PMS (Property Management System)</li>
          <li>Channel Manager für OTAs</li>
          <li>AI Revenue Management</li>
          <li>0€ monatliche Kosten</li>
          <li>Nur 10-50% Provision pro Buchung</li>
        </ul>
      </div>
    ` : ''}
  `;

  return baseTemplate({
    title: 'Willkommen bei Book.ax!',
    content,
    preheader: 'Dein Konto ist jetzt aktiv',
  });
}

/**
 * Password Reset Email
 */
export interface PasswordResetEmailProps {
  firstName: string;
  resetUrl: string;
}

export function passwordResetEmail({ firstName, resetUrl }: PasswordResetEmailProps): string {
  const content = `
    <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px;">
      Passwort zurücksetzen 🔐
    </h2>
    
    <p style="margin: 0 0 15px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hallo ${firstName},
    </p>
    
    <p style="margin: 0 0 15px; color: #374151; font-size: 16px; line-height: 1.6;">
      du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt. 
      Klicke auf den folgenden Button, um ein neues Passwort zu vergeben:
    </p>
    
    ${emailButton('Neues Passwort vergeben', resetUrl)}
    
    <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:<br>
      <a href="${resetUrl}" style="color: #0066cc; word-break: break-all;">${resetUrl}</a>
    </p>
    
    <div style="margin-top: 30px; padding: 20px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px;">
      <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.5;">
        <strong>Wichtig:</strong> Dieser Link ist nur 1 Stunde gültig. 
        Falls du keine Passwort-Änderung angefordert hast, ignoriere diese E-Mail. 
        Dein Passwort bleibt dann unverändert.
      </p>
    </div>
  `;

  return baseTemplate({
    title: 'Passwort zurücksetzen',
    content,
    preheader: 'Setze dein Passwort zurück',
  });
}

/**
 * Booking Confirmation Email
 */
export interface BookingConfirmationEmailProps {
  firstName: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  bookingReference: string;
  totalAmount: string;
  bookingUrl: string;
}

export function bookingConfirmationEmail(props: BookingConfirmationEmailProps): string {
  const content = `
    <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px;">
      Buchungsbestätigung ✅
    </h2>
    
    <p style="margin: 0 0 15px; color: #374151; font-size: 16px; line-height: 1.6;">
      Hallo ${props.firstName},
    </p>
    
    <p style="margin: 0 0 15px; color: #374151; font-size: 16px; line-height: 1.6;">
      deine Buchung wurde bestätigt! Wir freuen uns auf deinen Aufenthalt.
    </p>
    
    <div style="margin: 25px 0; padding: 20px; background-color: #f9fafb; border-radius: 6px;">
      <h3 style="margin: 0 0 15px; color: #111827; font-size: 18px;">${props.hotelName}</h3>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Check-in:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${props.checkIn}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Check-out:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${props.checkOut}</td>
        </tr>
        <tr style="border-top: 1px solid #e5e7eb;">
          <td style="padding: 12px 0 0; color: #6b7280; font-size: 14px;">Buchungsnummer:</td>
          <td style="padding: 12px 0 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${props.bookingReference}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Gesamtbetrag:</td>
          <td style="padding: 8px 0; color: #0066cc; font-size: 18px; font-weight: bold; text-align: right;">${props.totalAmount}</td>
        </tr>
      </table>
    </div>
    
    ${emailButton('Buchung ansehen', props.bookingUrl)}
    
    <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Bei Fragen zu deiner Buchung, kontaktiere uns gerne unter 
      <a href="mailto:support@book.ax" style="color: #0066cc;">support@book.ax</a>
    </p>
  `;

  return baseTemplate({
    title: 'Buchungsbestätigung',
    content,
    preheader: `Deine Buchung bei ${props.hotelName} ist bestätigt`,
  });
}
