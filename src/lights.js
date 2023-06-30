import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

THREE.ColorManagement.enabled = false;

const SIZE = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("resize", () => {
  // Update sizes
  SIZE.width = window.innerWidth;
  SIZE.height = window.innerHeight;

  // Update camera
  camera.aspect = SIZE.width / SIZE.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(SIZE.width, SIZE.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// BASIC ELEMENTS: CANVAS AND SCENE
const canvas = document.querySelector(".canvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  80,
  SIZE.width / SIZE.height,
  0.1,
  100
);
camera.position.set(1, 1, 5);
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(SIZE.width, SIZE.height);

// Ambient light: Creates a light from all directions
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//scene.add(ambientLight);

//Creates light  that acts like the sun
const directionalLight = new THREE.DirectionalLight(0x00fc00, 0.3);
//scene.add(directionalLight);

//Create a light that interpolates between two colors depending where the object face is facing
const hemisphereLight = new THREE.HemisphereLight(0x00ff00, 0xfff, 0.3);
//scene.add(hemisphereLight);

//Create a light that acts as a lighter from a certain point
const pointLight = new THREE.PointLight(0xffff00, 1, 5, 2);
//scene.add(pointLight);

//Create a light that starts from a rectangle
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 2, 2);
//scene.add(rectAreaLight);
rectAreaLight.position.set(-1, 1, 1);
rectAreaLight.lookAt(new THREE.Vector3());

// Create a light that acts as a flashlight
const spotLight = new THREE.SpotLight(
  0x00fc90,
  0.9,
  12,
  Math.PI * 0.5,
  0.25,
  1
);
spotLight.position.set(-3, 2, 3);
scene.add(spotLight);

// Geometries
const material = new THREE.MeshStandardMaterial();
//material.color.set(0xfff);
// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1;

scene.add(sphere, cube, torus, plane);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const animateControls = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animateControls);
};

animateControls();

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
