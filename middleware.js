import CryptoJS from 'crypto-js';
import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export function middleware(request) {
  if (!BOT_TOKEN) {
    console.error('Missing TELEGRAM_BOT_TOKEN in environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const initData = request.headers.get('initdata');

  if (!initData) {
    console.log('Missing initData');
    return NextResponse.json({ error: 'Missing initData' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams(initData);
    const requiredFields = ['auth_date', 'user', 'hash'];
    for (const field of requiredFields) {
      if (!params.has(field)) {
        console.log('Missing field:', field);
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const userField = params.get('user');
    let userData;
    try {
      userData = JSON.parse(decodeURIComponent(userField));
    } catch (e) {
      return NextResponse.json({ error: 'Invalid user data format' }, { status: 400 });
    }

    const hash = params.get('hash');
    params.delete('hash');

    const dataCheckString = Array.from(params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n');

    let secretKey = CryptoJS.HmacSHA256(BOT_TOKEN, "WebAppData").toString(CryptoJS.enc.Hex);

    const checkHash = CryptoJS.HmacSHA256(dataCheckString, CryptoJS.enc.Hex.parse(secretKey)).toString(CryptoJS.enc.Hex);

    if (checkHash !== hash) {
      console.log('Invalid hash', userData);
      return NextResponse.json({ error: 'Invalid hash' }, { status: 401 });
    }

    const authDate = parseInt(params.get('auth_date'), 10);
    const currentTime = Math.floor(Date.now() / 1000);

    console.log('Auth date:', authDate, 'Current time:', currentTime);
    if (currentTime - authDate > 60 * 60 * 48) {
      console.log('Data is outdated:', currentTime, authDate);
      return NextResponse.json({ error: 'Data is outdated' }, { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Failed to parse or validate initData:', error);
    return NextResponse.json({ error: 'Failed to parse or validate initData', details: error.message }, { status: 400 });
  }
}

export const config = {
  matcher: [
    '/api/user/:path*',
  ],
};