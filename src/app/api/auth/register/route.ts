import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
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
  verified: boolean;
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    if (!roleFiles[role]) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data', 'users');
    const filePath = path.join(dataDir, roleFiles[role]);

    let users: UserRecord[] = [];
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      users = JSON.parse(content);
      const exists = users.find(u => u.email === email);
      if (exists) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
    }

    const newUser: UserRecord = {
      id: `${role[0]}${Date.now()}`,
      name,
      email,
      password,
      role,
      verified: false,
    };

    users.push(newUser);
    writeFileSync(filePath, JSON.stringify(users, null, 2));

    const { password: _, ...safeUser } = newUser;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
