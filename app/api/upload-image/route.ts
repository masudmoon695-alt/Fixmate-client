import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image || typeof image === 'string') {
      return NextResponse.json({ error: 'No image file received' }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Image upload is not configured' }, { status: 500 });
    }

    const uploadForm = new FormData();
    uploadForm.append('key', apiKey);
    uploadForm.append('image', image);

    const res = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: uploadForm,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.success) {
      return NextResponse.json({ error: json?.error?.message || 'ImgBB upload failed' }, { status: 502 });
    }

    const url = json?.data?.url;
    if (!url) {
      return NextResponse.json({ error: 'ImgBB did not return an image URL' }, { status: 502 });
    }

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
