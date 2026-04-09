import { NextResponse } from 'next/server';
import axios from 'axios';
import axiosInstance from '@/app/plugins/axios';

import type { BackendMeResponse } from '@/app/types/auth';

export async function GET(req: Request) {
  try {
    const token = req.headers
      .get('cookie')
      ?.match(/(?:^|; )access_token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
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
