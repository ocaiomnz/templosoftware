/* Domus MVP — JS mínimo para modais + filtros.
   Sem dependências, sem backend. */

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function setText(el, value) {
  if (!el) return;
  el.textContent = value ?? "";
}

function setHTML(el, value) {
  if (!el) return;
  el.innerHTML = value ?? "";
}

function openModal(modalEl, triggerEl) {
  if (!modalEl) return;

  modalEl.classList.add("is-open");
  modalEl.setAttribute("aria-hidden", "false");

  // trava scroll do body (simples)
  document.documentElement.classList.add("modal-open");

  // foco inicial
  const focusTarget =
    qs("[data-modal-close]", modalEl) ||
    qs("a,button,input,select,textarea,[tabindex]:not([tabindex='-1'])", modalEl);

  requestAnimationFrame(() => {
    focusTarget?.focus?.();
  });

  // lembra gatilho
  modalEl._triggerEl = triggerEl || null;
}

function closeModal(modalEl) {
  if (!modalEl) return;

  modalEl.classList.remove("is-open");
  modalEl.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("modal-open");

  const trg = modalEl._triggerEl;
  if (trg && typeof trg.focus === "function") {
    requestAnimationFrame(() => trg.focus());
  }
  modalEl._triggerEl = null;
}

function bindModalEvents(modalEl) {
  if (!modalEl) return;

  // Fechar pelo botão
  qsa("[data-modal-close]", modalEl).forEach((btn) => {
    btn.addEventListener("click", () => closeModal(modalEl));
  });

  // Fechar ao clicar fora do painel
  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) closeModal(modalEl);
  });

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalEl.classList.contains("is-open")) {
      closeModal(modalEl);
    }
  });
}

function initCatalogModal() {
  const modal = qs("#property-modal");
  if (!modal) return;

  bindModalEvents(modal);

  qsa("[data-open-property]").forEach((cardBtn) => {
    cardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const d = cardBtn.dataset;

      setText(qs("[data-m-title]", modal), d.title);
      setText(qs("[data-m-subtitle]", modal), d.subtitle);
      setText(qs("[data-m-address]", modal), d.address);
      setText(qs("[data-m-area]", modal), d.area);
      setText(qs("[data-m-price]", modal), d.price);
      setText(qs("[data-m-status]", modal), d.statusLabel);

      const img = qs("[data-m-img]", modal);
      if (img) {
        img.src = d.img || "";
        img.alt = d.imgAlt || d.title || "Foto do imóvel";
      }

      const chips = qs("[data-m-chips]", modal);
      if (chips) {
        const list = (d.chips || "").split("|").map((s) => s.trim()).filter(Boolean);
        setHTML(chips, list.map((c) => `<li>${c}</li>`).join(""));
      }

      const map = qs("[data-m-map]", modal);
      if (map) {
        const mapQ = encodeURIComponent(d.mapQuery || d.address || d.title || "");
        map.src = `https://www.google.com/maps?q=${mapQ}&output=embed`;
        map.title = `Mapa: ${d.address || d.title || "localização"}`;
      }

      const wa = qs("[data-m-wa]", modal);
      if (wa) {
        const msg = encodeURIComponent(d.waText || `Olá! Tenho interesse no imóvel: ${d.title || ""}`.trim());
        wa.href = `https://wa.me/?text=${msg}`;
      }

      const cal = qs("[data-m-cal]", modal);
      if (cal) {
        const txt = encodeURIComponent(`Visita Domus — ${d.title || "Imóvel"}`);
        const details = encodeURIComponent(d.address || "");
        cal.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${txt}&details=${details}`;
      }

      openModal(modal, cardBtn);
    });
  });
}

function initRegisteredFilters() {
  const root = qs("[data-filter-root]");
  if (!root) return;

  const buttons = qsa("[data-filter]", root);
  const cards = qsa("[data-status]", root);

  function applyFilter(value) {
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === value)));

    cards.forEach((c) => {
      const ok = value === "todos" || c.dataset.status === value;
      c.style.display = ok ? "" : "none";
    });
  }

  buttons.forEach((b) => {
    b.addEventListener("click", () => applyFilter(b.dataset.filter));
  });

  // padrão
  applyFilter("todos");
}

function initContractModal() {
  const modal = qs("#contract-modal");
  if (!modal) return;

  bindModalEvents(modal);

  qsa("[data-open-contract]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const d = btn.dataset;

      setText(qs("[data-c-id]", modal), d.contractId);
      setText(qs("[data-c-title]", modal), d.title);
      setText(qs("[data-c-property]", modal), d.property);
      setText(qs("[data-c-parties]", modal), d.parties);
      setText(qs("[data-c-agent]", modal), d.agent);
      setText(qs("[data-c-value]", modal), d.value);
      setText(qs("[data-c-status]", modal), d.statusLabel);

      const img = qs("[data-c-img]", modal);
      if (img) {
        img.src = d.img || "";
        img.alt = d.imgAlt || d.property || "Foto do imóvel";
      }

      const map = qs("[data-c-map]", modal);
      if (map) {
        const mapQ = encodeURIComponent(d.mapQuery || d.address || d.property || "");
        map.src = `https://www.google.com/maps?q=${mapQ}&output=embed`;
        map.title = `Mapa: ${d.address || d.property || "localização"}`;
      }

      // timeline (valores em dias)
      const tl = qs("[data-c-timeline]", modal);
      if (tl) {
        const steps = [
          { key: "tAtendimento", label: "Atendimento" },
          { key: "tCadastro", label: "Cadastro / documentação" },
          { key: "tNegociacao", label: "Negociação" },
          { key: "tJuridico", label: "Jurídico" },
          { key: "tConfirmacao", label: "Confirmação" },
        ];
        const parsed = steps.map((s) => ({
          label: s.label,
          days: Number(d[s.key] || 0),
        }));
        const total = parsed.reduce((acc, s) => acc + (Number.isFinite(s.days) ? s.days : 0), 0) || 1;

        setHTML(
          tl,
          parsed
            .map((s) => {
              const pct = Math.max(2, Math.round((s.days / total) * 100));
              return `<li>
                <div class="tl-row">
                  <span class="tl-name">${s.label}</span>
                  <span class="tl-days">${s.days}d</span>
                </div>
                <div class="tl-track" aria-hidden="true"><div class="tl-fill" style="width:${pct}%"></div></div>
              </li>`;
            })
            .join("")
        );
      }

      openModal(modal, btn);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCatalogModal();
  initRegisteredFilters();
  initContractModal();
});

