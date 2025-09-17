import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Utility: simple countdown to a target date ---
const useCountdown = (targetDateISO) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const target = useMemo(() => (targetDateISO ? new Date(targetDateISO).getTime() : Date.now() + 7 * 86400000), [targetDateISO]);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
};

export default function KishanWorkshopLanding() {
  // Google Apps Script Web App URL (Deploy > Test deployments > Web app)
  // Note: If the script isn't deployed with access "Anyone", the request may redirect to Google Sign-in.
  const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxGu2ejf-vWlsyj3xNv-uq7sz-YU2FpXEAghvEwFopTZJl3tQmndVO9AazU7tReCkU7Gw/exec";
  const { d, h, m, s } = useCountdown("2025-09-24T19:00:00+05:30"); // 24 Sept 7 PM IST default
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    const data = Object.fromEntries(new FormData(formRef.current).entries());

    // simple validation
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || phone.length < 8) {
      alert("Please enter a valid Name, Email and WhatsApp number.");
      return;
    }

    setLoading(true);
    try {
      // Save to localStorage as fallback
      const leads = JSON.parse(localStorage.getItem("bwk_leads") || "[]");
      leads.push({ name, email, phone, ts: new Date().toISOString() });
      localStorage.setItem("bwk_leads", JSON.stringify(leads));

      // Send to Google Apps Script (sheets backend)
      // Using no-cors so the browser doesn't block due to CORS; response body won't be readable.
      // Ensure your GAS web app is deployed with access: "Anyone" (not just within domain).
      await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      });

      setOpenSuccess(true);
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-white selection:bg-blue-300/30">
      {/* Gradient BG + noise */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(65%_45%_at_50%_-10%,rgba(29,78,216,0.28),transparent_60%)]"/>
        <div className="absolute inset-0 bg-[radial-gradient(65%_45%_at_50%_110%,rgba(56,189,248,0.2),transparent_60%)]"/>
        <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage:"url('data:image/svg+xml;utf8, <svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\' viewBox=\'0 0 160 160\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'4\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.25\'/></svg>')"}}/>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#05080f]/60 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_10px_30px_rgba(37,99,235,.45)]"/>
            <span className="font-semibold tracking-wide">Build with Kishan</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#learn" className="hover:text-white">You’ll Learn</a>
            <a href="#agenda" className="hover:text-white">Agenda</a>
            <a href="#host" className="hover:text-white">Host</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#register" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">Register Free</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 md:pt-24 md:pb-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.p initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.05}} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/> Free 7‑Day Mega Workshop • Google Meet
            </motion.p>
            <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.12}} className="mt-5 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">New Rules</span> to Build a Startup in 2025
            </motion.h1>
            <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.18}} className="mt-4 text-white/70 text-base md:text-lg max-w-xl">
              24 Sept se shuru — 7 din ka execution‑first program jisme hum idea → validation → marketing → systems tak sab clear karenge. No fluff. Sirf modern playbook.
            </motion.p>

            {/* Counters */}
            <div className="mt-6 grid grid-cols-4 gap-3 max-w-md text-center">
            {[['Days',d],['Hours',h],['Mins',m],['Secs',s]].map(([label,val],i)=> (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 py-3">
                  <div className="text-2xl font-bold">{String(val).padStart(2,'0')}</div>
                  <div className="text-[11px] text-white/60">{label}</div>
                </div>
              ))}
            </div>

            {/* Trust */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-white/60 text-sm">
              <div className="flex items-center gap-2"><span className="i-lucide-users h-4 w-4"/> 170k+ audience</div>
              <div className="flex items-center gap-2"><span className="i-lucide-badge-check h-4 w-4"/> Viral reels 1M+ views</div>
              <div className="flex items-center gap-2"><span className="i-lucide-clock h-4 w-4"/> Daily 60–75 min</div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <a href="#register" className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 font-semibold shadow-[0_20px_50px_rgba(56,189,248,.45)] transition active:scale-[.98]">
                <span className="i-lucide-rocket h-4 w-4"/>
                Register Free — Starts 24 Sept
                <span className="i-lucide-arrow-right h-4 w-4 -mr-1 translate-x-0 transition group-hover:translate-x-1"/>
              </a>
            </div>
          </div>

          {/* Right visual card (photoshop/canva vibe) */}
          <motion.div initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} transition={{delay:.15}} className="relative">
            <div className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[.06] to-white/[.02] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,.45)] hover:border-white/20 transition overflow-hidden">
              <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"/>
              <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"/>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#07101c] ring-1 ring-inset ring-white/10 grid place-items-center">
                <div className="text-center px-6">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-4"/>
                  <p className="text-sm text-white/60">Host</p>
                  <p className="text-xl font-semibold">Kishan Sharma</p>
                  <p className="mt-2 text-white/60">Start Date: <span className="text-white">24 Sept, 7 PM IST</span></p>
                  <p className="mt-4 text-white/70 text-sm">“Aaj ka business showroom se nahi, Instagram se banta hai.” — Reset how you think about startups.</p>
                </div>
              </div>

              <ul className="mt-6 grid gap-3 text-sm text-white/80">
                <li className="flex items-center gap-2"><span className="i-lucide-check-circle h-4 w-4 text-emerald-400"/> Day 1: Why Startups Fail (real reasons)</li>
                <li className="flex items-center gap-2"><span className="i-lucide-check-circle h-4 w-4 text-emerald-400"/> Day 2: Idea → Validation live</li>
                <li className="flex items-center gap-2"><span className="i-lucide-check-circle h-4 w-4 text-emerald-400"/> Day 3: Business Model & Unit Economics</li>
                <li className="flex items-center gap-2"><span className="i-lucide-check-circle h-4 w-4 text-emerald-400"/> Day 4: Marketing 2025 (Attention Economy)</li>
                <li className="flex items-center gap-2"><span className="i-lucide-check-circle h-4 w-4 text-emerald-400"/> Day 5: Funding vs Bootstrapping</li>
                <li className="flex items-center gap-2"><span className="i-lucide-check-circle h-4 w-4 text-emerald-400"/> Day 6: Systems, SOPs, Team</li>
                <li className="flex items-center gap-2"><span className="i-lucide-check-circle h-4 w-4 text-emerald-400"/> Day 7: Exit mindset + Q&A</li>
              </ul>

              <a href="#register" className="mt-6 inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition">
                Register now <span className="i-lucide-arrow-right h-4 w-4"/>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What you'll learn */}
      <section id="learn" className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {t:'Zero to One Clarity', d:'Business ka simple lens: Problem → Solution → Distribution → Money.'},
              {t:'Modern Marketing Playbook', d:'Hooks, nurtures, retargeting — Instagram is the new showroom.'},
              {t:'Action Systems', d:'Daily 45‑min execution plan + AI tools to speed you up.'},
            ].map((c,i)=> (
              <div key={i} className="group rounded-2xl border border-white/10 bg-white/[.03] p-6 hover:bg-white/[.05] transition">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-4 opacity-90 group-hover:opacity-100"/>
                <h3 className="font-semibold text-lg">{c.t}</h3>
                <p className="mt-2 text-white/70 text-sm">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda grid */}
      <section id="agenda" className="py-8 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold">7‑Day Agenda</h2>
          <div className="mt-6 grid md:grid-cols-4 gap-5">
            {[
              ['Day 01','Why startups fail (truth)'],
              ['Day 02','Idea to validation exercise'],
              ['Day 03','Business model + unit economics'],
              ['Day 04','Attention & funnels (2025)'],
              ['Day 05','Funding vs Bootstrapping'],
              ['Day 06','Systems, SOPs, team design'],
              ['Day 07','Exit & legacy + Q&A'],
              ['Bonus','10 new marketing strategies'],
            ].map((item, idx)=> (
              <div key={idx} className="rounded-2xl border border-white/10 p-5 bg-gradient-to-b from-white/[.04] to-transparent hover:from-white/[.06] transition">
                <div className="text-sm text-white/50">{item[0]}</div>
                <div className="mt-2 font-semibold">{item[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Card */}
      <section id="register" className="py-8 md:py-16">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,.45)]">
            <h3 className="text-xl md:text-2xl font-bold">Register Free — Seats Limited</h3>
            <p className="mt-1 text-white/70 text-sm">Join link WhatsApp + Email par bhej diya jayega. Daily reminder + resources.</p>
            <form ref={formRef} onSubmit={handleSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
              <input name="name" placeholder="Your Name" className="h-12 rounded-xl bg-[#0b1220] px-4 text-sm outline-none border border-white/10 focus:border-blue-400 transition" required/>
              <input type="email" name="email" placeholder="Email" className="h-12 rounded-xl bg-[#0b1220] px-4 text-sm outline-none border border-white/10 focus:border-blue-400 transition" required/>
              <input type="tel" name="phone" placeholder="Phone (WhatsApp)" className="h-12 rounded-xl bg-[#0b1220] px-4 text-sm outline-none border border-white/10 focus:border-blue-400 transition md:col-span-2" required/>
              <button disabled={loading} className="md:col-span-2 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 font-semibold shadow-[0_18px_40px_rgba(56,189,248,.5)] transition active:scale-[.98] disabled:opacity-60">
                {loading ? 'Registering…' : 'Claim Your Seat'}
              </button>
              <p className="md:col-span-2 text-[12px] text-white/50">By registering, you agree to receive session reminders and resources on WhatsApp & email.</p>
            </form>
          </div>

          {/* Highlights / Proof */}
          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 p-5 bg-white/[.02]">
              <p className="text-white/80 font-medium">What you get</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70 list-disc pl-5">
                <li>7 live sessions + Q&A</li>
                <li>Action templates & checklists</li>
                <li>Replay (limited-time)</li>
                <li>Private WhatsApp group access</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 p-5 bg-white/[.02]">
              <p className="text-white/80 font-medium">Why free?</p>
              <p className="mt-2 text-sm text-white/70">Mission: maximum impact. Serious founders will stay till Day 7 — wahi hamara core community banega.</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-5 bg-white/[.02]">
              <p className="text-white/80 font-medium">Trusted by</p>
              <p className="mt-2 text-sm text-white/60">Add 4–6 brand logos / screenshots of comments here for social proof.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Host */}
      <section id="host" className="py-8 md:py-16">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-[1.2fr_.8fr] gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold">Meet Your Host — Kishan Kumar</h2>
            <p className="mt-3 text-white/70">Founder & growth strategist. Built a ₹1CR+ Instagram‑led business ecosystem with his brother. Known for brutal clarity, no‑fluff frameworks and execution‑first teaching style.</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70 list-disc pl-5">
              <li>177k+ audience across platforms</li>
              <li>1M+ views viral reels</li>
              <li>Off‑grid performance campaigns (NDA safe)</li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 blur opacity-40" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[.03] aspect-[4/5] grid place-items-center">
                <span className="text-white/60 text-sm">Add host photo here</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-8 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold">FAQs</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-5">
            {[{q:'Kya yeh free hai?',a:'Haan — 7 din ka live program bilkul free hai. Join link WhatsApp + Email par milega.'},{q:'Recording milegi?',a:'Limited-time replay denge. Best hai live attend karo (Q&A ke liye).'}, {q:'Platform kya hoga?',a:'Google Meet — zero barrier, mobile se bhi instantly join.'}, {q:'Beginner attend kar sakta/ sakti hai?',a:'Bilkul — yeh 0→1 founders, students, creators, SMB owners sab ke liye hai.'}].map((f,i)=>(
              <details key={i} className="rounded-2xl border border-white/10 bg-white/[.02] p-5 open:bg-white/[.04] transition">
                <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
                <p className="mt-2 text-white/70 text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-10 md:py-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold">Join the 7‑Day Mega Workshop — Free</h3>
            <p className="mt-2 text-white/70">Execution‑first system for modern startups. Starts 24 Sept, 7 PM IST.</p>
          </div>
          <div className="md:col-span-1">
            <a href="#register" className="group inline-flex items-center justify-center w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 font-semibold shadow-[0_18px_40px_rgba(56,189,248,.5)] transition">
              Claim Your Seat
              <span className="i-lucide-arrow-right ml-2 h-4 w-4 transition -translate-x-1 group-hover:translate-x-0"/>
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>© {new Date().getFullYear()} Build with Kishan. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a className="hover:text-white transition" href="#">Privacy</a>
            <a className="hover:text-white transition" href="#">Terms</a>
            <a className="hover:text-white transition" href="#">Contact</a>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      <AnimatePresence>
        {openSuccess && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}} className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1220] p-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-3"/>
              <h4 className="text-xl font-bold">Registration Successful 🎉</h4>
              <p className="mt-2 text-white/70 text-sm">WhatsApp & email par confirmation bhej diya gaya hai. Niche button se WhatsApp group join kar lo to never miss updates.</p>
              <div className="mt-5 flex gap-3">
                <a href="#" className="inline-flex h-11 items-center justify-center px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">Close</a>
                <a href="https://wa.me/" className="inline-flex h-11 items-center justify-center px-5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 font-semibold">Join WhatsApp Group</a>
              </div>
              <button onClick={()=>setOpenSuccess(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


