# 📝 Todo List App

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-FF6C37?style=for-the-badge&logo=convex&logoColor=white)

A modern, feature-rich Todo application built with React Native Expo and Convex backend.

[Features](#-features) • [Demo](#-demo--download) • [Installation](#-installation) • [Setup](#️-setup) • [Building](#-building) • [Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Features

- ✅ **Full CRUD Operations** - Create, Read, Update, and Delete todos
- 🎨 **Beautiful UI** - Light/dark theme toggle with smooth animations
- 📱 **Responsive Design** - Works on all screen sizes
- 🔄 **Real-time Sync** - Instant updates across all devices
- 🎯 **Smart Filtering** - Filter by All, Active, or Completed status
- 📝 **Rich Tasks** - Add descriptions and due dates
- 🔀 **Drag & Drop** - Reorder tasks with long press
- 💾 **Cloud Storage** - Persistent data with Convex backend
- ⚡ **Optimized** - Fast performance with optimistic updates

## 🎥 Demo & Download

<div align="center">

### 📱 Try the App Now!

[![Download APK & Demo](https://img.shields.io/badge/📦_Download_APK_&_Watch_Demo-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/18aVQ8hvJIPkDjMHYs1_YHCqFbQFkEujl?usp=sharing)

**Includes:**

**📹 Video demonstration of all features**

**📦 APK file ready to install on Android**

> **Note:** Download the APK and enable "Install from Unknown Sources" in your Android settings to install.

</div>

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native with Expo |
| **Backend** | Convex (Serverless) |
| **Language** | TypeScript |
| **UI** | React Native Core Components |
| **Icons** | Ionicons |
| **State** | Convex Real-time Queries |

## 📋 Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/blessing986/todo-list.git
cd todo-list
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Install Required Assets

Make sure you have the following files in the `assets/` folder:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024)
- `hero.jpg` (background image)

## ⚙️ Setup

### 🔧 Convex Backend Setup

#### Step 1: Install Convex

```bash
npm install convex
```

#### Step 2: Initialize Convex

```bash
npx convex dev
```

This creates a `convex` folder with your backend configuration.

#### Step 3: Login to Convex

```bash
npx convex login
```

Create a free account at [convex.dev](https://convex.dev).

#### Step 4: Deploy to Production

```bash
npx convex deploy
```

✅ **Copy the deployment URL** you receive (e.g., `https://your-deployment-url.convex.cloud`)

### 🌍 Environment Variables

#### Step 1: Create `.env` File

```bash
touch .env  # Mac/Linux
# or
type nul > .env  # Windows
```

#### Step 2: Add Your Convex URL

```env
EXPO_PUBLIC_CONVEX_URL=https://your-deployment-url.convex.cloud
```

#### Step 3: Verify `app.config.js`

Ensure your `app.config.js` has:

```javascript
export default {
  expo: {
    // ... other config
    extra: {
      convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL,
      eas: {
        projectId: "your-eas-project-id"
      }
    }
  }
};
```

## 🏃 Running the App

### Development Mode

```bash
# Start Expo dev server
npx expo start

# Or with cache cleared
npx expo start -c
```

Then choose your platform:
- Press **`a`** for Android emulator
- Press **`i`** for iOS simulator  
- Scan **QR code** with Expo Go app

### Web

```bash
npx expo start --web
```

## 📦 Building

### 🤖 Build APK (Android)

#### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

#### Step 2: Login to EAS

```bash
eas login
```

#### Step 3: Configure EAS

```bash
eas build:configure
```

Add the EAS project ID to your `app.config.js`:

```javascript
extra: {
  eas: {
    projectId: "ad002c86-1312-4539-ba45-1455814d1839"
  }
}
```

#### Step 4: Build APK

**Preview Build (for testing):**
```bash
eas build -p android --profile preview
```

**Production Build:**
```bash
eas build -p android --profile production
```

⏳ Build takes 10-20 minutes. You'll get a download link when ready.

📱 **Find your builds:** https://expo.dev/accounts/[your-account]/projects/[your-project]/builds

### 🍎 Build for iOS

```bash
eas build -p ios --profile production
```

> ⚠️ **Note:** Requires Apple Developer account ($99/year)

## 📁 Project Structure

```
mzb-todo-list/
├── 📂 assets/                  # Images and icons
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── hero.jpg
├── 📂 convex/                  # Backend code
│   ├── _generated/             # Auto-generated
│   ├── schema.ts               # Database schema
│   └── todos.ts                # CRUD functions
├── 📄 App.tsx                  # Main component
├── 📄 app.config.js            # Expo config
├── 📄 eas.json                 # Build config
├── 📄 package.json             # Dependencies
├── 📄 .env                     # Environment vars
└── 📄 README.md                # This file
```

## 🗄️ Database Schema

```typescript
// convex/schema.ts
{
  todos: {
    title: string,
    description?: string,
    dueDate?: string,
    completed: boolean,
    createdAt: string
  }
}
```

## 🔌 Convex Functions

Located in `convex/todos.ts`:

| Function | Type | Description |
|----------|------|-------------|
| `getTodos` | Query | Fetch all todos |
| `addTodo` | Mutation | Create new todo |
| `updateTodo` | Mutation | Update existing todo |
| `deleteTodo` | Mutation | Delete a todo |
| `toggleComplete` | Mutation | Toggle completion status |
| `clearCompleted` | Mutation | Delete all completed todos |

## 📜 Available Scripts

```bash
# Development
npm start                    # Start Expo dev server
npm start -- --reset-cache   # Start with cleared cache
npm run android             # Run on Android
npm run ios                 # Run on iOS
npm run web                 # Run on web

# Convex
npx convex dev              # Local development
npx convex deploy           # Deploy to production

# Building
eas build -p android --profile preview    # Build APK
eas build -p android --profile production # Production APK
eas build -p ios --profile production     # iOS build

# Utilities
npx expo-doctor             # Check for issues
```

## 🔐 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `EXPO_PUBLIC_CONVEX_URL` | ✅ Yes | Convex deployment URL | `https://xxx.convex.cloud` |

## 🐛 Troubleshooting

### ❌ WebSocket Connection Refused

**Problem:** `WebSocket closed with code 1006`

**Solution:**
```bash
# Deploy to production
npx convex deploy

# Update .env with production URL
EXPO_PUBLIC_CONVEX_URL=https://your-url.convex.cloud

# Restart Expo
npx expo start -c
```

### ❌ Todos Not Showing in Dashboard

**Problem:** Data not appearing in Convex dashboard

**Solutions:**
1. Check correct dashboard:
   - **Production:** https://dashboard.convex.dev
   - **Local:** http://127.0.0.1:6790
2. Verify URL matches in `.env`
3. Check console for errors

### ❌ Local Development URL Issues

**Problem:** Using `http://127.0.0.1:3212` doesn't work on device

**Solution:** Don't use `npx convex dev` for React Native. Use production deployment:
```bash
npx convex deploy
```

## 🔄 Development Workflow

**Steps:**
1. Make changes to your code
2. If you edited `convex/` functions:
   ```bash
   npx convex deploy
   ```
3. Test in your app (changes are instant)
4. Commit and push:
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```

## 📊 Convex Dashboard

Access your dashboard at: **https://dashboard.convex.dev**

Features:
- 📊 View data in real-time
- ✏️ Edit records manually
- 🧪 Test functions with custom inputs
- 📈 Monitor logs and performance
- 🚀 Manage deployments

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - React Native framework
- [Convex](https://convex.dev/) - Backend infrastructure
- [Ionicons](https://ionic.io/ionicons) - Icon library

## 👨‍💻 Author

**Blessing Ubiomor**

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️

</div>
