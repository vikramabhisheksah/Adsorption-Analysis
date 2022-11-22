const plotItem = (x, y, z) => {
  const canvas = document.createElement("canvas");
  const plots = document.querySelector("div.plots");
  plots.appendChild(canvas);

  const scene = new THREE.Scene();

  const sizes = {
    width: canvas.width,
    height: canvas.height,
  };

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);
  controls.update();

  renderer.setSize(sizes.width, sizes.height);

  const axesHelper1 = new THREE.AxesHelper(-10);
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper1);
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

    function createPolygon(vertices) {
      var v3 = vertices.map(([x, y, z]) => {
        if (x === y && y === z) {
          return new THREE.Vector3(x + 0.00000001, y, z);
        } else {
          return new THREE.Vector3(x, y, z);
        }
      });

      var holes = [];
      var triangles, mesh;
      var geometry = new THREE.Geometry();
      var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.4,
        transparent: true,
      });

      geometry.vertices = v3;

      triangles = THREE.ShapeUtils.triangulateShape(v3, holes);

      for (var i = 0; i < triangles.length; i++) {
        geometry.faces.push(
          new THREE.Face3(triangles[i][0], triangles[i][1], triangles[i][2])
        );
        geometry.faces.push(
          new THREE.Face3(triangles[i][2], triangles[i][1], triangles[i][0])
        );
      }

      mesh = new THREE.Mesh(geometry, material);

      return mesh;
    }

    scene.add(
      createPolygon([
        [p1, 0, 0],
        [0, p2, 0],
        [0, 0, p3],
      ])
    );
  }

  drawThreePointTriangle(x, y, z);

  const animate = () => {
    controls.update();

    renderer.render(scene, camera);

    // Call animate for each frame
    window.requestAnimationFrame(animate);
  };

  animate();
};

plotItem(1, 1, 1);
plotItem(0, 1, 1);
plotItem(0, -1, 1);
plotItem(0, 1, -1);
plotItem(-1, 1, 1);
plotItem(1, 1, -1);


document.querySelectorAll("div.plots > canvas").forEach((item, ind) => {
  item.addEventListener("click", () => {
    console.log(`Click on ${ind}`);
  });
});
