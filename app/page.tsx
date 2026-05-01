"use client";

import { useState, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────────── */
interface GeneratedImage {
  id: number;
  niche: string;
  nicheLabel: string;
  prompt: string;
  imageBase64: string | null;
  title: string;
  description: string;
  keywords: string;
  category: string;
  error?: string;
}

/* ─── Niche definitions ──────────────────────────────────── */
const NICHES = [
  { id: "natureza",    label: "Natureza",            emoji: "🌿" },
  { id: "negocios",   label: "Negócios / Tech",      emoji: "💼" },
  { id: "pessoas",    label: "Pessoas / Lifestyle",  emoji: "👥" },
  { id: "comida",     label: "Comida",               emoji: "🍽️" },
  { id: "arquitetura",label: "Arquitetura",          emoji: "🏛️" },
  { id: "animais",    label: "Animais",              emoji: "🐾" },
  { id: "saude",      label: "Saúde / Fitness",      emoji: "💪" },
  { id: "viagem",     label: "Viagem / Turismo",     emoji: "✈️" },
  { id: "abstrato",   label: "Abstrato / Arte",      emoji: "🎨" },
  { id: "brasil",     label: "Cultura Brasileira",   emoji: "🇧🇷" },
  { id: "moda",       label: "Moda / Beleza",        emoji: "👗" },
  { id: "esportes",   label: "Esportes",             emoji: "⚽" },
];

const QUANTITIES = [1, 3, 5, 10];

/* ─── CopyButton component ──────────────────────────────── */
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
        copied
          ? "bg-green-500/20 text-green-400 border border-green-500/40"
          : "bg-surface-2 text-muted hover:text-accent hover:border-accent/40 border border-border"
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copiado!
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

/* ─── MetaField component ───────────────────────────────── */
function MetaField({
  label,
  value,
  copyLabel,
  mono = false,
}: {
  label: string;
  value: string;
  copyLabel: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted uppercase tracking-wider">{label}</span>
        <CopyButton text={value} label={copyLabel} />
      </div>
      <div
        className={`w-full p-3 rounded-lg bg-bg border border-border text-sm text-foreground leading-relaxed ${
          mono ? "font-mono text-xs" : ""
        }`}
        style={{ wordBreak: "break-word" }}
      >
        {value || <span className="text-muted italic">—</span>}
      </div>
    </div>
  );
}

/* ─── ImageCard component ────────────────────────────────── */
function ImageCard({ img, index }: { img: GeneratedImage; index: number }) {
  const [imgExpanded, setImgExpanded] = useState(false);

  const allMetadata = `TITLE:\n${img.title}\n\nDESCRIPTION:\n${img.description}\n\nKEYWORDS:\n${img.keywords}\n\nCATEGORY:\n${img.category}`;

  return (
    <div
      className="rounded-2xl border border-border bg-surface overflow-hidden animate-[fadeUp_0.4s_ease_forwards]"
      style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
    >
      {/* Image area */}
      <div className="relative aspect-video bg-bg overflow-hidden">
        {img.error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-red-400 p-4">
            <svg className="w-8 h-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-center opacity-80">{img.error}</span>
          </div>
        ) : img.imageBase64 ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.imageBase64}
              alt={img.title || "Generated image"}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
              onClick={() => setImgExpanded(true)}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <a
                href={img.imageBase64}
                download={`stockai_${img.niche}_${img.id}.png`}
                className="p-2 rounded-lg bg-bg/80 backdrop-blur-sm border border-border/60 text-muted hover:text-accent transition-colors"
                title="Download"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
            <div className="absolute bottom-2 left-2">
              <span className="text-xs px-2 py-1 rounded-md bg-bg/80 backdrop-blur-sm border border-border/60 text-muted">
                {img.nicheLabel}
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 shimmer" />
        )}
      </div>

      {/* Metadata */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
            {img.title || "Gerando título..."}
          </h3>
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
            #{img.id}
          </span>
        </div>

        {img.title && (
          <>
            <MetaField label="Título" value={img.title} copyLabel="Copiar título" />
            <MetaField label="Descrição" value={img.description} copyLabel="Copiar descrição" />
            <MetaField label="Palavras-chave" value={img.keywords} copyLabel="Copiar keywords" mono />
            <MetaField label="Categoria" value={img.category} copyLabel="Copiar categoria" />

            {/* Prompt */}
            <details className="group">
              <summary className="flex items-center gap-1.5 text-xs text-muted cursor-pointer hover:text-accent transition-colors list-none">
                <svg className="w-3 h-3 group-open:rotate-90 transition-transform" fill="currentColor" viewBox="0 0 6 10">
                  <path d="M1.4 0L6 5 1.4 10 0 8.6 3.2 5 0 1.4z" />
                </svg>
                Ver prompt usado
              </summary>
              <div className="mt-2 p-3 rounded-lg bg-bg border border-border text-xs text-muted font-mono leading-relaxed">
                {img.prompt}
              </div>
            </details>

            {/* Copy All */}
            <div className="pt-1 border-t border-border">
              <CopyButton text={allMetadata} label="Copiar tudo para Adobe Stock" />
            </div>
          </>
        )}
      </div>

      {/* Expanded image modal */}
      {imgExpanded && img.imageBase64 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setImgExpanded(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.imageBase64}
            alt={img.title}
            className="max-w-full max-h-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setImgExpanded(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-bg border border-border text-muted hover:text-foreground"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function Home() {
  const [selectedNiches, setSelectedNiches] = useState<string[]>(["natureza"]);
  const [quantity, setQuantity] = useState(3);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");

  const toggleNiche = (id: string) => {
    setSelectedNiches((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedNiches(NICHES.map((n) => n.id));
  const clearAll = () => setSelectedNiches([]);

  const handleGenerate = useCallback(async () => {
    if (selectedNiches.length === 0) {
      setError("Selecione pelo menos um nicho.");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);
    setProgress({ done: 0, total: quantity });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niches: selectedNiches, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao gerar imagens.");
        return;
      }

      setResults(data.results);
      setProgress({ done: quantity, total: quantity });
    } catch {
      setError("Falha na conexão. Verifique sua chave de API.");
    } finally {
      setLoading(false);
    }
  }, [selectedNiches, quantity]);

  const estimatedTime = quantity * 6; // ~6s per image (gen + metadata)

  return (
    <main className="min-h-screen bg-bg">
      {/* ── Header ─────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-bg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              StockAI Studio
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted hidden sm:block">Powered by Gemini API</span>
            {results.length > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                {results.length} imagens geradas
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">

          {/* ── Controls Panel ──────────────────── */}
          <aside className="space-y-5">

            {/* Intro */}
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Gerar Imagens
                <span className="text-accent"> para Stock</span>
              </h1>
              <p className="mt-1 text-sm text-muted">
                Gere imagens prontas para vender no Adobe Stock com metadados completos.
              </p>
            </div>

            {/* Quantity */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Quantidade</h2>
              <div className="grid grid-cols-4 gap-2">
                {QUANTITIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all duration-150 border ${
                      quantity === q
                        ? "bg-accent text-bg border-accent shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                        : "bg-surface-2 text-muted border-border hover:border-accent/40 hover:text-foreground"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Personalizado:</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(20, Math.max(1, Number(e.target.value))))}
                  className="w-16 text-center px-2 py-1 rounded-lg bg-bg border border-border text-sm text-foreground focus:outline-none focus:border-accent/60"
                />
              </div>
              <p className="text-xs text-muted">
                ⏱ Estimativa: ~{Math.floor(estimatedTime / 60)}m{estimatedTime % 60}s
              </p>
            </div>

            {/* Niches */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Nichos</h2>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-xs text-accent hover:underline">Todos</button>
                  <span className="text-muted text-xs">·</span>
                  <button onClick={clearAll} className="text-xs text-muted hover:text-foreground hover:underline">Limpar</button>
                </div>
              </div>

              <div className="space-y-1.5">
                {NICHES.map((niche) => {
                  const checked = selectedNiches.includes(niche.id);
                  return (
                    <label
                      key={niche.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-150 border ${
                        checked
                          ? "bg-accent/8 border-accent/30 text-foreground"
                          : "bg-transparent border-transparent hover:bg-surface-2 text-muted hover:text-foreground"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                        checked ? "bg-accent border-accent" : "border-border bg-surface-2"
                      }`}>
                        {checked && (
                          <svg className="w-2.5 h-2.5 text-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">{niche.emoji}</span>
                      <span className="text-sm font-medium">{niche.label}</span>
                    </label>
                  );
                })}
              </div>

              {selectedNiches.length > 0 && (
                <p className="text-xs text-muted">
                  {selectedNiches.length} nicho{selectedNiches.length > 1 ? "s" : ""} selecionado{selectedNiches.length > 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || selectedNiches.length === 0}
              className={`w-full py-4 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden ${
                loading
                  ? "bg-accent/60 text-bg cursor-not-allowed"
                  : selectedNiches.length === 0
                  ? "bg-surface-2 text-muted cursor-not-allowed border border-border"
                  : "bg-accent text-bg hover:bg-accent-dim shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Gerando {quantity} imagem{quantity > 1 ? "ns" : ""}...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Gerar {quantity} imagem{quantity > 1 ? "ns" : ""}
                </span>
              )}
            </button>

            {/* Progress */}
            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted">
                  <span>Processando...</span>
                  <span>{results.length}/{quantity}</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${((results.length / quantity) * 100) || 5}%` }}
                  />
                </div>
                <p className="text-xs text-muted">
                  Aguardando limite de taxa da API Gemini (grátis: ~10 img/min)
                </p>
              </div>
            )}

            {/* Tips */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Dicas Adobe Stock</h3>
              <ul className="space-y-1.5">
                {[
                  "Marque sempre 'Created with AI' no upload",
                  "Use upscaler (Topaz/Magnific) antes de enviar",
                  "Evite conteúdo muito genérico/saturado",
                  "Máx. 1.000 uploads/semana no free tier",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted">
                    <span className="text-accent mt-0.5">›</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Results Grid ────────────────────── */}
          <section>
            {results.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 rounded-2xl border border-dashed border-border text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Nenhuma imagem gerada ainda</p>
                  <p className="text-xs text-muted mt-1">Selecione nichos e clique em Gerar</p>
                </div>
              </div>
            ) : loading && results.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: quantity }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
                    <div className="aspect-video shimmer" />
                    <div className="p-4 space-y-2.5">
                      <div className="h-3 shimmer rounded w-3/4" />
                      <div className="h-2 shimmer rounded w-1/2" />
                      <div className="h-2 shimmer rounded w-full" />
                      <div className="h-2 shimmer rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-foreground">
                    {results.length} imagem{results.length > 1 ? "ns" : ""} gerada{results.length > 1 ? "s" : ""}
                  </h2>
                  {results.length > 0 && (
                    <button
                      onClick={() => {
                        const all = results.map((r, i) =>
                          `=== IMAGEM ${i + 1}: ${r.nicheLabel} ===\nTÍTULO: ${r.title}\nDESCRIÇÃO: ${r.description}\nPALAVRAS-CHAVE: ${r.keywords}\nCATEGORIA: ${r.category}\n`
                        ).join("\n");
                        navigator.clipboard.writeText(all);
                      }}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Copiar todos os metadados
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {results.map((img, i) => (
                    <ImageCard key={img.id} img={img} index={i} />
                  ))}
                  {loading && results.length < quantity &&
                    Array.from({ length: quantity - results.length }).map((_, i) => (
                      <div key={`skeleton-${i}`} className="rounded-2xl border border-border bg-surface overflow-hidden">
                        <div className="aspect-video shimmer" />
                        <div className="p-4 space-y-2.5">
                          <div className="h-3 shimmer rounded w-3/4" />
                          <div className="h-2 shimmer rounded w-1/2" />
                          <div className="h-2 shimmer rounded w-full" />
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
