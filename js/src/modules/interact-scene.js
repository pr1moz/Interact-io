/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.renderScene = function () {
  var scope = this;

  // Scene rendering objects
  this.camera = null;
  this.scene = null;
  this.renderer = null;

  // Location of focus, where the object orbits around
  var target = new THREE.Vector3();
  var panOffset = new THREE.Vector3();

  // How far you can zoom in and out
  var minDistance = 10;
  var maxDistance = 1000;

  // How far you can orbit vertically, upper and lower limits.
  // Range is 0 to Math.PI radians.
  var minPolarAngle = 0; // radians
  var maxPolarAngle = Math.PI; // radians

  // How far you can orbit horizontally, upper and lower limits.
  // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
  var minAzimuthAngle = - Infinity; // radians
  var maxAzimuthAngle = Infinity; // radians

  // Use this small number to prevent full 180 / 0 camera angle
  var EPS = 0.000001;

  // Initial state to reset to
  var targetReset = target.clone();
  var positionReset = new THREE.Vector3();
  var zoomReset = 1;

  // current position in spherical coordinates
  var spherical = new THREE.Spherical();

  var scale = 1;

  function initScene () {
    // Init new scene
    scope.scene = new THREE.Scene();
    scope.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    // Init renderer
    scope.renderer = new THREE.WebGLRenderer();
    scope.renderer.setClearColor(scope.scene.fog.color);
    scope.renderer.setPixelRatio(window.devicePixelRatio);
    scope.renderer.setSize(window.innerWidth, window.innerHeight);

    // Attach <canvas> to container node
    scope.container.appendChild(scope.renderer.domElement);

    // Prepare camera
    scope.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    scope.camera.position.z = 500;
    positionReset.copy(scope.camera.position);

    // Generate the world
    var geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);
    var material =  new THREE.MeshPhongMaterial({color:0xffffff, shading: THREE.FlatShading});

    for (var i = 0; i < 500; i ++) {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (Math.random() - 0.5) * 1000;
      mesh.position.y = (Math.random() - 0.5) * 1000;
      mesh.position.z = (Math.random() - 0.5) * 1000;
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      scope.scene.add(mesh);
    }

    // Add lights
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scope.scene.add(light);

    light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    scope.scene.add(light);

    light = new THREE.AmbientLight(0x222222);
    scope.scene.add(light);

    // Update camera position and other parameters before render
    updateView();

    // Add event listeners
    scope.win.addEventListener('resize', onWindowResize, false);
    scope.win.addEventListener('resetView', resetView, false);
    scope.win.addEventListener('updateView', updateView, false);

    // Start rendering
    render();

  }

  function render () {
    requestAnimationFrame(render);
    scope.renderer.render(scope.scene, scope.camera);
  }

  function updateView () {
    if (scope.panChanged) {
      cameraPan();
    }

    if (scope.zoomChanged) {
      cameraZoom();
    }

    // Distance between camera and target
    var offset = new THREE.Vector3();

    // Keeps camera always pointing up
    var quat = new THREE.Quaternion().setFromUnitVectors(scope.camera.up, new THREE.Vector3( 0, 1, 0 ) );
    var quatInverse = quat.clone().inverse();

    // Last camera position to apply delta to
    var lastPosition = new THREE.Vector3();
    var lastQuaternion = new THREE.Quaternion();

    var position = scope.camera.position;
    // Calculate the offset of camera from target
    // to apply calculations to
    offset.copy(position).sub(target);

    // Rotate offset to "y-axis-is-up" space
    offset.applyQuaternion(quat);

    // Angle from z-axis around y-axis
    spherical.setFromVector3(offset);

    // Apply delta from parent scope
    spherical.theta += scope.sphericalDelta.theta;
    spherical.phi += scope.sphericalDelta.phi;

    // Restrict theta to be between desired limits
    spherical.theta = Math.max(minAzimuthAngle, Math.min(maxAzimuthAngle, spherical.theta));

    // Restrict phi to be between desired limits
    spherical.phi = Math.max(minPolarAngle, Math.min(maxPolarAngle, spherical.phi));
    spherical.makeSafe();
    spherical.radius *= scale;

    // Restrict radius to be between desired limits
    spherical.radius = Math.max(minDistance, Math.min(maxDistance, spherical.radius));

    // Move target to panned location
    target.add(panOffset);

    offset.setFromSpherical(spherical);

    // Rotate offset back to "camera-up-vector-is-up" space
    offset.applyQuaternion(quatInverse);

    // Set camera position to 0 (target)
    // and apply new calculated offset
    position.copy(target).add(offset);
    scope.camera.lookAt(target);

    // Reset sphericalDelta if input is mouse
    if (scope.INPUT !== scope.INPUTLIST.KEYBOARD) {
      scope.sphericalDelta.set(0, 0, 0);
    }

    scale = 1;
    panOffset.set(0, 0, 0);

    // update condition is:
    // min(camera displacement, camera rotation in radians)^2 > EPS
    // using small-angle approximation cos(x/2) = 1 - x^2 / 8
    if (lastPosition.distanceToSquared(scope.camera.position) > EPS ||
      8 * (1 - lastQuaternion.dot(scope.camera.quaternion)) > EPS) {
      lastPosition.copy(scope.camera.position);
      lastQuaternion.copy(scope.camera.quaternion);
    }
  }

  function cameraPan () {
    var offset = new THREE.Vector3();
    var temp = new THREE.Vector3();

    // Perspective
    var position = scope.camera.position;
    offset.copy(position).sub(target);
    var targetDistance = offset.length();

    // Calculate target distance of camera
    targetDistance *= Math.tan((scope.camera.fov / 2) * Math.PI / 180.0);

    // Set the pan on x axis
    temp.setFromMatrixColumn(scope.camera.matrix, 0); // get X column of objectMatrix
    temp.multiplyScalar(- (2 * scope.panDelta.x * targetDistance / scope.renderer.domElement.clientHeight));
    panOffset.add(temp);

    temp = new THREE.Vector3();

    // Set the pan on y axis
    temp.setFromMatrixColumn(scope.camera.matrix, 1); // get Y column of objectMatrix
    temp.multiplyScalar(2 * scope.panDelta.y * targetDistance / scope.renderer.domElement.clientHeight);
    panOffset.add(temp);

    if (scope.INPUT !== scope.INPUTLIST.KEYBOARD) {
      scope.panDelta.set(0,0);
      scope.panChanged = false;
    }
  }

  function cameraZoom () {
    if (scope.zoomDelta === 0) return;

    if (scope.zoomDelta > 0) {
      scale *= Math.pow(0.95, scope.zoomDelta);
    } else {
      scale /= Math.pow(0.95, -scope.zoomDelta);
    }

    if (scope.INPUT !== scope.INPUTLIST.KEYBOARD) {
      scope.zoomDelta = 0;
      scope.zoomChanged = false;
    }
  }

  function resetView () {
    target.copy(targetReset);
    scope.camera.position.copy(positionReset);
    scope.camera.zoom = zoomReset;

    scope.camera.updateProjectionMatrix();
    updateView();

    scope.MODE = scope.MODELIST.NONE;
  }

  function onWindowResize () {
    scope.camera.aspect = window.innerWidth / window.innerHeight;
    scope.camera.updateProjectionMatrix();
    scope.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initScene();
};
