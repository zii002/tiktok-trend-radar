"use client";

import { FormEvent, useMemo, useState } from "react";

type View = "Radar" | "Analizler" | "Markalar";

type TrendProfile = {
  title: string;
  score: number;
  count: number;
  concept: string;
  keywords: string;
};

const trendPoints = "0,132 38,108 76,116 114,94 152,83 190,100 228,88 266,91 304,69 342,76 380,62 418,44 456,18";

const profiles: Record<string, TrendProfile> = {
  Axess: {
    title: "Çantadan çıkanlar transition",
    score: 88,
    count: 12,
    concept:
      "Cüzdandan art arda kartlar çıkar. Karakter aradığını bulamayınca telefonu kaldırır; tüm kartlar Juzdan ekranında birleşir.",
    keywords: "what’s in my bag transition · wallet card transition",
  },
  Juzdan: {
    title: "Kartlar telefonda birleşiyor",
    score: 92,
    count: 15,
    concept:
      "Her kişi kameranın önünden farklı bir kart geçirir. Son geçişte telefon görünür ve bütün kartlar Juzdan içinde toplanır.",
    keywords: "pass the object transition · phone wallet reveal",
  },
  Wings: {
    title: "POV: havalimanı rutini",
    score: 84,
    count: 8,
    concept:
      "Havalimanı rutini hızlı kesmelerle ilerler. Her aşamada küçük bir ayrıcalık görünür; kapanışta Wings kart tek karede belirir.",
    keywords: "airport routine POV · travel day transition",
  },
};

const analysisCards = [
  {
    status: "Hızla yükseliyor",
    title: "Çantadan çıkanlar",
    score: 88,
    velocity: "+42%",
    lifespan: "8–12 gün",
  },
  {
    status: "Yeni sinyal",
    title: "Bir saniyede before / after",
    score: 83,
    velocity: "+31%",
    lifespan: "12–18 gün",
  },
  {
    status: "Markaya uygun",
    title: "POV: karar veremiyorum",
    score: 79,
    velocity: "+24%",
    lifespan: "6–9 gün",
  },
];

const brandCards = [
  { name: "Axess", trends: 12, fit: 88, category: "Ödeme sistemleri" },
  { name: "Juzdan", trends: 15, fit: 92, category: "Finansal teknoloji" },
  { name: "Wings", trends: 8, fit: 84, category: "Seyahat & ayrıcalık" },
];

const breakdown = [
  ["Güncellik", 91],
  ["Marka uyumu", 88],
  ["Kolay çekilebilirlik", 96],
  ["Türkiye uyumu", 80],
] as const;

export default function Home() {
  const [activeView, setActiveView] = useState<View>("Radar");
  const [country, setCountry] = useState("Türkiye");
  const [sector, setSector] = useState("Finans");
  const [brand, setBrand] = useState("Axess");
  const [period, setPeriod] = useState("7G");
  const [saved, setSaved] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const profile = useMemo(() => profiles[brand] ?? profiles.Axess, [brand]);

  function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tiktokUrl.trim() || analyzing) return;
    setAnalyzing(true);
    setAnalysisComplete(false);
    window.setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 900);
  }

  function closeAnalyze() {
    setAnalyzeOpen(false);
    setAnalyzing(false);
    setAnalysisComplete(false);
    setTiktokUrl("");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-bars" aria-hidden="true">
            <i />
            <i />
          </span>
          <span>TikTok Trend Radar</span>
        </div>

        <nav className="primary-nav" aria-label="Ana menü">
          {(
            [
              ["Radar", "◎"],
              ["Analizler", "▥"],
              ["Markalar", "▤"],
            ] as const
          ).map(([item, icon]) => (
            <button
              key={item}
              className={`nav-item ${activeView === item ? "active" : ""}`}
              type="button"
              aria-current={activeView === item ? "page" : undefined}
              onClick={() => setActiveView(item)}
            >
              <span aria-hidden="true">{icon}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="data-status">
          <span aria-hidden="true" />
          MVP demo verisi
        </div>
        <button className="help-button" type="button" aria-label="Yardım">
          ?
        </button>
      </aside>

      <section className="workspace">
        <div className="filter-row">
          <label>
            <span className="sr-only">Ülke</span>
            <select value={country} onChange={(event) => setCountry(event.target.value)}>
              <option>Türkiye</option>
              <option>Birleşik Krallık</option>
              <option>Almanya</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Sektör</span>
            <select value={sector} onChange={(event) => setSector(event.target.value)}>
              <option>Finans</option>
              <option>Perakende</option>
              <option>Güzellik</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Marka</span>
            <select value={brand} onChange={(event) => setBrand(event.target.value)}>
              <option>Axess</option>
              <option>Juzdan</option>
              <option>Wings</option>
            </select>
          </label>
          <button className="add-trend" type="button" onClick={() => setAnalyzeOpen(true)}>
            <span aria-hidden="true">＋</span>
            Trend analiz et
          </button>
        </div>

        {activeView === "Radar" && (
          <RadarView
            profile={profile}
            brand={brand}
            country={country}
            sector={sector}
            period={period}
            saved={saved}
            onPeriodChange={setPeriod}
            onSavedChange={() => setSaved((current) => !current)}
            onScoreOpen={() => setScoreOpen(true)}
          />
        )}

        {activeView === "Analizler" && <AnalysesView />}
        {activeView === "Markalar" && <BrandsView onSelectBrand={(value) => {
          setBrand(value);
          setActiveView("Radar");
        }} />}
      </section>

      {scoreOpen && (
        <div className="drawer-backdrop" role="presentation" onMouseDown={() => setScoreOpen(false)}>
          <aside
            className="score-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="score-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={() => setScoreOpen(false)} aria-label="Kapat">
              ×
            </button>
            <p className="eyebrow">Trend Fit Score</p>
            <h2 id="score-title">{profile.score}/100</h2>
            <p className="drawer-intro">
              Bu trend {brand} için yüksek yaratıcı uyum gösteriyor.
            </p>
            <div className="breakdown-list">
              {breakdown.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <i>
                    <b style={{ width: `${value}%` }} />
                  </i>
                </div>
              ))}
            </div>
            <div className="idea-box">
              <small>Markaya uyarlama</small>
              <p>{profile.concept}</p>
            </div>
            <div className="keyword-box">
              <small>Referans arama kelimeleri</small>
              <p>{profile.keywords}</p>
            </div>
          </aside>
        </div>
      )}

      {analyzeOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeAnalyze}>
          <section
            className="analyze-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="analyze-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={closeAnalyze} aria-label="Kapat">
              ×
            </button>
            <p className="eyebrow">Yeni trend sinyali</p>
            <h2 id="analyze-title">TikTok videosunu analiz et</h2>
            <p>
              Video bağlantısını ekle; Radar hook, format, marka uyumu ve çekim zorluğu için
              örnek bir değerlendirme oluştursun.
            </p>
            <form onSubmit={handleAnalyze}>
              <label htmlFor="tiktok-url">TikTok video bağlantısı</label>
              <input
                id="tiktok-url"
                type="url"
                inputMode="url"
                placeholder="https://www.tiktok.com/@creator/video/..."
                value={tiktokUrl}
                onChange={(event) => {
                  setTiktokUrl(event.target.value);
                  setAnalysisComplete(false);
                }}
                required
              />
              <button className="primary-action" type="submit" disabled={analyzing}>
                {analyzing ? "Sinyaller çıkarılıyor…" : "Analizi başlat"}
              </button>
            </form>
            <p className="demo-note">MVP demo: bağlantı herhangi bir servise gönderilmez.</p>

            {analysisComplete && (
              <div className="analysis-result" role="status">
                <div>
                  <small>Hook gücü</small>
                  <strong>86</strong>
                </div>
                <div>
                  <small>Marka uyumu</small>
                  <strong>88</strong>
                </div>
                <div>
                  <small>Çekim zorluğu</small>
                  <strong>Kolay</strong>
                </div>
                <p>
                  <b>Öneri:</b> İlk iki saniyedeki nesne geçişini koru; ürün mesajını son
                  kareye bırak.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function RadarView({
  profile,
  brand,
  country,
  sector,
  period,
  saved,
  onPeriodChange,
  onSavedChange,
  onScoreOpen,
}: {
  profile: TrendProfile;
  brand: string;
  country: string;
  sector: string;
  period: string;
  saved: boolean;
  onPeriodChange: (value: string) => void;
  onSavedChange: () => void;
  onScoreOpen: () => void;
}) {
  return (
    <div className="hero-grid">
      <header className="hero-copy">
        <p className="eyebrow">Haftalık yaratıcı sinyaller</p>
        <h1>Trendleri markaya dönüşmeden yakala</h1>
      </header>

      <article className="kpi-card" aria-label="Yükselen trend sayısı">
        <div>
          <strong>{profile.count}</strong>
          <span>Yükselen Trend</span>
        </div>
        <div className="kpi-bars" aria-hidden="true">
          {[34, 50, 62, 72, 82, 100].map((height, index) => (
            <i
              key={height}
              className={index === 5 ? "highlight" : ""}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </article>

      <article className="trend-card">
        <div className="trend-copy">
          <div className="trend-card-top">
            <span className="rising-chip">↗ Yükseliyor</span>
            <button
              type="button"
              className={`bookmark ${saved ? "saved" : ""}`}
              aria-label={saved ? "Kayıttan çıkar" : "Trendi kaydet"}
              aria-pressed={saved}
              onClick={onSavedChange}
            >
              {saved ? "◆" : "◇"}
            </button>
          </div>
          <h2>{profile.title}</h2>
          <div className="trend-meta">
            <div>
              <small>Kategori</small>
              <strong>{sector}</strong>
            </div>
            <div>
              <small>Marka</small>
              <strong>{brand}</strong>
            </div>
            <div>
              <small>Bölge</small>
              <strong>{country}</strong>
            </div>
          </div>
        </div>
        <button
          className="score-ring"
          style={{
            background: `conic-gradient(var(--cyan) 0 ${profile.score * 3.6}deg, #253149 ${profile.score * 3.6}deg 360deg)`,
          }}
          type="button"
          aria-label={`Trend uyum puanı ${profile.score}; ayrıntıları aç`}
          onClick={onScoreOpen}
        >
          <span>
            <strong>{profile.score}</strong>
            <small>/100</small>
          </span>
        </button>
      </article>

      <article className="velocity-card">
        <div className="card-heading">
          <div>
            <p className="eyebrow">Son {period === "7G" ? "7 gün" : period === "30G" ? "30 gün" : "90 gün"}</p>
            <h2>Trend hızı</h2>
          </div>
          <select
            aria-label="Trend dönemi"
            value={period}
            onChange={(event) => onPeriodChange(event.target.value)}
          >
            <option>7G</option>
            <option>30G</option>
            <option>90G</option>
          </select>
        </div>
        <div className="chart" role="img" aria-label="Trend hızı güçlü biçimde yükseliyor">
          <div className="chart-grid" aria-hidden="true">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          <svg viewBox="0 0 456 150" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="lineGlow" x1="0" x2="1">
                <stop offset="0%" stopColor="#25f4ee" stopOpacity=".6" />
                <stop offset="100%" stopColor="#25f4ee" />
              </linearGradient>
            </defs>
            <polyline points={trendPoints} fill="none" stroke="url(#lineGlow)" strokeWidth="4" />
            <circle cx="456" cy="18" r="8" fill="#fe2c55" stroke="#f2eee5" strokeWidth="3" />
          </svg>
          <div className="chart-dates" aria-hidden="true">
            <span>17 Tem</span>
            <span>19 Tem</span>
            <span>21 Tem</span>
            <span>23 Tem</span>
          </div>
        </div>
      </article>
    </div>
  );
}

function AnalysesView() {
  return (
    <section className="secondary-view">
      <header className="view-header">
        <div>
          <p className="eyebrow">Karşılaştırmalı okuma</p>
          <h1>Yükselen sinyaller</h1>
        </div>
        <p>Trendleri hız, marka uyumu ve tahmini ömürlerine göre karşılaştır.</p>
      </header>
      <div className="analysis-grid">
        {analysisCards.map((item, index) => (
          <article key={item.title} className="analysis-card">
            <div className="analysis-index">0{index + 1}</div>
            <span className="rising-chip">{item.status}</span>
            <h2>{item.title}</h2>
            <div className="analysis-metrics">
              <div><small>Fit Score</small><strong>{item.score}</strong></div>
              <div><small>Hız</small><strong>{item.velocity}</strong></div>
              <div><small>Tahmini ömür</small><strong>{item.lifespan}</strong></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BrandsView({ onSelectBrand }: { onSelectBrand: (brand: string) => void }) {
  return (
    <section className="secondary-view">
      <header className="view-header">
        <div>
          <p className="eyebrow">Marka radarları</p>
          <h1>Her markanın ritmi farklı</h1>
        </div>
        <p>İçerik evrenine göre en güçlü trend eşleşmelerini gör.</p>
      </header>
      <div className="brand-grid">
        {brandCards.map((item) => (
          <button className="brand-card" type="button" key={item.name} onClick={() => onSelectBrand(item.name)}>
            <div className="brand-monogram">{item.name.slice(0, 2).toUpperCase()}</div>
            <span>{item.category}</span>
            <h2>{item.name}</h2>
            <div className="brand-stats">
              <div><strong>{item.trends}</strong><small>yükselen trend</small></div>
              <div><strong>{item.fit}</strong><small>ortalama uyum</small></div>
            </div>
            <i>Radarı aç →</i>
          </button>
        ))}
      </div>
    </section>
  );
}
