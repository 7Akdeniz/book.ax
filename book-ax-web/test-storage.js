/**
 * Test Supabase Storage Connection from Vercel
 * Run: node test-storage.js
 */

const https = require('https');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_KEY';

console.log('🧪 Testing Supabase Storage Connection...\n');
console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
console.log(`🔑 Service Key: ${SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY.substring(0, 20) + '...' : 'NOT SET'}\n`);

// Test 1: List buckets
console.log('Test 1: List Storage Buckets');
console.log('─'.repeat(50));

const url = `${SUPABASE_URL}/storage/v1/bucket`;
const options = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
    },
};

const req = https.request(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        
        try {
            const json = JSON.parse(data);
            console.log('\n✅ Buckets found:');
            json.forEach(bucket => {
                console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
            });
            
            const mediaBucket = json.find(b => b.name === 'media');
            if (mediaBucket) {
                console.log('\n✅ "media" bucket exists!');
                console.log(JSON.stringify(mediaBucket, null, 2));
            } else {
                console.log('\n❌ "media" bucket NOT found!');
            }
        } catch (e) {
            console.log('❌ Error parsing response:', e.message);
            console.log('Response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
});

req.end();
