import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import {
  ArrowDown, ArrowRight, CircleHelp, Compass, Handshake, Instagram, Lightbulb,
  Mail, MapPin, Menu, MessageCircle, PenLine, Route as RouteIcon, Send, Shapes,
  Sparkles, Users, Wrench, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudioCursor } from "@/components/studio-cursor";
import logo from "@/assets/craft-studio-logo.png";
import toon3 from "@/assets/toons/toon-3.png";
import toon5 from "@/assets/toons/toon-5.png";
import toon6 from "@/assets/toons/toon-6.png";
import toon8 from "@/assets/toons/toon-8.png";
import toon9 from "@/assets/toons/toon-9.png";
import toon11 from "@/assets/toons/toon-11.png";
import toon12 from "@/assets/toons/toon-12.png";

const toonSources: Record<number, string> = { 3: toon3, 5: toon5, 6: toon6, 8: toon8, 9: toon9, 11: toon11, 12: toon12 };

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Craft Studio — Ideas Deserve Good Design" },
    { name: "description", content: "Craft Studio creates brands, websites, automation and useful digital experiences with intention." },
    { property: "og:title", content: "Craft Studio — Ideas Deserve Good Design" },
    { property: "og:description", content: "Follow the Craft Studio map from a rough idea to a useful digital experience." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

type ServiceGlyphName = "spark" | "automation" | "code" | "browser" | "eye" | "signal" | "gear" | "profile" | "people";

const services: [string, string, string, string, string, ServiceGlyphName][] = [
  ["01", "AI", "Make technology work for you.", "Practical AI solutions built around real problems.", "DISCUSS A BUILD", "spark"],
  ["02", "AI Automation", "Less repetition. More doing.", "Automate repetitive workflows and connect the tools you already use.", "BUILD AN AUTOMATION", "automation"],
  ["03", "Python", "Logic, built properly.", "Python tools, scripts and custom solutions.", "DISCUSS A BUILD", "code"],
  ["04", "Web Development", "Web that works.", "Fast, responsive, purpose-built digital experiences.", "DESIGN MY WEBSITE", "browser"],
  ["05", "Web Design", "Good design makes things easier.", "Interfaces designed around people, clarity and purpose.", "DESIGN MY WEBSITE", "eye"],
  ["06", "Digital Marketing", "Be seen. Be understood.", "Digital marketing shaped around audience, message and goals.", "START A PROJECT", "signal"],
  ["07", "Custom Software", "When off-the-shelf isn't enough.", "Purpose-built software for specific needs.", "DISCUSS A BUILD", "gear"],
  ["08", "Career Design", "Your experience deserves better presentation.", "Resume, LinkedIn and portfolio building.", "BUILD MY PROFILE", "profile"],
  ["09", "Career Support", "From preparation to opportunity.", "Practical placement and career support.", "BUILD MY PROFILE", "people"],
];

const process = [
  ["01", "Listen", "What are you trying to solve?"], ["02", "Sketch", "Ideas before execution."],
  ["03", "Shape", "Find the clearest direction."], ["04", "Build", "Design. Code. Create."],
  ["05", "Refine", "Test. Improve. Polish."], ["06", "Deliver", "Something ready to use."],
];

const faqs = [
  ["Is Craft Studio new?", "Yes. Craft Studio is newly established, while the people behind the studio bring previous experience."],
  ["Do you build custom projects?", "Yes. Requirements are discussed first, then the right approach is defined."],
  ["Can you handle design and development?", "Yes."],
  ["Do you provide AI and automation?", "Yes, for suitable business and workflow requirements."],
  ["Do you provide career services?", "Yes. Resume, LinkedIn, portfolio and placement/career support are available."],
  ["How do I start?", "Tell us what you're trying to build, improve or solve."],
];

function Mark({ className = "" }: { className?: string }) {
  return <img src={logo} alt="Craft Studio" className={`object-contain ${className}`} />;
}

function ServiceGlyph({ name }: { name: ServiceGlyphName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 4.5, strokeLinecap: "square" as const, strokeLinejoin: "miter" as const };
  const drawings: Record<ServiceGlyphName, ReactNode> = {
    spark: <><path {...common} d="M28 4 17 25h10l-4 19 19-25H31z"/><path {...common} d="M7 17 2 12m44 32-5-5M45 10l5-5M8 40l-6 5"/></>,
    automation: <><path {...common} d="M7 11h40v30H7z"/><path {...common} d="m17 30 8-8 7 7 10-12"/><path {...common} d="m37 17 5 0 0 5"/><circle cx="15" cy="16" r="2.5" fill="currentColor"/></>,
    code: <><path {...common} d="m19 13-12 13 12 13M37 13l12 13-12 13M31 8l-9 36"/></>,
    browser: <><path {...common} d="M5 8h46v38H5zM5 18h46"/><circle cx="12" cy="13" r="2" fill="currentColor"/><path {...common} d="m20 37 7-13 5 8 5-4 6 9z"/></>,
    eye: <><path {...common} d="M3 28s10-15 25-15 25 15 25 15-10 15-25 15S3 28 3 28Z"/><circle cx="28" cy="28" r="8" fill="currentColor"/><path {...common} d="M28 3v6M8 8l5 5m35-5-5 5"/></>,
    signal: <><path {...common} d="M8 39V26h8v13M24 39V17h8v22M40 39V8h8v31"/><path {...common} d="M5 46h46"/></>,
    gear: <><path {...common} d="m23 4 10 0 2 7 7-2 6 9-5 5 5 6-6 10-7-3-2 8H23l-2-8-7 3-6-10 5-6-5-5 6-9 7 2z"/><circle cx="28" cy="24" r="7" fill="currentColor"/></>,
    profile: <><path {...common} d="M6 9h44v36H6zM6 17h44"/><circle cx="19" cy="28" r="6" fill="currentColor"/><path {...common} d="M11 40c2-6 6-8 8-8s6 2 8 8M33 25h11M33 33h11"/></>,
    people: <><circle cx="28" cy="16" r="7" fill="currentColor"/><circle cx="11" cy="20" r="5" fill="currentColor"/><circle cx="45" cy="20" r="5" fill="currentColor"/><path d="M19 27h18v22H19zM4 29h12v20H4zM40 29h12v20H40z" fill="currentColor"/></>,
  };
  return <svg viewBox="0 0 56 56" aria-hidden="true">{drawings[name]}</svg>;
}

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openService, setOpenService] = useState<number | null>(null);
  const [routeProgress, setRouteProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 90);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setRouteProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.1, rootMargin: "0px 0px -8%" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`New Craft Studio enquiry — ${values.get("service")}`);
    const body = encodeURIComponent(`Name: ${values.get("name")}\nContact: ${values.get("contact")}\nService: ${values.get("service")}\n\n${values.get("message")}`);
    window.location.href = `mailto:craftstudio2k26@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudioCursor />
      <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 lg:px-10">
          <a href="#top" aria-label="Craft Studio home" className={`transition-all duration-700 ${scrolled ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 pointer-events-none"}`}><Mark className="h-12 w-28" /></a>
          <nav aria-label="Map navigation" className="hidden items-center gap-6 font-mono text-[11px] uppercase text-muted-foreground md:flex">
            {[["01 Services","services"],["02 Process","process"],["03 Studio","work"],["04 About","about"]].map(([label,id]) => <a key={id} href={`#${id}`} className="story-link transition-colors hover:text-foreground">{label}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden font-hand text-lg text-accent lg:block">you are here →</span>
            <Button variant="studio" asChild className="hidden sm:inline-flex"><a href="#contact">Final stop <MapPin /></a></Button>
            <Button variant="paper" size="icon" aria-label="Toggle navigation" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
          </div>
        </div>
        {menuOpen && <nav className="border-b border-border bg-background px-5 py-5 md:hidden">{["services","process","work","about","contact"].map(id => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="block border-b border-border py-3 font-mono text-sm uppercase">{id}</a>)}</nav>}
      </header>

      <main id="top" className="journey-map relative overflow-hidden">
        <svg aria-hidden="true" className="map-route" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="map-route-base" d="M50 0 C83 5 14 10 50 16 S84 27 50 34 S15 44 50 51 S83 62 50 70 S17 80 50 87 S72 95 50 100" />
          <path className="map-route-progress" pathLength="1" style={{ strokeDashoffset: 1 - routeProgress }} d="M50 0 C83 5 14 10 50 16 S84 27 50 34 S15 44 50 51 S83 62 50 70 S17 80 50 87 S72 95 50 100" />
        </svg>

        <section className="drafting-grid relative flex min-h-[94svh] items-center pt-24">
          <span className="map-coordinate left-[5%] top-32">REF. CS—01 / ENTRY</span>
          <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 gap-5 px-5 py-14 lg:px-10">
            <div className="col-span-12 flex min-h-[24vh] items-center justify-center lg:min-h-[34vh]"><Mark className={`w-[min(80vw,650px)] transition-all duration-700 ${scrolled ? "scale-75 -translate-y-6 opacity-0" : "scale-100 opacity-100"}`} /></div>
            <div className="col-span-12 lg:col-span-9" data-reveal>
              <p className="map-label"><PenLine /> Digital craft studio / starting point</p>
              <h1 className="font-display text-[clamp(2.8rem,7vw,6.7rem)] font-semibold uppercase leading-[.92]">Ideas deserve<br/><span className="sketch-underline">good design.</span></h1>
            </div>
            <div className="col-span-10 col-start-3 mt-6 border-l-2 border-accent pl-5 lg:col-span-4 lg:col-start-9" data-reveal>
              <p className="text-lg leading-relaxed">We craft brands, visuals & digital experiences with intention.</p>
              <p className="mt-3 font-hand text-2xl text-muted-foreground -rotate-2">Design • Web • Digital</p>
            </div>
            <div className="col-span-12 mt-8 flex flex-wrap gap-3"><Button variant="studio" size="studio" asChild><a href="#contact">Start a project <ArrowRight /></a></Button><Button variant="paper" size="studio" asChild><a href="#services">Follow the map <ArrowDown /></a></Button></div>
          </div>
        </section>

        <section className="map-stamp bg-primary text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-9 sm:flex-row sm:items-end lg:px-10" data-reveal><h2 className="font-display text-3xl font-semibold uppercase sm:text-5xl">No shortcuts.<br/>Just good craft.</h2><p className="font-mono text-xs uppercase text-primary-foreground/70">Strategy · Design · Technology · Execution</p></div></section>

        <MapZone id="services" number="01" label="Production lab" side="left" icon={Wrench}>
          <div data-reveal><SectionHead eyebrow="Services" title="What we craft." text="Different problems need different tools. Pick a destination to see how we can help." /></div>
          <div className="service-map mt-12">
            {services.map(([number,title,headline,detail,cta,glyph], index) => {
              const open = openService === index;
              return <div key={title} data-reveal style={{ "--reveal-delay": `${index * 40}ms` } as CSSProperties} className="service-cell">
                <button type="button" aria-expanded={open} onClick={() => setOpenService(open ? null : index)} className={`service-stop group ${open ? "is-open" : ""}`}>
                  <span className="service-pin"><ServiceGlyph name={glyph} /></span><span className="service-title"><span className="font-mono text-[10px] text-accent">{number}</span><strong className="font-display text-base uppercase sm:text-lg">{title}</strong></span><span className="service-plus">+</span>
                  <span className="col-span-full mt-2 text-sm font-semibold uppercase">{headline}</span>
                  <span className={`col-span-full grid transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><span className="overflow-hidden text-sm leading-relaxed text-muted-foreground">{detail}<a href="#contact" onClick={(e) => e.stopPropagation()} className="mt-3 flex items-center gap-2 font-mono text-[10px] text-accent">{cta} <ArrowRight className="size-3" /></a></span></span>
                </button>
              </div>;
            })}
          </div>

        </MapZone>

        <MapZone number="02" label="Thinking compass" side="right" tone="ink" icon={Compass}>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div data-reveal><p className="map-label text-accent">Why Craft?</p><h2 className="mt-5 font-display text-4xl font-semibold uppercase leading-none sm:text-6xl">Because good work doesn't happen by accident.</h2></div>
            <div className="compass-map" data-reveal><Compass className="compass-icon" />{[["Understand","Start with the problem."],["Sketch","Explore possibilities."],["Build","Make it real."],["Refine","Question. Improve."]].map(([a,b],i)=><div key={a} className={`compass-point compass-point-${i+1}`}><span>0{i+1}</span><strong>{a}</strong><small>{b}</small></div>)}</div>
          </div>
        </MapZone>

        <MapZone id="process" number="03" label="Craft trail" side="left" icon={RouteIcon}>
          <div data-reveal><SectionHead eyebrow="Process" title="From rough idea to right result." /></div>
          <div className="process-trail mt-16">{process.map(([n,t,d],i)=><div key={t} data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as CSSProperties} className="process-stop"><div className="process-marker">{n}</div><div><h3 className="font-display text-lg font-semibold uppercase">{t}</h3><p className="mt-1 text-xs text-muted-foreground">{d}</p></div></div>)}</div>
        </MapZone>

        <MapZone number="04" label="People first" side="right" tone="ink" icon={Users}>
          <div className="grid gap-10 lg:grid-cols-2"><div data-reveal><p className="map-label text-accent">Human-centred design</p><h2 className="mt-4 font-display text-5xl font-semibold uppercase leading-none sm:text-7xl">Design for people.</h2><p className="mt-6 max-w-xl text-primary-foreground/70">Technology is useful when people can understand it, trust it and use it.</p></div><div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">{[["Clear","People shouldn't have to figure things out."],["Human","Design should feel natural, not mechanical."],["Useful","Beautiful is good. Useful is better."]].map(([a,b],i)=><div key={a} data-reveal className="border-l border-primary-foreground/30 pl-5"><span className="font-hand text-2xl text-accent">0{i+1}</span><h3 className="mt-2 font-display text-xl font-semibold uppercase">{a}</h3><p className="mt-1 text-sm text-primary-foreground/65">{b}</p></div>)}</div></div>
        </MapZone>

        <MapZone id="work" number="05" label="Active studio" side="left" icon={Sparkles}>
          <div data-reveal><SectionHead eyebrow="In the studio" title="Working on something interesting." text="Ideas are on the table, lines are moving, and the next chapter is taking shape." /></div>
          <div className="studio-scene mt-12" data-reveal>
            <div className="scene-note scene-note-a">rough thought →</div>
            <div className="scene-orbit scene-orbit-a" />
            <div className="scene-row">
              <div className="scene-character scene-character-a"><Toon number={3} /><span>thinking</span></div>
              <div className="scene-character scene-character-b"><Toon number={8} /><span>shaping</span></div>
              <div className="scene-character scene-character-c"><Toon number={11} /><span>refining</span></div>
            </div>
            <div className="scene-note scene-note-b">something useful is taking shape</div>
          </div>
        </MapZone>

        <MapZone id="about" number="06" label="The makers" side="right" icon={Lightbulb}>
          <div className="about-stage"><div data-reveal><SectionHead eyebrow="About" title="Behind the craft." text="Craft Studio brings design, technology and problem-solving together under one roof." /><div className="mt-10 space-y-2 font-display text-xl font-semibold uppercase sm:text-3xl"><p>Ideas should be understood.</p><p>Technology should feel useful.</p><p>Design should have a reason.</p><p className="text-accent">Details matter.</p></div></div><div className="about-peek" data-reveal><span className="about-peek-ring"/><Toon number={12} /><span className="about-caption">human thinking,<br/>always →</span></div></div>
        </MapZone>

        <MapZone number="07" label="Trust checkpoint" side="left" icon={Handshake}>
          <SectionHead eyebrow="Trust principles" title="Things we don't compromise." />
          <div className="trust-crossroads mt-12">{[["Honesty","No inflated claims. No fake proof."],["Clarity","Understand what we're building and why."],["Craft","Small details matter."],["Communication","You shouldn't have to chase your project."]].map(([a,b],i)=><div key={a} data-reveal className="trust-sign"><span>0{i+1}</span><h3>{a}</h3><p>{b}</p></div>)}</div>
        </MapZone>

        <MapZone id="faq" number="08" label="Before departure" side="right" icon={CircleHelp}>
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><SectionHead eyebrow="FAQ" title="Before we start." /><div className="border-t border-border">{faqs.map(([q,a])=><details key={q} className="group border-b border-border"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display font-semibold"><span>{q}</span><span className="text-2xl transition-transform group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p></details>)}</div></div>
        </MapZone>

        <MapZone number="09" label="Next line" side="left" icon={Shapes}>
          <div className="cta-stage" data-reveal><div><p className="font-hand text-2xl text-accent">got an idea?</p><h2 className="mt-4 max-w-4xl font-display text-[clamp(2.8rem,7vw,6rem)] font-semibold uppercase leading-[.92]">Let's sketch it out.</h2><p className="mt-7 max-w-xl text-muted-foreground">You don't need everything figured out before you contact us. Start with the idea. We'll figure out the next line together.</p><div className="mt-8 flex flex-wrap gap-3"><Button variant="studio" size="studio" asChild><a href="#contact">Start a project <ArrowRight/></a></Button><Button variant="paper" size="studio" asChild><a href="https://wa.me/916383283116" target="_blank" rel="noreferrer">WhatsApp us <MessageCircle/></a></Button></div></div><div className="cta-peek"><Toon number={9}/><span className="font-hand text-lg text-accent">let's begin</span></div></div>
        </MapZone>

        <section id="contact" className="relative z-10 scroll-mt-20 bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl grid-cols-12 gap-y-10 px-5 py-24 lg:gap-x-10 lg:px-10 lg:py-32">
            <div className="col-span-12 lg:col-span-5"><p className="map-label text-accent"><MapPin /> Final destination / Contact</p><h2 className="mt-5 font-display text-5xl font-semibold uppercase leading-none sm:text-7xl">Let's make something.</h2><div className="mt-10 space-y-4 text-sm text-primary-foreground/70"><a className="flex items-center gap-3 break-all hover:text-primary-foreground" href="tel:+916383283116"><MessageCircle className="size-4 text-accent"/>6383283116</a><a className="flex items-center gap-3 break-all hover:text-primary-foreground" href="mailto:craftstudio2k26@gmail.com"><Mail className="size-4 text-accent"/>craftstudio2k26@gmail.com</a><a className="flex items-center gap-3 break-all hover:text-primary-foreground" href="https://www.instagram.com/craftstudio____?igsi=MWdodXl6YWttMXdzdg==" target="_blank" rel="noreferrer"><Instagram className="size-4 text-accent"/>@craftstudio____</a></div></div>
            <form onSubmit={submit} className="col-span-12 grid min-w-0 gap-5 border border-primary-foreground/25 p-5 sm:p-7 lg:col-span-6 lg:col-start-7">
              <Field label="Name"><input required name="name" placeholder="[Your name]" className="field" /></Field><Field label="What can we help with?"><select required name="service" className="field"><option value="">[Service]</option>{services.map(([,t])=><option key={String(t)}>{String(t)}</option>)}</select></Field><Field label="Tell us about the idea"><textarea required name="message" rows={5} placeholder="[Message]" className="field resize-none" /></Field><Field label="WhatsApp / Email"><input required name="contact" placeholder="[Contact]" className="field" /></Field><Button type="submit" variant="paper" size="studio" className="border-primary-foreground/35 bg-primary-foreground text-primary hover:bg-primary-foreground">Send the sketch <Send /></Button>
            </form>
          </div>
        </section>
      </main>
      <footer className="border-t border-primary-foreground/15 bg-primary text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 px-5 py-10 sm:flex-row sm:items-end lg:px-10"><Mark className="h-16 w-36 invert"/><div className="font-mono text-[10px] uppercase leading-loose text-primary-foreground/55 sm:text-right"><p>Route complete. Start with an idea.</p><p>© 2026 Craft Studio</p></div></div></footer>
    </div>
  );
}

function MapZone({ id, number, label, side, tone, icon: Icon, children }: { id?: string; number: string; label: string; side: "left" | "right"; tone?: "ink"; icon: LucideIcon; children: ReactNode }) {
  return <section id={id} className={`map-zone scroll-mt-20 ${side === "right" ? "map-zone-right" : "map-zone-left"} ${tone === "ink" ? "map-zone-ink" : ""}`}><span className="route-node" aria-hidden="true"><span /></span><div className="map-zone-inner"><div className="zone-marker"><Icon/><span>{number}</span></div><span className="zone-label">ZONE {number} / {label}</span>{children}</div></section>;
}

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div><p className="map-label"><RouteIcon /> {eyebrow}</p><h2 className="mt-4 max-w-4xl font-display text-4xl font-semibold uppercase leading-[.98] sm:text-6xl">{title}</h2>{text && <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">{text}</p>}</div>;
}

function Toon({ number, className = "" }: { number: number; className?: string }) { return <img src={toonSources[number] ?? toonSources[3]} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} className={`toon ${className}`} />; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="grid gap-2 font-mono text-[11px] uppercase text-primary-foreground/70"><span>{label}</span>{children}</label>; }