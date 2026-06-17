import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const roleFiles: Record<string, string> = {
  patient: 'patients.json',
  provider: 'doctors.json',
  facility: 'hospitals.json',
  pharmacy: 'pharmacies.json',
  admin: 'admins.json',
};

interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  verified?: boolean;
  auth?: string;
  specialty?: string;
}

export async function POST(req: Request) {
  try {
    const { email, password, auth } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data', 'users');

    for (const [role, filename] of Object.entries(roleFiles)) {
      const filePath = path.join(dataDir, filename);
      if (!existsSync(filePath)) continue;
      const content = readFileSync(filePath, 'utf-8');
      const users: UserRecord[] = JSON.parse(content);
      const user = users.find((u: UserRecord) => u.email === email && u.password === password);
      if (user) {
        if (role === 'admin' && user.auth && user.auth !== auth) {
          return NextResponse.json({ error: 'Invalid auth code' }, { status: 401 });
        }
        const { password: _, auth: __, ...safeUser } = user;
        return NextResponse.json({ user: { ...safeUser, role } });
      }
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
