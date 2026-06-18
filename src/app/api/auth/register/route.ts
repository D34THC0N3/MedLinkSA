import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const roleFiles: Record<string, string> = {
  patient: 'patients.json',
  provider: 'doctors.json',
  facility: 'hospitals.json',
  pharmacy: 'pharmacies.json',
  admin: 'admins.json',
};

const signupRoles = ['patient', 'provider', 'facility', 'pharmacy'];

interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  verified: boolean;
  createdAt: string;
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const targetRole = role || 'patient';
    if (!signupRoles.includes(targetRole)) {
      return NextResponse.json({ error: 'Invalid role selection' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data', 'users');
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

    const filePath = path.join(dataDir, roleFiles[targetRole]);

    let users: UserRecord[] = [];
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      users = JSON.parse(content);
      const exists = users.find(u => u.email === email);
      if (exists) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
      }
    }

    const newUser: UserRecord = {
      id: `${targetRole[0]}${Date.now()}`,
      name,
      email,
      password,
      role: targetRole,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeFileSync(filePath, JSON.stringify(users, null, 2));

    const { password: _, ...safeUser } = newUser;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
