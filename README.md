# Your Name — Engineering Portfolio

A dark, sleek multi-page portfolio for a Mechanical Engineer specializing in robotics, mechanical design, and electronics.

## 📁 File Structure

```
portfolio/
├── index.html          ← Landing page (all sections)
├── css/
│   ├── style.css       ← Main stylesheet
│   └── pages.css       ← Projects & Blog page styles
├── js/
│   └── main.js         ← Animations, nav, interactions
└── pages/
    ├── projects.html   ← Full projects page with filter
    └── blog.html       ← Blog listing with sidebar
```

## 🚀 Deploying to GitHub Pages

### Step 1 — Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click **New Repository**
3. Name it: `yourusername.github.io` (replace with your actual GitHub username)
4. Set it to **Public**
5. Click **Create repository**

### Step 2 — Upload Your Files
**Option A — GitHub Web UI (easiest):**
1. Open your new repository
2. Click **Add file → Upload files**
3. Drag in the entire `portfolio/` folder contents (all files and subfolders)
4. Click **Commit changes**

**Option B — Git CLI:**
```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repository **Settings**
2. Scroll to **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**

### Step 4 — Visit Your Site
Your site will be live at:
`https://yourusername.github.io`

(Takes 1–3 minutes to deploy on first publish)

---

## ✏️ Customizing Your Portfolio

### Personal Info
Search and replace these placeholders across all HTML files:
- `Your Name` → Your actual name
- `YN` → Your initials
- `your@email.com` → Your email
- `yourusername` → Your GitHub username
- `yourprofile` → Your LinkedIn profile URL
- `Nairobi, Kenya` → Your location

### Adding Projects
In `pages/projects.html`, copy a `.project-full-card` block and update:
- The emoji in `.project-full-thumb`
- `data-category` attribute (for filtering): `robotics`, `mechanical`, `electronics`, `software`
- Title, description, highlights, and stack badges

### Adding Blog Posts
In `pages/blog.html`, copy a `.blog-post-card` block and update the category, date, title, and excerpt.

### Your Photo
Replace the placeholder in `index.html`:
```html
<!-- Find this block: -->
<div class="about-image-placeholder">...</div>

<!-- Replace with: -->
<img src="assets/photo.jpg" alt="Your Name" style="width:100%; display:block;" />
```
Add your photo to the `assets/` folder.

### Colors
Edit `css/style.css` `:root` variables:
```css
--accent: #00e5ff;    /* Cyan — primary accent */
--accent2: #7fff6e;   /* Green — secondary accent */
--accent3: #ff6b35;   /* Orange — tertiary accent */
```

---

## 🌐 Custom Domain (Optional)
1. Buy a domain (e.g., `yourname.dev`)
2. In GitHub Pages settings, enter your custom domain
3. Add a `CNAME` file to your repo root with just: `yourname.dev`
4. Update DNS at your domain registrar to point to GitHub Pages

---

Built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no build tools.
