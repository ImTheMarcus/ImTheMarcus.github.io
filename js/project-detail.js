// ============================================================
//  PROJECT DETAIL — 3D Viewer + IDE Code Display
// ============================================================

// ── POPULATE SIDEBAR FROM data.js ───────────────────────────
// Gets project index from URL param e.g. project-detail.html?id=0
(() => {
  const params  = new URLSearchParams(window.location.search);
  const idx     = parseInt(params.get('id') ?? '0', 10);
  const project = (typeof PORTFOLIO !== 'undefined') ? PORTFOLIO.projects[idx] : null;

  if (project) {
    // Header
    document.getElementById('detail-tag').textContent   = project.tag;
    document.getElementById('detail-title').textContent = project.title;
    document.title = `${project.title} — ${PORTFOLIO.name}`;

    // Meta badges
    const meta = document.getElementById('detail-meta');
    const statusClass = project.wip ? 'status-wip' : 'status-done';
    meta.innerHTML = `
      <span class="meta-badge ${statusClass}">${project.status}</span>
      ${project.stack.map(s => `<span class="meta-badge">${s}</span>`).join('')}
    `;

    // Description
    document.getElementById('detail-desc').innerHTML = `<p>${project.desc}</p>`;

    // Sidebar — info
    document.getElementById('sidebar-info').innerHTML = `
      <div class="info-row"><span class="info-key">Status</span><span class="info-val">${project.status}</span></div>
      <div class="info-row"><span class="info-key">Category</span><span class="info-val">${project.tag}</span></div>
    `;

    // Sidebar — stack
    document.getElementById('sidebar-stack').innerHTML =
      project.stack.map(s => `<span class="stack-pill">${s}</span>`).join('');

    // Sidebar — features
    document.getElementById('sidebar-features').innerHTML =
      project.highlights.map(h => `<li>${h}</li>`).join('');

    // Sidebar — links
    const links = document.getElementById('sidebar-links');
    links.innerHTML = '';
    if (project.github) {
      links.innerHTML += `<a href="${project.github}" target="_blank" class="sidebar-link">⌥ GitHub Repository</a>`;
    }
    links.innerHTML += `<a href="projects.html" class="sidebar-link">← Back to Projects</a>`;
  }
})();

// ══════════════════════════════════════════════════════════════
//  3D MODEL VIEWER
// ══════════════════════════════════════════════════════════════

const canvas    = document.getElementById('model-canvas');
const dropzone  = document.getElementById('viewer-dropzone');
const controls  = document.getElementById('viewer-controls');
const loading   = document.getElementById('viewer-loading');
const fileInput = document.getElementById('model-file-input');
const filenameEl = document.getElementById('viewer-filename');

// Three.js scene setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x0e1318, 1);
renderer.shadowMap.enabled = true;

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.01, 1000);
camera.position.set(0, 0, 3);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0x00e5ff, 0.8);
dirLight.position.set(5, 8, 5);
scene.add(dirLight);
const fillLight = new THREE.DirectionalLight(0x7fff6e, 0.3);
fillLight.position.set(-5, -3, -5);
scene.add(fillLight);

// Grid
const grid = new THREE.GridHelper(10, 20, 0x1e2d40, 0x1e2d40);
scene.add(grid);

// Resize handler
function resizeRenderer() {
  const w = canvas.parentElement.clientWidth;
  const h = canvas.parentElement.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

resizeRenderer();
window.addEventListener('resize', resizeRenderer);

// Orbit controls (manual implementation — no import needed)
let isDragging = false, lastX = 0, lastY = 0;
let rotX = 0, rotY = 0, zoom = 3;
let currentMesh = null;

canvas.addEventListener('mousedown', e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
window.addEventListener('mouseup', () => { isDragging = false; });
window.addEventListener('mousemove', e => {
  if (!isDragging || !currentMesh) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  rotY += dx * 0.008;
  rotX += dy * 0.008;
  rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
  currentMesh.rotation.x = rotX;
  currentMesh.rotation.y = rotY;
  lastX = e.clientX; lastY = e.clientY;
});

canvas.addEventListener('wheel', e => {
  zoom += e.deltaY * 0.005;
  zoom = Math.max(0.5, Math.min(20, zoom));
  camera.position.z = zoom;
  e.preventDefault();
}, { passive: false });

// Touch support
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
    const dx = e.touches[0].clientX - lastX;
    const dy = e.touches[0].clientY - lastY;
    rotY += dx * 0.008; rotX += dy * 0.008;
    currentMesh.rotation.x = rotX; currentMesh.rotation.y = rotY;
    lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
  }
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    zoom -= (dist - lastTouchDist) * 0.02;
    zoom = Math.max(0.5, Math.min(20, zoom));
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

// ── STL PARSER ──────────────────────────────────────────────
function parseSTL(buffer) {
  // Try binary STL first
  const isBinary = (() => {
    const arr = new Uint8Array(buffer);
    // Binary STL: first 80 bytes = header, next 4 = triangle count
    if (arr.length < 84) return false;
    const triCount = new DataView(buffer).getUint32(80, true);
    return arr.length === 84 + triCount * 50;
  })();

  const geometry = new THREE.BufferGeometry();

  if (isBinary) {
    const view   = new DataView(buffer);
    const tris   = view.getUint32(80, true);
    const verts  = new Float32Array(tris * 9);
    const norms  = new Float32Array(tris * 9);
    let offset = 84;
    for (let i = 0; i < tris; i++) {
      const nx = view.getFloat32(offset,    true);
      const ny = view.getFloat32(offset+4,  true);
      const nz = view.getFloat32(offset+8,  true);
      offset += 12;
      for (let v = 0; v < 3; v++) {
        const base = i * 9 + v * 3;
        verts[base]   = view.getFloat32(offset,   true);
        verts[base+1] = view.getFloat32(offset+4, true);
        verts[base+2] = view.getFloat32(offset+8, true);
        norms[base] = nx; norms[base+1] = ny; norms[base+2] = nz;
        offset += 12;
      }
      offset += 2; // attribute byte count
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geometry.setAttribute('normal',   new THREE.BufferAttribute(norms, 3));
  } else {
    // ASCII STL
    const text   = new TextDecoder().decode(buffer);
    const verts  = [];
    const regex  = /vertex\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/g;
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

// ── OBJ PARSER ──────────────────────────────────────────────
function parseOBJ(text) {
  const positions = [], normals = [];
  const verts = [];

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

// ── LOAD & DISPLAY MODEL ────────────────────────────────────
let wireframeMode = false;
let materialMode  = 0;
const materials = [
  new THREE.MeshPhongMaterial({ color: 0xc0c8d8, shininess: 60, specular: 0x00e5ff }),
  new THREE.MeshPhongMaterial({ color: 0x2a3a52, shininess: 10, specular: 0x00e5ff }),
  new THREE.MeshNormalMaterial(),
];

function loadModel(file) {
  loading.style.display = 'flex';
  filenameEl.textContent = file.name;

  const reader = new FileReader();
  const ext    = file.name.split('.').pop().toLowerCase();

  reader.onload = e => {
    try {
      let geometry;
      if (ext === 'stl') {
        geometry = parseSTL(e.target.result);
      } else if (ext === 'obj') {
        geometry = parseOBJ(new TextDecoder().decode(e.target.result));
      } else {
        alert(`Unsupported format: .${ext}\nSupported: STL, OBJ`);
        loading.style.display = 'none';
        return;
      }

      // Centre and scale
      geometry.computeBoundingBox();
      const box    = geometry.boundingBox;
      const centre = new THREE.Vector3();
      box.getCenter(centre);
      const size   = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale  = 2 / maxDim;

      geometry.translate(-centre.x, -centre.y, -centre.z);

      // Remove old mesh
      if (currentMesh) scene.remove(currentMesh);
      rotX = 0; rotY = 0;

      currentMesh = new THREE.Mesh(geometry, materials[materialMode].clone());
      currentMesh.scale.setScalar(scale);
      scene.add(currentMesh);

      // Position grid at bottom of model
      const bottom = -size.y * scale / 2;
      grid.position.y = bottom - 0.01;

      // Reset camera
      zoom = 3;
      camera.position.z = zoom;

      // Show controls, hide dropzone
      dropzone.classList.add('hidden');
      controls.style.display = 'flex';
      loading.style.display  = 'none';

    } catch (err) {
      console.error(err);
      alert('Failed to parse model. Make sure it is a valid STL or OBJ file.');
      loading.style.display = 'none';
    }
  };

  reader.readAsArrayBuffer(file);
}

// File input
fileInput.addEventListener('change', e => {
  if (e.target.files[0]) loadModel(e.target.files[0]);
});

// Drag and drop
const container = document.querySelector('.viewer-container');
container.addEventListener('dragover',  e => { e.preventDefault(); dropzone.classList.add('drag-over'); });
container.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
container.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) loadModel(e.dataTransfer.files[0]);
});

// Viewer control buttons
document.getElementById('btn-reset').addEventListener('click', () => {
  rotX = 0; rotY = 0; zoom = 3;
  camera.position.z = zoom;
  if (currentMesh) { currentMesh.rotation.x = 0; currentMesh.rotation.y = 0; }
});

document.getElementById('btn-wireframe').addEventListener('click', function() {
  wireframeMode = !wireframeMode;
  this.classList.toggle('active', wireframeMode);
  if (currentMesh) currentMesh.material.wireframe = wireframeMode;
});

document.getElementById('btn-material').addEventListener('click', () => {
  if (!currentMesh) return;
  materialMode = (materialMode + 1) % materials.length;
  const mat = materials[materialMode].clone();
  mat.wireframe = wireframeMode;
  currentMesh.material = mat;
});

// ══════════════════════════════════════════════════════════════
//  IDE CODE VIEWER
// ══════════════════════════════════════════════════════════════

const codeEl      = document.getElementById('ide-code');
const lineNumsEl  = document.getElementById('ide-line-nums');
const pasteArea   = document.getElementById('ide-paste-area');
const langSelect  = document.getElementById('ide-lang-select');
const filenameIDE = document.getElementById('ide-active-filename');
const codeFileIn  = document.getElementById('code-file-input');

function updateLineNumbers(code) {
  const lines = code.split('\n').length;
  lineNumsEl.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
}

function setCode(code, lang, filename) {
  // Sanitize for HTML display
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  codeEl.className = `language-${lang}`;
  codeEl.innerHTML = escaped;
  filenameIDE.textContent = filename || 'code';
  updateLineNumbers(code);

  if (window.Prism) Prism.highlightElement(codeEl);
}

// Extension → Prism language map
const extLangMap = {
  c: 'c', h: 'c', cpp: 'cpp', cxx: 'cpp', cc: 'cpp', hpp: 'cpp',
  ino: 'cpp', py: 'python', js: 'javascript', ts: 'javascript',
  json: 'json', yaml: 'yaml', yml: 'yaml',
  sh: 'bash', bash: 'bash', m: 'matlab',
  xml: 'markup', html: 'markup', htm: 'markup',
  md: 'markup', txt: 'markup',
};

// Load code file
codeFileIn.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const ext  = file.name.split('.').pop().toLowerCase();
  const lang = extLangMap[ext] || 'markup';

  const reader = new FileReader();
  reader.onload = ev => {
    setCode(ev.target.result, lang, file.name);
    // Update lang select to match
    if (langSelect.querySelector(`option[value="${lang}"]`)) {
      langSelect.value = lang;
    }
  };
  reader.readAsText(file);
});

// Apply pasted code
document.getElementById('btn-apply-paste').addEventListener('click', () => {
  const code = pasteArea.value.trim();
  if (!code) return;
  const lang = langSelect.value;
  setCode(code, lang, `snippet.${lang === 'cpp' ? 'cpp' : lang}`);
  pasteArea.value = '';
});

// Copy code button
document.getElementById('btn-copy-code').addEventListener('click', function() {
  const code = codeEl.textContent;
  navigator.clipboard.writeText(code).then(() => {
    this.textContent = '✓ Copied';
    this.classList.add('copied');
    setTimeout(() => {
      this.textContent = '⧉ Copy';
      this.classList.remove('copied');
    }, 2000);
  });
});

// Initial line numbers
updateLineNumbers(codeEl.textContent);
if (window.Prism) Prism.highlightElement(codeEl);

// ══════════════════════════════════════════════════════════════
//  MEDIA UPLOADER
// ══════════════════════════════════════════════════════════════

const mediaGrid  = document.getElementById('media-grid');
const mediaInput = document.getElementById('media-input');

function addMediaItem(file) {
  // Remove placeholder if present
  const placeholder = mediaGrid.querySelector('.media-placeholder');
  if (placeholder) placeholder.remove();

  const item = document.createElement('div');
  item.className = 'media-item';

  const url = URL.createObjectURL(file);
  const isVideo = file.type.startsWith('video/');

  if (isVideo) {
    const video = document.createElement('video');
    video.src = url; video.controls = true; video.muted = true;
    item.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = url; img.alt = file.name;
    item.appendChild(img);
  }

  const removeBtn = document.createElement('button');
  removeBtn.className = 'media-remove';
  removeBtn.textContent = '✕';
  removeBtn.addEventListener('click', () => {
    item.remove();
    URL.revokeObjectURL(url);
    if (mediaGrid.children.length === 0) {
      const ph = document.createElement('div');
      ph.className = 'media-placeholder';
      ph.innerHTML = '<span>Drop images or click "+ Add Images" above</span>';
      mediaGrid.appendChild(ph);
    }
  });

  item.appendChild(removeBtn);
  mediaGrid.appendChild(item);
}

mediaInput.addEventListener('change', e => {
  Array.from(e.target.files).forEach(addMediaItem);
});

// Drag & drop onto media grid
mediaGrid.addEventListener('dragover', e => e.preventDefault());
mediaGrid.addEventListener('drop', e => {
  e.preventDefault();
  Array.from(e.dataTransfer.files)
    .filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'))
    .forEach(addMediaItem);
});