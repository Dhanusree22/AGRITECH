import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Eye, EyeOff, Sparkles, Wind, Sun, Layers } from 'lucide-react';

export type AgriTheme = 'emerald' | 'harvest' | 'neural';

interface Agri3DBackgroundProps {
  currentPath?: string;
  className?: string;
}

export const Agri3DBackground: React.FC<Agri3DBackgroundProps> = ({ currentPath = '/', className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [theme, setTheme] = useState<AgriTheme>(() => {
    // Auto-select initial theme based on path if desired
    if (currentPath.startsWith('/buyer')) return 'harvest';
    if (currentPath.startsWith('/admin')) return 'neural';
    return 'emerald';
  });
  const [intensity, setIntensity] = useState<'normal' | 'soft' | 'vivid'>('normal');
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Sync theme when user navigates between major modules
  useEffect(() => {
    if (currentPath.startsWith('/buyer')) {
      setTheme('harvest');
    } else if (currentPath.startsWith('/admin')) {
      setTheme('neural');
    } else if (currentPath.startsWith('/farmer')) {
      setTheme('emerald');
    }
  }, [currentPath]);

  // Color palletes for themes
  const themeColors = useMemo(() => {
    switch (theme) {
      case 'harvest':
        return {
          terrainGrid: 0xd97706,      // warm amber/gold
          terrainSurface: 0x78350f,   // rich earthy gold
          particles: 0xfef08a,        // golden sun pollen
          leaves1: 0xf59e0b,          // ripe wheat amber
          leaves2: 0xd97706,          // golden corn
          leaves3: 0xb45309,          // rustic bronze
          nodes: 0xfbbf24,            // bright amber node
          lightSun: 0xffedd5,         // warm golden hour light
          lightAmbient: 0xfef3c7,     // soft honey glow
          fog: 0xfefce8,              // warm mist
        };
      case 'neural':
        return {
          terrainGrid: 0x059669,      // cyber emerald
          terrainSurface: 0x064e3b,   // deep forest
          particles: 0x34d399,        // glowing mint green
          leaves1: 0x10b981,          // crisp emerald
          leaves2: 0x065f46,          // deep pine
          leaves3: 0x6ee7b7,          // neon mint
          nodes: 0x10b981,            // emerald cyber sensor
          lightSun: 0xe6fffa,         // crisp cool daylight
          lightAmbient: 0xccfbf1,     // soft teal ambient
          fog: 0xf0fdf4,              // light emerald mist
        };
      case 'emerald':
      default:
        return {
          terrainGrid: 0x10b981,      // vibrant lush green
          terrainSurface: 0x064e3b,   // deep fertile soil
          particles: 0xfde047,        // golden sunlight motes
          leaves1: 0x34d399,          // fresh sprout
          leaves2: 0x059669,          // rich chlorophyll
          leaves3: 0x10b981,          // lush green
          nodes: 0x34d399,            // fresh eco-crystal
          lightSun: 0xfffbeb,         // pure golden sunlight
          lightAmbient: 0xdcfce7,     // morning dew ambient
          fog: 0xf0fdf4,              // clean valley mist
        };
    }
  }, [theme]);

  // Ref to track dynamic updates without full re-mount
  const themeRef = useRef(themeColors);
  themeRef.current = themeColors;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf4f7f5, 0.015);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 12, 42);
    camera.lookAt(0, 2, 0);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // Canvas styling: strictly pointer-events-none so it NEVER interferes with clicks
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    container.appendChild(renderer.domElement);

    // 1. LIGHTING
    const ambientLight = new THREE.AmbientLight(themeRef.current.lightAmbient, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(themeRef.current.lightSun, 1.6);
    sunLight.position.set(25, 45, 30);
    scene.add(sunLight);

    const pointLight = new THREE.PointLight(themeRef.current.terrainGrid, 1.8, 60);
    pointLight.position.set(0, 8, 10);
    scene.add(pointLight);

    // 2. UNDULATING 3D AGRICULTURAL TERRAIN
    // Terraced contours simulating Indian farm topography
    const terrainWidth = 140;
    const terrainDepth = 100;
    const gridSegmentsX = 64;
    const gridSegmentsY = 48;

    const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainDepth, gridSegmentsX, gridSegmentsY);
    terrainGeo.rotateX(-Math.PI / 2.15); // gentle incline towards viewer
    terrainGeo.translate(0, -9, -10);

    const origPositions = terrainGeo.attributes.position.clone();

    // Wireframe grid material (contour lines)
    const terrainWireMat = new THREE.MeshBasicMaterial({
      color: themeRef.current.terrainGrid,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const terrainWireMesh = new THREE.Mesh(terrainGeo, terrainWireMat);
    scene.add(terrainWireMesh);

    // Soft translucent terrain skin underneath
    const terrainSkinMat = new THREE.MeshStandardMaterial({
      color: themeRef.current.terrainSurface,
      roughness: 0.85,
      metalness: 0.1,
      transparent: true,
      opacity: 0.28,
      flatShading: true,
    });
    const terrainSkinMesh = new THREE.Mesh(terrainGeo, terrainSkinMat);
    scene.add(terrainSkinMesh);

    // 3. FLOATING 3D BOTANICAL LEAVES / SEED PODS
    // Custom leaf shape geometry with curved spine
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.9, 0.9, 0.5, 2.2);
    leafShape.quadraticCurveTo(0, 2.8, -0.5, 2.2);
    leafShape.quadraticCurveTo(-0.9, 0.9, 0, 0);

    const extrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };
    const leafGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
    leafGeo.center();

    const leafMaterials = [
      new THREE.MeshStandardMaterial({
        color: themeRef.current.leaves1,
        roughness: 0.45,
        metalness: 0.1,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshStandardMaterial({
        color: themeRef.current.leaves2,
        roughness: 0.5,
        metalness: 0.05,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshStandardMaterial({
        color: themeRef.current.leaves3,
        roughness: 0.4,
        metalness: 0.15,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      }),
    ];

    const leafCount = 45;
    const leaves: {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      speedY: number;
      swayFreq: number;
      swayAmp: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
    }[] = [];

    const leavesGroup = new THREE.Group();
    scene.add(leavesGroup);

    for (let i = 0; i < leafCount; i++) {
      const mat = leafMaterials[i % leafMaterials.length];
      const mesh = new THREE.Mesh(leafGeo, mat);

      const scale = 0.5 + Math.random() * 0.75;
      mesh.scale.set(scale, scale, scale);

      const baseX = (Math.random() - 0.5) * 70;
      const baseY = -10 + Math.random() * 35;
      const baseZ = -20 + Math.random() * 50;

      mesh.position.set(baseX, baseY, baseZ);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      leavesGroup.add(mesh);
      leaves.push({
        mesh,
        baseX,
        baseY,
        baseZ,
        speedY: 0.015 + Math.random() * 0.025,
        swayFreq: 0.8 + Math.random() * 1.5,
        swayAmp: 1.5 + Math.random() * 2.5,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.012,
      });
    }

    // 4. FLOATING BIO-PARTICLES & GOLDEN SUN MOTES
    const particleCount = 550;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 90;
      particlePositions[i * 3 + 1] = -12 + Math.random() * 40;
      particlePositions[i * 3 + 2] = -30 + Math.random() * 65;
      particleScales[i] = 1.0 + Math.random() * 2.5;
      particleSpeeds[i] = 0.01 + Math.random() * 0.03;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle circular soft texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(253, 224, 71, 0.85)');
      grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.3)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      color: themeRef.current.particles,
      size: 1.4,
      map: particleTexture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. SMART AGRI-NODES / CRYSTALLINE ECO-POLYHEDRA
    // Geometric polyhedra representing sensor nodes, AI telemetry, and market nodes
    const nodeGeometries = [
      new THREE.IcosahedronGeometry(0.9, 0),
      new THREE.OctahedronGeometry(0.8, 0),
      new THREE.DodecahedronGeometry(0.85, 0),
    ];

    const nodeMat = new THREE.MeshStandardMaterial({
      color: themeRef.current.nodes,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.35,
      wireframe: false,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const nodeObjects: {
      group: THREE.Group;
      baseX: number;
      baseY: number;
      baseZ: number;
      orbitSpeed: number;
      orbitRadius: number;
      angle: number;
    }[] = [];

    const nodeCount = 14;
    for (let i = 0; i < nodeCount; i++) {
      const g = new THREE.Group();
      const geom = nodeGeometries[i % nodeGeometries.length];
      const m1 = new THREE.Mesh(geom, nodeMat);
      const m2 = new THREE.Mesh(geom, wireMat);
      m2.scale.set(1.02, 1.02, 1.02);
      g.add(m1);
      g.add(m2);

      const angle = (i / nodeCount) * Math.PI * 2;
      const orbitRadius = 18 + (i % 3) * 8;
      const baseX = Math.cos(angle) * orbitRadius;
      const baseY = -2 + (i % 5) * 3.5;
      const baseZ = -10 + Math.sin(angle) * 12;

      g.position.set(baseX, baseY, baseZ);
      nodesGroup.add(g);

      nodeObjects.push({
        group: g,
        baseX,
        baseY,
        baseZ,
        orbitSpeed: 0.003 + (i % 3) * 0.002,
        orbitRadius,
        angle,
      });
    }

    // 6. PASSIVE MOUSE PARALLAX (Linear Interpolation)
    // Non-blocking window listener with passive: true
    let targetCameraX = 0;
    let targetCameraY = 12;

    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCameraX = normX * 3.5;
      targetCameraY = 12 + normY * 2.2;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    };

    window.addEventListener('resize', handleResize);

    // 7. ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isPausedRef.current) return;

      const elapsedTime = clock.getElapsedTime();

      // Dynamic color theme update when theme changes
      const currentColors = themeRef.current;
      terrainWireMat.color.setHex(currentColors.terrainGrid);
      terrainSkinMat.color.setHex(currentColors.terrainSurface);
      particleMat.color.setHex(currentColors.particles);
      nodeMat.color.setHex(currentColors.nodes);
      ambientLight.color.setHex(currentColors.lightAmbient);
      sunLight.color.setHex(currentColors.lightSun);
      pointLight.color.setHex(currentColors.terrainGrid);

      // Smooth camera parallax
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 1.5, 0);

      // A. Animate undulating terrain waves
      const posAttr = terrainGeo.attributes.position;
      const origPos = origPositions;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        const ox = origPos.getX(i);
        const oy = origPos.getY(i);
        // Harmonic wave representing rolling wheat/paddy crop field
        const wave1 = Math.sin(ox * 0.07 + elapsedTime * 0.7) * Math.cos(oy * 0.06 + elapsedTime * 0.5) * 2.2;
        const wave2 = Math.sin((ox + oy) * 0.04 + elapsedTime * 0.4) * 1.4;
        const wave3 = Math.cos(ox * 0.12 - elapsedTime * 0.8) * 0.6;
        posAttr.setZ(i, wave1 + wave2 + wave3);
      }
      posAttr.needsUpdate = true;
      terrainGeo.computeVertexNormals();

      // B. Animate floating botanical leaves
      leaves.forEach((leaf, idx) => {
        // Floating up and drifting
        leaf.baseY += leaf.speedY;
        if (leaf.baseY > 24) {
          leaf.baseY = -12;
        }

        const sway = Math.sin(elapsedTime * leaf.swayFreq + idx) * leaf.swayAmp;
        leaf.mesh.position.x = leaf.baseX + sway;
        leaf.mesh.position.y = leaf.baseY + Math.cos(elapsedTime * 0.8 + idx) * 0.8;

        // Leaf rotational tumble in wind
        leaf.mesh.rotation.x += leaf.rotSpeedX;
        leaf.mesh.rotation.y += leaf.rotSpeedY;
        leaf.mesh.rotation.z += leaf.rotSpeedZ + Math.sin(elapsedTime * 1.2 + idx) * 0.005;
      });

      // C. Animate sunlit pollen particles
      const pPositions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3 + 1] += particleSpeeds[i];
        pPositions[i * 3] += Math.sin(elapsedTime * 0.5 + i) * 0.02;

        if (pPositions[i * 3 + 1] > 26) {
          pPositions[i * 3 + 1] = -12;
          pPositions[i * 3] = (Math.random() - 0.5) * 90;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // D. Animate crystalline eco-nodes
      nodeObjects.forEach((node) => {
        node.angle += node.orbitSpeed;
        node.group.position.x = Math.cos(node.angle) * node.orbitRadius;
        node.group.position.z = node.baseZ + Math.sin(node.angle) * 4;
        node.group.position.y = node.baseY + Math.sin(elapsedTime * 1.2 + node.angle) * 0.6;

        node.group.rotation.x += 0.008;
        node.group.rotation.y += 0.012;
      });

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      // Dispose 3D resources
      terrainGeo.dispose();
      terrainWireMat.dispose();
      terrainSkinMat.dispose();
      leafGeo.dispose();
      leafMaterials.forEach((m) => m.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      nodeGeometries.forEach((g) => g.dispose());
      nodeMat.dispose();
      wireMat.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {/* Fixed Fullscreen 3D Background Canvas Layer: STRICTLY pointer-events-none */}
      <div
        ref={mountRef}
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className} ${
          intensity === 'soft' ? 'opacity-55' : intensity === 'vivid' ? 'opacity-95' : 'opacity-80'
        }`}
        style={{ zIndex: 0 }}
      />

      {/* Floating 3D Background Atmosphere Control Pill (Discreet, bottom-left) */}
      <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-emerald-900/10 shadow-lg text-[11px] text-[#064e3b] transition-all hover:bg-white hover:shadow-xl">
        <button
          onClick={() => setShowControls(!showControls)}
          className="flex items-center gap-1.5 font-bold hover:text-emerald-700 cursor-pointer"
          title="Customize 3D Living Background Atmosphere"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tracking-tight">
            3D Field:{' '}
            <span className="capitalize font-extrabold text-emerald-800">
              {theme === 'emerald' ? '🌿 Lush Farm' : theme === 'harvest' ? '🌾 Harvest' : '⚡ Neural'}
            </span>
          </span>
        </button>

        {showControls && (
          <div className="flex items-center gap-1 pl-2 border-l border-emerald-900/15 animate-fadeIn">
            <button
              onClick={() => setTheme('emerald')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                theme === 'emerald' ? 'bg-[#064e3b] text-white shadow-xs' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              🌿 Emerald
            </button>
            <button
              onClick={() => setTheme('harvest')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                theme === 'harvest' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              🌾 Harvest
            </button>
            <button
              onClick={() => setTheme('neural')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                theme === 'neural' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              ⚡ Neural
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded-full text-emerald-900 hover:bg-emerald-100 cursor-pointer"
              title={isPaused ? 'Resume 3D Motion' : 'Pause 3D Motion'}
            >
              {isPaused ? <EyeOff className="w-3 h-3 text-amber-700" /> : <Eye className="w-3 h-3 text-emerald-700" />}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
