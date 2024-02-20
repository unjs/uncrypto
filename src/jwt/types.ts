/** Recognized JWT Claims Set members */
export interface JWTRegisteredClaims {
  /**
   * JWT Issuer
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1 RFC7519#section-4.1.1}
   */
  iss?: string;

  /**
   * JWT Subject
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2 RFC7519#section-4.1.2}
   */
  sub?: string;

  /**
   * JWT Audience
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3 RFC7519#section-4.1.3}
   */
  aud?: string | string[];

  /**
   * JWT ID
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7 RFC7519#section-4.1.7}
   */
  jti?: string;

  /**
   * JWT Not Before
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5 RFC7519#section-4.1.5}
   */
  nbf?: number;

  /**
   * JWT Expiration Time
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4 RFC7519#section-4.1.4}
   */
  exp?: number;

  /**
   * JWT Issued At
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6 RFC7519#section-4.1.6}
   */
  iat?: number;
}

export interface SignJWTOptions<T extends Record<string, unknown>> {
  payload?: T;
  secret: string;
  issuer: string;
  audience: string;
  /**
   * Expiration time in days
   * @default 30
   */
  expires?: number;
  /** @default 'HMAC' */
  signatureMethod?: string;
  /** @default 'SHA-256' */
  hashMethod?: string;
}

export interface VerifyJWTOptions {
  token: string;
  secret: string;
  issuer: string;
  audience: string;
  /** @default 60 */
  leeway?: number;
  /** @default 'HMAC' */
  signatureMethod?: string;
  /** @default 'SHA-256' */
  hashMethod?: string;
}
