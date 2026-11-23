/**
 * Sections.js — 3D lanterns, skill orbs, and panel manager
 * Refined palette (gold, soft emerald, sky dawn), subtle pulses, no neon
 */
import * as THREE from 'three';
import { PALETTE } from '../utils/Palette.js';

const PROJECTS = [
  { id: 'llm-playground', label: 'LLM Playground 3D',          color: PALETTE.hex.accentGold, link: '#' },
  { id: 'cricket-stats',  label: 'Cricket Analytics',          color: PALETTE.hex.secondaryEmerald, link: '#' },
  { id: 'open-source',    label: 'Team VYPR — Hacktoberfest',  color: PALETTE.hex.tertiarySky, link: '#' },
  { id: 'portfolio-3d',   label: 'Portfolio 3D Tree',          color: PALETTE.hex.accentHover, link: '#' },
];

const SKILLS = [
  { label: 'JavaScript', color: PALETTE.hex.accentGold },
  { label: 'Python',     color: PALETTE.hex.tertiarySky },
  { label: 'Three.js',   color: PALETTE.hex.secondaryEmerald },
  { label: 'React',      color: PALETTE.hex.tertiarySky },
  { label: 'Node.js',    color: PALETTE.hex.emerald1 },
  { label: 'Git',        color: PALETTE.hex.accentHover },
  { label: 'AI / LLMs',  color: PALETTE.hex.accentGold },
  { label: 'C / C++',    color: PALETTE.hex.tertiarySky },
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

  // ── Build project lanterns (warm, subtle) ─────────────────────────────────
  _buildLanterns() {
    const tips = this.tree.tipPositions || [];
    const geo  = new THREE.IcosahedronGeometry(0.3, 1);

    PROJECTS.forEach((proj, i) => {
      const pos = tips[i] || new THREE.Vector3(
        (i % 2 === 0 ? 1 : -1) * (2 + i * 0.8),
        6 + i * 1.5,
        (i % 3 === 0 ? 1 : -1) * 1.5
      );

      const mat = new THREE.MeshStandardMaterial({
        color: proj.color,
        emissive: proj.color,
        emissiveIntensity: 0.35, // subtle glow, no neon
        metalness: 0.2,
        roughness: 0.4,
        transparent: true,
        opacity: 0.88,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.position.y += 0.4;
      mesh.userData = {
        label:   proj.label,
        section: 'projects',
        baseY:   mesh.position.y,
        phase:   i * 0.9,
        link:    proj.link,
        isLantern: true,
      };

      // Subtle, gentle point light
      const light = new THREE.PointLight(proj.color, 0.4, 3);
      mesh.add(light);

      this.scene.add(mesh);
      this.interactives.push(mesh);
      this._lanterns.push({ mesh, light, mat });
    });
  }

  // ── Build skill leaf-orbs (gentle, soft) ──────────────────────────────────
  _buildSkillOrbs() {
    const geo = new THREE.SphereGeometry(0.18, 8, 8);

    SKILLS.forEach((skill, i) => {
      const angle = (i / SKILLS.length) * Math.PI * 2;
      const radius = 2.6 + (i % 3) * 0.5;
      const y      = 2.8 + i * 0.85;

      const mat = new THREE.MeshStandardMaterial({
        color: skill.color,
        emissive: skill.color,
        emissiveIntensity: 0.3, // quiet, calm emission
        roughness: 0.5,
        metalness: 0.1,
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
        phase:   i * 0.6,
        baseY:   y,
        isOrb:   true,
      };

      this.scene.add(mesh);
      this.interactives.push(mesh);
      this._orbMeshes.push({ mesh, mat });
    });
  }

  // ── Build contact orbs at the tree top ────────────────────────────────────
  _buildContactOrbs() {
    const contacts = [
      { label: 'GitHub',   color: PALETTE.hex.textPrimary, href: 'https://github.com/' },
      { label: 'LinkedIn', color: PALETTE.hex.tertiarySky,  href: 'https://linkedin.com/' },
      { label: 'Email',    color: PALETTE.hex.accentGold,   href: 'mailto:surya@example.com' },
    ];

    const geo = new THREE.SphereGeometry(0.24, 10, 10);
    contacts.forEach((c, i) => {
      const mat = new THREE.MeshStandardMaterial({
        color: c.color,
        emissive: c.color,
        emissiveIntensity: 0.35,
        roughness: 0.4,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((i - 1) * 2.2, 14, 0);
      mesh.userData = { label: c.label, section: 'contact', href: c.href, phase: i * 1.5 };

      this.scene.add(mesh);
      this.interactives.push(mesh);
    });
  }

  showPanel(name) {
    this.setPanelVisible(name, true);
  }

  setPanelVisible(name, visible) {
    const el = document.getElementById(`${name}-section`);
    if (!el) return;
    if (visible) {
      el.classList.add('cp-visible');
    } else {
      el.classList.remove('cp-visible');
    }
  }

  // ── Slow, minimal drift animations ────────────────────────────────────────
  update(time, dt) {
    this._time = time;

    // Very gentle lantern float (no swinging, no flashing)
    this._lanterns.forEach(({ mesh, light, mat }) => {
      const ph = mesh.userData.phase;
      mesh.position.y = mesh.userData.baseY + Math.sin(time * 0.4 + ph) * 0.08;
      mesh.rotation.y += dt * 0.15;
    });

    // Skill orbs: very calm float
    this._orbMeshes.forEach(({ mesh }) => {
      const ph = mesh.userData.phase;
      mesh.position.y = mesh.userData.baseY + Math.sin(time * 0.3 + ph) * 0.05;
      mesh.rotation.y += dt * 0.1;
    });

    // Contact orbs: slow drift
    this.interactives
      .filter(m => m.userData.section === 'contact')
      .forEach(m => {
        m.position.y = 14 + Math.sin(time * 0.35 + m.userData.phase) * 0.08;
      });
  }
}
