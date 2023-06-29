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

// BASIC ELEMENTS: CANVAS AND SCENE
const canvas = document.querySelector(".canvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  80,
  SIZE.width / SIZE.height,
  0.1,
  100
);
camera.position.set(0, 0, 2);
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(SIZE.width, SIZE.height);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Geometries
const material = new THREE.MeshStandardMaterial();
material.color.set(0xfff);
const cube = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
scene.add(cube);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const animateControls = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animateControls);
};

animateControls();
