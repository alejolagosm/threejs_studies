import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

THREE.ColorManagement.enabled = false;

const SIZE = {
  width: window.innerWidth,
  height: window.innerHeight,
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

// BASIC ELEMENTS: CANVAS, SCENE, CAMERA, CONTROLS AND RENDERER
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

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(SIZE.width, SIZE.height);

const animateControls = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animateControls);
};

animateControls();

//ADD SHADOWS TO THE RENDER
renderer.shadowMap.enabled = true;

// Ambient light: Creates a light from all directions
const ambientLight = new THREE.AmbientLight("#fff", 0.3);
scene.add(ambientLight);

//Creates light  that acts like the sun
const directionalLight = new THREE.DirectionalLight("#fff", 0.5);
scene.add(directionalLight);

//Add the ability to cast shadows
directionalLight.castShadow = true;

//Control de definition of the shadow
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
//Control the start and end of the shadow camera
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 6;

// Control the size of the shadow camera
directionalLight.shadow.camera.top = 3;
directionalLight.shadow.camera.right = 3;
directionalLight.shadow.camera.bottom = -3;
directionalLight.shadow.camera.left = -3;

const dirLightShadowHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
dirLightShadowHelper.visible = false;
scene.add(dirLightShadowHelper);

//MORE LIGHTS

//Create a light that interpolates between two colors depending where the object face is facing
const hemisphereLight = new THREE.HemisphereLight(0x00ff00, 0xfff, 0.3);
//scene.add(hemisphereLight);

//Create a light that acts as a lighter from a certain point
const pointLight = new THREE.PointLight(0xfff, 1, 5, 2);
//scene.add(pointLight);

//Create a light that starts from a rectangle
const rectAreaLight = new THREE.RectAreaLight(0xfff, 2, 2, 2);
//scene.add(rectAreaLight);
//rectAreaLight.position.set(-1, 1, 1);
//rectAreaLight.lookAt(new THREE.Vector3());

// Create a light that acts as a flashlight
const spotLight = new THREE.SpotLight("#fff", 1, 15, Math.PI * 0.2);
spotLight.position.set(-1, 2, 3);
//scene.add(spotLight);
//scene.add(spotLight.target);
spotLight.castShadow = false;

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

spotLight.shadow.camera.fov = 50;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 10;

// GEOMETRIES
const material = new THREE.MeshStandardMaterial();
material.color.set("#ffd700");
// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;
sphere.castShadow = true;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
cube.castShadow = true;
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const planeMaterial = new THREE.MeshStandardMaterial();
planeMaterial.color.set("#00ffff");
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), planeMaterial);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1;

plane.receiveShadow = true;
scene.add(sphere, cube, torus, plane);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.position.z = Math.sin(elapsedTime) * 2;
  sphere.position.y = Math.abs(Math.sin(3 * elapsedTime)) - 0.5;
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
