import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
//import typeFont from "three/examples/fonts/helvetiker_regular.typeface.json";
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

// TEXTURES

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
const geometry2 = new THREE.SphereGeometry();
const textureMaterial = new THREE.MeshBasicMaterial({
  color: "#ffffff",
  map: texture,
});
const textureForm = new THREE.Mesh(geometry2, textureMaterial);
//scene.add(textureForm);

//MATERIALS

const loadingManager2 = new THREE.LoadingManager();
const multipleLoader2 = new THREE.TextureLoader(loadingManager2);
const texture2 = multipleLoader2.load("./material.jpg");

/*
const basic_material = new THREE.MeshBasicMaterial({
  color: "#100ffe",
  //map: texture2,
});

//Some basic properties to be altered in the material
basic_material.transparent = true;
basic_material.opacity = 0.5;
basic_material.side = THREE.DoubleSide;


const basic_material = new THREE.MeshDepthMaterial();

const basic_material = new THREE.MeshNormalMaterial();
basic_material.flatShading = true;
*/

//Lights needed to test the next materials
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(-2, 2, 0);
scene.add(ambientLight, pointLight);

// Materials that reject to lights
//const basic_material = new THREE.MeshLambertMaterial();

//const basic_material = new THREE.MeshPhongMaterial();
//basic_material.shininess = 100;
//basic_material.specular = new THREE.Color(0x1188ff);

// ENVIRONMENT MAPS
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  "env_map/px.png",
  "env_map/nx.png",
  "env_map/py.png",
  "env_map/ny.png",
  "env_map/pz.png",
  "env_map/nz.png",
]);

const basic_material = new THREE.MeshStandardMaterial();
basic_material.roughness = 0;
basic_material.metalness = 0.9;
//basic_material.map = texture2;

//Just like the map attribute, for different kinds of textures
// there are different kinds of maps that you can set on the material

// aoMap for AmbientOcclusion textures
// displacementMap for height textures
// metalness and roughness map as their names indicate
// normalMap for Normal textures
// alphaMap for textures related to light (You need to set the transparent attr to true

// Environment maps to see a kind of background
basic_material.envMap = cubeTexture;

gui.add(basic_material, "roughness").min(0.1).max(0.9).step(0.01);
const mesh = new THREE.Mesh(new THREE.SphereGeometry(), basic_material);
// scene.add(mesh);

const tick = () => {
  const elapsed = clock.getElapsedTime();
  mesh.rotation.x = 1 * elapsed;
  camera.lookAt(mesh.position);
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

// 3D TEXT

const fontLoader = new FontLoader();
const textMaterial = new THREE.MeshNormalMaterial();

const loadfont = (font) => {
  const textGeometry = new TextGeometry("Welcome", {
    font,
    size: 0.5,
    height: 0.2,
  });
  //How to center the text
  /* Method 1
  textGeometry.computeBoundingBox();

  textGeometry.translate(
    -textGeometry.boundingBox.max.x * 0.5,
    -textGeometry.boundingBox.max.y * 0.5,
    -textGeometry.boundingBox.max.z * 0.5
  );
  */
  //Method 2: Much easier
  textGeometry.center();
  const textmesh = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(textmesh);
};

fontLoader.load("gentilis_regular.typeface.json", loadfont);

for (let i = 0; i < 20; i++) {
  const cube = new THREE.Mesh(
    new THREE.SphereGeometry(Math.random() * 0.5),
    textMaterial
  );
  cube.position.set(
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5
  );
  scene.add(cube);
}
