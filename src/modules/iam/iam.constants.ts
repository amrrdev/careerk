import type { CookieOptions } from 'express';

export const REQUEST_USER_KEY = 'user';
export const AUTH_TYPE_KEY = 'authType';
export const ROLES_KEY = 'roles';
export const REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
