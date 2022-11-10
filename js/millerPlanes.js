const canvas = document.querySelector('canvas.scene');

// const div = document.getElementById('box6');

const scene = new THREE.Scene();

const light = new THREE.DirectionalLight(0xffffff, 0.1);
light.position.set(0,2,20);

const sizes = {
  width: window.innerWidth * 0.35, 
  height: window.innerHeight * 0.40
};

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1, 1000 
);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  // alpha: true ,
  canvas: canvas
});

controls = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.set(2, 2, 2);
camera.lookAt(0,0,0);
controls.update();

//controls.update() must be called after any manual changes to the camera's transform

renderer.setSize(sizes.width, sizes.height);
// document.body.appendChild(renderer.domElement);

function drawLine(p1, p2) {
  const material = new THREE.LineBasicMaterial({ color: 'yellow' });
  const points = [];
  points.push(new THREE.Vector3(...p1));
  points.push(new THREE.Vector3(...p2));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

function drawTriangle(points) {
  drawLine(points[0], points[1]);
  drawLine(points[1], points[2]);
  drawLine(points[2], points[0]);
}


const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

function drawThreePointTriangle(p1, p2, p3) {
  const max = Math.max(p1, p2, p3);

  if (max > 1) {
    p1 /= max;
    p2 /= max;
    p3 /= max;
  }

  const min = Math.min(p1, p2, p3);

  if (min < -1) {
    p1 /= min;
    p2 /= min;
    p3 /= min;
  }

  drawTriangle([
    [p1, 0, 0],
    [0, p2, 0],
    [0, 0, p3],
  ]);
}

drawThreePointTriangle(1, 1, 1);


// setInterval(() => {
//   controls.update();
//   renderer.render(scene, camera);
// }, 10);

const animate = () =>
{
    controls.update();

    renderer.render(scene, camera);

    // Call animate for each frame
    window.requestAnimationFrame(animate);
};

animate();