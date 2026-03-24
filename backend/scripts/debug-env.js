import 'dotenv/config';

console.log('ENV DATABASE_URL exists:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    console.log('URL length:', url.length);
    console.log('URL start:', url.substring(0, 20)); // Only show start
    // Check for weird characters
    const hasSpecial = /[\r\n]/.test(url);
    console.log('Contains newline/carriage return:', hasSpecial);
} else {
    console.log('DATABASE_URL IS UNDEFINED');
}
