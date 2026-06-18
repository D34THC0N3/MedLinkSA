import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const DEV_PASSWORD = '123456';

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
    const { email, password, role: requestedRole } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data', 'users');
    let foundUser: UserRecord | null = null;
    let foundRole = '';

    for (const [role, filename] of Object.entries(roleFiles)) {
      const filePath = path.join(dataDir, filename);
      if (!existsSync(filePath)) continue;
      const content = readFileSync(filePath, 'utf-8');
      const users: UserRecord[] = JSON.parse(content);
      const user = users.find((u: UserRecord) => u.email === email);

      if (user) {
        if (user.password !== password) {
          return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
        }
        foundUser = user;
        foundRole = role;
        break;
      }
    }

    if (!foundUser) {
      return NextResponse.json({ error: 'Account not found. Please check your email or create a new account.' }, { status: 404 });
    }

    if (requestedRole && requestedRole !== foundRole) {
      const roleLabels: Record<string, string> = {
        patient: 'Patient', provider: 'Doctor', facility: 'Hospital',
        pharmacy: 'Pharmacy', admin: 'Admin',
      };
      return NextResponse.json({
        error: `This account is registered as ${roleLabels[foundRole] || foundRole}. Please select the correct role.`,
      }, { status: 403 });
    }

    const { password: _, auth: __, ...safeUser } = foundUser;
    return NextResponse.json({ user: { ...safeUser, role: foundRole } });
  } catch {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
