// ============================================================
//  BLOG POST — All content comes from data.js posts array.
//  To write a post, add/edit the post entry in data.js.
//  For full article body, code, and images — see CONTENT-GUIDE.md
// ============================================================

(() => {
  const params = new URLSearchParams(window.location.search);
  const idx    = parseInt(params.get('id') ?? '0', 10);
  const D      = typeof PORTFOLIO !== 'undefined' ? PORTFOLIO : null;
  const post   = D ? D.posts[idx] : null;

  if (!post) return;

  // ── HEAD ────────────────────────────────────────────────
  document.title = `${post.title} — ${D.name}`;

  // ── HERO ────────────────────────────────────────────────
  document.getElementById('post-category').textContent = post.category;
  document.getElementById('post-title').textContent    = post.title;

  document.getElementById('post-meta').innerHTML = `
    <span class="meta-badge">${post.date}</span>
    <span class="meta-badge">${post.readTime}</span>
    <span class="meta-badge">${post.category}</span>
  `;

  // ── COVER IMAGE ─────────────────────────────────────────
  // Add coverImage: '../assets/img/blog0/cover.jpg' to the post in data.js
  if (post.coverImage) {
    const cover = document.getElementById('post-cover');
    cover.style.display = 'block';
    document.getElementById('post-cover-img').src = post.coverImage;
    document.getElementById('post-cover-img').alt = post.title;
  }

  // ── ARTICLE BODY ────────────────────────────────────────
  // Add body: ['<p>Paragraph one</p>', '<h2>Section</h2>', '<p>More text</p>']
  // to the post in data.js. Supports full HTML including h2, h3, ul, ol,
  // blockquote, strong, em, hr, and inline <code>.
  // If no body is set, the excerpt is shown as a placeholder.
  const bodyEl = document.getElementById('post-body');
  if (post.body && post.body.length > 0) {
    bodyEl.innerHTML = post.body.join('\n');
  } else {
    bodyEl.innerHTML = `
      <p>${post.excerpt}</p>
      <p style="color:var(--text3); font-family:var(--font-mono); font-size:0.75rem;">
        Add a <code>body</code> array to this post in data.js to write the full article.
        See CONTENT-GUIDE.md for instructions.
      </p>`;
  }

  // ── CODE BLOCK ──────────────────────────────────────────
  // Add codeSnippet: { filename, lang, content } to the post in data.js
  if (post.codeSnippet) {
    document.getElementById('section-code').style.display = 'flex';
    const codeEl    = document.getElementById('ide-code');
    const lineNums  = document.getElementById('ide-line-nums');
    document.getElementById('ide-filename').textContent = post.codeSnippet.filename;

    const escaped = post.codeSnippet.content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    codeEl.className = `language-${post.codeSnippet.lang}`;
    codeEl.innerHTML = escaped;

    const lines = post.codeSnippet.content.split('\n').length;
    lineNums.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');

    if (window.Prism) Prism.highlightElement(codeEl);
  }

  // ── IMAGE GALLERY ───────────────────────────────────────
  // Add images: ['../assets/img/blog0/photo1.jpg', '...'] to the post in data.js
  if (post.images && post.images.length > 0) {
    document.getElementById('section-media').style.display = 'flex';
    document.getElementById('media-grid').innerHTML = post.images.map(src => `
      <div class="media-item">
        <img src="${src}" alt="${post.title}" loading="lazy" />
      </div>`).join('');
  }

  // ── SIDEBAR ─────────────────────────────────────────────
  document.getElementById('sidebar-info').innerHTML = `
    <div class="info-row">
      <span class="info-key">Category</span>
      <span class="info-val">${post.category}</span>
    </div>
    <div class="info-row">
      <span class="info-key">Date</span>
      <span class="info-val">${post.date}</span>
    </div>
    <div class="info-row">
      <span class="info-key">Read time</span>
      <span class="info-val">${post.readTime}</span>
    </div>
  `;

  // ── RELATED POSTS ───────────────────────────────────────
  const related = D.posts
    .map((p, i) => ({ ...p, i }))
    .filter(p => p.i !== idx)
    .slice(0, 4);

  document.getElementById('related-posts').innerHTML = related.map(p => `
    <a href="blog-post.html?id=${p.i}" class="related-post">
      <div class="related-post-title">${p.title}</div>
      <div class="related-post-meta">${p.category} · ${p.date}</div>
    </a>`).join('');

})();

// ── COPY CODE BUTTON ────────────────────────────────────────
document.getElementById('btn-copy-code')?.addEventListener('click', function() {
  const code = document.getElementById('ide-code')?.textContent || '';
  navigator.clipboard.writeText(code).then(() => {
    this.textContent = '✓ Copied';
    this.classList.add('copied');
    setTimeout(() => {
      this.textContent = '⧉ Copy';
      this.classList.remove('copied');
    }, 2000);
  });
});