(function () {
  "use strict";

  const MUSCLES = [
    "Peito",
    "Ombros",
    "Costas",
    "Bíceps",
    "Tríceps",
    "Quadríceps",
    "Posterior",
    "Glúteos",
    "Abdômen",
    "Panturrilha",
  ];

  const MOCK_EXERCISES = [
    { id: 1, name: "Supino reto", muscles: ["Peito", "Tríceps", "Ombros"], prev: 50, curr: 54 },
    { id: 2, name: "Elevação lateral", muscles: ["Ombros"], prev: 6, curr: 12 },
    { id: 3, name: "Agachamento livre", muscles: ["Quadríceps", "Glúteos", "Posterior"], prev: 80, curr: 92 },
    { id: 4, name: "Remada curvada", muscles: ["Costas", "Bíceps"], prev: 40, curr: 44 },
    { id: 5, name: "Rosca direta", muscles: ["Bíceps"], prev: 14, curr: 16 },
    { id: 6, name: "Tríceps pulley", muscles: ["Tríceps"], prev: 25, curr: 28 },
    { id: 7, name: "Leg press", muscles: ["Quadríceps", "Glúteos"], prev: 120, curr: 140 },
    { id: 8, name: "Stiff", muscles: ["Posterior", "Glúteos"], prev: 60, curr: 65 },
    { id: 9, name: "Prancha (seg)", muscles: ["Abdômen"], prev: 45, curr: 60 },
    { id: 10, name: "Panturrilha em pé", muscles: ["Panturrilha"], prev: 80, curr: 90 },
    { id: 11, name: "Crucifixo inclinado", muscles: ["Peito"], prev: 12, curr: 14 },
    { id: 12, name: "Desenvolvimento", muscles: ["Ombros", "Tríceps"], prev: 22, curr: 24 },
    { id: 13, name: "Supino inclinado", muscles: ["Peito", "Ombros"], prev: 42, curr: 45 },
    { id: 14, name: "Puxada frontal", muscles: ["Costas", "Bíceps"], prev: 50, curr: 55 },
    { id: 15, name: "Rosca martelo", muscles: ["Bíceps"], prev: 12, curr: 12 },
    { id: 16, name: "Tríceps testa", muscles: ["Tríceps"], prev: 18, curr: 17 },
    { id: 17, name: "Cadeira extensora", muscles: ["Quadríceps"], prev: 45, curr: 48 },
    { id: 18, name: "Mesa flexora", muscles: ["Posterior"], prev: 35, curr: 38 },
    { id: 19, name: "Hack squat", muscles: ["Quadríceps", "Glúteos"], prev: 100, curr: 108 },
    { id: 20, name: "Elevação frontal", muscles: ["Ombros"], prev: 10, curr: 11 },
    { id: 21, name: "Remada unilateral", muscles: ["Costas"], prev: 24, curr: 26 },
    { id: 22, name: "Abdominal máquina", muscles: ["Abdômen"], prev: 40, curr: 45 },
    { id: 23, name: "Afundo", muscles: ["Quadríceps", "Glúteos"], prev: 20, curr: 24 },
    { id: 24, name: "Rosca concentrada", muscles: ["Bíceps"], prev: 10, curr: 9 },
    { id: 25, name: "Crossover", muscles: ["Peito"], prev: 15, curr: 18 },
    { id: 26, name: "Elevação pélvica", muscles: ["Glúteos"], prev: 60, curr: 70 },
    { id: 27, name: "Panturrilha sentado", muscles: ["Panturrilha"], prev: 50, curr: 52 },
    { id: 28, name: "Barra fixa", muscles: ["Costas", "Bíceps"], prev: 6, curr: 8 },
  ];

  const MOCK_DIARY = [
    {
      date: "2026-05-18",
      label: "Hoje",
      items: [
        { exercise: "Supino reto", load: "54 kg × 4", muscles: ["Peito", "Tríceps"] },
        { exercise: "Elevação lateral", load: "12 kg × 3", muscles: ["Ombros"] },
        { exercise: "Crucifixo inclinado", load: "14 kg × 3", muscles: ["Peito"] },
      ],
    },
    {
      date: "2026-05-16",
      label: "16 mai",
      items: [
        { exercise: "Agachamento livre", load: "92 kg × 5", muscles: ["Quadríceps", "Glúteos"] },
        { exercise: "Leg press", load: "140 kg × 4", muscles: ["Quadríceps"] },
        { exercise: "Stiff", load: "65 kg × 3", muscles: ["Posterior"] },
      ],
    },
    {
      date: "2026-05-14",
      label: "14 mai",
      items: [
        { exercise: "Remada curvada", load: "44 kg × 4", muscles: ["Costas", "Bíceps"] },
        { exercise: "Rosca direta", load: "16 kg × 3", muscles: ["Bíceps"] },
        { exercise: "Tríceps pulley", load: "28 kg × 3", muscles: ["Tríceps"] },
      ],
    },
    {
      date: "2026-05-12",
      label: "12 mai",
      items: [
        { exercise: "Desenvolvimento", load: "24 kg × 4", muscles: ["Ombros"] },
        { exercise: "Supino reto", load: "52 kg × 4", muscles: ["Peito"] },
        { exercise: "Prancha", load: "60 s × 3", muscles: ["Abdômen"] },
      ],
    },
    {
      date: "2026-05-10",
      label: "10 mai",
      items: [
        { exercise: "Panturrilha em pé", load: "90 kg × 4", muscles: ["Panturrilha"] },
        { exercise: "Agachamento livre", load: "88 kg × 5", muscles: ["Quadríceps"] },
      ],
    },
  ];

  const BODY_DEFAULT = { weight: 78, height: 175, age: 28 };

  function pctChange(prev, curr) {
    if (!prev || prev <= 0) return 0;
    return Math.round(((curr - prev) / prev) * 100);
  }

  function heatColor(pct) {
    const clamped = Math.max(-20, Math.min(120, pct));
    const t = (clamped + 20) / 140;
    const r = Math.round(248 - t * (248 - 74));
    const g = Math.round(113 + t * (222 - 113));
    const b = Math.round(113 + t * (128 - 113));
    return `rgb(${r}, ${g}, ${b})`;
  }

  function bmi(weightKg, heightCm) {
    const m = heightCm / 100;
    return (weightKg / (m * m)).toFixed(1);
  }

  function bmiLabel(v) {
    const n = parseFloat(v);
    if (n < 18.5) return "Abaixo do peso";
    if (n < 25) return "Peso saudável";
    if (n < 30) return "Sobrepeso";
    return "Obesidade";
  }

  function aggregateMuscleGrowth() {
    const map = {};
    MUSCLES.forEach((m) => {
      map[m] = { total: 0, count: 0, max: -999 };
    });
    MOCK_EXERCISES.forEach((ex) => {
      const p = pctChange(ex.prev, ex.curr);
      ex.muscles.forEach((mus) => {
        if (!map[mus]) map[mus] = { total: 0, count: 0, max: -999 };
        map[mus].total += p;
        map[mus].count += 1;
        map[mus].max = Math.max(map[mus].max, p);
      });
    });
    const result = {};
    Object.keys(map).forEach((k) => {
      const e = map[k];
      result[k] = e.count ? Math.round(e.total / e.count) : 0;
    });
    return result;
  }

  let muscleHeat = aggregateMuscleGrowth();

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function showToast(msg) {
    const el = $("#ac-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove("is-show"), 2800);
  }

  function initTabs() {
    const tabs = $$(".ac-tab");
    const panels = $$(".ac-panel");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-panel");
        tabs.forEach((t) => t.setAttribute("aria-selected", t === tab ? "true" : "false"));
        panels.forEach((p) => {
          const show = p.id === id;
          p.classList.toggle("is-visible", show);
          p.hidden = !show;
        });
        $$(".ac-nav a").forEach((a) => {
          const href = a.getAttribute("href");
          a.classList.toggle("is-active", href === `#${id}`);
        });
      });
    });
    panels.forEach((p) => {
      const show = p.classList.contains("is-visible");
      p.hidden = !show;
    });
  }

  function initNavScroll() {
    $$(".ac-nav a").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#panel-")) return;
        e.preventDefault();
        const tab = $(`.ac-tab[data-panel="${href.slice(1)}"]`);
        if (tab) tab.click();
        $(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function setText(sel, text) {
    const el = $(sel);
    if (el) el.textContent = text;
  }

  function renderBodyMetrics() {
    const w = parseFloat($("#input-weight")?.value) || BODY_DEFAULT.weight;
    const h = parseFloat($("#input-height")?.value) || BODY_DEFAULT.height;
    const b = bmi(w, h);
    setText("#kpi-bmi", b);
    setText("#kpi-bmi-label", bmiLabel(b));
    setText("#kpi-weight", `${w} kg`);
    setText("#kpi-height", `${h} cm`);
    setText("#kpi-lean", `~${(w * (1 - 0.18)).toFixed(1)} kg`);
  }

  function getExercisesForMuscle(muscle) {
    return MOCK_EXERCISES.filter((ex) => ex.muscles.includes(muscle));
  }

  function paintBodyMap() {
    muscleHeat = aggregateMuscleGrowth();
    $$(".ac-muscle-zone").forEach((zone) => {
      const mus = zone.getAttribute("data-muscle");
      const pct = muscleHeat[mus] ?? 0;
      const color = heatColor(pct);
      zone.style.setProperty("--heat-color", color);
      zone.style.setProperty("--heat-stroke", color);
      zone.style.fill = color;
      zone.style.stroke = color;
      zone.style.fillOpacity = "0.72";
      zone.style.strokeWidth = "2";
      zone.setAttribute("data-heat", pct);
      zone.setAttribute("aria-label", `${mus}: ${pct >= 0 ? "+" : ""}${pct}% de evolução média`);
    });
  }

  /** Exibe painel e destaque no músculo com mais exercícios / maior ganho (demo ao carregar). */
  function initDemoHighlight() {
    const top = Object.entries(muscleHeat).sort((a, b) => b[1] - a[1])[0];
    const muscle = top ? top[0] : "Peito";
    $$(`.ac-muscle-zone[data-muscle="${muscle}"]`).forEach((z) => z.classList.add("is-active"));
    showMusclePanel(muscle);
  }

  function showMusclePanel(muscle) {
    const placeholder = $("#muscle-panel-placeholder");
    const content = $("#muscle-panel-content");
    const title = $("#muscle-panel-title");
    const meta = $("#muscle-panel-meta");
    const list = $("#muscle-panel-exercises");
    if (!placeholder || !content || !title || !meta || !list) return;

    const pct = muscleHeat[muscle] ?? 0;
    const exercises = getExercisesForMuscle(muscle);

    placeholder.hidden = true;
    content.hidden = false;
    title.textContent = muscle;
    meta.textContent = `${exercises.length} exercício(s) · evolução média ${pct >= 0 ? "+" : ""}${pct}%`;

    if (!exercises.length) {
      list.innerHTML = "<li><span class=\"ex-name\">Nenhum exercício cadastrado</span></li>";
      return;
    }

    list.innerHTML = exercises
      .map((ex) => {
        const p = pctChange(ex.prev, ex.curr);
        const color = heatColor(p);
        const loads =
          ex.prev === 0 && ex.curr > 0
            ? `corpo → ${ex.curr} reps`
            : `${ex.prev} → ${ex.curr} kg`;
        return `<li>
          <span class="ex-name">${ex.name}</span>
          <span class="ex-pct" style="color:${color}">${p >= 0 ? "+" : ""}${p}% · ${loads}</span>
        </li>`;
      })
      .join("");
  }

  function hideMusclePanel() {
    const placeholder = $("#muscle-panel-placeholder");
    const content = $("#muscle-panel-content");
    if (placeholder) placeholder.hidden = false;
    if (content) content.hidden = true;
    $$(".ac-muscle-zone").forEach((z) => z.classList.remove("is-active"));
  }

  function renderExerciseLoadList() {
    const ul = $("#exercise-load-list");
    if (!ul) return;
    const sorted = [...MOCK_EXERCISES].sort(
      (a, b) => pctChange(b.prev, b.curr) - pctChange(a.prev, a.curr)
    );
    ul.innerHTML = sorted
      .map((ex) => {
        const p = pctChange(ex.prev, ex.curr);
        const color = heatColor(p);
        const pctClass = p > 0 ? "is-gain" : p < 0 ? "is-loss" : "is-flat";
        const loads =
          ex.prev === 0 && ex.curr > 0
            ? `${ex.prev} → ${ex.curr} reps`
            : `${ex.prev} → ${ex.curr} kg`;
        return `<li class="ac-ex-load-item" style="--item-accent:${color}">
          <span class="ac-ex-load-name">${ex.name}</span>
          <span class="ac-ex-load-weights">${loads}</span>
          <span class="ac-ex-load-pct ${pctClass}" style="color:${color}">${p > 0 ? "+" : ""}${p}%</span>
          <div class="ac-ex-load-muscles">${ex.muscles.map((m) => `<span class="ac-tag">${m}</span>`).join("")}</div>
        </li>`;
      })
      .join("");
  }

  function renderExerciseTable(extra) {
    const tbody = $("#exercise-tbody");
    if (!tbody) return;
    const all = extra ? [...MOCK_EXERCISES, extra] : MOCK_EXERCISES;
    tbody.innerHTML = all
      .map((ex) => {
        const p = pctChange(ex.prev, ex.curr);
        const color = heatColor(p);
        return `<tr>
          <td><strong>${ex.name}</strong></td>
          <td><div class="ac-muscle-tags">${ex.muscles.map((m) => `<span class="ac-tag">${m}</span>`).join("")}</div></td>
          <td>${ex.prev} → ${ex.curr} kg</td>
          <td style="color:${color};font-weight:700;">${p >= 0 ? "+" : ""}${p}%</td>
        </tr>`;
      })
      .join("");
  }

  function renderEvolution() {
    const list = $("#evolution-list");
    if (!list) return;
    const sorted = [...MOCK_EXERCISES].sort(
      (a, b) => pctChange(b.prev, b.curr) - pctChange(a.prev, a.curr)
    );
    list.innerHTML = sorted
      .map((ex) => {
        const p = pctChange(ex.prev, ex.curr);
        const color = heatColor(p);
        const w = Math.min(100, Math.max(8, Math.abs(p)));
        return `<div class="ac-ev-row">
          <span class="ac-ev-name">${ex.name}</span>
          <span class="ac-ev-loads">${ex.prev} → ${ex.curr} kg</span>
          <div class="ac-ev-bar-track" aria-hidden="true"><div class="ac-ev-bar-fill" style="width:${w}%;background:${color};"></div></div>
          <span class="ac-ev-pct" style="color:${color}">${p >= 0 ? "+" : ""}${p}%</span>
        </div>`;
      })
      .join("");
  }

  function renderMuscleHeatGrid() {
    const grid = $("#muscle-heat-grid");
    if (!grid) return;
    const entries = Object.entries(muscleHeat).sort((a, b) => b[1] - a[1]);
    grid.innerHTML = entries
      .map(([name, pct]) => {
        const bg = heatColor(pct);
        return `<div class="ac-heat-cell" style="background:${bg}22;border-color:${bg}55;">
          <div class="ac-heat-cell-name">${name}</div>
          <div class="ac-heat-cell-pct" style="color:${bg}">${pct >= 0 ? "+" : ""}${pct}%</div>
        </div>`;
      })
      .join("");
  }

  function renderDiary() {
    const ul = $("#diary-timeline");
    if (!ul) return;
    ul.innerHTML = MOCK_DIARY.map((day) => {
      const inner = day.items
        .map(
          (it) => `<div class="ac-timeline-item">
            <strong>${it.exercise}</strong>
            <span class="ac-ev-loads">${it.load}</span>
            <div class="ac-muscle-tags" style="margin-top:0.35rem;">${it.muscles.map((m) => `<span class="ac-tag">${m}</span>`).join("")}</div>
          </div>`
        )
        .join("");
      return `<li><div class="ac-timeline-date">${day.label} · ${day.date}</div>${inner}</li>`;
    }).join("");
  }

  function initBodyForm() {
    const form = $("#body-form");
    if (!form) return;
    $("#input-weight").value = BODY_DEFAULT.weight;
    $("#input-height").value = BODY_DEFAULT.height;
    $("#input-age").value = BODY_DEFAULT.age;
    renderBodyMetrics();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      renderBodyMetrics();
      paintBodyMap();
      showToast("Medidas atualizadas (apenas demonstração local)");
    });
    $$("#body-form input").forEach((inp) => {
      inp.addEventListener("input", renderBodyMetrics);
    });
  }

  function initExerciseForm() {
    const form = $("#exercise-form");
    if (!form) return;
    const muscleSel = $("#ex-muscles");
    if (!muscleSel || muscleSel.options.length > 0) return;
    MUSCLES.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      muscleSel.appendChild(opt);
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#ex-name").value.trim();
      const selected = [...muscleSel.selectedOptions].map((o) => o.value);
      if (!name || !selected.length) {
        showToast("Informe nome e ao menos um músculo");
        return;
      }
      const extra = {
        id: Date.now(),
        name,
        muscles: selected,
        prev: parseFloat($("#ex-prev").value) || 0,
        curr: parseFloat($("#ex-curr").value) || 0,
      };
      MOCK_EXERCISES.push(extra);
      renderExerciseTable();
      renderEvolution();
      renderMuscleHeatGrid();
      renderExerciseLoadList();
      paintBodyMap();
      form.reset();
      showToast(`Exercício "${name}" adicionado ao catálogo demo`);
    });
  }

  function initDiaryForm() {
    const form = $("#diary-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const exercise = $("#diary-exercise").value;
      const load = $("#diary-load").value.trim();
      if (!exercise || !load) return;
      const ex = MOCK_EXERCISES.find((x) => x.name === exercise);
      const muscles = ex ? ex.muscles : ["—"];
      const today = new Date().toISOString().slice(0, 10);
      let day = MOCK_DIARY.find((d) => d.date === today);
      if (!day) {
        day = { date: today, label: "Hoje", items: [] };
        MOCK_DIARY.unshift(day);
      }
      day.items.unshift({ exercise, load, muscles });
      renderDiary();
      form.reset();
      showToast("Treino registrado no diário demo");
    });
    const sel = $("#diary-exercise");
    if (!sel || sel.options.length > 0) return;
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Selecione…";
    sel.appendChild(blank);
    MOCK_EXERCISES.forEach((ex) => {
      const opt = document.createElement("option");
      opt.value = ex.name;
      opt.textContent = ex.name;
      sel.appendChild(opt);
    });
  }

  function initMuscleHover() {
    const stage = $(".ac-body-stage");
    let activeMuscle = null;

    const setActive = (mus) => {
      activeMuscle = mus;
      $$(".ac-muscle-zone").forEach((z) => z.classList.remove("is-active"));
      $$(`.ac-muscle-zone[data-muscle="${mus}"]`).forEach((z) => z.classList.add("is-active"));
      showMusclePanel(mus);
    };

    $$(".ac-muscle-zone").forEach((zone) => {
      const mus = zone.getAttribute("data-muscle");
      zone.setAttribute("tabindex", "0");
      zone.setAttribute("role", "button");
      zone.setAttribute("aria-label", `Músculo ${mus}. Ver exercícios relacionados.`);
      zone.addEventListener("mouseenter", () => setActive(mus));
      zone.addEventListener("focus", () => setActive(mus));
    });

    stage?.addEventListener("mouseleave", () => {
      activeMuscle = null;
      hideMusclePanel();
    });
  }

  function init() {
    initTabs();
    initNavScroll();
    initBodyForm();
    initExerciseForm();
    initDiaryForm();
    initMuscleHover();
    renderExerciseTable();
    renderEvolution();
    renderMuscleHeatGrid();
    renderExerciseLoadList();
    renderDiary();
    paintBodyMap();
    initDemoHighlight();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
