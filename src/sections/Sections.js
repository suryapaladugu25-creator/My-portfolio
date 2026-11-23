/**
 * Sections.js — 3D lanterns, skill orbs, and panel manager
 * Creates interactive 3D objects at tree positions and manages HTML panel visibility.
 */

import * as THREE from 'three';

// Project data
const PROJECTS = [
  { id: 'llm-playground', label: 'LLM Playground 3D', color: 0xf5c842, link: '#' },
  { id: 'cricket-stats',  label: 'Cricket Analytics',  color: 0x00e5ff, link: '#' },
  { id: 'open-source',    label: 'Team VYPR — Hacktoberfest', color: 0xa78bfa, link: '#' },
  { id: 'portfolio-3d',   label: 'Portfolio 3D Tree',   color: 0xffd700, link: '#' },
];

const SKILLS = [
  { label: 'JavaScript', color: 0xf7df1e },
  { label: 'Python',     color: 0x3776ab },
  { label: 'Three.js',   color: 0x49ef4c },
  { label: 'React',      color: 0x61dafb },
  { label: 'Node.js',    color: 0x68a063 },
  { label: 'Git',        color: 0xf1502f },
  { label: 'AI / LLMs',  color: 0xa78bfa },
  { label: 'C / C++',    color: 0x00599c },
];

export class SectionsManager {
  constructor(scene, camCtrl, tree, device) {
    this.scene    = scene;
    this.camCtrl  = camCtrl;
    this.tree     = tree;
    this.device   = device;
    this.interactives = [];
    this._lanterns    = [];
    this._orbMeshes   = [];
    this._time        = 0;

    this._buildLanterns();
    this._buildSkillOrbs();
    this._buildContactOrbs();
  }

  // ── Build glowing project lanterns in the canopy ───────────────────────────
  _buildLanterns() {
    const tips = this.tree.tipPositions || [];
    const geo  = new THREE.IcosahedronGeometry(0.35, 2);

    PROJECTS.forEach((proj, i) => {
      const pos = tips[i] || new THREE.Vector3(
        (i % 2 === 0 ? 1 : -1) * (2 + i * 0.8),
        6 + i * 1.5,
        (i % 3 === 0 ? 1 : -1) * 1.5
      );

      const mat = new THREE.MeshStandardMaterial({
        color: proj.color,
        emissive: proj.color,
        emissiveIntensity: 0.9,
        metalness: 0.4,
        roughness: 0.2,
        transparent: true,
        opacity: 0.92,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.position.y += 0.5;
      mesh.userData = {
        label:   proj.label,
        section: 'projects',
        baseY:   mesh.position.y,
        phase:   i * 1.1,
        link:    proj.link,
        isLantern: true,
      };

      // Outer glow ring
      const ringGeo = new THREE.TorusGeometry(0.55, 0.05, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: proj.color, transparent: true, opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      mesh.add(ring);

      // Point light inside lantern
      const light = new THREE.PointLight(proj.color, 1.2, 4);
      mesh.add(light);

      this.scene.add(mesh);
      this.interactives.push(mesh);
      this._lanterns.push({ mesh, light, ring, mat });
    });
  }

  // ── Build skill leaf-orbs near branch tips ─────────────────────────────────
  _buildSkillOrbs() {
    const geo = new THREE.SphereGeometry(0.22, 10, 10);

    SKILLS.forEach((skill, i) => {
      const angle = (i / SKILLS.length) * Math.PI * 2;
      const radius = 2.8 + (i % 3) * 0.6;
      const y      = 2.5 + i * 0.9;

      const mat = new THREE.MeshStandardMaterial({
        color: skill.color,
        emissive: skill.color,
        emissiveIntensity: 0.7,
        roughness: 0.3,
        metalness: 0.3,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius * 0.5
      );
      mesh.userData = {
        label:   skill.label,
        section: 'skills',
        phase:   i * 0.7,
        baseY:   y,
        isOrb:   true,
      };

      this.scene.add(mesh);
      this.interactives.push(mesh);
      this._orbMeshes.push({ mesh, mat });
    });
  }

  // ── Build contact orbs at the top ─────────────────────────────────────────
  _buildContactOrbs() {
    const contacts = [
      { label: 'GitHub',   color: 0xffffff, href: 'https://github.com/' },
      { label: 'LinkedIn', color: 0x00aaff, href: 'https://linkedin.com/in/' },
      { label: 'Email',    color: 0xf5c842, href: 'mailto:surya@example.com' },
    ];

    const geo = new THREE.SphereGeometry(0.3, 12, 12);
    contacts.forEach((c, i) => {
      const mat = new THREE.MeshStandardMaterial({
        color: c.color, emissive: c.color, emissiveIntensity: 0.8,
        roughness: 0.2, metalness: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((i - 1) * 2.5, 14, 0);
      mesh.userData = { label: c.label, section: 'contact', href: c.href, phase: i * 2.1 };

      mesh.userData.onClick = () => window.open(c.href, '_blank');

      this.scene.add(mesh);
      this.interactives.push(mesh);
    });
  }

  // ── Show a named panel ────────────────────────────────────────────────────
  showPanel(name) {
    this.setPanelVisible(name, true);
  }

  // ── Toggle panel visibility ───────────────────────────────────────────────
  setPanelVisible(name, visible) {
    const el = document.getElementById(`${name}-section`);
    if (!el) return;
    if (visible) {
      el.classList.add('cp-visible');
    } else {
      el.classList.remove('cp-visible');
    }
  }

  // ── Animate lanterns, orbs every frame ───────────────────────────────────
  update(time, dt) {
    this._time = time;

    // Lantern bob + pulse
    this._lanterns.forEach(({ mesh, light, mat }) => {
      const ph = mesh.userData.phase;
      mesh.position.y = mesh.userData.baseY + Math.sin(time * 0.9 + ph) * 0.18;
      mesh.rotation.y += dt * 0.4;
      const pulse = 0.7 + 0.3 * Math.sin(time * 1.6 + ph);
      mat.emissiveIntensity = pulse;
      light.intensity       = pulse * 1.5;
    });

    // Skill orbs gentle drift
    this._orbMeshes.forEach(({ mesh }) => {
      const ph = mesh.userData.phase;
      mesh.position.y = mesh.userData.baseY + Math.sin(time * 0.6 + ph) * 0.12;
      mesh.rotation.x += dt * 0.3;
      mesh.rotation.z += dt * 0.2;
    });

    // Contact orbs pulse
    this.interactives
      .filter(m => m.userData.section === 'contact')
      .forEach(m => {
        m.position.y = 14 + Math.sin(time * 1.1 + m.userData.phase) * 0.2;
        m.rotation.y += dt * 0.5;
      });
  }
}

