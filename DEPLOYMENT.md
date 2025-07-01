# NotePad Deployment Guide

## 🚀 Live Demo

Your NotePad app has been successfully deployed to GitHub! You can access it at:

**GitHub Repository**: [https://github.com/Vicmoou/Bookshelfy](https://github.com/Vicmoou/Bookshelfy)

## 📋 Deployment Options

### 1. GitHub Pages (Recommended)

To deploy your app using GitHub Pages:

1. Go to your repository on GitHub: `https://github.com/Vicmoou/Bookshelfy`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Choose **master** branch and **/ (root)** folder
6. Click **Save**
7. Your app will be available at: `https://vicmoou.github.io/Bookshelfy/`

### 2. Netlify (Alternative)

1. Visit [netlify.com](https://netlify.com)
2. Click **"New site from Git"**
3. Connect your GitHub account
4. Select the `Bookshelfy` repository
5. Set build command to: **(leave empty)**
6. Set publish directory to: **/** (root)
7. Click **Deploy site**

### 3. Vercel (Alternative)

1. Visit [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. No build configuration needed
5. Click **Deploy**

## 🛠️ Local Development

To run the app locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/Vicmoou/Bookshelfy.git
   cd Bookshelfy
   ```

2. Start a local server:
   ```bash
   # Using Python
   python3 -m http.server 8080
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8080
   ```

3. Open [http://localhost:8080](http://localhost:8080) in your browser

## ✨ Features Included

- ✏️ **Rich Note Editor**: Create and edit notes with auto-save
- 🔍 **Smart Search**: Search through titles, content, and tags
- 🏷️ **Tag System**: Organize notes with custom tags
- 🌙 **Dark/Light Theme**: Toggle between themes
- 📱 **Responsive Design**: Works on all devices
- 💾 **Local Storage**: Notes persist in browser
- 📊 **Statistics**: Track your note count
- ⌨️ **Keyboard Shortcuts**: 
  - `Ctrl+N`: New note
  - `Ctrl+S`: Save note
  - `Ctrl+/`: Focus search
  - `Escape`: Close modals
- 📤 **Export Function**: Download notes as JSON

## 🔧 Technical Details

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser localStorage API
- **Icons**: Font Awesome 6.4.0
- **No dependencies**: Works without build tools
- **Cross-browser**: Compatible with modern browsers

## 📝 Usage Instructions

1. **Creating Notes**: Click "New Note" or use `Ctrl+N`
2. **Editing**: Click on any note to edit
3. **Tags**: Add comma-separated tags for organization
4. **Search**: Type in the search box to filter notes
5. **Themes**: Click the moon/sun icon to toggle themes
6. **Export**: Click "Export" to download all notes
7. **Delete**: Click the delete button in the editor

## 🔒 Privacy & Security

- All notes are stored locally in your browser
- No data is sent to external servers
- Export function allows you to backup your data
- Clear browser data will remove all notes

## 🎨 Customization

The app uses CSS custom properties for easy theming. You can modify colors in `styles.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #f093fb;
    /* ... other variables */
}
```

## 📱 Progressive Web App (Optional)

To make this a PWA, add a `manifest.json` and service worker. The current implementation focuses on core functionality.

---

**Enjoy your new note-taking app!** 🎉