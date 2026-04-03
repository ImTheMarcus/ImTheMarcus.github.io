// ============================================================
//  RENDER — Reads PORTFOLIO data and builds the page.
//  You never need to edit this file.
// ============================================================

(() => {
  const D = PORTFOLIO;

  // ── Helpers ─────────────────────────────────────────────
  const el   = id => document.getElementById(id);
  const set  = (id, html) => { if (el(id)) el(id).innerHTML = html; };
  const text = (id, val)  => { if (el(id)) el(id).textContent = val; };

  // ── PAGE TITLE ──────────────────────────────────────────
  document.title = document.title.replace('Your Name', D.name);

  // ── NAV LOGO ────────────────────────────────────────────
  document.querySelectorAll('.nav-logo').forEach(l => {
    l.innerHTML = `${D.initials}<span>.eng</span>`;
  });

  // ── HERO NAME ───────────────────────────────────────────
  const nameParts = D.name.trim().split(' ');
  const firstName = nameParts[0];
  const lastName  = nameParts.slice(1).join(' ') || '';
  set('hero-name', `
    <span class="line">${firstName}</span>
    <span class="line"><span class="accent-word">${lastName}</span></span>
  `);

  // ── HERO DESC & STATS ────────────────────────────────────
  text('hero-desc', D.bio[0]);

  set('hero-stats', D.stats.map((s, i) => `
    <div class="stat-card reveal${i > 0 ? ` reveal-delay-${i}` : ''}">
      <div class="stat-number" data-count="${s.number}" data-suffix="${s.suffix}">${s.number}${s.suffix}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join(''));

  // ── ABOUT ───────────────────────────────────────────────
  text('about-tagline', D.tagline);
  set('about-bio', D.bio.map(p => `<p>${p}</p>`).join(''));
  set('about-tags', D.tags.map(t =>
    `<span class="tag${t.accent ? ' accent' : ''}">${t.label}</span>`
  ).join(''));

  // ── SKILLS ──────────────────────────────────────────────
  set('skills-grid', D.skills.map(cat => `
    <div class="skill-category">
      <div class="skill-cat-icon">${cat.icon}</div>
      <h3 class="skill-cat-title">${cat.title}</h3>
      <p class="skill-cat-subtitle">${cat.subtitle}</p>
      <ul class="skill-list">
        ${cat.items.map(item =>
          `<li>${item.name} <span class="skill-dot ${item.level}"></span></li>`
        ).join('')}
      </ul>
    </div>`).join(''));

  // ── PROJECTS PREVIEW (index — first 3) ──────────────────
  set('projects-preview', D.projects.slice(0, 3).map((p, i) => `
    <div class="project-card reveal${i > 0 ? ` reveal-delay-${i}` : ''}"
         onclick="window.location='pages/projects.html'">
      <div class="project-card-thumb">${p.emoji}</div>
      <div class="project-card-body">
        <p class="project-card-tag">${p.tag}</p>
        <h3 class="project-card-title">${p.title}</h3>
        <p class="project-card-desc">${p.desc}</p>
      </div>
      <div class="project-card-footer">
        <div class="project-card-stack">
          ${p.stack.slice(0, 3).map(s => `<span class="stack-badge">${s}</span>`).join('')}
        </div>
        <span class="project-card-arrow">→</span>
      </div>
    </div>`).join(''));

  // ── FULL PROJECTS PAGE ──────────────────────────────────
  set('projects-grid', D.projects.map((p, i) => `
    <div class="project-full-card reveal${i % 3 > 0 ? ` reveal-delay-${i % 3}` : ''}"
         data-category="${p.category}"
         data-id="${i}"
         style="cursor:pointer;">
      <div class="project-full-thumb">${p.emoji}</div>
      <div class="project-full-body">
        <p class="project-full-tag">${p.tag}</p>
        <div class="project-full-header">
          <h2 class="project-full-title">${p.title}</h2>
          <span class="project-full-status${p.wip ? ' wip' : ''}">${p.status}</span>
        </div>
        <p class="project-full-desc">${p.desc}</p>
        <ul class="project-full-highlights">
          ${p.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>
      <div class="project-full-footer">
        <div class="project-card-stack">
          ${p.stack.map(s => `<span class="stack-badge">${s}</span>`).join('')}
        </div>
        <div class="project-links">
          ${p.github ? `<a href="${p.github}" target="_blank" class="project-link" onclick="event.stopPropagation()">GitHub</a>` : ''}
          <a href="project-detail.html?id=${i}" class="project-link" onclick="event.stopPropagation()">Open Project →</a>
        </div>
      </div>
    </div>`).join(''));

  // ── WORK HISTORY ────────────────────────────────────────
  set('work-timeline', D.work.map((w, i) => `
    <div class="timeline-item reveal${i > 0 ? ` reveal-delay-${i}` : ''}">
      <p class="timeline-date">${w.period}</p>
      <h3 class="timeline-role">${w.role}</h3>
      <p class="timeline-company">${w.company}</p>
      <p class="timeline-desc">${w.desc}</p>
      <div class="timeline-tags">
        ${w.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>`).join(''));

  // ── BLOG PREVIEW (index — first 3) ──────────────────────
  const bp = D.posts.slice(0, 3);
  set('blog-preview', `
    <a href="pages/blog-post.html?id=0" class="blog-card featured">
      <div class="blog-card-meta">
        <span class="blog-cat">${bp[0].category}</span>
        <span class="blog-date">${bp[0].date}</span>
      </div>
      <h3 class="blog-card-title">${bp[0].title}</h3>
      <p class="blog-card-excerpt">${bp[0].excerpt}</p>
      <span class="blog-read-more">Read Article →</span>
    </a>
    ${bp.slice(1).map((p, i) => `
      <a href="pages/blog-post.html?id=${i + 1}" class="blog-card">
        <div class="blog-card-meta">
          <span class="blog-cat">${p.category}</span>
          <span class="blog-date">${p.date}</span>
        </div>
        <h3 class="blog-card-title">${p.title}</h3>
        <p class="blog-card-excerpt">${p.excerpt}</p>
        <span class="blog-read-more">Read →</span>
      </a>`).join('')}`);

  // ── FULL BLOG LIST ──────────────────────────────────────
  set('blog-list', D.posts.map((p, i) => `
    <a href="blog-post.html?id=${i}" class="blog-post-card reveal">
      <div class="blog-post-meta">
        <span class="blog-cat">${p.category}</span>
        <span class="blog-date">${p.date}</span>
      </div>
      <h2 class="blog-post-title">${p.title}</h2>
      <p class="blog-post-excerpt">${p.excerpt}</p>
      <div class="blog-post-footer">
        <span class="blog-read-more">Read Article →</span>
        <span class="blog-reading-time">${p.readTime}</span>
      </div>
    </a>`).join(''));

  // ── CONTACT LINKS ───────────────────────────────────────
  document.querySelectorAll('.contact-email').forEach(l => {
    l.href = `mailto:${D.email}`;
    l.textContent = D.email;
  });
  document.querySelectorAll('.contact-github').forEach(l => {
    l.href = D.github;
    l.textContent = D.github.replace('https://', '');
  });
  document.querySelectorAll('.contact-linkedin').forEach(l => {
    l.href = D.linkedin;
    l.textContent = D.linkedin.replace('https://', '');
  });
  document.querySelectorAll('.contact-location').forEach(l => {
    l.textContent = D.location;
  });

  // ── FOOTER ──────────────────────────────────────────────
  document.querySelectorAll('.footer-copy').forEach(f => {
    f.textContent = `© ${new Date().getFullYear()} ${D.name} — ${D.role}`;
  });

  // ── RE-OBSERVE REVEALS ───────────────────────────────────
  // Must run AFTER all content is injected so dynamically
  // created .reveal elements get picked up by the observer
  if (typeof window.observeReveals === 'function') {
    window.observeReveals();
  }

})();