const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 14);
const pointsCount = 1600;
const positions = new Float32Array(pointsCount * 3);
for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 40;
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({size: 0.035, color: 0x4ef2d6, transparent: true, opacity: 0.85});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);
const sphereGeometry = new THREE.IcosahedronGeometry(2.4, 1);
const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x2f84ff, emissive: 0x0d4fff, metalness: 0.15, roughness: 0.12, transparent: true, opacity: 0.78, envMapIntensity: 1});
const coreSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(coreSphere);
const glow = new THREE.PointLight(0x4ef2d6, 1.5, 20);
glow.position.set(0, 0, 0);
scene.add(glow);
const ringGeometry = new THREE.TorusGeometry(5.6, 0.08, 18, 120);
const ringMaterial = new THREE.MeshBasicMaterial({color: 0x4ef2d6, transparent: true, opacity: 0.22});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 1.8;
scene.add(ring);
const ambient = new THREE.AmbientLight(0xffffff, 0.24);
scene.add(ambient);
const directional = new THREE.DirectionalLight(0x8c96ff, 1.2);
directional.position.set(5, 5, 8);
scene.add(directional);
const shapes = [];
const shapeMaterial = new THREE.MeshStandardMaterial({color: 0x61d6ff, emissive: 0x133f77, metalness: 0.5, roughness: 0.3});
for (let i = 0; i < 5; i++) {
  const geo = new THREE.OctahedronGeometry(1 + Math.random() * 0.5, 0);
  const mesh = new THREE.Mesh(geo, shapeMaterial);
  mesh.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 12);
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  scene.add(mesh);
  shapes.push(mesh);
}
let cursorX = 0, cursorY = 0;
document.addEventListener('mousemove', event => {
  cursorX = (event.clientX / window.innerWidth - 0.5) * 2;
  cursorY = -(event.clientY / window.innerHeight - 0.5) * 2;
});
const clock = new THREE.Clock();
function animateScene() {
  const elapsed = clock.getElapsedTime();
  ring.rotation.z = elapsed * 0.18;
  coreSphere.rotation.y = elapsed * 0.35;
  coreSphere.rotation.x = elapsed * 0.12;
  particles.rotation.y = elapsed * 0.02;
  particles.rotation.x = elapsed * 0.01;
  shapes.forEach((shape, index) => {
    shape.rotation.x += 0.005 + index * 0.001;
    shape.rotation.y += 0.008 + index * 0.0015;
    shape.position.x += (cursorX * 0.08 - shape.position.x) * 0.02;
    shape.position.y += (cursorY * 0.08 - shape.position.y) * 0.02;
  });
  camera.position.x += (cursorX * 2 - camera.position.x) * 0.04;
  camera.position.y += (cursorY * 1.5 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(animateScene);
}
animateScene();
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
