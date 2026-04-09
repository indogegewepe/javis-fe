import { NextResponse } from 'next/server';
import axiosInstance from '@/app/plugins/axios';

function getApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API_BASE_URL is not configured');
  }

  return baseUrl.replace(/\/+$/, '');
}

export async function POST() {
  try {
    const apiBaseUrl = getApiBaseUrl();
    await axiosInstance.post(
      `${apiBaseUrl}/api/auth/logout`,
      {},
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Logout backend call failed:', error);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('access_token', '', {
    path: '/',
    maxAge: 0,
  });

  return response;
}
