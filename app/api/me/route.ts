import { NextResponse } from 'next/server';
import axios from 'axios';
import axiosInstance from '@/app/plugins/axios';

type BackendMeResponse = {
  user?: unknown;
  message?: string;
};

function getApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API_BASE_URL is not configured');
  }

  return baseUrl.replace(/\/+$/, '');
}

export async function GET(req: Request) {
  try {
    const token = req.headers
      .get('cookie')
      ?.match(/(?:^|; )access_token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }

    const apiBaseUrl = getApiBaseUrl();
    const backendRes = await axiosInstance.get<BackendMeResponse>(`${apiBaseUrl}/api/auth/me`, {
      headers: {
        Accept: 'application/json',
      },
    });
    const data = backendRes.data;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = (error.response?.data as BackendMeResponse) ?? {};
      return NextResponse.json(
        { message: data.message ?? 'Gagal mengambil data user' },
        { status: error.response?.status ?? 500 }
      );
    }

    console.error('Me proxy error:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
