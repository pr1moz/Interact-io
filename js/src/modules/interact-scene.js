/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.renderScene = function () {
  var scope = this;

  this.camera = null;
  this.controls = null;
  this.scene = null;
  this.renderer = null;

  this.initScene = function () {
    scope.scene = new THREE.Scene();
    scope.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    scope.renderer = new THREE.WebGLRenderer();
    scope.renderer.setClearColor( scope.scene.fog.color );
    scope.renderer.setPixelRatio( window.devicePixelRatio );
    scope.renderer.setSize( window.innerWidth, window.innerHeight );

    scope.container.appendChild( scope.renderer.domElement );

    scope.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    scope.camera.position.z = 500;

    scope.controls = new INTERACT.OrbitControls( scope.camera, scope.renderer.domElement );
    scope.controls.enableDamping = true;
    scope.controls.dampingFactor = 0.25;
    scope.controls.enableZoom = false;

    // world

    var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
    var material =  new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );

    for ( var i = 0; i < 500; i ++ ) {

      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = ( Math.random() - 0.5 ) * 1000;
      mesh.position.y = ( Math.random() - 0.5 ) * 1000;
      mesh.position.z = ( Math.random() - 0.5 ) * 1000;
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      scope.scene.add( mesh );

    }

    // lights
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scope.scene.add( light );

    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    scope.scene.add( light );

    light = new THREE.AmbientLight( 0x222222 );
    scope.scene.add( light );

    //

    window.addEventListener( 'resize', scope.onWindowResize, false );

    scope.render();
  };

  this.render = function () {
    requestAnimationFrame( scope.render );
    scope.controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    scope.renderer.render( scope.scene, scope.camera );
  };

  this.onWindowResize = function () {
    scope.camera.aspect = window.innerWidth / window.innerHeight;
    scope.camera.updateProjectionMatrix();
    scope.renderer.setSize( window.innerWidth, window.innerHeight );
  };

  this.initScene();
};
