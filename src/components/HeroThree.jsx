import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import Logo from "../assets/shubh-avsar-logo.png";

export default function HeroThree() {
  const mountRef = useRef(null);
  const tagline = "Exclusive Events, Priceless Memories";

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = 700;

    // Scene, camera, renderer
    const scene = new THREE.Scene();

    // Gradient background using a ShaderMaterial on a big plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;

        void main() {
          vec3 color1 = vec3(133.0/255.0, 23.0/255.0, 26.0/255.0);
          vec3 color2 = vec3(206.0/255.0, 161.0/255.0, 59.0/255.0);
          vec3 color3 = vec3(255.0/255.0, 227.0/255.0, 91.0/255.0);
          vec3 color4 = vec3(252.0/255.0, 233.0/255.0, 131.0/255.0);

          // Slow diagonal movement
          float y = vUv.y + 0.05 * sin(time * 0.05 + vUv.x * 5.0);
          vec3 gradient;
          if (y < 0.33) gradient = mix(color1, color2, y/0.33);
          else if (y < 0.66) gradient = mix(color2, color3, (y-0.33)/0.33);
          else gradient = mix(color3, color4, (y-0.66)/0.34);

          gl_FragColor = vec4(gradient, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -10;
    scene.add(plane);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Lights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Floating spheres
    const group = new THREE.Group();
    const spheres = [];
    for (let i = 0; i < 25; i++) {
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: "#85171A",
        transparent: true,
        opacity: 0.9,
        emissive: "#CEA13B",
        emissiveIntensity: 0.4,
      });
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(Math.random() * 0.25 + 0.08, 16, 16),
        sphereMaterial
      );
      sphere.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
      group.add(sphere);
      spheres.push(sphereMaterial);
    }
    scene.add(group);

    // Ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.08, 16, 100),
      new THREE.MeshStandardMaterial({ color: "#CEA13B", emissive: "#FFE35B", emissiveIntensity: 0.6 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.5;
    scene.add(ring);

    // Particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
      );
      particle.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 15
      );
      scene.add(particle);
      particles.push(particle);
    }

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    document.addEventListener("mousemove", onMouseMove);

    // Animation
    const animate = () => {
      planeMaterial.uniforms.time.value += 0.2; // slower

      group.children.forEach((sphere, i) => {
        sphere.position.y += Math.sin(Date.now() * 0.0003 + i) * 0.001;
        sphere.rotation.y += 0.002;

        // sync glow with gradient
        const glow = 0.3 + 0.2 * Math.sin(planeMaterial.uniforms.time.value * 0.3 + i);
        sphere.material.emissiveIntensity = glow;
      });

      ring.rotation.z += 0.002;
      group.rotation.y += 0.002 + mouseX * 0.01;
      group.rotation.x += mouseY * 0.01;
      particles.forEach((p, i) => {
        p.position.y += Math.sin(Date.now() * 0.0001 + i) * 0.0005;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      renderer.setSize(w, height);
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onMouseMove);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <header id="home" className="relative w-full h-[700px] overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <img
          src={Logo}
          alt="Shubh Avsar Logo"
          className="w-36 md:w-48 mb-6 drop-shadow-lg animate-glow"
        />
        <p
          style={{ fontFamily: "'Carattere', cursive" }}
          className="text-3xl md:text-5xl text-[#85171A] tracking-wide font-bold animate-word-glow"
        >
          {tagline.split(" ").map((word, i) => (
            <span key={i} className="inline-block mr-2">
              {word}
            </span>
          ))}
        </p>
      </div>

      <style>
        {`
          @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 6px #FFE35B); }
            50% { filter: drop-shadow(0 0 14px #CEA13B); }
          }
          .animate-glow {
            animation: glow 3s infinite ease-in-out;
          }

          @keyframes wordGlow {
            0% { opacity: 0; transform: translateY(10px) scale(0.9); filter: drop-shadow(0 0 0 #FFE35B); }
            20% { opacity: 1; transform: translateY(0) scale(1); filter: drop-shadow(0 0 8px #FFE35B); }
            80% { opacity: 1; transform: translateY(0) scale(1); filter: drop-shadow(0 0 8px #FFE35B); }
            100% { opacity: 0; transform: translateY(-10px) scale(0.9); filter: drop-shadow(0 0 0 #FFE35B); }
          }

          .animate-word-glow span {
            display: inline-block;
            opacity: 0;
            animation: wordGlow 5s ease-in-out infinite;
          }

          .animate-word-glow span:nth-child(1) { animation-delay: 0s; }
          .animate-word-glow span:nth-child(2) { animation-delay: 0.5s; }
          .animate-word-glow span:nth-child(3) { animation-delay: 1s; }
          .animate-word-glow span:nth-child(4) { animation-delay: 1.5s; }
          .animate-word-glow span:nth-child(5) { animation-delay: 2s; }
        `}
      </style>
    </header>
  );
}
