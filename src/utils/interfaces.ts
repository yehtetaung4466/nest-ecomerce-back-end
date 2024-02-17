export interface TokenPayload {
  sub: number;
  type: 'access' | 'refresh';
  iat?: any;
  exp?: any;
}
export interface Order {
  itemId: number;
  quantity: number;
}
export interface Denied_Order extends Order {
  reason: string;
}
