import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hero', standalone: true, imports: [CommonModule],
  template: `
<section class="hero" id="hero">
<canvas #globeCanvas class="globe-canvas" id="globeCanvas"></canvas>
<div class="hero-mandala-bg pat-mandala"></div>
<div class="hero-overlay"></div>
<div class="hero-particles" id="particles">
  <div *ngFor="let p of particles" class="particle"
    [style.left]="p.left" [style.animationDuration]="p.dur" [style.animationDelay]="p.del"
    [style.width]="p.sz" [style.height]="p.sz"></div>
</div>
<div class="hero-plane" aria-hidden="true">
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="planeBody" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/><stop offset="60%" stop-color="#F1CD7C"/><stop offset="100%" stop-color="#D4A843"/>
      </linearGradient>
      <linearGradient id="planeAccent" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#FF6B00"/><stop offset="100%" stop-color="#7A1F2B"/>
      </linearGradient>
    </defs>
    <path d="M6 36 L46 22 L58 18 C60 17 62 19 60 21 L52 28 L26 50 C25 51 23 51 22 49 L18 42 L8 38 C6 37 6 37 6 36 Z" fill="url(#planeBody)" stroke="#7A1F2B" stroke-width="0.6"/>
    <path d="M22 49 L30 40 L34 44 L26 50 C25 51 23 51 22 49 Z" fill="url(#planeAccent)" opacity="0.85"/>
    <path d="M46 22 L40 16 L36 18 L42 26 Z" fill="#FFFFFF" stroke="#D4A843" stroke-width="0.4"/>
    <circle cx="30" cy="30" r="1.2" fill="#0B1120"/>
    <circle cx="36" cy="28" r="1.2" fill="#0B1120"/>
    <circle cx="42" cy="26" r="1.2" fill="#0B1120"/>
  </svg>
</div>
<div class="hero-plane-trail" aria-hidden="true"></div>
<div class="w">
<div class="hero-content">
  <div class="hero-namaste"><span class="ns-emoji">🙏</span><span>Namaste, traveller</span></div>
  <div class="hero-badge"><div class="hero-badge-dot"></div><span>Serving 18.5M Indians abroad</span></div>
  <h1>Find your best<br>fare <span class="grad-s">home</span>.<br><span class="grad-g">Every time.</span></h1>
  <p class="hero-sub">Multi-city flight search built for the Indian diaspora. Compare every airline across 6 corridors &#8212; one search, best prices, zero fees.</p>
  <div class="hero-btns">
    <button class="btn-p" (click)="scrollToBooking()">Search Flights</button>
    <button class="btn-s" (click)="auth.openAppModal()">Download App</button>
  </div>
  <div class="hero-stats">
    <div class="hero-stat" *ngFor="let s of stats; let i = index" [attr.data-idx]="i">
      <strong>{{s.current}}</strong><span>{{s.label}}</span>
    </div>
  </div>
</div>
</div>
</section>`
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private animId = 0;
  stats = [
    { count: 6, prefix: '', suffix: '', label: 'Global Corridors', current: '0' },
    { count: 180, prefix: '$', suffix: '+', label: 'Avg Savings/Trip', current: '$0' },
    { count: 99.9, prefix: '', suffix: '%', label: 'Uptime', current: '0%' }
  ];
  particles: { left: string; dur: string; del: string; sz: string }[] = [];

  constructor(public auth: AuthService) {
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        left: Math.random() * 100 + '%', dur: (8 + Math.random() * 15) + 's',
        del: (Math.random() * 10) + 's', sz: (1 + Math.random() * 2) + 'px'
      });
    }
  }

  ngAfterViewInit() { this.loadGlobe(); this.animateCounters(); }
  ngOnDestroy() { cancelAnimationFrame(this.animId); }
  scrollToBooking() { document.getElementById('flights')?.scrollIntoView({ behavior: 'smooth' }); }

  animateCounters() {
    const dur = 1500; const start = performance.now();
    const step = (ts: number) => {
      const p = Math.min((ts - start) / dur, 1); const e = 1 - Math.pow(1 - p, 3);
      this.stats.forEach(s => { let v = e * s.count; v = s.count % 1 === 0 ? Math.round(v) : Math.round(v * 10) / 10; s.current = s.prefix + v + s.suffix; });
      if (p < 1) requestAnimationFrame(step); else this.stats.forEach(s => s.current = s.prefix + s.count + s.suffix);
    };
    setTimeout(() => requestAnimationFrame(step), 800);
  }

  loadGlobe() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => this.buildGlobe();
    document.head.appendChild(script);
  }

  buildGlobe() {
    const T = (window as any).THREE; if (!T) return;
    const c = this.canvasRef?.nativeElement; if (!c) return;
    let W = c.parentElement!.offsetWidth * 0.65, H = c.parentElement!.offsetHeight || window.innerHeight;
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(45, W / H, 0.1, 1000);
    cam.position.z = 2.8;
    const ren = new T.WebGLRenderer({ canvas: c, alpha: true, antialias: true });
    ren.setSize(W, H); ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const globe = new T.Mesh(new T.SphereGeometry(1, 48, 48), new T.MeshBasicMaterial({ color: 0x1a2744, wireframe: true, transparent: true, opacity: 0.12 }));
    scene.add(globe);
    const ring = new T.Mesh(new T.RingGeometry(1.02, 1.06, 64), new T.MeshBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 0.08, side: T.DoubleSide }));
    scene.add(ring);
    const dg = new T.SphereGeometry(0.018, 12, 12);
    const matIN = new T.MeshBasicMaterial({ color: 0xD4A843, transparent: true, opacity: 0.95 });
    const matAbroad = new T.MeshBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 0.85 });
    const haloG = new T.SphereGeometry(0.045, 12, 12);
    const haloMat = new T.MeshBasicMaterial({ color: 0xD4A843, transparent: true, opacity: 0.18 });
    const cities = [
      {la:28.6,lo:77.2,india:true},{la:19.07,lo:72.87,india:true},{la:13.08,lo:80.27,india:true},
      {la:12.97,lo:77.59,india:true},{la:15.49,lo:73.82,india:true},{la:26.91,lo:75.78,india:true},
      {la:17.38,lo:78.48,india:true},{la:22.57,lo:88.36,india:true},{la:23.02,lo:72.57,india:true},
      {la:18.52,lo:73.86,india:true},
      {la:43.65,lo:-79.38},{la:49.28,lo:-123.12},{la:51.5,lo:-0.12},{la:25.2,lo:55.27},
      {la:-33.86,lo:151.2},{la:1.35,lo:103.82},{la:40.71,lo:-74},{la:37.77,lo:-122.42}
    ];
    cities.forEach((ct: any) => {
      const phi = (90 - ct.la) * Math.PI / 180, theta = (ct.lo + 180) * Math.PI / 180;
      const x = -1.02 * Math.sin(phi) * Math.cos(theta), y = 1.02 * Math.cos(phi), z = 1.02 * Math.sin(phi) * Math.sin(theta);
      const dot = new T.Mesh(dg, ct.india ? matIN : matAbroad);
      dot.position.set(x, y, z);
      globe.add(dot);
      if (ct.india) {
        const halo = new T.Mesh(haloG, haloMat);
        halo.position.set(x, y, z);
        globe.add(halo);
      }
    });
    const lv = (la: number, lo: number, r: number) => { const p2 = (90 - la) * Math.PI / 180, t = (lo + 180) * Math.PI / 180; return new T.Vector3(-r * Math.sin(p2) * Math.cos(t), r * Math.cos(p2), r * Math.sin(p2) * Math.sin(t)); };
    const arcs: any[] = [];
    const arc = (a1: number, b1: number, a2: number, b2: number, col: number) => {
      const p1 = lv(a1,b1,1.02), p2 = lv(a2,b2,1.02);
      const mid = new T.Vector3().addVectors(p1,p2).multiplyScalar(0.5).normalize().multiplyScalar(1.5);
      const pts = new T.QuadraticBezierCurve3(p1,mid,p2).getPoints(60);
      const line = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({color:col,transparent:true,opacity:0.35}));
      globe.add(line);
      const sg = new T.SphereGeometry(0.012, 8, 8);
      const sphere = new T.Mesh(sg, new T.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.95 }));
      globe.add(sphere);
      arcs.push({ pts, sphere, t: Math.random() });
    };
    arc(43.65,-79.38,28.6,77.2,0xFF6B00); arc(49.28,-123.12,19.07,72.87,0xD4A843);
    arc(51.5,-0.12,12.97,77.59,0xFF6B00); arc(25.2,55.27,13.08,80.27,0xD4A843);
    arc(-33.86,151.2,17.38,78.48,0xFF6B00); arc(1.35,103.82,13.08,80.27,0xD4A843);
    arc(40.71,-74,19.07,72.87,0xFF6B00); arc(37.77,-122.42,28.6,77.2,0xD4A843);
    scene.add(new T.AmbientLight(0xffffff, 0.6));
    const dirLight = new T.DirectionalLight(0xFFD79A, 0.4); dirLight.position.set(5, 3, 5); scene.add(dirLight);
    let mx = 0, my2 = 0;
    document.addEventListener('mousemove', (e: MouseEvent) => { mx = (e.clientX / window.innerWidth - 0.5) * 0.3; my2 = (e.clientY / window.innerHeight - 0.5) * 0.3; });
    const anim = () => {
      this.animId = requestAnimationFrame(anim);
      globe.rotation.y += 0.002;
      globe.rotation.x += (my2 * 0.5 - globe.rotation.x) * 0.02;
      cam.position.x += (mx * 1.5 - cam.position.x) * 0.02;
      ring.rotation.z += 0.003;
      arcs.forEach(a => {
        a.t += 0.005;
        if (a.t > 1) a.t = 0;
        const idx = Math.floor(a.t * (a.pts.length - 1));
        const p = a.pts[idx];
        a.sphere.position.set(p.x, p.y, p.z);
      });
      ren.render(scene, cam);
    };
    anim();
    window.addEventListener('resize', () => { W = c.parentElement!.offsetWidth * 0.65; H = c.parentElement!.offsetHeight || window.innerHeight; cam.aspect = W / H; cam.updateProjectionMatrix(); ren.setSize(W, H); });
  }
}
