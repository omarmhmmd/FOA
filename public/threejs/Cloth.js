/*
 * Cloth Simulation using a relaxed constrains solver
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

var DAMPING = 0.03;
var DRAG = 1 - DAMPING;
var MASS = 0.1;
var restDistance = 25;

var xSegs = 10; //
var ySegs = 10; //

var clothFunction = plane(restDistance * xSegs, restDistance * ySegs);

var cloth = new Cloth(xSegs, ySegs);

var GRAVITY = 981 * 1.4; //
var gravity = new THREE.Vector3(0, -GRAVITY, 0).multiplyScalar(MASS);

var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;

var pins = [];

var wind = true;
var windStrength = 2;
var windForce = new THREE.Vector3(0, 0, 0);

var ballPosition = new THREE.Vector3(0, -45, 0);
var ballSize = 60; //40

var tmpForce = new THREE.Vector3();

var lastTime;

function plane(width, height) {
  return function (u, v) {
    var x = (u - 0.5) * width;
    var y = (v + 0.5) * height;
    var z = 0;

    return new THREE.Vector3(x, y, z);
  };
}

function Particle(x, y, z, mass) {
  this.position = clothFunction(x, y); // position
  this.previous = clothFunction(x, y); // previous
  this.original = clothFunction(x, y);
  this.a = new THREE.Vector3(0, 0, 0); // acceleration
  this.mass = mass;
  this.invMass = 1 / mass;
  this.tmp = new THREE.Vector3();
  this.tmp2 = new THREE.Vector3();
}

// Force -> Acceleration
Particle.prototype.addForce = function (force) {
  this.a.add(this.tmp2.copy(force).multiplyScalar(this.invMass));
};

// Performs verlet integration
Particle.prototype.integrate = function (timesq) {
  var newPos = this.tmp.subVectors(this.position, this.previous);
  newPos.multiplyScalar(DRAG).add(this.position);
  newPos.add(this.a.multiplyScalar(timesq));

  this.tmp = this.previous;
  this.previous = this.position;
  this.position = newPos;

  this.a.set(0, 0, 0);
};

var diff = new THREE.Vector3();

function satisifyConstrains(p1, p2, distance) {
  diff.subVectors(p2.position, p1.position);
  var currentDist = diff.length();
  if (currentDist == 0) return; // prevents division by 0
  var correction = diff.multiplyScalar(1 - distance / currentDist);
  var correctionHalf = correction.multiplyScalar(0.5);
  p1.position.add(correctionHalf);
  p2.position.sub(correctionHalf);
}

function Cloth(w, h) {
  w = w || 10;
  h = 15;
  this.w = w;
  this.h = h;

  var particles = [];
  var constrains = [];

  var u, v;

  // Create particles
  for (v = 0; v <= h; v++) {
    for (u = 0; u <= w; u++) {
      particles.push(new Particle(u / w, v / h, 0, MASS));
    }
  }

  // Structural

  for (v = 0; v < h; v++) {
    for (u = 0; u < w; u++) {
      constrains.push([
        particles[index(u, v)],
        particles[index(u, v + 1)],
        restDistance,
      ]);

      constrains.push([
        particles[index(u, v)],
        particles[index(u + 1, v)],
        restDistance,
      ]);
    }
  }

  for (u = w, v = 0; v < h; v++) {
    constrains.push([
      particles[index(u, v)],
      particles[index(u, v + 1)],
      restDistance,
    ]);
  }

  for (v = h, u = 0; u < w; u++) {
    constrains.push([
      particles[index(u, v)],
      particles[index(u + 1, v)],
      restDistance,
    ]);
  }

  // While many system uses shear and bend springs,
  // the relax constrains model seem to be just fine
  // using structural springs.
  // Shear
  // var diagonalDist = Math.sqrt(restDistance * restDistance * 2);

  // for (v=0;v<h;v++) {
  // 	for (u=0;u<w;u++) {

  // 		constrains.push([
  // 			particles[index(u, v)],
  // 			particles[index(u+1, v+1)],
  // 			diagonalDist
  // 		]);

  // 		constrains.push([
  // 			particles[index(u+1, v)],
  // 			particles[index(u, v+1)],
  // 			diagonalDist
  // 		]);

  // 	}
  // }

  this.particles = particles;
  this.constrains = constrains;

  function index(u, v) {
    return u + v * (w + 1);
  }

  this.index = index;
}

function simulate(time) {
  if (!lastTime) {
    lastTime = time;
    return;
  }

  var i, il, particles, particle, pt, constrains, constrain;

  // Aerodynamics forces
  if (wind) {
    var face,
      faces = clothGeometry.faces,
      normal;

    particles = cloth.particles;

    for (i = 0, il = faces.length; i < il; i++) {
      face = faces[i];
      normal = face.normal;

      tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
      particles[face.a].addForce(tmpForce);
      particles[face.b].addForce(tmpForce);
      particles[face.c].addForce(tmpForce);
    }
  }

  for (particles = cloth.particles, i = 0, il = particles.length; i < il; i++) {
    particle = particles[i];
    particle.addForce(gravity);

    particle.integrate(TIMESTEP_SQ);
  }

  // Start Constrains

  (constrains = cloth.constrains), (il = constrains.length);
  for (i = 0; i < il; i++) {
    constrain = constrains[i];
    satisifyConstrains(constrain[0], constrain[1], constrain[2]);
  }

  // Ball Constrains

  ballPosition.z = -Math.sin(Date.now() / 600) * 90; //+ 40;
  ballPosition.x = Math.cos(Date.now() / 400) * 70;

  if (sphere.visible)
    for (
      particles = cloth.particles, i = 0, il = particles.length;
      i < il;
      i++
    ) {
      particle = particles[i];
      pos = particle.position;
      diff.subVectors(pos, ballPosition);
      if (diff.length() < ballSize) {
        // collided
        diff.normalize().multiplyScalar(ballSize);
        pos.copy(ballPosition).add(diff);
      }
    }

  // Floor Constains
  for (particles = cloth.particles, i = 0, il = particles.length; i < il; i++) {
    particle = particles[i];
    pos = particle.position;
    if (pos.y < -250) {
      pos.y = -250;
    }
  }

  // Pin Constrains
  for (i = 0, il = pins.length; i < il; i++) {
    var xy = pins[i];
    var p = particles[xy];
    p.position.copy(p.original);
    p.previous.copy(p.original);
  }
}

 // empirically, it's about 16-17 ms
 var rotationVal = 0;
 rotationVal = Math.PI / 4;

 var time0 = new Date("2014/10/24").getTime();
 var time = time0;
 var deltaT = 16;
 var stepNumber = 0;

 /* testing cloth simulation */
 var pinsFormation = [];
 var pins = [6];

 pinsFormation.push(pins);

 pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 pinsFormation.push(pins);

 pins = [0];
 pinsFormation.push(pins);

 pins = []; // cut the rope ;)
 pinsFormation.push(pins);

 pins = [0, cloth.w]; // classic 2 pins
 pinsFormation.push(pins);

 pins = pinsFormation[1];

 function togglePins() {
	 pins = pinsFormation[~~(Math.random() * pinsFormation.length)];
 }

 var container; // the DOM element (a DIV) that contains the canvas and info)
 var camera, scene, renderer;

 var clothGeometry;
 var sphere;
 var object, arrow;

 var rotate = false;

 function init() {
	 container = document.createElement("div");
	 document.body.appendChild(container);

	 // scene
	 scene = new THREE.Scene();
	 scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);

	 // camera
	 camera = new THREE.PerspectiveCamera(
		 50,
		 window.innerWidth / window.innerHeight,
		 1,
		 10000
	 );
	 camera.position.y = 1;
	 camera.position.z = 1500;
	 scene.add(camera);

	 // lights
	 var light, materials;
	 scene.add(new THREE.AmbientLight(0x666666));
	 light = new THREE.DirectionalLight(0xdfebff, 1.75);

	 light.position.set(50, 200, 100);
	 light.position.multiplyScalar(1.3);
	 light.castShadow = false;
	 //light.shadowCameraVisible = true;
	 light.shadowMapWidth = 2048;
	 light.shadowMapHeight = 2048;

	 var d = 300;

	 light.shadowCameraLeft = -d;
	 light.shadowCameraRight = d;
	 light.shadowCameraTop = d;
	 light.shadowCameraBottom = -d;
	 light.shadowCameraFar = 1000;
	 light.shadowDarkness = 0.5;

	 scene.add(light);

	 light = new THREE.DirectionalLight(0x3dff0c, 0.35);
	 light.position.set(0, -1, 0);

	 scene.add(light);

	 // cloth material
	 var clothTexture = THREE.ImageUtils.loadTexture(
		 "flag-imgs/group-C/14.png"
	 );
	 clothTexture.wrapS = THREE.RepeatWrapping;
	 clothTexture.anisotropy = 16;
	 clothTexture.rotation = Math.PI / 4;
	 clothTexture.needsUpdate = true;
	 console.log(clothTexture);

	 var clothMaterial = new THREE.MeshPhongMaterial({
		 alphaTest: 0.1,
		 ambient: 0xffffff,
		 color: 0xffffff,
		 specular: 0x030303,
		 emissive: 0x787878,
		 shininess: 10,
		 rotation: Math.PI / 4,
		 map: clothTexture,
		 side: THREE.DoubleSide,
	 });

	 // cloth geometry
	 clothGeometry = new THREE.ParametricGeometry(
		 clothFunction,
		 cloth.w,
		 cloth.h
	 );

	 clothGeometry.dynamic = true;
	 // clothGeometry.rotation = Math.PI / 4;
	 clothGeometry.computeFaceNormals();

	 var img = new Image();
	 // img.onload = createMeshThenRender;
	 img.src = "img.jpg";

	 var imgWidth = (imgHeight = 256);
	 var mapCanvas = document.createElement("canvas");
	 mapCanvas.width = mapCanvas.height = 256;

	 // document.body.appendChild( mapCanvas );
	 var ctx = mapCanvas.getContext("2d");
	 ctx.translate(imgWidth / 2, imgHeight / 2);
	 ctx.rotate(Math.PI / 4);
	 ctx.translate(-imgWidth / 2, -imgHeight / 2);
	 ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

	 var texture = new THREE.Texture(mapCanvas);
	 texture.needsUpdate = true;

	 // cloth mesh
	 object = new THREE.Mesh(clothGeometry, clothMaterial);
	 object.position.set(10, 225, 0);
	 object.castShadow = true;
	 object.receiveShadow = true;
	 object.rotation.z = Math.PI / 2;
	 scene.add(object);

	 // sphere
	 var ballGeo = new THREE.SphereGeometry(ballSize, 20, 20);
	 var ballMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
	 sphere = new THREE.Mesh(ballGeo, ballMaterial);
	 sphere.castShadow = true;
	 sphere.receiveShadow = true;
	 scene.add(sphere);
	 // arrow
	 arrow = new THREE.ArrowHelper(
		 new THREE.Vector3(0, 1, 0),
		 new THREE.Vector3(0, 0, 0),
		 100, // length of arrow
		 THREE.ColorKeywords.red,
		 20, // length of arrowhead
		 10 // width of arrowhead
	 );
	 arrow.position.set(-200, 0, -200);

	 // ground
	 var initColor = new THREE.Color(0x957e5c);
	 var initTexture = THREE.ImageUtils.generateDataTexture(1, 1, initColor);

	 var groundMaterial = new THREE.MeshPhongMaterial({
		 color: 0xffffff,
		 specular: 0x111111,
		 map: initTexture,
	 });

	 var groundTexture = THREE.ImageUtils.loadTexture(
		 "grasslight-big.jpg",
		 undefined,
		 function () {
			 groundMaterial.map = groundTexture;
		 }
	 );
	 groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	 groundTexture.repeat.set(25, 25);
	 groundTexture.anisotropy = 16;

	 var mesh = new THREE.Mesh(
		 new THREE.PlaneGeometry(20000, 20000),
		 groundMaterial
	 );
	 mesh.position.y = -250;
	 mesh.rotation.x = -Math.PI / 2;
	 mesh.receiveShadow = true;
	 scene.add(mesh);

	 // poles
	 var poleGeo = new THREE.BoxGeometry(7.5, 850, 5);
	 var poleMat = new THREE.MeshPhongMaterial({
		 color: 0x000000,
		 specular: 0xffffff,
		 shiness: 100,
	 });

	 var mesh = new THREE.Mesh(poleGeo, poleMat);
	 mesh.position.x = -120;
	 mesh.position.y = -62;
	 mesh.receiveShadow = true;
	 mesh.castShadow = true;
	 scene.add(mesh);
	 //
	 renderer = new THREE.WebGLRenderer({ antialias: true });
	 renderer.setSize(window.innerWidth, window.innerHeight);
	 renderer.setClearColor(scene.fog.color);

	 container.appendChild(renderer.domElement);

	 renderer.gammaInput = true;
	 renderer.gammaOutput = true;

	 renderer.shadowMapEnabled = true;

	 //

	 window.addEventListener("resize", onWindowResize, false);

	 sphere.visible = !true;
 }

 function onWindowResize() {
	 camera.aspect = window.innerWidth / window.innerHeight;
	 camera.updateProjectionMatrix();

	 renderer.setSize(window.innerWidth, window.innerHeight);
 }

 // not used in this version
 function animate() {
	 var time = Date.now();

	 requestAnimationFrame(animate);

	 oneStep(time);
 }

 function oneStep(time) {
	 windStrength = Math.cos(time / 7000) * 20 + 40;
	 windForce
		 .set(
			 Math.sin(time / 2000),
			 Math.cos(time / 3000),
			 Math.sin(time / 1000)
		 )
		 .normalize()
		 .multiplyScalar(windStrength);
	 arrow.setLength(windStrength * 5);
	 windDir = new THREE.Vector3().copy(windForce);
	 windDir.normalize();
	 arrow.setDirection(windDir);
	 simulate(time);
	 if (animationId == null) {
		 console.log(
			 "windStrength: " +
				 windStrength +
				 " and force: " +
				 JSON.stringify(windForce)
		 );
	 }
	 render(time);
 }

 function render(time) {
	 var timer = time * 0.0002;

	 var p = cloth.particles;

	 for (var i = 0, il = p.length; i < il; i++) {
		 clothGeometry.vertices[i].copy(p[i].position);
	 }

	 clothGeometry.computeFaceNormals();
	 clothGeometry.computeVertexNormals();

	 clothGeometry.normalsNeedUpdate = true;
	 clothGeometry.verticesNeedUpdate = true;

	 sphere.position.copy(ballPosition);

	 if (rotate) {
		 camera.position.x = Math.cos(timer) * 1500;
		 camera.position.z = Math.sin(timer) * 1500;
	 }

	 camera.lookAt(scene.position);

	 renderer.render(scene, camera);
 }

 var animationId = null;

 function go() {
	 if (animationId != null) return;
	 animationLoop();
 }

 function animationLoop() {
	 animationId = requestAnimationFrame(animationLoop);
	 time += deltaT;
	 oneStep(time);
 }

 function stop() {
	 if (animationId == null) return;
	 cancelAnimationFrame(animationId);
	 animationId = null;
 }

 init();
 go();
