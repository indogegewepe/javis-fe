import { NextResponse } from 'next/server';
import axios from 'axios';
import axiosInstance from '@/app/plugins/axios';

type LoginBody = {
  identifier?: string;
  email?: string;
  username?: string;
  password?: string;
};

type BackendLoginResponse = {
  access_token?: string;
  token?: string;
  message?: string;
  attemptsRemaining?: number;
  resetTime?: string | number;
};

function getApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API_BASE_URL is not configured');
  }

  return baseUrl.replace(/\/+$/, '');
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    const apiBaseUrl = getApiBaseUrl();

    const backendRes = await axiosInstance.post<BackendLoginResponse>(
      `${apiBaseUrl}/api/auth/login`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    const data = backendRes.data;

    const token = data.access_token ?? data.token;
    if (!token) {
      return NextResponse.json(
        { message: 'Token tidak ditemukan dari backend' },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: data.message ?? 'Login berhasil',
    });

    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        (error.response?.data as BackendLoginResponse) ?? { message: 'Login gagal' },
        { status: error.response?.status ?? 500 }
      );
    }

    console.error('Login proxy error:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
