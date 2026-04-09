import { NextResponse } from 'next/server';
import axios from 'axios';
import axiosInstance from '@/app/plugins/axios';
import type { LoginInput, BackendLoginResponse } from '@/app/types/auth';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginInput;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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
