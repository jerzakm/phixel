import * as THREE from 'three'
import Hexasphere from './geometry/hexasphere';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

var width = window.innerWidth;
var height = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);

var cameraDistance = 65;
var camera = new THREE.PerspectiveCamera(cameraDistance, width / height, 1, 30);
camera.position.z = -cameraDistance;

var controls = new OrbitControls(camera, renderer.domElement);

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 20, 100);
controls.update();

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, cameraDistance * .4, cameraDistance * 1.2);

const img = document.createElement('img')
img.src = 'equirectangle_projection.png'
img.onload = function () {
  render(img);
};

let mainHexasphere

function render(img: HTMLImageElement) {
  var projectionCanvas = document.createElement('canvas');
  var projectionContext = projectionCanvas.getContext('2d');

  projectionCanvas.width = img.width;
  projectionCanvas.height = img.height;
  projectionContext.drawImage(img, 0, 0, img.width, img.height);

  var pixelData = projectionContext.getImageData(0, 0, img.width, img.height);

  var maxLat = -100;
  var maxLon = 0;
  var minLat = 0;
  var minLon = 0;

  var isLand = function (lat: any, lon: any) {

    var x: any = parseInt(`${img.width * (lon + 180) / 360}`);
    var y: any = parseInt(`${img.height * (lat + 90) / 180}`);

    if (pixelData == null) {
      pixelData = projectionContext.getImageData(0, 0, img.width, img.height);
    }
    return pixelData.data[(y * pixelData.width + x) * 4] === 0;
  };

  var meshMaterials = [];
  meshMaterials.push(new THREE.MeshBasicMaterial({
    color: 0xEFEFEF,
    transparent: true
  }));

  var oceanMaterial = []
  oceanMaterial.push(new THREE.MeshBasicMaterial({
    color: 0x999999,
    transparent: true
  }));


  var introTick = 0;
  var seenTiles = {};
  var currentTiles = [];

  var createScene = function (radius, divisions, tileSize) {
    introTick = -1;
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    var hexasphere = new Hexasphere(radius, divisions, tileSize);

    // var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    console.log(hexasphere.tiles.length)
    for (var i = 0; i < hexasphere.tiles.length; i++) {
      var t = hexasphere.tiles[i];
      var latLon = t.getLatLon(hexasphere.radius);

      var geometry = new THREE.Geometry();

      for (var j = 0; j < t.boundary.length; j++) {
        var bp = t.boundary[j];
        geometry.vertices.push(new THREE.Vector3(bp.x, bp.y, bp.z));
      }
      geometry.faces.push(new THREE.Face3(0, 1, 2));
      geometry.faces.push(new THREE.Face3(0, 2, 3));
      geometry.faces.push(new THREE.Face3(0, 3, 4));
      if (geometry.vertices.length > 5) {
        geometry.faces.push(new THREE.Face3(0, 4, 5));
      }

      let material: any = {};

      if (isLand(latLon.lat, latLon.lon)) {
        material = meshMaterials[Math.floor(Math.random() * meshMaterials.length)]
      } else {
        material = oceanMaterial[Math.floor(Math.random() * oceanMaterial.length)]
      }

      material.opacity = 1;
      var mesh = new THREE.Mesh(geometry, material);
      // mesh.position.set(t.centerPoint.x, t.centerPoint.y, t.centerPoint.z)
      scene.add(mesh);
      hexasphere.tiles[i].mesh = mesh;

    }


    introTick = 0;
    mainHexasphere = hexasphere
  };
  createScene(40, 140, .97);

  var startTime = Date.now();
  var lastTime = Date.now();
  var cameraAngle = -Math.PI / 1.5;

  let h = 0;
  let v = 0;

  window.addEventListener('keydown', (ev) => {
    h = 0; v = 0;
    if (ev.key == 'w') {
      h = 1;
    } else if (ev.key == 's') {
      h = -1;
    } else if (ev.key == 'd') {
      v = 1;
    } else if (ev.key == 'a') {
      v = -1;
    }
  });

  var rotateCameraBy = (2 * Math.PI) / (200000 / 2000);
  cameraAngle += rotateCameraBy;
  camera.position.x = cameraDistance * Math.cos(cameraAngle);
  camera.position.y = Math.sin(cameraAngle) * 10;
  camera.position.z = cameraDistance * Math.sin(cameraAngle);
  camera.lookAt(scene.position);

  var tick = function () {

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(tick);

  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function clamp(val, min, max) {
    return Math.min(Math.max(min, val), max);
  }

  document.body.appendChild(renderer.domElement)
  requestAnimationFrame(tick);
  // window.scene = scene;
  // window.createScene = createScene;
}
