rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{handle} {
      allow create: if request.auth != null && request.auth.token.handle == handle;
    }
  }
}
