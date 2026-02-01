import { OAuth2Client, TokenPayload } from 'google-auth-library';

// Singleton instance of OAuth2Client
let client: OAuth2Client;

function getGoogleClient() {
  if (!client) {
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return client;
}

export async function verifyGoogleToken(idToken: string): Promise<TokenPayload | undefined> {
  try {
    const client = getGoogleClient();
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
    return undefined;
  }
}