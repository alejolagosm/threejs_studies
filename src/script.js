import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

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

// CREATING A MESH

// Cube geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
});
const cube = new THREE.Mesh(geometry, material);
//cube.rotation.set(2, 2, 1);
// scene.add(cube);

//Group geometry
const group = new THREE.Group();
const capsule1 = new THREE.Mesh(
  new THREE.CapsuleGeometry(1, 0.1, 10, 10),
  new THREE.MeshBasicMaterial({ color: 0x9f4f9f, wireframe: true })
);
group.add(capsule1);
const capsule2 = new THREE.Mesh(
  new THREE.CapsuleGeometry(1, 2, 10, 10),
  new THREE.MeshBasicMaterial({ color: 0x005f00 })
);
capsule2.position.set(2, 0, 0);
group.add(capsule2);
//scene.add(group);

// HELPER AXES
const axes = new THREE.AxesHelper(1);
//scene.add(axes);

// CREATING A CAMERA
const camera = new THREE.PerspectiveCamera(
  80,
  SIZE.width / SIZE.height,
  0.1,
  10
);
//const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 1, 100);
camera.position.set(0, 0, 3);
scene.add(camera);
// camera.lookAt(capsule2.position);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(SIZE.width, SIZE.height);

// HANDLING THE RESIZING OF THE WINDOW
window.addEventListener("resize", () => {
  SIZE.width = window.innerWidth;
  SIZE.height = window.innerHeight;

  // Update the camera
  camera.aspect = SIZE.width / SIZE.height;
  camera.updateProjectionMatrix();

  renderer.setSize(SIZE.width, SIZE.height);
});

// CUSTOM ANIMATIONS

// Clock to ensure animation uses correct fps values
const clock = new THREE.Clock();

// WITH A CUSTOM FUNCTION
const animate = () => {
  // CREATING THE ANIMATION
  const elapsed = clock.getElapsedTime();
  group.position.y = Math.sin(elapsed);
  group.rotation.x += 0.01;
  camera.lookAt(group.position);
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

//animate();

// WITH GSAP
//gsap.to(cube.position, { duration: 1, delay: 0.5, x: 2 });

// CREATING CUSTOM CONTROLS

// This event listener can be used to create custom controls
/*
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / SIZE.width - 0.5;
  cursor.y = -(e.clientY / SIZE.height - 0.5);
});
*/

const customControls = () => {
  // Changing the camera position to face different sides of the object
  camera.position.x = cursor.x * 3;
  //camera.position.z = Math.sin(cursor.x * Math.PI) * 3;
  //camera.position.y = cursor.y * 3;
  camera.position.y = Math.sin(cursor.y * Math.PI) * 3;
  camera.position.z = Math.cos(cursor.y * Math.PI) * 3;
  camera.lookAt(cube.position);

  renderer.render(scene, camera);
  window.requestAnimationFrame(customControls);
};

//customControls();

//USING THREE JS CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const animateControls = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animateControls);
};

animateControls();

// Creating custom geometries

const customGeometry = new THREE.BufferGeometry();

const count = 10;
const posArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 2;
}

const posAttribute = new THREE.BufferAttribute(posArray, 3);

customGeometry.setAttribute("position", posAttribute);

const cusMesh = new THREE.Mesh(customGeometry, material);
// scene.add(cusMesh);

// Debug UI
const gui = new GUI();
const parameters = {
  spin: () => {
    gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + Math.PI });
  },
};
gui.add(cube.position, "y").min(-2).max(2).step(0.1);
gui.addColor(cube.material, "color");
gui.add(parameters, "spin");

// TEXTURE

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
  console.log("loading finished");
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load("./material.jpg");

//Transforming the UV coordinates of the texture

texture.repeat.x = 4;
texture.repeat.y = 4;

texture.wrapS = THREE.MirroredRepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

// How to apply filters when the pixels of the texture differ from
// the pixels of the material
texture.generateMipmaps = false;
texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;

/*
texture.offset.x = 0.5;
texture.rotation = Math.PI / 2;
texture.center.x = 0.5;
texture.center.y = 0.5;
*/
const geometry2 = new THREE.BoxGeometry();
const textureMaterial = new THREE.MeshBasicMaterial({
  color: "ffffff",
  map: texture,
});
const textureForm = new THREE.Mesh(geometry2, textureMaterial);
scene.add(textureForm);
