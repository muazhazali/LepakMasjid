/**
 * Verify PocketBase Schema
 * 
 * This script verifies that PocketBase collections match the PRD schema
 * Run with: node scripts/verify-schema.js
 */

import PocketBase from 'pocketbase';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env.local') });
config({ path: join(__dirname, '../.env') });

const POCKETBASE_URL = process.env.VITE_POCKETBASE_URL || 'https://pb.muazhazali.me';

// Expected schema based on PRD
const EXPECTED_SCHEMA = {
  mosques: {
    name: 'text',
    name_bm: 'text',
    address: 'text',
    state: 'text',
    lat: 'number',
    lng: 'number',
    description: 'text',
    description_bm: 'text',
    status: 'text', // 'pending' | 'approved' | 'rejected'
    created_by: 'relation', // to users
  },
  amenities: {
    key: 'text',
    label_bm: 'text',
    label_en: 'text',
    icon: 'text',
    order: 'number',
  },
  mosque_amenities: {
    mosque_id: 'relation', // to mosques
    amenity_id: 'relation', // to amenities (nullable for custom)
    details: 'json', // MosqueAmenityDetails
    verified: 'bool',
  },
  activities: {
    mosque_id: 'relation', // to mosques
    title: 'text',
    title_bm: 'text',
    description: 'text',
    description_bm: 'text',
    type: 'text', // 'one_off' | 'recurring' | 'fixed'
    schedule_json: 'json', // ActivitySchedule
    start_date: 'date',
    end_date: 'date',
    status: 'text', // 'active' | 'cancelled'
    created_by: 'relation', // to users
  },
  submissions: {
    type: 'text', // 'new_mosque' | 'edit_mosque'
    mosque_id: 'relation', // to mosques (nullable for new_mosque)
    data: 'json', // Full mosque data
    status: 'text', // 'pending' | 'approved' | 'rejected'
    submitted_by: 'relation', // to users
    submitted_at: 'date',
    reviewed_by: 'relation', // to users (nullable)
    reviewed_at: 'date',
    rejection_reason: 'text',
  },
  audit_logs: {
    actor_id: 'relation', // to users
    action: 'text',
    entity_type: 'text',
    entity_id: 'text',
    before: 'json',
    after: 'json',
    timestamp: 'date',
    ip_address: 'text',
    user_agent: 'text',
  },
};

function checkField(field, expectedType) {
  const fieldType = field.type;
  
  // Map PocketBase types to our expected types
  const typeMap = {
    'text': 'text',
    'number': 'number',
    'bool': 'bool',
    'date': 'date',
    'json': 'json',
    'relation': 'relation',
    'select': 'text', // select is a text field with options
  };
  
  const normalizedType = typeMap[fieldType] || fieldType;
  return normalizedType === expectedType || 
         (expectedType === 'text' && (fieldType === 'select' || fieldType === 'email'));
}

function verifyCollection(collection, expectedFields) {
  const issues = [];
  const existingFields = {};
  
  collection.schema.forEach(field => {
    existingFields[field.name] = field;
  });
  
  // Check required fields
  Object.keys(expectedFields).forEach(fieldName => {
    if (!existingFields[fieldName]) {
      issues.push({
        type: 'missing',
        field: fieldName,
        expected: expectedFields[fieldName],
      });
    } else {
      const field = existingFields[fieldName];
      if (!checkField(field, expectedFields[fieldName])) {
        issues.push({
          type: 'type_mismatch',
          field: fieldName,
          expected: expectedFields[fieldName],
          actual: field.type,
        });
      }
    }
  });
  
  return issues;
}

async function verifySchema() {
  const pb = new PocketBase(POCKETBASE_URL);
  
  console.log('🔍 Verifying PocketBase Schema...\n');
  console.log(`📍 URL: ${POCKETBASE_URL}\n`);
  
  try {
    // Get all collections
    const collections = await pb.collections.getFullList();
    const collectionMap = {};
    collections.forEach(col => {
      collectionMap[col.name] = col;
    });
    
    let allPassed = true;
    
    // Verify each expected collection
    Object.keys(EXPECTED_SCHEMA).forEach(collectionName => {
      console.log(`\n📋 Checking collection: ${collectionName}`);
      
      if (!collectionMap[collectionName]) {
        console.log(`   ❌ Collection does not exist!`);
        allPassed = false;
        return;
      }
      
      const collection = collectionMap[collectionName];
      const expectedFields = EXPECTED_SCHEMA[collectionName];
      const issues = verifyCollection(collection, expectedFields);
      
      if (issues.length === 0) {
        console.log(`   ✅ Schema matches expected structure`);
      } else {
        console.log(`   ⚠️  Found ${issues.length} issue(s):`);
        issues.forEach(issue => {
          if (issue.type === 'missing') {
            console.log(`      - Missing field: ${issue.field} (expected: ${issue.expected})`);
          } else if (issue.type === 'type_mismatch') {
            console.log(`      - Type mismatch: ${issue.field} (expected: ${issue.expected}, actual: ${issue.actual})`);
          }
        });
        allPassed = false;
      }
    });
    
    // Check for extra collections
    const expectedNames = Object.keys(EXPECTED_SCHEMA);
    const extraCollections = collections
      .map(c => c.name)
      .filter(name => !expectedNames.includes(name) && name !== 'users');
    
    if (extraCollections.length > 0) {
      console.log(`\n📦 Extra collections found (not in PRD):`);
      extraCollections.forEach(name => {
        console.log(`   - ${name}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
      console.log('✅ All collections match the PRD schema!');
    } else {
      console.log('⚠️  Some collections need updates. See issues above.');
    }
    
    return { success: allPassed };
    
  } catch (error) {
    console.error('\n❌ Schema verification failed!');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    return { success: false, error: error.message };
  }
}

verifySchema()
  .then(result => {
    process.exit(result.success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });

