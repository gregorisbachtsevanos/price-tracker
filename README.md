# 🧴 SuppWise

A cross-platform mobile application built with **React Native** and **Supabase** to help users **track and manage their supplement intake**, set **reminders**, and monitor **consistency over time**.

## 📱 Features

- ✅ **Track supplements** (name, dosage, frequency)
- 🔔 **Reminders** with push notifications for each supplement
- 📊 **Daily & Weekly Intake Logs**
- 🔒 **Authentication** via Supabase (email/password, social providers)
- ☁️ **Cloud Sync** for supplement data using Supabase database
- 🧠 **Smart Suggestions** for optimal intake times (coming soon)
- 🌗 Dark Mode support

## 🛠️ Tech Stack

- **React Native** (Expo or CLI)
- **Supabase** (Auth + Database)
- **TypeScript**
- **React Navigation**
- **AsyncStorage** (for local caching)
- **Push Notifications** (Expo or Firebase)

## ⚙️ Setup Instructions

1. **Clone the repository:**

```
git clone https://github.com/gregorisbachtsevanos/SuppWise.git
cd SuppWise
```

2. Install dependencies:

```
npm install
```

3. Configure Supabase:

- Create a project at supabase.com
- Copy your project URL and anon public key
- Create a .env file and add:

```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
```

4. Start the app:

```
npx expo start
# or with React Native CLI
npx react-native run-android
npx react-native run-ios
```

***If using Expo, make sure to install the Expo Go app on your device.***

## 📦 Folder Structure

├── /src\
│──├── /components       # UI Components\
│──├── /screens          # App Screens\
│──├── /services         # Supabase client and helpers\
│──├── /utils            # Utilities & helpers\
│──└── /hooks            # Custom hooks\
├── App.tsx               # Entry point\
└── .env                  # Environment variables\
