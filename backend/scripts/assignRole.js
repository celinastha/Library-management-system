const admin = require('../utils/FirebaseConfig/firebaseConfig');

// Assign a role to a user by UID
async function setRole(uid, role, cardId = null) {
  const claims = { role };
  //if (cardId) claims.cardId = cardId; // optional for borrowers

  await admin.auth().setCustomUserClaims(uid, claims);
  console.log(`Assigned role ${role} to user ${uid}`);
  process.exit(0);
}

// Example usage: assign librarian role
setRole('FIREBASE_USER_UID', 'librarian'); // paste or type user firebases UID in place of  FIREBASE_USER_UID

// Example usage: assign borrower role with cardId
// setRole('FIREBASE_USER_UID', 'borrower', 'ID000123'); // paste or type user firebases UID in place of  FIREBASE_USER_UID