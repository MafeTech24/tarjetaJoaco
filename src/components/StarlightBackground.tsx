import type { CSSProperties } from "react";

/**
 * Cascading Starlight Background
 * Fondo animado puramente con CSS: estrellas titilantes + cascada de destellos dorados.
 * Usa un PRNG con semilla para que el render de servidor (SSR) y el cliente
 * generen exactamente las mismas posiciones (evita errores de hidratación).
 */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r = mulberry32(2410);
const between = (min: number, max: number) => min + r() * (max - min);
const fix = (n: number, d = 2) => Number(n.toFixed(d));

// Paleta entre marfil (#fff8e8) y oro cálido (#e0ae57)
const PALETTE = ["#fff8e8", "#fbecc9", "#f3d9a0", "#ebc57d", "#e0ae57"];

type Star = { id: number; style: CSSProperties };
type Faller = Star & { sparkle: boolean };

const TWINKLE_COUNT = 38;
const FALLING_COUNT = 30;

const twinkles: Star[] = Array.from({ length: TWINKLE_COUNT }, (_, id) => {
  const size = fix(between(1, 2.5), 1);
  return {
    id,
    style: {
      left: `${fix(between(0, 100))}%`,
      top: `${fix(between(0, 100))}%`,
      width: size,
      height: size,
      "--star-color": PALETTE[Math.floor(r() * PALETTE.length)],
      animationDuration: `${fix(between(3, 7))}s`,
      animationDelay: `-${fix(between(0, 7))}s`,
    } as CSSProperties,
  };
});

const fallers: Faller[] = Array.from({ length: FALLING_COUNT }, (_, id) => {
  const sparkle = r() < 0.22; // ~1 de cada 5 es un destello ✦
  const size = sparkle ? fix(between(8, 14), 1) : fix(between(1.5, 4), 1);
  const duration = fix(between(6, 15));
  return {
    id,
    sparkle,
    style: {
      left: `${fix(between(0, 100))}%`,
      width: size,
      height: size,
      "--drift": `${fix(between(-4, 4))}vw`,
      "--peak": fix(between(0.55, 1)),
      "--rm-top": `${fix(between(5, 95))}%`,
      "--star-color": PALETTE[Math.floor(r() * PALETTE.length)],
      animationDuration: `${duration}s`,
      // Retraso negativo: la cascada ya está "en marcha" al cargar la página
      animationDelay: `-${fix(between(0, duration))}s`,
    } as CSSProperties,
  };
});

export function StarlightBackground() {
  return (
    <div aria-hidden="true" className="starlight fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Capa 1: estrellas titilantes estáticas */}
      <div className="absolute inset-0">
        {twinkles.map((s) => (
          <span key={s.id} className="starlight-twinkle" style={s.style} />
        ))}
      </div>

      {/* Capa 2: cascada de estrellas descendentes */}
      <div className="absolute inset-0">
        {fallers.map((s) =>
          s.sparkle ? (
            <svg key={s.id} viewBox="0 0 24 24" className="starlight-fall starlight-sparkle" style={s.style}>
              <path
                fill="var(--star-color)"
                d="M12 0C12.9 7.3 16.7 11.1 24 12 16.7 12.9 12.9 16.7 12 24 11.1 16.7 7.3 12.9 0 12 7.3 11.1 11.1 7.3 12 0Z"
              />
            </svg>
          ) : (
            <span key={s.id} className="starlight-fall starlight-dot" style={s.style} />
          ),
        )}
      </div>
    </div>
  );
}
