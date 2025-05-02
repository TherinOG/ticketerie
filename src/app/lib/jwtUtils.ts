import ms from 'ms';

export function convertJwtExpirationToSeconds(jwtExpiration: string): number | null {
  try {
    const expiresInMilliseconds = ms(jwtExpiration as ms.StringValue);
    const expiresInSeconds = Math.floor(expiresInMilliseconds / 1000);
    return expiresInSeconds;
  } catch (error) {
    console.error("Invalid JWT_EXPIRATION format:", error);
    return null;
  }
}