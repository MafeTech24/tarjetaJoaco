import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import caliz from "@/assets/caliz.png";
import { StarlightBackground } from "@/components/StarlightBackground";
import { BackgroundMusic } from "@/components/BackgroundMusic";

// URL pública del sitio (sin "/" final). WhatsApp necesita la URL absoluta de la imagen.
// Ej: "https://primera-comunion-joaco.lovable.app"
const SITE_URL = "";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Primera Comunión de Joaquín Ignacio" },
      { name: "description", content: "Te invito a Mi Primera Comunión — Sábado 24 de Octubre a las 12:00 hs en la Parroquia de Urca." },
      { property: "og:title", content: "Primera Comunión de Joaquín Ignacio" },
      { property: "og:description", content: "Sábado 24 de Octubre a las 12:00 hs en la Parroquia de Urca." },
      { property: "og:type", content: "website" },
      ...(SITE_URL ? [{ property: "og:url", content: SITE_URL }] : []),
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "877" },
      { property: "og:image:alt", content: "Mi Primera Comunión — Joaquín Ignacio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
  component: Index,
});

const CONTACTOS = [
  { nombre: "Anita", tel: "5493516985802" },
  { nombre: "Pablo", tel: "5493513665716" },
] as const;
const MSG = {
  si: "Sí, asistiré a la Primera Comunión de Joaquín. ¡Muchas gracias por la invitación!",
  no: "No podré asistir a la Primera Comunión de Joaquín. Muchas gracias por la invitación.",
};

const eventos = [
  {
    hora: "12:00 hs", titulo: "La ceremonia", lugar: "Parroquia Urca",
    dir: "Lucas de Figueroa y Mendoza 879, X5009 Córdoba",
    map: "https://www.google.com/maps?q=-31.38384047416947,-64.24798688966872&output=embed",
    link: "https://www.google.com/maps/dir/?api=1&destination=-31.38384047416947,-64.24798688966872",
  },
  {
    hora: "Desde las 13:30 hs", titulo: "El almuerzo", lugar: "Aldea de Valle",
    dir: "Calle del Valle Escondido, Córdoba",
    map: "https://www.google.com/maps?q=-31.3650119,-64.2784048&output=embed",
    link: "https://www.google.com/maps/dir/?api=1&destination=-31.3650119,-64.2784048",
  },
];

function Divider() {
  return (
    <div aria-hidden className="mx-auto my-5 flex w-40 items-center gap-3 text-gold">
      <span className="h-px flex-1 bg-gold/50" />✦<span className="h-px flex-1 bg-gold/50" />
    </div>
  );
}

function Index() {
  const [choice, setChoice] = useState<"si" | "no" | null>(null);
  const [err, setErr] = useState(false);

  const send = (tel: string) => {
    if (!choice) return setErr(true);
    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(MSG[choice])}`, "_blank", "noopener");
  };

  return (
    <>
      <StarlightBackground />

      <BackgroundMusic />

      <main className="relative z-10 mx-auto max-w-xl px-5 pb-20">
        <header className="animate-rise pt-20 text-center">
          <p className="font-serif text-2xl italic text-muted-foreground">Te invito a Mi Primera Comunión</p>
          {/*<h1 className="mt-2 font-serif text-5xl font-semibold text-gold sm:text-6xl">Joaquín Ignacio</h1>*/}
        </header>

        <article className="arch animate-rise mx-auto mt-10 max-w-md px-7 pb-10 pt-14 text-center" style={{ animationDelay: ".2s" }}>
          <img src={caliz} alt="Cáliz dorado con la hostia, rayos de luz y ramas" width={1024} height={1024} className="animate-glow mx-auto w-44" />
          {/*<h2 className="mt-4 font-serif text-2xl leading-tight text-ivory">
            Invitación a<br /><span className="text-3xl text-gold">Mi Primera Comunión</span>
          </h2>*/}
          <Divider />
          <p className="font-serif text-3xl font-semibold leading-tight text-gold">Joaquín Ignacio<br />López Paris</p>
          <Divider />
          <p className="text-base text-muted-foreground">Tengo la alegría de invitarte a la celebración de Mi Primera Comunión:</p>
          <p className="mt-4 font-serif text-xl text-ivory">El día Sábado 24 de Octubre a las 12:00 hs<br />En la Parroquia de Urca</p>
          <p className="mt-4 text-base text-muted-foreground">Y luego te espero a partir de las 13:30 hs en el<br /><span className="font-serif text-xl text-ivory">Complejo Las Aldeas de Valle Escondido.</span></p>
        </article>

        <section id="detalles" className="scroll-mt-16 pt-20" aria-labelledby="t-detalles">
          <h2 id="t-detalles" className="text-center font-serif text-4xl text-gold">Dos momentos para compartir</h2>
          <Divider />
          <div className="mt-6 space-y-8">
            {eventos.map((e) => (
              <article key={e.titulo} className="rounded-3xl border bg-card/80 p-6 text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-gold">{e.hora}</p>
                <h3 className="mt-2 font-serif text-3xl text-ivory">{e.titulo}</h3>
                <p className="mt-1 text-lg font-semibold text-gold">{e.lugar}</p>
                <p className="mt-1 text-muted-foreground">{e.dir}</p>
                <div className="mt-5 overflow-hidden rounded-2xl border border-gold/60">
                  <iframe title={`Mapa: ${e.lugar}`} src={e.map} loading="lazy" className="block aspect-[4/3] w-full" referrerPolicy="no-referrer-when-downgrade" />
                </div>
                <a href={e.link} target="_blank" rel="noopener noreferrer" className="ghost-btn mt-5">Cómo llegar</a>
              </article>
            ))}
          </div>
        </section>

        <section className="pt-20 text-center" aria-labelledby="t-rsvp">
          <h2 id="t-rsvp" className="font-serif text-4xl text-gold">¿Nos acompañás?</h2>
          <Divider />
          <p className="text-muted-foreground">Elegí una opción y confirmá tu respuesta con Anita o Pablo por WhatsApp.</p>
          <div role="radiogroup" aria-label="Confirmación" className="mt-6 grid gap-4">
            {([["si", "Sí, asistiré", "¡Nos vemos para celebrar!"], ["no", "No podré asistir", "Gracias por avisarnos."]] as const).map(([k, t, s]) => (
              <button
                key={k} type="button" role="radio" aria-checked={choice === k}
                onClick={() => { setChoice(k); setErr(false); }}
                className={`rounded-2xl border p-5 text-left transition focus-visible:outline-2 focus-visible:outline-ivory ${choice === k ? "border-gold bg-gold/15" : "bg-card/60 hover:border-gold"}`}
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden className={`grid h-6 w-6 place-items-center rounded-full border-2 border-gold`}>
                    {choice === k && <span className="h-3 w-3 rounded-full bg-gold" />}
                  </span>
                  <span>
                    <span className="block font-serif text-2xl text-ivory">{t}</span>
                    <span className="block text-muted-foreground">{s}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {CONTACTOS.map((c) => (
              <button
                key={c.tel}
                id={`confirmar-${c.nombre.toLowerCase()}`}
                type="button"
                onClick={() => send(c.tel)}
                aria-disabled={!choice}
                className={`gold-btn w-full transition-opacity ${choice ? "" : "opacity-60"}`}
              >
                Confirmar con {c.nombre}
              </button>
            ))}
          </div>
          {err && <p role="alert" className="mt-4 font-semibold text-destructive">Por favor, elegí una de las dos opciones.</p>}
          <p className="mt-4 text-sm text-muted-foreground">Se abrirá WhatsApp y podrás revisar el mensaje antes de enviarlo.</p>
        </section>
      </main>
    </>
  );
}
