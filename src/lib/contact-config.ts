/**
 * True when every variable the contact form needs is set. Read on the server
 * only; `/` is prerendered, so set them in Vercel before the build. Previews
 * and local dev usually leave them unset and show the "not connected" state.
 */
export function contactConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL);
}
