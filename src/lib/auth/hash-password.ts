// CLI utility: npx tsx src/lib/auth/hash-password.ts <your-password>
import { hash } from 'bcryptjs';

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: npx tsx src/lib/auth/hash-password.ts <password>');
    process.exit(1);
  }
  const hashed = await hash(password, 12);
  console.log('\nAdd this to your .env.local:\n');
  console.log(`DASHBOARD_PASSWORD_HASH=${hashed}`);
}

main();
