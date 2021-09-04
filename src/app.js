// Imports
import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import * as dat from 'dat.gui';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';

// Configuracion basica
let gui = undefined;
let size = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

// Paleta de colores
const palette = {
  bgColor: '#34495e', // CSS String
};

//variables que se van a utilizar en el codigo
let plane = undefined;
let spotLight;

// Variables generales
let countCube = undefined;
let countSphere = undefined;
let countLight = undefined;

let GUIFolderCube = 1;
let GUIFolderSphere = 1;
let GUIFolderLigths = 1;

// Arreglos de objetos
const objectsCube = [];
const objectsSphere = [];
const objectsLight = [];

//funcion para mantener la margen del html
window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

//funcion para setear la segunda ventana y carpeta
//funcion que se utiliza en el boton volver
export function reset() {
  //setear la nueva escena
  scene.children = [];
  renderer.setSize(0, 0, true);
  //contdores de los objetos
  countCube = 0;
  countSphere = 0;
  countLight = 0;
  //contadores de las carpetas
  GUIFolderCube = 1;
  GUIFolderSphere = 1;
  GUIFolderLigths = 1;
}

//funcion principalGUIFolderLigths
export function main(optionSize) {
  reset();
  // Configuracion inicial
  //crea la escena
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(palette.bgColor, 1);
  document.body.appendChild(renderer.domElement);

  //posicion de la camara
  camera.position.z = 15;
  camera.position.y = 15;

  // Controls de la camara
  new OrbitControls(camera, renderer.domElement);

  //funciones javascript
  // Plano por defecto
  defaultPlane(optionSize);

  // GUI
  loadGUI();

  // Light
  setupLights();

  // Render
  animate();
}

//para crear el plano
function defaultPlane(size) {
  const geometry = new THREE.PlaneGeometry(size, size, size, size);
  const material = new THREE.MeshBasicMaterial({
    color: '#f1c40f',
    side: THREE.DoubleSide,
    wireframe: false,
  });
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  plane.receiveShadow = true;
  plane.rotation.x = Math.PI / 2;


  // Render
  animate();

}

//
function loadGUI() {
  cleanGUI();
  gui = new dat.GUI();
  gui.open();
}

// Limpia el GUI
export function cleanGUI() {
  const dom = document.querySelector('.dg.main');
  if (dom) dom.remove();
}

//luces predeterminadas
function setupLights() {
  const light = new THREE.DirectionalLight( 0xFFFFFF );
  const helper = new THREE.DirectionalLightHelper( light, 5 );
  scene.add( helper );
  const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
  pointLight.position.set( 10, 10, 10 );
  scene.add( pointLight ); 

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  spotLight = new THREE.SpotLight( 0xffffff, 1 );
	spotLight.position.set( 15, 40, 35 );
	spotLight.angle = Math.PI / 4;
	spotLight.penumbra = 0.1;
	spotLight.decay = 2;
	spotLight.distance = 200;

	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 512;
	spotLight.shadow.mapSize.height = 512;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 200;
	spotLight.shadow.focus = 1;
  scene.add( spotLight );
}

//create lights 
// Codigo Creacion de Spotlight

export function createLights() {
  const SpotLight = new THREE.SpotLight(0xA71F8B, 1); 
  SpotLight.position.set(0, 10, 0);
  SpotLight.angle = Math.PI / 4;
  SpotLight.penumbra = 0.1;
  SpotLight.decay = 2;
  SpotLight.distance = 200;
  SpotLight.castShadow = true;


  objectsLight.push(SpotLight)
  scene.add(SpotLight);


SpotLight.GUISpotLight = _LightObject();
_createLightGUI(SpotLight.GUISpotLight);

 countLight = countLight + 1;
 }

  function  _LightObject() {
  var GUILight = {
    color: 0xFFFAF0,
    intensity: 1,
    castShadow: true,
    posX: 0,
    posY: 10,
    posZ: 0,
    angle: Math.PI / 4,
    penumbra: 0.1,
    decay: 2,
    distance: 200,
    };
  
  return GUILight;
  }

  function _createLightGUI(GUILight) {
    const folder2 = gui.addFolder('SpotLight ' + GUIFolderLigths);
    // Props
    folder2.addColor(GUILight, 'color');
    folder2.add(GUILight, 'intensity', 0, 1);
    folder2.add(GUILight, 'penumbra', 0, 1);
    folder2.add(GUILight, 'decay', 1, 2);
    // Posicion
    folder2.add(GUILight, 'posX', -6, Math.PI * 2);
    folder2.add(GUILight, 'posY', 0, Math.PI * 2);
    folder2.add(GUILight, 'posZ', -6, Math.PI * 2);
    folder2.add(GUILight, 'angle', Math.PI / 4, Math.PI / 2);
    
    GUIFolderLigths = GUIFolderLigths + 1;
    }


    function _updateLights()    {
      Object.keys(objectsLight).forEach((i) => {
        const SpotLightSelected = objectsLight[i];
      
        SpotLightSelected.color.setHex(SpotLightSelected.GUISpotLight.color);
        SpotLightSelected.intensity = SpotLightSelected.GUISpotLight.intensity;
        SpotLightSelected.penumbra = SpotLightSelected.GUISpotLight.penumbra;
        SpotLightSelected.decay = SpotLightSelected.GUISpotLight.decay;
        

        //Posición
        SpotLightSelected.position.x = SpotLightSelected.GUISpotLight.posX;
        SpotLightSelected.position.y = SpotLightSelected.GUISpotLight.posY;
        SpotLightSelected.position.z = SpotLightSelected.GUISpotLight.posZ;
        SpotLightSelected.angle = SpotLightSelected.GUISpotLight.angle;
      });
  }


function animate() {
  requestAnimationFrame(animate);
  updateElements();
  renderer.render(scene, camera);
}

function updateElements() {
  _updateCubes();
  _updateSpheres();
  _updateLights();
}

//funcion para crear el cubo en html
export function createCubeGeneric() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0xffaec0,
    wireframe: false,
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);
  objectsCube.push(cube);
  cube.position.y = 0.5;
  cube.castShadow = true;
  cube.receiveShadow = true;

  cube.GUIcube = _cubeObject();
  _createCubeGUI(cube.GUIcube);

  countCube = countCube + 1;
}


//funcion para definir el cubo como objeto
function _cubeObject() {
  var GUIcube = {
    material: 'Basic',
    wireframe: false,
    materialColor: 0xffaec0,
    scaleX: 2,
    scaleY: 3,
    scaleZ: 10,
    posX: 0,
    posY: 0.5,
    posZ: 0,
  };

  return GUIcube;
}
//funcion para crear la carpeta de los cubos
function _createCubeGUI(GUIcube) {
  const folder = gui.addFolder('Cube ' + GUIFolderCube);

  //wireframe
  folder.add(GUIcube, 'wireframe');
  // Material
  folder.addColor(GUIcube, 'materialColor');
  folder.add(GUIcube, 'material', ['Basic', 'Phong', 'Lambert']);

  // Escala
  folder.add(GUIcube, 'scaleX');
  folder.add(GUIcube, 'scaleY');
  folder.add(GUIcube, 'scaleZ');

  // Posicion
  folder.add(GUIcube, 'posX');
  folder.add(GUIcube, 'posY');
  folder.add(GUIcube, 'posZ');

  GUIFolderCube = GUIFolderCube + 1;
}

//funcion priavada para los cambios de los cubos
function _updateCubes() {
  Object.keys(objectsCube).forEach((i) => {
    const cubeSelected = objectsCube[i];

    

    //Material cubo
    cubeSelected.GUIcube.material == 'Basic'
      ? (cubeSelected.material = new THREE.MeshBasicMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : cubeSelected.GUIcube.material == 'Lambert'
      ? (cubeSelected.material = new THREE.MeshLambertMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : (cubeSelected.material = new THREE.MeshPhongMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }));

    //wireframe
    cubeSelected.material.wireframe = cubeSelected.GUIcube.wireframe;
    
    //Escalar cubo
    cubeSelected.geometry = new THREE.BoxGeometry(
      cubeSelected.GUIcube.scaleX,
      cubeSelected.GUIcube.scaleY,
      cubeSelected.GUIcube.scaleZ,
    );

    //Posición
    cubeSelected.position.x = cubeSelected.GUIcube.posX;
    cubeSelected.position.y = cubeSelected.GUIcube.posY;
    cubeSelected.position.z = cubeSelected.GUIcube.posZ;
  });

}
//funcion para crear la esfera desde el boton 
export function createSphereGeneric() {
  const geometry = new THREE.SphereGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0xffaec0,
    wireframe: false,
  });
  const sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);
  objectsSphere.push(sphere);
  sphere.position.y = 0.5;
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  sphere.GUIsphere = _SphereObject();
  _createSphereGUI(sphere.GUIsphere);

  countSphere = countSphere + 1;
}

//funcion para el arreglo de las opciones
function _SphereObject() {
  var GUIsphere = {
    material: 'Basic',
    wireframe: false,
    materialColor: 0xffaec0,
    scaleX: 1,
    scaleY: 9,
    scaleZ: 9,
    posX: 0,
    posY: 0.5,
    posZ: 0,
  };

  return GUIsphere;
}

//funcion para añadir las opciones de la esfera al gui
function _createSphereGUI(GUIsphere) {
  const folder2 = gui.addFolder('Sphere ' + GUIFolderSphere);

  //wireframe
  folder2.add(GUIsphere, 'wireframe');
  // Material
  folder2.addColor(GUIsphere, 'materialColor');
  folder2.add(GUIsphere, 'material', ['Basic', 'Phong', 'Lambert']);

  // Escala
  folder2.add(GUIsphere, 'scaleX');
  folder2.add(GUIsphere, 'scaleY');
  folder2.add(GUIsphere, 'scaleZ');

  // Posicion
  folder2.add(GUIsphere, 'posX');
  folder2.add(GUIsphere, 'posY');
  folder2.add(GUIsphere, 'posZ');

  GUIFolderSphere = GUIFolderSphere + 1;
}

//funcion para generar los cambios en la esfera 
function _updateSpheres() {
  Object.keys(objectsSphere).forEach((i) => {
    const sphereSelected = objectsSphere[i];

    //Material cubo
    sphereSelected.GUIsphere.material == 'Basic'
      ? (sphereSelected.material = new THREE.MeshBasicMaterial({
          color: sphereSelected.GUIsphere.materialColor,
        }))
      : sphereSelected.GUIsphere.material == 'Lambert'
      ? (sphereSelected.material = new THREE.MeshLambertMaterial({
          color: sphereSelected.GUIsphere.materialColor,
        }))
      : (sphereSelected.material = new THREE.MeshPhongMaterial({
          color: sphereSelected.GUIsphere.materialColor,
        }));
    
    //wireframe
    sphereSelected.material.wireframe = sphereSelected.GUIsphere.wireframe;


    //Escalar cubo
    sphereSelected.geometry = new THREE.SphereGeometry(
      sphereSelected.GUIsphere.scaleX,
      sphereSelected.GUIsphere.scaleY,
      sphereSelected.GUIsphere.scaleZ,
    );

    //Posición
    sphereSelected.position.x = sphereSelected.GUIsphere.posX;
    sphereSelected.position.y = sphereSelected.GUIsphere.posY;
    sphereSelected.position.z = sphereSelected.GUIsphere.posZ;
  });
}


