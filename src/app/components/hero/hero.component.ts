import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hero', standalone: true, imports: [CommonModule],
  template: `
<section class="hero" id="hero">
<canvas #globeCanvas class="globe-canvas"></canvas>
<div class="hero-overlay"></div>
<div class="hero-particles" id="particles">
  <div *ngFor="let p of particles" class="particle"
    [style.left]="p.left" [style.animationDuration]="p.dur" [style.animationDelay]="p.del"
    [style.width]="p.sz" [style.height]="p.sz"></div>
</div>
<div class="w">
<div class="hero-content">
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
    const dg = new T.SphereGeometry(0.015, 8, 8), ds = new T.MeshBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 0.7 }), dg2 = new T.MeshBasicMaterial({ color: 0x138808, transparent: true, opacity: 0.7 });
    const cities = [{la:28.6,lo:77.2},{la:19.07,lo:72.87},{la:13.08,lo:80.27},{la:12.97,lo:77.59},{la:43.65,lo:-79.38},{la:49.28,lo:-123.12},{la:51.5,lo:-0.12},{la:25.2,lo:55.27},{la:-33.86,lo:151.2},{la:1.35,lo:103.82},{la:40.71,lo:-74},{la:15.49,lo:73.82},{la:26.91,lo:75.78},{la:17.38,lo:78.48},{la:22.57,lo:88.36}];
    cities.forEach((ct: any, i: number) => {
      const phi = (90 - ct.la) * Math.PI / 180, theta = (ct.lo + 180) * Math.PI / 180;
      const dot = new T.Mesh(dg, i < 4 ? dg2 : ds);
      dot.position.set(-1.02 * Math.sin(phi) * Math.cos(theta), 1.02 * Math.cos(phi), 1.02 * Math.sin(phi) * Math.sin(theta));
      globe.add(dot);
    });
    const lv = (la: number, lo: number, r: number) => { const p2 = (90 - la) * Math.PI / 180, t = (lo + 180) * Math.PI / 180; return new T.Vector3(-r * Math.sin(p2) * Math.cos(t), r * Math.cos(p2), r * Math.sin(p2) * Math.sin(t)); };
    const arc = (a1: number, b1: number, a2: number, b2: number, col: number) => { const p1 = lv(a1,b1,1.02), p2 = lv(a2,b2,1.02), mid = new T.Vector3().addVectors(p1,p2).multiplyScalar(0.5).normalize().multiplyScalar(1.5); globe.add(new T.Line(new T.BufferGeometry().setFromPoints(new T.QuadraticBezierCurve3(p1,mid,p2).getPoints(50)), new T.LineBasicMaterial({color:col,transparent:true,opacity:0.35}))); };
    arc(43.65,-79.38,28.6,77.2,0xFF6B00); arc(49.28,-123.12,19.07,72.87,0x138808);
    arc(51.5,-0.12,12.97,77.59,0xFF6B00); arc(25.2,55.27,13.08,80.27,0x138808);
    arc(-33.86,151.2,17.38,78.48,0xFF6B00); arc(1.35,103.82,13.08,80.27,0x138808);
    scene.add(new T.AmbientLight(0xffffff, 0.5));
    let mx = 0, my2 = 0;
    document.addEventListener('mousemove', (e: MouseEvent) => { mx = (e.clientX / window.innerWidth - 0.5) * 0.3; my2 = (e.clientY / window.innerHeight - 0.5) * 0.3; });
    const anim = () => { this.animId = requestAnimationFrame(anim); globe.rotation.y += 0.002; globe.rotation.x += (my2 * 0.5 - globe.rotation.x) * 0.02; cam.position.x += (mx * 1.5 - cam.position.x) * 0.02; ring.rotation.z += 0.003; ren.render(scene, cam); };
    anim();
    window.addEventListener('resize', () => { W = c.parentElement!.offsetWidth * 0.65; H = c.parentElement!.offsetHeight || window.innerHeight; cam.aspect = W / H; cam.updateProjectionMatrix(); ren.setSize(W, H); });
  }
}
