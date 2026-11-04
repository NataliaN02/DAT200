import * as THREE from "three";
import Dat from "three/addons/dat.gui.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

async function init() {

  // scene, camera, renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 15);
  scene.add(camera);

  const renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("WebGL-output").appendChild(renderer.domElement);
  await renderer.init();

  // light
  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const sun = new THREE.DirectionalLight(0xffffff, 3);
  sun.position.set(10, 20, 10);
  scene.add(sun);

  // speed control
  const controls = {
    rotationSpeed: 1.0,
    axis: "X",
  };
  const gui = new Dat.GUI();
  gui.add(controls, "rotationSpeed", 0, 10).name("Hastighet");

  // orbit controls
  const orbit = new OrbitControls(camera, renderer.domElement);

  // load windmill model
  let rotor = null;
  const loader = new GLTFLoader();
  loader.load(
    "windmill.glb",
    function (gltf) {
      scene.add(gltf.scene);

      gltf.scene.traverse(function (node) {
        console.log("Found node:", node.name);
        if (node.name == "Rotor") rotor = node;
      });
      if (!rotor) console.warn("Rotor node not found in the model!");

      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3()).length();
      camera.position.set(center.x, center.y + size * 0.2, center.z + size * 1.5);
      orbit.target.copy(center);
      orbit.update();
    },
    function (xhr) { console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); },
    function (error) { console.log("An error happened", error); }
  );

  // animation loop
  const clock = new THREE.Clock();
  const rotationAxis = new THREE.Vector3(1, 0, 0);

  function renderScene() {
    const deltaTime = clock.getDelta();
    if (rotor) {
      rotor.rotateOnAxis(rotationAxis, controls.rotationSpeed * deltaTime);
    }
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