import fs from 'fs';
import path from 'path';

const pub = path.resolve(process.cwd(), 'dist', 'public');
console.log('verifying build output at', pub);
if (!fs.existsSync(pub)) {
  console.error('ERROR: publish directory not found:', pub);
  // print dist contents for debugging
  const dist = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(dist)) {
    console.error('dist exists; listing contents:');
    const items = fs.readdirSync(dist);
    for (const it of items) console.error('-', it);
  } else {
    console.error('dist directory does not exist');
  }
  process.exit(1);
}
console.log('publish directory exists — OK');
process.exit(0);
