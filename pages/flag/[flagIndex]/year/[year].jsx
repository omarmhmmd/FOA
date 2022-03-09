import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import styles from "./flag.module.scss";
import Title from "../../../../components/Title";
import MUIGrid from "@mui/material/Grid";
import Flag from "../../../../components/Flag";
import { flags } from "../../../../public/flags.js";
import Data from "../../../../components/Data";
import ThreeJS from "../../../../components/ThreeJS";
import Stack from "../../../../components/Stack";
import Grid from "../../../../components/Grid";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import Head from 'next/head'

import { useEffect, useRef } from "react";
import * as THREE from "three";
import SmallTextBox from "../../../../components/SmallTextBox";

export async function getServerSideProps() {
  return {
    props: {},
  };
}

const Index = () => {
  const router = useRouter();
  const { flagIndex, year } = router.query;

  const flagIndexNum = parseInt(flagIndex);

  const checkFlag = () => {
    return flagIndexNum - 1;
  };

  const flagRef = useRef(null);
  const controls = useRef(null);

  useEffect(() => {
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
          tmpForce
            .copy(normal)
            .normalize()
            .multiplyScalar(normal.dot(windForce));
          particles[face.a].addForce(tmpForce);
          particles[face.b].addForce(tmpForce);
          particles[face.c].addForce(tmpForce);
        }
      }

      for (
        particles = cloth.particles, i = 0, il = particles.length;
        i < il;
        i++
      ) {
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

      // Floor Constrains
      for (
        particles = cloth.particles, i = 0, il = particles.length;
        i < il;
        i++
      ) {
        particle = particles[i];
        const pos = particle.position;
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

    var rotationVal = 0;
    rotationVal = Math.PI / 4;
    var time0 = new Date("2014/10/24").getTime();
    var time = time0;
    var deltaT = 16;

    /* testing cloth simulation */
    var pinsFormation = [];
    // var pins = [0];
    // pinsFormation.push(pins);
    pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // pinsFormation.push(pins);
    // pins = [0];
    // pinsFormation.push(pins);
    // pins = []; // cut the rope ;)
    // pinsFormation.push(pins);
    // pins = [0, cloth.w]; // classic 2 pins
    // pinsFormation.push(pins);
    // pins = pinsFormation[1];

    var container; // the DOM element (a DIV) that contains the canvas and info)
    var camera, scene, renderer;
    var clothGeometry;
    var object;
    var rotate = false;

    const init = () => {
      // scene
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xcce0ff, 0, 10000);

      // camera
      camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      // Change Z based on window width and height -- make it responsive

      // /** MOBILE **/
      // camera.position.z = 2000;
      // camera.position.z = 5000;
      camera.position.z = 1125;
      // camera.position.z = 2000;
      scene.add(camera);

      // lights
      var light, materials;
      scene.add(new THREE.AmbientLight(0x666666));
      light = new THREE.DirectionalLight(0xdfebff, 1.75);
      light.position.set(50, 200, 100);
      light.position.multiplyScalar(1.3);
      light.castShadow = false;
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
      THREE.ImageUtils.crossOrigin = "";
      var clothTexture = THREE.ImageUtils.loadTexture(
        "/images/flags-threeJS/" + checkFlag() + ".jpg"
      );
      clothTexture.wrapS = THREE.RepeatWrapping;
      clothTexture.anisotropy = 16;
      clothTexture.rotation = Math.PI / 4;

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
        needsUpdate: true,
      });
      clothTexture.needsUpdate = true;

      // cloth geometry
      clothGeometry = new THREE.ParametricGeometry(
        clothFunction,
        cloth.w,
        cloth.h
      );
      clothGeometry.dynamic = true;
      clothGeometry.computeFaceNormals();
      var img = new Image();
      img.src = "img.jpg";
      var imgHeight = 256;
      var imgWidth = 256;
      var mapCanvas = document.createElement("canvas");
      mapCanvas.width = mapCanvas.height = 256;
      var ctx = mapCanvas.getContext("2d");
      ctx.translate(imgWidth / 2, imgHeight / 2);
      ctx.rotate(Math.PI / 4);
      ctx.translate(-imgWidth / 2, -imgHeight / 2);
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
      var texture = new THREE.Texture(mapCanvas);
      texture.needsUpdate = true;

      // cloth mesh
      object = new THREE.Mesh(clothGeometry, clothMaterial);
      object.material.map.needsUpdate = true;
      object.position.set(-118, 50, 0);

      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          // alert("works");
          child.material.map = clothTexture;
          child.material.needsUpdate = true;
          child.geometry.buffersNeedUpdate = true;
          child.geometry.uvsNeedUpdate = true;
        }
      });

      /**
       * Mobile
       */
      // object.position.set(0, 200, 0);
      object.castShadow = true;
      object.receiveShadow = true;
      object.rotation.z = Math.PI / 2;
      scene.add(object);
      object.matrixAutoUpdate = false;
      object.updateMatrix();

      const getRandomColor = (max) => {
        return Math.floor(Math.random() * max);
      };

      if (getRandomColor(2) == 0) {
        var initColor = new THREE.Color(0x5c7a2e);
      } else var initColor = new THREE.Color(0x957e5c);

      var initTexture = THREE.ImageUtils.generateDataTexture(1, 1, initColor);
      var groundMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x5c7a2e,
        map: initTexture,
      });
      var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(10000, 10000),
        groundMaterial
      );
      mesh.position.y = -400;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      scene.add(mesh);

      // poles
      var poleGeo = new THREE.BoxGeometry(5, 1375, 15);
      var poleMat = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0xffffff,
        shiness: 100,
      });
      var mesh = new THREE.Mesh(poleGeo, poleMat);
      mesh.position.x = -250;
      mesh.position.y = -500;

      // Mobile don't render
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);

      //
      renderer = new THREE.WebGLRenderer({ antialias: false });
      renderer.setSize(
        flagRef.current.clientWidth,
        flagRef.current.clientHeight
      );
      renderer.setClearColor(scene.fog.color);
      // renderer.setPixelRatio(0.2 );

      flagRef.current.appendChild(renderer.domElement);

      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      renderer.shadowMapEnabled = true;

      window.addEventListener("resize", onWindowResize, false);

      /**
       * ZOOM EVENT HERE
       * */
      // window.addEventListener("wheel", function (e) {
      //   console.log(e.deltaY);
      //   camera.position.z += e.deltaY * 2.5;
      //   camera.position.clampScalar(0, 5000);
      //   console.log(camera.position.z);
      // });
    };

    function onWindowResize() {
      if (window.innerWidth < 1000) {
        camera.position.z = 2000;
      }
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
      const windDir = new THREE.Vector3().copy(windForce);
      windDir.normalize();
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

    var changeFlag = (flagNum) => {
      object.material.map = THREE.ImageUtils.loadTexture(
        "/images/flags-threeJS/" + flagNum + ".jpg"
      );
    };

    controls.current = { changeFlag };

    init();
    go();
  }, []);
  return (
    <MUIGrid className={styles.container} container spacing={0}>
      <Head>
        <title>بيرق هاى افغانستان | Flags Of Afghanistan</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <MUIGrid
        item
        className={styles.listContainer}
        sm={1.5}
        display={{ xs: "none", sm: "block" }}
      >
        <div className={styles.title} style={{ backgroundColor: "white" }}>
          <Title farsi="بيرق هاى افغانستان" english="Flags Of Afghanistan" />
        </div>
        <div className={styles.list}>
          {flags.map((flag, index) => (
            <div
              onClick={() => {
                controls.current.changeFlag(index);
              }}
              key={index}
              className={styles.listItem}
            >
              <Flag
                key={index}
                image={`/images/flags-sml/${index}.jpg`}
                duration={flag.duration}
                kingdom={flag.kingdom}
                year={flag.year}
                flagIndex={index}
              />
            </div>
          ))}
        </div>
      </MUIGrid>
      <MUIGrid
        id="flagScroll"
        ref={flagRef}
        className={styles.threeJSContainer}
        display={{ xs: "none", sm: "block" }}
      ></MUIGrid>
      <MUIGrid item xs={12} sm={3} className={styles.infoContainer}>
        <div className={styles.title}>
          <Title
            farsi="جمهوری دمکراتی افغانستان"
            english={flags[checkFlag()].kingdom}
          />
        </div>
        <div className={styles.infoList}>
          <div id="info" className={styles.infoFlag}>
            <MUIGrid display={{ xs: "block", sm: "none" }}>
              <ThreeJS className={styles.mobileFlag} meshIndex={checkFlag()} />
              {/* <img src={`/images/flags-sml/${checkFlag()}.jpg`} alt="Flag" /> */}
            </MUIGrid>
            <MUIGrid display={{ xs: "none", sm: "block" }}>
              <img src={`/images/flags-sml/${checkFlag()}.jpg`} alt="Flag" />
            </MUIGrid>
          </div>
          <div className={styles.infoData}>
            <Data
              duration={flags[checkFlag()].duration}
              kingdom={flags[checkFlag()].kingdom}
              ruler={flags[checkFlag()].ruler}
              year={flags[checkFlag()].year}
            />
          </div>
          <div className={styles.infoEssay}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>
          <div className={styles.next}>
            <Link href={`/`}>
              <div>
                <ArrowBack fontSize="medium" htmlColor="black" />
              </div>
            </Link>
            <Link href={`#info`}>
              <div>
                <ArrowUpward fontSize="medium" htmlColor="black" />
              </div>
            </Link>
          </div>
        </div>
      </MUIGrid>
    </MUIGrid>
  );
};

export default Index;
