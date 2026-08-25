import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { TrendingUp, Activity, Users, Sun, Sparkles, Cpu, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Farm3DScene: React.FC<{ onExploreClick?: () => void }> = ({ onExploreClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeHUDIndex, setActiveHUDIndex] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f291e);
    scene.fog = new THREE.FogExp2(0x0f291e, 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 580;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 14, 28);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xd4edda, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5cc, 2.2);
    sunLight.position.set(20, 35, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    const groundGlowLight = new THREE.PointLight(0x48bb78, 2, 30);
    groundGlowLight.position.set(0, 4, 0);
    scene.add(groundGlowLight);

    // Group for all rotating/swaying elements
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Terrain Ground
    const groundGeo = new THREE.PlaneGeometry(60, 60, 40, 40);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.15) * Math.cos(y * 0.15) * 1.2 + Math.sin(x * 0.05) * 0.8;
      pos.setZ(i, z);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1c452e,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    worldGroup.add(ground);

    // 2. Crop Field Plots (Lush green rows & Golden grain fields)
    const cropGroup = new THREE.Group();
    const plantGeo = new THREE.ConeGeometry(0.35, 1.2, 5);
    const plantMat1 = new THREE.MeshStandardMaterial({ color: 0x38a169, roughness: 0.6 });
    const plantMat2 = new THREE.MeshStandardMaterial({ color: 0xd69e2e, roughness: 0.7 }); // wheat gold
    const plantMat3 = new THREE.MeshStandardMaterial({ color: 0x22543d, roughness: 0.8 }); // dark crop

    const cropsList: THREE.Mesh[] = [];

    // Left Field (Green crops)
    for (let row = -8; row <= 8; row += 1.2) {
      for (let col = -12; col <= -3; col += 1.0) {
        const plant = new THREE.Mesh(plantGeo, (row + col) % 3 === 0 ? plantMat2 : plantMat1);
        plant.position.set(col + (Math.random() * 0.2 - 0.1), 0.6, row + (Math.random() * 0.2 - 0.1));
        plant.rotation.y = Math.random() * Math.PI;
        plant.scale.set(0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.5, 0.8 + Math.random() * 0.4);
        plant.castShadow = true;
        cropGroup.add(plant);
        cropsList.push(plant);
      }
    }

    // Right Field (Vegetables & golden wheat)
    for (let row = -8; row <= 8; row += 1.2) {
      for (let col = 3; col <= 12; col += 1.0) {
        const plant = new THREE.Mesh(plantGeo, col > 7 ? plantMat2 : plantMat3);
        plant.position.set(col + (Math.random() * 0.2 - 0.1), 0.6, row + (Math.random() * 0.2 - 0.1));
        plant.rotation.y = Math.random() * Math.PI;
        plant.scale.set(0.9 + Math.random() * 0.3, 0.9 + Math.random() * 0.4, 0.9 + Math.random() * 0.3);
        plant.castShadow = true;
        cropGroup.add(plant);
        cropsList.push(plant);
      }
    }
    worldGroup.add(cropGroup);

    // 3. Central Irrigation Canal / Water Stream
    const waterGeo = new THREE.PlaneGeometry(2.4, 28, 10, 10);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x3182ce,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, 0.08, 0);
    worldGroup.add(water);

    // 4. Stylized 3D Tractor Model
    const tractorGroup = new THREE.Group();
    // Body chassis
    const chassisGeo = new THREE.BoxGeometry(2.2, 1.2, 3.4);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0xdd6b20, roughness: 0.3, metalness: 0.4 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.set(0, 1.2, 0);
    chassis.castShadow = true;
    tractorGroup.add(chassis);

    // Cabin
    const cabinGeo = new THREE.BoxGeometry(1.8, 1.4, 1.6);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.2, metalness: 0.7, transparent: true, opacity: 0.85 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 2.3, -0.6);
    tractorGroup.add(cabin);

    // Wheels (Large back, small front)
    const wheelGeoBig = new THREE.CylinderGeometry(0.85, 0.85, 0.6, 16);
    const wheelGeoSmall = new THREE.CylinderGeometry(0.55, 0.55, 0.5, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.9 });

    const wheelBackL = new THREE.Mesh(wheelGeoBig, wheelMat);
    wheelBackL.rotation.z = Math.PI / 2;
    wheelBackL.position.set(-1.3, 0.85, -0.8);
    tractorGroup.add(wheelBackL);

    const wheelBackR = wheelBackL.clone();
    wheelBackR.position.set(1.3, 0.85, -0.8);
    tractorGroup.add(wheelBackR);

    const wheelFrontL = new THREE.Mesh(wheelGeoSmall, wheelMat);
    wheelFrontL.rotation.z = Math.PI / 2;
    wheelFrontL.position.set(-1.2, 0.55, 1.1);
    tractorGroup.add(wheelFrontL);

    const wheelFrontR = wheelFrontL.clone();
    wheelFrontR.position.set(1.2, 0.55, 1.1);
    tractorGroup.add(wheelFrontR);

    tractorGroup.position.set(0, 0, 4);
    tractorGroup.scale.set(0.8, 0.8, 0.8);
    worldGroup.add(tractorGroup);

    // 5. Stylized Modern Barn / Storage Hub
    const barnGroup = new THREE.Group();
    const barnBodyGeo = new THREE.BoxGeometry(5, 3.5, 4.5);
    const barnBodyMat = new THREE.MeshStandardMaterial({ color: 0x2c5282, roughness: 0.5 });
    const barnBody = new THREE.Mesh(barnBodyGeo, barnBodyMat);
    barnBody.position.set(0, 1.75, 0);
    barnBody.castShadow = true;
    barnGroup.add(barnBody);

    const roofGeo = new THREE.ConeGeometry(4.2, 2, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x742a2a, roughness: 0.4 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(0, 4.2, 0);
    barnGroup.add(roof);

    barnGroup.position.set(-8, 0, -12);
    worldGroup.add(barnGroup);

    // 6. Solar Panel Farm Array
    const solarGroup = new THREE.Group();
    for (let s = 0; s < 4; s++) {
      const panelGeo = new THREE.BoxGeometry(2, 0.1, 1.2);
      const panelMat = new THREE.MeshStandardMaterial({ color: 0x2b6cb0, metalness: 0.9, roughness: 0.1 });
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(s * 2.4 - 3.6, 1.2, 0);
      panel.rotation.x = -Math.PI / 6;
      panel.castShadow = true;
      solarGroup.add(panel);

      const standGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2);
      const standMat = new THREE.MeshStandardMaterial({ color: 0x718096, metalness: 0.7 });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.set(s * 2.4 - 3.6, 0.6, 0);
      solarGroup.add(stand);
    }
    solarGroup.position.set(8, 0, -11);
    worldGroup.add(solarGroup);

    // 7. Floating AI Intelligence Data Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 35;
      particlePos[i * 3 + 1] = Math.random() * 12 + 1;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 35;

      // Golden and Emerald Green particles
      if (i % 2 === 0) {
        particleColors[i * 3] = 0.3;
        particleColors[i * 3 + 1] = 0.95;
        particleColors[i * 3 + 2] = 0.5;
      } else {
        particleColors[i * 3] = 0.98;
        particleColors[i * 3 + 1] = 0.8;
        particleColors[i * 3 + 2] = 0.2;
      }
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particles);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 14;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Sway crops with wind
      for (let i = 0; i < cropsList.length; i++) {
        const crop = cropsList[i];
        crop.rotation.z = Math.sin(elapsedTime * 2.5 + crop.position.x * 0.5 + crop.position.z * 0.3) * 0.08;
      }

      // Move Tractor slowly along central road
      tractorGroup.position.z = ((Math.sin(elapsedTime * 0.4) * 0.5 + 0.5) * 10) - 2;
      wheelBackL.rotation.x = elapsedTime * 2;
      wheelBackR.rotation.x = elapsedTime * 2;
      wheelFrontL.rotation.x = elapsedTime * 2.5;
      wheelFrontR.rotation.x = elapsedTime * 2.5;

      // Animate AI data particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime * 1.5 + i) * 0.02;
        if (positions[i * 3 + 1] > 14) positions[i * 3 + 1] = 1;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Smooth camera interpolation based on mouse
      targetCameraX = mouseX * 6;
      targetCameraY = 14 + mouseY * 3;
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 2, 0);

      // Subtle slow world rotation
      worldGroup.rotation.y = Math.sin(elapsedTime * 0.1) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20 bg-gradient-to-b from-[#091a13] via-[#0f291e] to-[#07130e]">
      {/* 3D WebGL Canvas Mounting Point */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Fallback Static Gradient / 3D Artwork if WebGL disabled */}
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-emerald-950/80">
          <div className="max-w-md bg-emerald-900/60 p-6 rounded-2xl border border-emerald-600/30 backdrop-blur-md">
            <Cpu className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-xl font-bold text-white mb-2">AGRITECH 3D Agricultural Simulation</h4>
            <p className="text-sm text-emerald-200">
              Interactive 3D visualization active. Connect with thousands of verified farmers and buyers with live Mandi intelligence.
            </p>
          </div>
        </div>
      )}

      {/* Top Floating Badges */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#064e3b20] text-xs font-bold text-[#064e3b] shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-600 -ml-4" />
          <span>3D APMC Mandi Twin Engine</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 text-xs font-semibold text-amber-900 shadow-lg">
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>Weather: 26°C Optimal Harvest</span>
        </div>
      </div>

      {/* Floating Interactive 3D HUD Cards (Requested Spec: Live Market, AI Demand, Active Farmers) */}
      <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pointer-events-auto">
        {/* 1. Live Market Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#064e3b20] shadow-xl text-[#064e3b] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-700" />
              LIVE APMC MANDI
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-950 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1 text-emerald-700" /> +8.4%
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h4 className="text-base font-bold text-[#064e3b]">Tomato (Hybrid)</h4>
            <span className="text-xl font-extrabold text-[#064e3b]">₹32<span className="text-xs text-[#064e3b70] font-normal">/kg</span></span>
          </div>
          <p className="text-[11px] text-[#064e3b70] mt-1">Kolar Mandi • 420 Tons Arrived Today</p>
        </motion.div>

        {/* 2. AI Demand Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#064e3b20] shadow-xl text-[#064e3b] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              AI DEMAND INDEX
            </span>
            <span className="text-xs font-bold text-amber-950 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
              94% Score
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h4 className="text-base font-bold text-[#064e3b]">High Buyer Demand</h4>
            <span className="text-xs font-semibold text-emerald-800">7-10 Day Surge</span>
          </div>
          <div className="w-full bg-[#f1f5f2] rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-emerald-600 h-1.5 rounded-full" style={{ width: '94%' }} />
          </div>
        </motion.div>

        {/* 3. Active Farmers Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#064e3b20] shadow-xl text-[#064e3b] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-700" />
              ACTIVE ECOSYSTEM
            </span>
            <span className="text-xs font-bold text-cyan-950 bg-cyan-100 border border-cyan-300 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h4 className="text-xl font-extrabold text-[#064e3b]">25,400+</h4>
            <span className="text-xs text-cyan-800 font-medium">18,200+ Buyers</span>
          </div>
          <p className="text-[11px] text-[#064e3b70] mt-1">₹145+ Cr Safe Escrow Volume</p>
        </motion.div>
      </div>

      {/* Subtle Hint on bottom center */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-emerald-900 font-medium tracking-wide uppercase pointer-events-none hidden md:block">
        Move cursor to inspect 3D agricultural terrain & crop canopy
      </div>
    </div>
  );
};
