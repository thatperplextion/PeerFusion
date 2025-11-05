// Script to set up Supabase storage buckets
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file');
  console.log('Please set up your .env file with Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const buckets = [
  {
    name: 'avatars',
    public: true,
    fileSizeLimit: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  },
  {
    name: 'post-images',
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  },
  {
    name: 'documents',
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  },
  {
    name: 'attachments',
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: null // All types allowed
  }
];

async function setupStorageBuckets() {
  console.log('🗄️  Setting up Supabase storage buckets...\n');

  for (const bucket of buckets) {
    try {
      console.log(`Creating bucket: ${bucket.name}...`);
      
      // Check if bucket already exists
      const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error(`❌ Error listing buckets:`, listError.message);
        continue;
      }

      const bucketExists = existingBuckets.some(b => b.name === bucket.name);

      if (bucketExists) {
        console.log(`✅ Bucket '${bucket.name}' already exists`);
        
        // Update bucket settings
        const { data: updateData, error: updateError } = await supabase.storage.updateBucket(
          bucket.name,
          {
            public: bucket.public,
            fileSizeLimit: bucket.fileSizeLimit,
            allowedMimeTypes: bucket.allowedMimeTypes
          }
        );

        if (updateError) {
          console.log(`⚠️  Could not update bucket settings: ${updateError.message}`);
        } else {
          console.log(`✅ Updated bucket '${bucket.name}' settings`);
        }
      } else {
        // Create new bucket
        const { data, error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.public,
          fileSizeLimit: bucket.fileSizeLimit,
          allowedMimeTypes: bucket.allowedMimeTypes
        });

        if (error) {
          console.error(`❌ Error creating bucket '${bucket.name}':`, error.message);
        } else {
          console.log(`✅ Created bucket '${bucket.name}' successfully`);
        }
      }

      console.log(`   - Public: ${bucket.public}`);
      console.log(`   - Size limit: ${(bucket.fileSizeLimit / 1024 / 1024).toFixed(1)}MB`);
      console.log(`   - MIME types: ${bucket.allowedMimeTypes ? bucket.allowedMimeTypes.join(', ') : 'All types'}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Unexpected error with bucket '${bucket.name}':`, error.message);
    }
  }

  console.log('✅ Storage bucket setup complete!\n');
  console.log('📝 Next steps:');
  console.log('   1. Verify buckets in Supabase Dashboard > Storage');
  console.log('   2. Configure storage policies if needed');
  console.log('   3. Test file uploads using the storage utility\n');
}

setupStorageBuckets()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
