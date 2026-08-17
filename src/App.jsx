import { useState, useEffect, useRef } from "react";
import { C, GP, GC, GG, FONTS, FONT_URL, buildCSS } from "./theme";

// ─────────────────────────────────────────────
//  CONTENT
// ─────────────────────────────────────────────

const BAND_NAME = "Candy Chic";
const TAGLINE   = "Denver's sweetest sound.";

const STREAMING = [
  { label:"Spotify",     url:"https://open.spotify.com/artist/5L9MJfhnkgSExw0nb4Jc0x?si=4cxwdVRaSpyrVwvNvrSxTw" },
  { label:"Apple Music", url:"https://music.apple.com/us/artist/candy-chic/1609887234" },
  { label:"YouTube",     url:"https://youtube.com/@candychicbops?si=7szsvvIbpy5Rb1Z6" },
  { label:"SoundCloud",  url:"https://on.soundcloud.com/V4YtuiNeGrUhVlz7cb" },
];

const SOCIALS = [
  { label:"Instagram", url:"https://www.instagram.com/candychicbops" },
  { label:"TikTok",    url:"https://www.tiktok.com/@candychicbops" },
];

const CONTACTS = [
  ["Management", "Candychicbops@gmail.com"]
];

const INQUIRY_TYPES = [
  { label:"Booking",  email:"Candychicbops@gmail.com",    desc:"Show bookings, venue inquiries, tour requests" },
  { label:"Press",    email:"Candychicbops@gmail.com", desc:"Interviews, features, press kits" },
  { label:"General",  email:"Candychicbops@gmail.com",      desc:"Collabs, fan mail, everything else" },
];

const SHOW = {
  stats:false, about:false, music:false, video:false,
  shows:false, gallery:false, merch:false, newsletter:false,
};

// ─────────────────────────────────────────────
//  HOOKS
// ─────────────────────────────────────────────

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useIsTouch() {
  const [touch, setTouch] = useState(true);
  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  return touch;
}

// ─────────────────────────────────────────────
//  SMALL COMPONENTS
// ─────────────────────────────────────────────

function MarqueeDots({ center=false }) {
  const pat = ["gold","pink","gold","cyan","gold","pink","gold","cyan","gold","gold","pink","gold","cyan","gold","pink","gold","cyan","gold"];
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:center?"center":"flex-start",gap:8,margin:"1.8rem 0",flexWrap:"wrap"}}>
      {pat.map((t,i) => {
        const bg   = t==="pink"?C.neonPink:t==="cyan"?C.neonCyan:i%3===0?C.gold:C.goldDim;
        const glow = t==="pink"?`0 0 6px rgba(255,62,138,0.95)`:t==="cyan"?`0 0 6px rgba(0,212,204,0.95)`:"none";
        return <div key={i} style={{width:6,height:6,borderRadius:"50%",background:bg,opacity:t==="gold"&&i%3!==0?0.45:1,boxShadow:glow,flexShrink:0}}/>;
      })}
    </div>
  );
}

function Divider({ color="gold" }) {
  const col = color==="pink"?C.neonPink:color==="cyan"?C.neonCyan:C.gold;
  return <div style={{height:1,background:`linear-gradient(90deg,transparent,${col},transparent)`,margin:"0 1rem",opacity:0.3}}/>;
}

// ─────────────────────────────────────────────
//  INTRO SCREEN
// ─────────────────────────────────────────────

function IntroScreen({ onDone }) {
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1800);
    const t2 = setTimeout(() => onDone(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{position:"fixed",inset:0,zIndex:999,background:C.bg,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",opacity:fade?0:1,transition:"opacity .7s ease",pointerEvents:fade?"none":"all"}}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 60% 60% at 50% 50%,#2A1A08,${C.bg})`}}/>
      <p style={{fontFamily:FONTS.ui,fontSize:"0.65rem",letterSpacing:"0.35em",textTransform:"uppercase",
        color:C.neonPink,textShadow:GP(0.9),marginBottom:"1.5rem",position:"relative",
        animation:"pulseP 2.8s ease-in-out infinite"}}>✦ &nbsp; Now Presenting &nbsp; ✦</p>
      <h1 style={{fontFamily:FONTS.display,fontSize:"clamp(2.5rem,8vw,6rem)",fontWeight:900,
        color:C.ivory,textTransform:"uppercase",letterSpacing:"0.06em",lineHeight:1,
        position:"relative",textAlign:"center"}}>{BAND_NAME}</h1>
      <div style={{width:120,height:1,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"2rem auto",opacity:0.6}}/>
      <div style={{display:"flex",gap:6,position:"relative"}}>
        {[0,1,2].map(i => (
          <div key={i} style={{width:5,height:5,borderRadius:"50%",background:C.gold,
            animation:`introFade 1.2s ease-in-out ${i*0.2}s infinite alternate`}}/>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CUSTOM CURSOR — desktop only
// ─────────────────────────────────────────────

function CustomCursor() {
  const isTouch = useIsTouch();
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const pos     = useRef({x:0,y:0});
  const cur     = useRef({x:0,y:0});

  useEffect(() => {
    if (isTouch) return;
    const onMove = e => { pos.current = {x:e.clientX,y:e.clientY}; };
    window.addEventListener("mousemove", onMove);
    let raf;
    const tick = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.95;
      cur.current.y += (pos.current.y - cur.current.y) * 0.95;
      if (ringRef.current) ringRef.current.style.transform = `translate(${cur.current.x-16}px,${cur.current.y-16}px)`;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${pos.current.x-3}px,${pos.current.y-3}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div ref={ringRef} style={{position:"fixed",top:0,left:0,width:32,height:32,borderRadius:"50%",
        border:`1px solid ${C.neonPink}`,boxShadow:GP(0.4),pointerEvents:"none",zIndex:9999}}/>
      <div ref={dotRef} style={{position:"fixed",top:0,left:0,width:6,height:6,borderRadius:"50%",
        background:C.neonPink,boxShadow:GP(0.9),pointerEvents:"none",zIndex:9999}}/>
    </>
  );
}

// ─────────────────────────────────────────────
//  MOBILE NAV
// ─────────────────────────────────────────────

function MobileNav({ open, onClose, go, navItems }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const intervalRef = useRef(null);
  const photos = [
    { src:"/gallery-1.jpg", pos:"center" },
    { src:"/gallery-2.webp", pos:"center" },
    { src:"/gallery-3.jpg",  pos:"center" },
    { src:"/gallery-4.webp", pos:"center" },
    { src:"/gallery-5.jpg",  pos:"center" },
    { src:"/gallery-6.jpg",  pos:"center" },
  ];

  useEffect(() => {
    if (!open) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setPhotoIdx(i => (i + 1) % photos.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [open]);

  if (!open) return null;

  return (
    <div style={{position:"fixed",inset:0,zIndex:150,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:"2rem",overflow:"hidden"}}>
      {photos.map((photo,i) => (
        <div key={photo.src} style={{
          position:"absolute",inset:0,
          backgroundImage:`url(${photo.src})`,
          backgroundSize:"cover",
          backgroundPosition:photo.pos,
          opacity: i === photoIdx ? 1 : 0,
          transition:"opacity 0.6s ease",
          filter:"saturate(0.9) brightness(0.55)",
          willChange:"opacity",
        }}/>
      ))}
      <div style={{position:"absolute",inset:0,
        background:"radial-gradient(ellipse 80% 80% at 50% 50%, rgba(10,7,5,0.4) 0%, rgba(10,7,5,0.88) 100%)"}}/>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,
        background:`linear-gradient(90deg,transparent,${C.neonPink},transparent)`,opacity:0.6}}/>
      <button onClick={onClose} style={{position:"absolute",top:"1.5rem",right:"2rem",
        background:"none",border:"none",color:C.neonPink,fontSize:"1.5rem",
        cursor:"pointer",textShadow:GP(0.7),zIndex:1}}>✕</button>
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",
        alignItems:"center",gap:"1.8rem"}}>
        {navItems.map(l => (
          <span key={l} style={{fontFamily:FONTS.display,fontSize:"clamp(1.5rem,6vw,2.2rem)",
            fontWeight:700,color:C.ivory,letterSpacing:"0.08em",textTransform:"uppercase",
            cursor:"pointer",transition:"color .2s,text-shadow .2s",
            textShadow:"0 2px 20px rgba(0,0,0,0.8)"}}
            onClick={() => { go(l.toLowerCase()); onClose(); }}
            onMouseEnter={e=>{e.target.style.color=C.neonPink;e.target.style.textShadow=GP(0.7);}}
            onMouseLeave={e=>{e.target.style.color=C.ivory;e.target.style.textShadow="0 2px 20px rgba(0,0,0,0.8)";}}>
            {l}
          </span>
        ))}
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,
        background:`linear-gradient(90deg,transparent,${C.neonCyan},transparent)`,opacity:0.4}}/>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CONTACT FORM
// ─────────────────────────────────────────────

function ContactForm() {
  const [inquiry, setInquiry] = useState(null);
  const [sent,    setSent]    = useState(false);
  const selected = INQUIRY_TYPES.find(t => t.label === inquiry);

  const inputStyle = {
    width:"100%", padding:"0.7rem 0", border:"none",
    borderBottom:`1px solid rgba(201,168,76,0.25)`, background:"transparent",
    fontFamily:FONTS.body, fontSize:"1rem", color:C.cream,
  };
  const labelStyle = {
    display:"block", fontSize:"0.62rem", letterSpacing:"0.16em",
    textTransform:"uppercase", fontWeight:500, color:C.neonCyan,
    marginBottom:"0.45rem", fontFamily:FONTS.ui, textShadow:GC(0.4),
  };

  if (sent) return (
    <div style={{paddingTop:"2.5rem",textAlign:"center"}}>
      <p style={{fontFamily:FONTS.display,fontSize:"2.2rem",fontWeight:700,color:C.neonPink,textShadow:GP(0.8)}}>Thank you.</p>
      <p style={{fontFamily:FONTS.body,fontStyle:"italic",color:C.sepia,marginTop:"0.6rem",fontSize:"1.05rem"}}>We'll be in touch shortly.</p>
    </div>
  );

  return (
    <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
      <input type="text" name="_gotcha" style={{display:"none"}}/>
      <div style={{marginBottom:"1.8rem"}}>
        <label style={labelStyle}>Inquiry Type</label>
        <div style={{display:"flex",gap:"0.6rem",marginTop:"0.5rem",flexWrap:"wrap"}}>
          {INQUIRY_TYPES.map(t => (
            <button key={t.label} type="button" onClick={() => setInquiry(t.label)}
              style={{padding:"0.55rem 1.1rem",fontFamily:FONTS.ui,fontSize:"0.68rem",
                letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",
                border:`1px solid ${inquiry===t.label?C.neonPink:C.border}`,
                background:inquiry===t.label?"rgba(255,62,138,0.1)":"transparent",
                color:inquiry===t.label?C.neonPink:C.sepia,
                textShadow:inquiry===t.label?GP(0.6):"none",transition:"all .2s"}}>
              {t.label}
            </button>
          ))}
        </div>
        {selected && (
          <div style={{marginTop:"0.8rem",padding:"0.7rem 1rem",
            border:`1px solid rgba(0,212,204,0.2)`,background:"rgba(0,212,204,0.04)"}}>
            <p style={{fontSize:"0.68rem",color:C.neonCyan,marginBottom:3,textShadow:GC(0.5)}}>{selected.email}</p>
            <p style={{fontSize:"0.65rem",color:C.sepia,fontFamily:FONTS.body,fontStyle:"italic"}}>{selected.desc}</p>
          </div>
        )}
      </div>
      {[["Name","text","Your name"],["Email","email","your@email.com"]].map(([lbl,type,ph]) => (
        <div key={lbl} style={{marginBottom:"1.4rem"}}>
          <label style={labelStyle}>{lbl}</label>
          <input type={type} placeholder={ph} required style={inputStyle}/>
        </div>
      ))}
      <div style={{marginBottom:"1.4rem"}}>
        <label style={labelStyle}>Message</label>
        <textarea placeholder="Tell us more..." rows={4} required style={{...inputStyle,resize:"none"}}/>
      </div>
      <button type="submit" disabled={!inquiry}
        style={{marginTop:"0.8rem",padding:"0.85rem 2rem",background:"transparent",
          color:inquiry?C.gold:"rgba(201,168,76,0.3)",
          border:`1px solid ${inquiry?C.gold:"rgba(201,168,76,0.3)"}`,
          fontFamily:FONTS.ui,fontSize:"0.7rem",letterSpacing:"0.2em",
          textTransform:"uppercase",fontWeight:500,
          cursor:inquiry?"pointer":"not-allowed",
          textShadow:inquiry?GG(0.5):"none",transition:"all .2s",width:"100%"}}>
        {inquiry ? `Send to ${inquiry}` : "Select an Inquiry Type"}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────

export default function App() {
  const [intro,    setIntro]    = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const width  = useWindowWidth();
  const mobile = width < 768;

  useScrollReveal();

  const navItems = [
    SHOW.about   && "About",
    SHOW.music   && "Music",
    SHOW.shows   && "Shows",
    SHOW.gallery && "Gallery",
    SHOW.merch   && "Merch",
  ].filter(Boolean);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = FONT_URL;
    document.head.appendChild(link);
    const st = document.createElement("style");
    st.textContent = buildCSS() + `
      @keyframes introFade { from{opacity:0.2} to{opacity:1} }
      @keyframes pulseP    { 0%,100%{text-shadow:${GP(0.9)}} 50%{text-shadow:${GP(0.35)}} }
      .reveal      { opacity:0; transform:translateY(28px); transition:opacity .75s ease,transform .75s ease; }
      .reveal-left { opacity:0; transform:translateX(-28px); transition:opacity .75s ease,transform .75s ease; }
      .reveal-right{ opacity:0; transform:translateX(28px);  transition:opacity .75s ease,transform .75s ease; }
      .revealed    { opacity:1 !important; transform:translate(0,0) !important; }
      @media (pointer: fine) { * { cursor: none !important; } }
    `;
    document.head.appendChild(st);
  }, []);

  // 2. Preload gallery photos
  useEffect(() => {
    ["/gallery-1.jpg","/gallery-2.webp","/gallery-3.jpg",
     "/gallery-4.webp","/gallery-5.jpg","/gallery-6.jpg"].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  const pad  = mobile ? "1.2rem" : "2.5rem";
  const secY = mobile ? "4rem"   : "7rem";

  return (
    <>
      <CustomCursor/>
      {intro && <IntroScreen onDone={() => setIntro(false)}/>}
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} go={go} navItems={navItems}/>

      <div style={{background:C.bg,color:C.cream,fontFamily:FONTS.ui,minHeight:"100vh",overflowX:"hidden"}}>

        {/* invisible photo preloader */}
        <div style={{position:"fixed",width:1,height:1,overflow:"hidden",opacity:0,pointerEvents:"none",zIndex:-1}}>
          {["/gallery-1.jpg","/gallery-2.webp","/gallery-3.jpg","/gallery-4.webp","/gallery-5.jpg","/gallery-6.jpg"].map(src => (
            <div key={src} style={{width:1,height:1,backgroundImage:`url(${src})`,backgroundSize:"cover"}}/>
          ))}
        </div>

        {/* ── NAV ── */}
        <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:`0.9rem ${pad}`,backdropFilter:"blur(18px)",
          background:"rgba(10,7,5,0.92)",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontFamily:FONTS.display,fontSize:"1.1rem",fontWeight:700,letterSpacing:"0.1em",
            color:C.gold,textTransform:"uppercase",textShadow:GG(0.5),
            position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
            {BAND_NAME}
          </span>
          {/* desktop links */}
          {!mobile && (
            <div style={{display:"flex",gap:"2rem"}}>
              {navItems.map(l => (
                <span key={l} className="nav-link" style={{fontSize:"0.68rem",fontWeight:500,
                  letterSpacing:"0.18em",textTransform:"uppercase",color:C.sepia}}
                  onClick={() => go(l.toLowerCase())}>{l}</span>
              ))}
            </div>
          )}
          <button onClick={() => setMenuOpen(true)} style={{background:"none",border:"none",cursor:"pointer",
            display:"flex",flexDirection:"column",gap:5,padding:4,marginLeft:"auto"}}>
            {[0,1,2].map(i => <div key={i} style={{width:22,height:1.5,background:C.gold,boxShadow:GG(0.4)}}/>)}
          </button>
        </nav>

        {/* ── HERO ── */}
        <section id="hero" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",
          alignItems:"center",padding:`6rem ${pad} 4rem`,position:"relative",overflow:"hidden",textAlign:"center"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 65% at 50% 40%,#2A1A08,${C.bg} 72%)`}}/>
          <div style={{position:"absolute",top:"15%",left:"8%",width:300,height:300,borderRadius:"50%",background:C.neonPink,opacity:0.04,filter:"blur(80px)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"20%",right:"6%",width:260,height:260,borderRadius:"50%",background:C.neonCyan,opacity:0.05,filter:"blur(70px)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:1}}>
            <div style={{position:"absolute",left:0,right:0,height:"3px",background:"rgba(0,212,204,0.018)",animation:"scanline 9s linear infinite"}}/>
          </div>
          <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",backgroundSize:"180px"}}/>
          {!mobile && <>
            <div style={{position:"absolute",inset:"3rem",border:`1px solid ${C.border}`,pointerEvents:"none"}}/>
            <div style={{position:"absolute",inset:"3.4rem",border:`1px solid rgba(201,168,76,0.07)`,pointerEvents:"none"}}/>
            {[
              {t:"3rem",l:"3rem",rot:"",             col:C.neonPink,cls:"pulse-p"},
              {t:"3rem",r:"3rem",rot:"scaleX(-1)",   col:C.neonCyan,cls:"pulse-c"},
              {b:"3rem",l:"3rem",rot:"scaleY(-1)",   col:C.neonCyan,cls:"pulse-c"},
              {b:"3rem",r:"3rem",rot:"scale(-1,-1)", col:C.neonPink,cls:"pulse-p"},
            ].map((o,i) => {
              const p = {position:"absolute"};
              if(o.t) p.top=o.t; if(o.b) p.bottom=o.b;
              if(o.l) p.left=o.l; if(o.r) p.right=o.r;
              if(o.rot) p.transform=o.rot;
              return (<svg key={i} className={o.cls} style={{...p,width:32,height:32,filter:`drop-shadow(0 0 5px ${o.col})`}} viewBox="0 0 28 28">
                <path d="M2 2 L2 14 M2 2 L14 2" fill="none" stroke={o.col} strokeWidth="1.8"/>
              </svg>);
            })}
          </>}

          {/* minimalist centered layout */}
          <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",gap:"1.8rem",width:"100%"}}>

            {/* small title above photo */}
            <div className="curtain d1" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.8rem"}}>
              <MarqueeDots center/>
              <h1 className="title-flicker" style={{fontFamily:FONTS.display,
                fontSize:mobile?"clamp(2.2rem,10vw,3.5rem)":"clamp(2.5rem,5vw,4rem)",
                fontWeight:700,lineHeight:1.1,color:C.ivory,letterSpacing:"0.12em",
                textTransform:"uppercase"}}>
                Candy &nbsp;<span style={{color:C.gold,textShadow:GG(0.6)}}>Chic</span>
              </h1>
            </div>

            {/* centered band photo */}
            <div className="curtain d2" style={{position:"relative",width:mobile?"90%":"42%",maxWidth:480}}>
              <img src="/band-photo.jpg" alt="Candy Chic"
                style={{width:"100%",display:"block",border:`1px solid ${C.border}`,
                  filter:"saturate(1.1) contrast(1.05)",
                  boxShadow:`0 0 60px rgba(255,62,138,0.12), 0 0 120px rgba(0,0,0,0.6)`}}/>
              {/* neon corner accents */}
              {[
                {top:0,left:0},
                {top:0,right:0,transform:"scaleX(-1)"},
                {bottom:0,left:0,transform:"scaleY(-1)"},
                {bottom:0,right:0,transform:"scale(-1,-1)"},
              ].map((pos,i) => (
                <svg key={i} style={{position:"absolute",...pos,width:22,height:22,
                  filter:`drop-shadow(0 0 4px ${i%2===0?C.neonPink:C.neonCyan})`}} viewBox="0 0 28 28">
                  <path d="M2 2 L2 12 M2 2 L12 2" fill="none"
                    stroke={i%2===0?C.neonPink:C.neonCyan} strokeWidth="2"/>
                </svg>
              ))}
            </div>

            {/* all links in one uniform grid */}
            <div className="curtain d3" style={{
              display:"grid",
              gridTemplateColumns: mobile ? "repeat(2, minmax(0, 1fr))" : "repeat(3, 160px)",
              gap:"0.7rem",
              justifyContent:"center",
              padding: mobile ? "0.85rem 0" : "0.7rem 0",
              width: mobile ? "95%" : "auto",
            }}>
              {[...SOCIALS, ...STREAMING].map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="stream-btn"
                  style={{padding:"0.7rem 0",textAlign:"center",
                    border:`1px solid ${C.gold}`,background:"transparent",
                    color:C.gold,fontSize:"0.68rem",letterSpacing:"0.18em",
                    textTransform:"uppercase",fontFamily:FONTS.ui,
                    textDecoration:"none",transition:"all .2s",
                    textShadow:GG(0.4),boxShadow:`0 0 12px rgba(201,168,76,0.15)`}}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <Divider color="cyan"/>

        {/* ── SHOWS ── */}
        <section id="shows" style={{padding:`${secY} ${pad}`,position:"relative",overflow:"hidden"}}>
          <div style={{maxWidth:1060,margin:"0 auto"}}>
            <p className="pulse-p" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",
              textTransform:"uppercase",color:C.neonPink,marginBottom:"0.8rem"}}>On Tour</p>
            <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",
              fontWeight:700,marginBottom:"2.5rem",color:C.ivory}}>Upcoming Shows</h2>
            <p style={{fontFamily:FONTS.body,fontStyle:"italic",color:C.sepia,fontSize:"1rem"}}>
              No upcoming shows scheduled — check back soon.
            </p>
          </div>
        </section>

        <Divider color="cyan"/>

        {/* ── CONTACT ── */}
        <section id="contact" style={{padding:`${secY} ${pad}`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",bottom:0,left:"5%",width:350,height:350,borderRadius:"50%",
            background:C.neonCyan,opacity:0.04,filter:"blur(80px)",pointerEvents:"none"}}/>
          <div style={{
            maxWidth:1060, margin:"0 auto", position:"relative",
            display:"grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: mobile ? "3rem" : "5rem",
            alignItems:"start",
          }}>
            <div className="reveal reveal-left">
              <p className="pulse-p" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",
                textTransform:"uppercase",color:C.neonPink,marginBottom:"0.8rem"}}>Get in Touch</p>
              <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:700,
                marginBottom:"1.2rem",color:C.ivory}}>Booking &<br/>Inquiries</h2>
              <p style={{fontFamily:FONTS.body,fontSize:"1.05rem",color:C.sepia,lineHeight:1.85,marginBottom:"1.8rem"}}>
                Based in Denver, CO — available for shows, press, and collaborations. Reach out and we'll get back to you within 48 hours.
              </p>
              <MarqueeDots/>
              <p style={{fontSize:"0.88rem",marginBottom:"0.6rem",fontFamily:FONTS.body}}>
                <a href="mailto:Candychicbops@gmail.com" style={{color:C.neonPink,textDecoration:"none",textShadow:GP(0.4)}}>
                  Candychicbops@gmail.com
                </a>
              </p>

            </div>
            <div className="reveal reveal-right">
              <ContactForm/>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{background:C.surface,padding:`2rem ${pad}`,borderTop:`1px solid rgba(255,62,138,0.2)`}}>
          <div style={{maxWidth:1060,margin:"0 auto"}}>
            <div style={{display:"flex",flexDirection: mobile?"column":"row",alignItems: mobile?"flex-start":"center",
              justifyContent:"space-between",marginBottom:"1.2rem",gap:"1rem"}}>
              <span style={{fontFamily:FONTS.display,color:C.gold,fontSize:"0.95rem",fontWeight:700,
                letterSpacing:"0.08em",textTransform:"uppercase",textShadow:GG(0.5)}}>{BAND_NAME}</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {[C.neonPink,C.goldDim,C.neonCyan,C.neonPink,C.neonCyan,C.goldDim,C.neonPink].map((col,i) => (
                  <div key={i} style={{width:5,height:5,borderRadius:"50%",background:col,
                    boxShadow:col===C.goldDim?"none":`0 0 6px ${col}`,opacity:col===C.goldDim?0.4:0.9}}/>
                ))}
              </div>
            </div>
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:"1rem",display:"flex",
              justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"}}>
              <span style={{fontSize:"0.65rem",color:C.sepia}}>© 2026 Candy Chic · All rights reserved</span>
              <span style={{fontSize:"0.65rem",color:C.sepia}}>Denver, CO</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}