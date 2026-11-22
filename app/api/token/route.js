import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return NextResponse.json({ token });
}
