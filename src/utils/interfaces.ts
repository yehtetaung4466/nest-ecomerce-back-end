export interface TokenPayload {
  sub: number;
  type: 'access' | 'refresh';
  iat?: any;
  exp?: any;
}
