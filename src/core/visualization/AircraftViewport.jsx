import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { normalizeScene } from "./visualizationContract.js";

function disposeObject(object) {
  object.traverse((child) => {
    child.geometry?.dispose();
    if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
    else child.material?.dispose();
  });
}

function airplaneGroup(aircraft) {
  const group = new THREE.Group();
  const span = Math.max(aircraft.wingSpanM || 1.6, 0.2);
  const chord = Math.max(aircraft.meanChordM || 0.32, 0.08);
  const length = Math.max(span * 0.78, chord * 3.5);
  const fuselageMaterial = new THREE.MeshStandardMaterial({ color: 0xe9ece5, roughness: 0.55, metalness: 0.08 });
  const surfaceMaterial = new THREE.MeshStandardMaterial({ color: 0xff6a43, roughness: 0.48, side: THREE.DoubleSide });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x163f38, roughness: 0.62, side: THREE.DoubleSide });

  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(span * 0.055, length * 0.78, 6, 18), fuselageMaterial);
  fuselage.rotation.z = Math.PI / 2;
  group.add(fuselage);

  const wing = new THREE.Mesh(new THREE.BoxGeometry(chord, span, span * 0.018), surfaceMaterial);
  wing.position.x = length * 0.05;
  group.add(wing);

  const tail = new THREE.Mesh(new THREE.BoxGeometry(chord * 0.55, span * 0.36, span * 0.012), darkMaterial);
  tail.position.x = -length * 0.36;
  group.add(tail);

  const finGeometry = new THREE.BufferGeometry();
  finGeometry.setAttribute("position", new THREE.Float32BufferAttribute([
    -length * 0.44, 0, 0,
    -length * 0.24, 0, 0,
    -length * 0.39, 0, span * 0.22,
  ], 3));
  finGeometry.computeVertexNormals();
  group.add(new THREE.Mesh(finGeometry, darkMaterial));

  const nose = new THREE.Mesh(new THREE.ConeGeometry(span * 0.058, length * 0.18, 18), surfaceMaterial);
  nose.rotation.z = -Math.PI / 2;
  nose.position.x = length * 0.48;
  group.add(nose);

  return { group, span, length };
}

function overlayGroup(scene, scale) {
  const group = new THREE.Group();
  scene.overlays.forEach((overlay) => {
    const color = new THREE.Color(overlay.color || "#dce9ad");
    if (overlay.type === "point") {
      const point = new THREE.Mesh(new THREE.SphereGeometry(scale * 0.035, 16, 12), new THREE.MeshBasicMaterial({ color }));
      point.position.set(overlay.position.x, overlay.position.y, overlay.position.z);
      group.add(point);
    } else {
      const origin = new THREE.Vector3(overlay.origin.x, overlay.origin.y, overlay.origin.z);
      const vector = new THREE.Vector3(overlay.vector.x, overlay.vector.y, overlay.vector.z);
      const length = vector.length();
      if (length > 0) group.add(new THREE.ArrowHelper(vector.normalize(), origin, length, color, Math.min(length * 0.25, scale * 0.14), Math.min(length * 0.12, scale * 0.07)));
    }
  });
  return group;
}

export default function AircraftViewport({ aircraft, scene }) {
  const hostRef = useRef(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const normalizedScene = normalizeScene(scene);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      setWebglFailed(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x102f2a, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const threeScene = new THREE.Scene();
    threeScene.fog = new THREE.Fog(0x102f2a, 4, 11);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 50);
    const { group: fallbackAircraft, span } = airplaneGroup(aircraft);
    threeScene.add(fallbackAircraft);
    let disposed = false;

    const loader = new GLTFLoader();
    loader.load(
      `${import.meta.env.BASE_URL}models/course-aircraft.glb`,
      (gltf) => {
        if (disposed) {
          disposeObject(gltf.scene);
          return;
        }
        const model = gltf.scene;
        model.name = "Course_Aircraft_Model";
        // Blender exports to glTF's Y-up frame; return it to the course +z-up frame.
        model.rotation.x = Math.PI / 2;
        const spanScale = Math.max(aircraft.wingSpanM || 1.6, 0.2) / 1.6;
        const chordScale = Math.max(aircraft.meanChordM || 0.32, 0.08) / 0.32;
        model.traverse((object) => {
          if (/^(Wing|Aileron)_/.test(object.name)) {
            object.scale.x *= chordScale;
            object.scale.y *= spanScale;
          }
        });
        threeScene.remove(fallbackAircraft);
        disposeObject(fallbackAircraft);
        threeScene.add(model);
      },
      undefined,
      () => {
        // The procedural aircraft remains visible when an asset cannot be loaded.
      },
    );
    threeScene.add(overlayGroup(normalizedScene, span));
    threeScene.add(new THREE.HemisphereLight(0xe7fff6, 0x173832, 2.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3, -2, 5);
    threeScene.add(keyLight);

    camera.position.set(span * 1.3, -span * 1.45, span * 0.8);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = span * 1.25;
    controls.maxDistance = span * 4.5;
    controls.target.set(0, 0, 0);
    controls.update();

    let animationFrame;
    let visible = true;
    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const render = () => {
      if (visible) {
        controls.update();
        renderer.render(threeScene, camera);
      }
      animationFrame = requestAnimationFrame(render);
    };
    const onVisibility = () => { visible = document.visibilityState !== "hidden"; };
    document.addEventListener("visibilitychange", onVisibility);
    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      controls.dispose();
      disposeObject(threeScene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [aircraft.wingSpanM, aircraft.meanChordM, JSON.stringify(normalizedScene)]);

  return (
    <section className="aircraft-viewport" aria-labelledby="aircraft-view-title">
      <div className="visual-card-heading viewport-heading">
        <div><p className="eyebrow">Persistent aircraft</p><h2 id="aircraft-view-title">Semester aircraft</h2></div>
        <p>Drag to orbit · pinch or scroll to zoom</p>
      </div>
      {webglFailed ? (
        <div className="webgl-fallback"><strong>3D view unavailable</strong><span>The analysis and plots still work. Try a current Safari, Chrome, Edge, or Firefox browser.</span></div>
      ) : <div className="three-host" ref={hostRef} data-testid="aircraft-canvas" />}
      <p className="viewport-caption">{normalizedScene.caption}</p>
    </section>
  );
}
