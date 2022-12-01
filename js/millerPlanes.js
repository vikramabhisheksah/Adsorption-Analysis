var selectedMillerIndices = null;

const plotItem = (x, y, z) => {
  const canvas = document.createElement("canvas");
  const tooltipContainer = document.createElement("div");
  tooltipContainer.classList.add("tooltip2");
  const tooltipText = document.createElement("span");
  tooltipText.classList.add("tooltiptext");
  tooltipText.innerHTML = `x: ${x}; y: ${y}, z: ${z}`;
  const plots = document.querySelector("div.plots");

  tooltipContainer.appendChild(canvas);
  tooltipContainer.appendChild(tooltipText);

  plots.appendChild(tooltipContainer);

  canvas.onclick = function () {
    selectedMillerIndices = { x, y, z };
  };

  const scene = new THREE.Scene();

  const sizes = {
    width: 180,
    height: 135,
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

  var tooltip = d3
    .select("#my_dataviz")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .text(x, y, z);

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

    function createTriangle(vertices) {
      var v3 = vertices.map(([x, y, z]) => {
        if (x === y && z === x) {
          return new THREE.Vector3(x + 0.0001, y - 0.0001, z);
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

      if (triangles.length === 0) {
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(2, 1, 0));
      }

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

    if (p1 === p2 && p1 === 0) {
      scene.add(
        createTriangle([
          [0, 0, p3],
          [p3, 0, p3],
          [0, p3, p3],
        ])
      );
      scene.add(
        createTriangle([
          [p3, p3, p3],
          [p3, 0, p3],
          [0, p3, p3],
        ])
      );
    } else if (p1 === p3 && p1 === 0) {
      scene.add(
        createTriangle([
          [0, p2, 0],
          [p2, p2, 0],
          [0, p2, p2],
        ])
      );
      scene.add(
        createTriangle([
          [p2, p2, p2],
          [p2, p2, 0],
          [0, p2, p2],
        ])
      );
    } else if (p2 === p3 && p2 === 0) {
      scene.add(
        createTriangle([
          [p1, 0, 0],
          [p1, p1, 0],
          [p1, 0, p1],
        ])
      );

      scene.add(
        createTriangle([
          [p1, p1, p1],
          [p1, p1, 0],
          [p1, 0, p1],
        ])
      );
    } else {
      scene.add(
        createTriangle([
          [p1, 0, 0],
          [0, p2, 0],
          [0, 0, p3],
        ])
      );
    }
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

function parseTuple(tuple) {
  tuple = tuple.replace("(", "").replace(")", "");

  return tuple.split(",").map((i) => parseFloat(i));
}

const plotMillerIndices = async (millerData) => {
  document.querySelector("div.plots").innerHTML = "";
  THREE.Cache.clear();

  let millerIndices = millerData.map((i) => i.miller_index);

  millerIndices = [...new Set(millerIndices)].slice(0, 15);

  for (let data of millerIndices) {
    plotItem(...parseTuple(data));
  }
};

function nextPage() {
  let activePage = parseFloat(
    document.querySelector("span.page-number").innerHTML
  );
  document.querySelector("span.page-number").innerHTML = activePage + 1;
  plotMillerIndices();
}

function prevPage() {
  let activePage = parseFloat(
    document.querySelector("span.page-number").innerHTML
  );
  document.querySelector("span.page-number").innerHTML = activePage - 1;
  plotMillerIndices();
}

document.querySelectorAll("div.plots > canvas").forEach((item, ind) => {
  item.addEventListener("click", () => {
    console.log(`Click on ${ind}`);
  });
});
