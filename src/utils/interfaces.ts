export interface TokenPayload {
  sub: number;
  type: 'access' | 'refresh';
  role: Roles;
  iat?: any;
  exp?: any;
}
export type Roles = 'admin' | 'common';
export interface Order {
  itemId: number;
  quantity: number;
}
export interface Denied_Order extends Order {
  reason: string;
}
