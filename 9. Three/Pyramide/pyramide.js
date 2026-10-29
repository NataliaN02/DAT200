import * as THREE from "three";
import Dat from "three/addons/dat.gui.module.js";
import Stats from "three/addons/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

async function init() {

  // scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(5, 4, 8);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);

  const renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("WebGL-output").appendChild(renderer.domElement);
  await renderer.init();

  // pyramid : 1x1 base, height 1, center at (0,0,0)
  const vertices = new Float32Array([
    -0.5, -0.5, -0.5,   // 0
     0.5, -0.5, -0.5,   // 1
     0.5, -0.5,  0.5,   // 2
    -0.5, -0.5,  0.5,   // 3
     0.0,  0.5,  0.0,   // 4 
  ]);

  const faces = [
    0, 1, 2,   0, 2, 3,   // base
    3, 2, 4,               // front
    2, 1, 4,               // right
    1, 0, 4,               // back
    0, 3, 4,               // left
  ];

  const polyGeometry = new THREE.BufferGeometry();
  polyGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  polyGeometry.setIndex(faces);
  polyGeometry.computeVertexNormals();

  const meshMaterial = new THREE.MeshLambertMaterial();
  meshMaterial.color.setRGB(1, 0, 0);

  const wireFrameMat = new THREE.MeshBasicMaterial();
  wireFrameMat.wireframe = true;
  wireFrameMat.color.setRGB(0, 0, 0);

  const polyhedron = new THREE.Mesh(polyGeometry, meshMaterial);
  const edges = new THREE.Mesh(polyGeometry, wireFrameMat);
  polyhedron.castShadow = true;
  polyhedron.add(edges);
  scene.add(polyhedron);

    // ---------- różne materiały do eksperymentów ----------
  const materials = {
    Lambert: meshMaterial,                                   // matowy
    Phong: new THREE.MeshPhongMaterial({ shininess: 100 }),  // błyszczący
    Standard: new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.5 }), // metaliczny
    Basic: new THREE.MeshBasicMaterial(),                    // bez światła
  };
  Object.values(materials).forEach((m) => m.color.setRGB(1, 0, 0));

  // light
  const ambientLight = new THREE.AmbientLight(0x808080);
  scene.add(ambientLight);
  const spotLight = new THREE.SpotLight(0xffffff, 1000);
  spotLight.position.set(10, 15, 10);
  scene.add(spotLight);

  // dat.gui 
  const controls = {
    size: 2,
    height: 3,
    color: "#8800ff",
    rotationSpeedX: 0.5,
    rotationSpeedY: 1.0,
    rotationSpeedZ: 0.0,
  };
  polyhedron.scale.set(controls.size, controls.height, controls.size);

  const gui = new Dat.GUI();
  gui.add(controls, "size", 0.5, 5).name("Størrelse")
     .onChange(() => polyhedron.scale.set(controls.size, controls.height, controls.size));
  gui.add(controls, "height", 0.5, 6).name("Høyde")
     .onChange(() => polyhedron.scale.set(controls.size, controls.height, controls.size));
  gui.addColor(controls, "color").name("Farge")
     .onChange((c) => Object.values(materials).forEach((m) => m.color.set(c)));
  gui.add(controls, "rotationSpeedX", -5, 5).name("Rotasjon X");
  gui.add(controls, "rotationSpeedY", -5, 5).name("Rotasjon Y");
  gui.add(controls, "rotationSpeedZ", -5, 5).name("Rotasjon Z");

  controls.material = "Lambert";
  controls.ambientIntensity = 1;
  controls.spotIntensity = 1000;
  controls.lightColor = "#ffffff";

  gui.add(controls, "material", Object.keys(materials)).name("Materiale")
     .onChange((name) => { polyhedron.material = materials[name]; });
  gui.add(controls, "ambientIntensity", 0, 5).name("Omgivelseslys")
     .onChange((v) => { ambientLight.intensity = v; });
  gui.add(controls, "spotIntensity", 0, 3000).name("Spotlys")
     .onChange((v) => { spotLight.intensity = v; });
  gui.addColor(controls, "lightColor").name("Lysfarge")
     .onChange((c) => { spotLight.color.set(c); });

  // FPS statistics
  const stats = new Stats();
  document.getElementById("Stats-output").appendChild(stats.dom);

  // camera controls
  new OrbitControls(camera, renderer.domElement);

  // animation
  const clock = new THREE.Clock();
  const worldX = new THREE.Vector3(1, 0, 0);
  const worldY = new THREE.Vector3(0, 1, 0);
  const worldZ = new THREE.Vector3(0, 0, 1);

  function renderScene() {
    const deltaTime = clock.getDelta();

    polyhedron.rotateOnWorldAxis(worldX, controls.rotationSpeedX * deltaTime);
    polyhedron.rotateOnWorldAxis(worldY, controls.rotationSpeedY * deltaTime);
    polyhedron.rotateOnWorldAxis(worldZ, controls.rotationSpeedZ * deltaTime);

    stats.update();
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }
  renderScene();

  // resize handling
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize, false);
}
window.onload = init;