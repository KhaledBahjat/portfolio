const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs, setDoc } = require('firebase/firestore');
const { getStorage, ref, uploadString, getDownloadURL, deleteObject } = require('firebase/storage');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function diagnostic() {
  console.log('🚀 Starting Firebase Diagnostic...');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Storage Bucket:', firebaseConfig.storageBucket);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    console.log('\n--- Testing Firestore ---');
    console.log('Attempting to read "settings/main" (should be public)...');
    const settingsRef = doc(db, 'settings', 'main');
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      console.log('✅ Success: Settings document found.');
      console.log('Data:', JSON.stringify(settingsSnap.data(), null, 2));
    } else {
      console.log('ℹ️ Info: Settings document does not exist yet.');
    }

    console.log('\nAttempting to write a test document to "settings/test_diag"...');
    const testRef = doc(db, 'settings', 'test_diag');
    await setDoc(testRef, { timestamp: new Date().toISOString(), diag: true });
    console.log('✅ Success: Write permission confirmed for "settings" collection.');

    console.log('\n--- Testing Storage ---');
    console.log('Bucket:', firebaseConfig.storageBucket);
    const storage = getStorage(app);
    const storageRef = ref(storage, 'projects/test_diag.txt');
    
    console.log('Attempting to upload a test file...');
    await uploadString(storageRef, 'Diagnostic test ' + new Date().toISOString());
    console.log('✅ Success: Upload confirmed.');

    const downloadUrl = await getDownloadURL(storageRef);
    console.log('✅ Success: Download URL retrieved:', downloadUrl);

    console.log('Cleaning up test file...');
    await deleteObject(storageRef);
    console.log('✅ Success: Test file deleted.');

  } catch (error) {
    console.error('\n❌ Error:', error.code, '-', error.message);
    if (error.code?.includes('storage')) {
      console.error('👉 Storage Error detected. If Firestore worked but this failed, check if Storage is "Started" in Firebase Console.');
    }
  }

  console.log('\n--- End of Diagnostic ---');
}

// Check if dependencies are okay
try {
  diagnostic();
} catch (e) {
  console.error('Error starting diagnostic:', e);
}
