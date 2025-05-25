import { auth, db } from '../src/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

async function setupAdmin() {
  try {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    // Check if admin user already exists
    const adminDoc = await getDoc(doc(db, 'users', 'admin'));
    if (adminDoc.exists()) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );

    // Create admin user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      username: 'admin',
      email: adminEmail,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin user:', error);
    process.exit(1);
  }
}

setupAdmin(); 