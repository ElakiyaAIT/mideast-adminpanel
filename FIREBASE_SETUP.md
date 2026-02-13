# Firebase Setup Instructions

## Quick Setup

1. **Get Firebase Configuration:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (or create a new one)
   - Click the gear icon ⚙️ > **Project Settings**
   - Scroll down to **Your apps** section
   - Click the **Web** icon (`</>`) to add a web app (if you haven't already)
   - Copy the configuration values

2. **Create `.env` file in the `frontend` directory:**

   Create a file named `.env` in the `frontend` folder with the following content:

   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id

   # API Base URL
   VITE_API_BASE_URL=http://localhost:4000/v1
   ```

3. **Replace the placeholder values** with your actual Firebase configuration values from step 1.

4. **Enable Google Sign In in Firebase:**
   - In Firebase Console, go to **Authentication** > **Sign-in method**
   - Click on **Google** provider
   - Enable it and save
   - Add your project's support email if prompted

5. **Restart your dev server:**
   ```bash
   cd frontend
   pnpm dev
   ```

## Example Firebase Config

Your Firebase config object will look something like this:

```javascript
{
  apiKey: "AIzaSyC...",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project-id",
  storageBucket: "my-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}
```

Copy each value to the corresponding `VITE_FIREBASE_*` variable in your `.env` file.

## Troubleshooting

### "Invalid API Key" Error

- Make sure your `.env` file is in the `frontend` directory
- Verify all `VITE_FIREBASE_*` variables are set correctly
- Restart your dev server after creating/updating `.env`
- Check that there are no extra spaces or quotes around the values

### "Firebase: Error (auth/unauthorized-domain)"

- Go to Firebase Console > Authentication > Settings > Authorized domains
- Add `localhost` to the authorized domains list

### Environment Variables Not Loading

- Make sure variable names start with `VITE_` (required for Vite)
- Restart the dev server after changing `.env` file
- Check that `.env` file is in the `frontend` directory (not in root)
