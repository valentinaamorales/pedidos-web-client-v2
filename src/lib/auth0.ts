import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.APP_BASE_URL,
  secret: process.env.AUTH0_SECRET,
  authorizationParameters: {
    scope: 'openid profile email offline_access',
    audience: process.env.AUTH0_API_AUDIENCE,
  },
  routes: {
    callback: '/auth/callback',
    login: '/auth/login',
    logoutRedirect: '/',
  },
});
