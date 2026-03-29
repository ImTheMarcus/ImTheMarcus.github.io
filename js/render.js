// ============================================================
//  PROJECT DETAIL — View-only. All content comes from data.js
//  To add content to a project, edit the project entry in data.js
// ============================================================

(() => {
  const params  = new URLSearchParams(window.location.search);
  const idx     = parseInt(params.get('id') ?? '0', 10);
  const D       = typeof PORTFOLIO !== 'undefined' ? PORTFOLIO : null;
  const project = D ? D.projects[idx] : null;

  if (!project) return;

  // ── PAGE TITLE & HEADER ─────────────────────────────────
  document.title = `${project.title} — ${D.name}`;
  document.getElementById('detail-tag').textContent   = project.tag;
  document.getElementById('detail-title').textContent = project.title;

  document.getElementById('detail-meta').innerHTML = `
    <span class="meta-badge ${project.wip ? 'status-wip' : 'status-done'}">${project.status}</span>
    ${project.stack.map(s => `<span class="meta-badge">${s}</span>`).join('')}
  `;

  // ── OVERVIEW ────────────────────────────────────────────
  const descEl = document.getElementById('detail-desc');
  if (project.overview) {
    descEl.innerHTML = project.overview.map(p => `<p>${p}</p>`).join('');
  } else {
    descEl.innerHTML = `<p>${project.desc}</p>`;
  }

  // ── SIDEBAR ─────────────────────────────────────────────
  document.getElementById('sidebar-info').innerHTML = `
    <div class="info-row">
      <span class="info-key">Status</span>
      <span class="info-val">${project.status}</span>
    </div>
    <div class="info-row">
      <span class="info-key">Category</span>
      <span class="info-val">${project.tag}</span>
    </div>
    ${project.year ? `
    <div class="info-row">
      <span class="info-key">Year</span>
      <span class="info-val">${project.year}</span>
    </div>` : ''}
  `;

  document.getElementById('sidebar-stack').innerHTML =
    project.stack.map(s => `<span class="stack-pill">${s}</span>`).join('');

  document.getElementById('sidebar-features').innerHTML =
    project.highlights.map(h => `<li>${h}</li>`).join('');

  const linksEl = document.getElementById('sidebar-links');
  linksEl.innerHTML = '';
  if (project.github) {
    linksEl.innerHTML += `<a href="${project.github}" target="_blank" class="sidebar-link">⌥ GitHub Repository</a>`;
  }
  if (project.liveUrl) {
    linksEl.innerHTML += `<a href="${project.liveUrl}" target="_blank" class="sidebar-link">↗ Live / Demo</a>`;
  }
  linksEl.innerHTML += `<a href="projects.html" class="sidebar-link">← Back to Projects</a>`;

  // ── 3D MODEL VIEWER ─────────────────────────────────────
  // Add model: '../assets/models/yourfile.stl' to the project in data.js
  if (project.model) {
    document.getElementById('section-3d').style.display = 'flex';
    document.getElementById('model-filename').textContent = project.model.split('/').pop();
    initViewer(project.model);
  }

  // ── CODE VIEWER ─────────────────────────────────────────
  // Add code: { file: '../assets/code/main.cpp', lang: 'cpp' } to the project in data.js
  // OR add codeSnippet: { content: '...your code...', lang: 'cpp', filename: 'main.cpp' }
  if (project.code || project.codeSnippet) {
    document.getElementById('section-code').style.display = 'flex';
    if (project.codeSnippet) {
      renderCode(project.codeSnippet.content, project.codeSnippet.lang, project.codeSnippet.filename);
    } else if (project.code) {
      fetch(project.code.file)
        .then(r => r.text())
        .then(text => renderCode(text, project.code.lang, project.code.file.split('/').pop()))
        .catch(() => renderCode('// Could not load code file.', 'cpp', project.code.file.split('/').pop()));
    }
  }

  // ── MEDIA GALLERY ───────────────────────────────────────
  // Add images: ['../assets/img/project0/photo1.jpg', '...'] to the project in data.js
  if (project.images && project.images.length > 0) {
    document.getElementById('section-media').style.display = 'flex';
    document.getElementById('media-grid').innerHTML = project.images.map(src => `
      <div class="media-item">
        <img src="${src}" alt="${project.title}" loading="lazy" />
      </div>`).join('');
  }

})();

// ══════════════════════════════════════════════════════════
//  CODE RENDERER
// ══════════════════════════════════════════════════════════

function renderCode(code, lang, filename) {
  const codeEl     = document.getElementById('ide-code');
  const lineNumsEl = document.getElementById('ide-line-nums');
  const filenameEl = document.getElementById('ide-filename');

  filenameEl.textContent = filename || `code.${lang}`;

  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  codeEl.className = `language-${lang}`;
  codeEl.innerHTML = escaped;

  const lines = code.split('\n').length;
  lineNumsEl.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');

  if (window.Prism) Prism.highlightElement(codeEl);
}

// Copy button
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

// ══════════════════════════════════════════════════════════
//  3D VIEWER (Three.js)
// ══════════════════════════════════════════════════════════

function initViewer(modelUrl) {
  const canvas  = document.getElementById('model-canvas');
  const loading = document.getElementById('viewer-loading');
  const controls = document.getElementById('viewer-controls');

  loading.style.display = 'flex';

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x0e1318, 1);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 16/9, 0.01, 1000);
  camera.position.z = 3;

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0x00e5ff, 0.8);
  dir.position.set(5, 8, 5);
  scene.add(dir);
  const fill = new THREE.DirectionalLight(0x7fff6e, 0.3);
  fill.position.set(-5, -3, -5);
  scene.add(fill);

  // Grid
  const grid = new THREE.GridHelper(10, 20, 0x1e2d40, 0x1e2d40);
  scene.add(grid);

  function resize() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Orbit state
  let isDragging = false, lastX = 0, lastY = 0, rotX = 0, rotY = 0, zoom = 3;
  let currentMesh = null;
  let wireframeMode = false, materialMode = 0;

  const materials = [
    new THREE.MeshPhongMaterial({ color: 0xc0c8d8, shininess: 60, specular: 0x00e5ff }),
    new THREE.MeshPhongMaterial({ color: 0x2a3a52, shininess: 10, specular: 0x00e5ff }),
    new THREE.MeshNormalMaterial(),
  ];

  // Mouse orbit
  canvas.addEventListener('mousedown', e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', e => {
    if (!isDragging || !currentMesh) return;
    rotY += (e.clientX - lastX) * 0.008;
    rotX += (e.clientY - lastY) * 0.008;
    rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
    currentMesh.rotation.set(rotX, rotY, 0);
    lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener('wheel', e => {
    zoom = Math.max(0.5, Math.min(20, zoom + e.deltaY * 0.005));
    camera.position.z = zoom;
    e.preventDefault();
  }, { passive: false });

  // Touch orbit
  let lastTouchDist = 0;
  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 1) { isDragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; }
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist = Math.sqrt(dx*dx + dy*dy);
    }
  });
  canvas.addEventListener('touchmove', e => {
    if (e.touches.length === 1 && isDragging && currentMesh) {
      rotY += (e.touches[0].clientX - lastX) * 0.008;
      rotX += (e.touches[0].clientY - lastY) * 0.008;
      currentMesh.rotation.set(rotX, rotY, 0);
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    }
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      zoom = Math.max(0.5, Math.min(20, zoom - (dist - lastTouchDist) * 0.02));
      camera.position.z = zoom;
      lastTouchDist = dist;
    }
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { isDragging = false; });

  // Render loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  // Control buttons
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    rotX = 0; rotY = 0; zoom = 3;
    camera.position.z = zoom;
    if (currentMesh) currentMesh.rotation.set(0, 0, 0);
  });

  document.getElementById('btn-wireframe')?.addEventListener('click', function() {
    wireframeMode = !wireframeMode;
    this.classList.toggle('active', wireframeMode);
    if (currentMesh) currentMesh.material.wireframe = wireframeMode;
  });

  document.getElementById('btn-material')?.addEventListener('click', () => {
    if (!currentMesh) return;
    materialMode = (materialMode + 1) % materials.length;
    const mat = materials[materialMode].clone();
    mat.wireframe = wireframeMode;
    currentMesh.material = mat;
  });

  // Load the model file
  fetch(modelUrl)
    .then(r => r.arrayBuffer())
    .then(buffer => {
      const ext = modelUrl.split('.').pop().toLowerCase();
      let geometry;

      if (ext === 'stl') {
        geometry = parseSTL(buffer);
      } else if (ext === 'obj') {
        geometry = parseOBJ(new TextDecoder().decode(buffer));
      } else {
        loading.innerHTML = `<span>Unsupported format: .${ext} — use STL or OBJ</span>`;
        return;
      }

      // Centre and scale
      geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      const centre = new THREE.Vector3();
      box.getCenter(centre);
      const size = new THREE.Vector3();
      box.getSize(size);
      geometry.translate(-centre.x, -centre.y, -centre.z);

      const scale = 2 / Math.max(size.x, size.y, size.z);
      currentMesh = new THREE.Mesh(geometry, materials[0].clone());
      currentMesh.scale.setScalar(scale);
      scene.add(currentMesh);

      grid.position.y = (-size.y * scale / 2) - 0.01;

      loading.style.display = 'none';
      controls.style.display = 'flex';
    })
    .catch(() => {
      loading.innerHTML = '<span>Could not load model file.</span>';
    });
}

// ── STL Parser ──────────────────────────────────────────────
function parseSTL(buffer) {
  const geometry = new THREE.BufferGeometry();
  const view = new DataView(buffer);
  const triCount = view.getUint32(80, true);
  const expectedLen = 84 + triCount * 50;
  const isBinary = buffer.byteLength === expectedLen && triCount > 0;

  if (isBinary) {
    const verts = new Float32Array(triCount * 9);
    const norms = new Float32Array(triCount * 9);
    let offset = 84;
    for (let i = 0; i < triCount; i++) {
      const nx = view.getFloat32(offset, true);
      const ny = view.getFloat32(offset + 4, true);
      const nz = view.getFloat32(offset + 8, true);
      offset += 12;
      for (let v = 0; v < 3; v++) {
        const b = i * 9 + v * 3;
        verts[b]   = view.getFloat32(offset, true);
        verts[b+1] = view.getFloat32(offset+4, true);
        verts[b+2] = view.getFloat32(offset+8, true);
        norms[b] = nx; norms[b+1] = ny; norms[b+2] = nz;
        offset += 12;
      }
      offset += 2;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geometry.setAttribute('normal',   new THREE.BufferAttribute(norms, 3));
  } else {
    const text  = new TextDecoder().decode(buffer);
    const verts = [];
    const regex = /vertex\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/g;
    let match = regex.exec(text);
    while (match !== null) {
      verts.push(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
      match = regex.exec(text);
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
    geometry.computeVertexNormals();
  }
  return geometry;
}

// ── OBJ Parser ──────────────────────────────────────────────
function parseOBJ(text) {
  const positions = [], normals = [], verts = [];
  text.split('\n').forEach(line => {
    line = line.trim();
    if (line.startsWith('v ')) {
      const [, x, y, z] = line.split(/\s+/);
      positions.push(parseFloat(x), parseFloat(y), parseFloat(z));
    } else if (line.startsWith('vn ')) {
      const [, x, y, z] = line.split(/\s+/);
      normals.push(parseFloat(x), parseFloat(y), parseFloat(z));
    } else if (line.startsWith('f ')) {
      const parts = line.split(/\s+/).slice(1);
      for (let i = 1; i < parts.length - 1; i++) {
        [parts[0], parts[i], parts[i+1]].forEach(p => {
          const [vi] = p.split('/').map(n => parseInt(n, 10) - 1);
          const base = vi * 3;
          verts.push(positions[base], positions[base+1], positions[base+2]);
        });
      }
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
  geometry.computeVertexNormals();
  return geometry;
}