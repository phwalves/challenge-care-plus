(() => {
  const userPoints = 295;
  const defaultSelectedRankId = "gold";

  const rankConfig = [
    {
      id: "gold",
      name: "Care Gold",
      threshold: 0,
      icon: "medal",
      color: "#d4a017",
      soft: "#fff5d6",
      benefits: [
        ["bell-ring", "Lembretes inteligentes", "Alertas simples para você não perder consultas importantes."],
        ["calendar-check-2", "Check-in guiado", "Orientações rápidas antes da consulta agendada."],
        ["history", "Histórico de pontos", "Acompanhe ganhos, perdas e oportunidades de evolução."],
      ],
    },
    {
      id: "platinum",
      name: "Care Platinum",
      threshold: 300,
      icon: "shield-check",
      color: "#6a5cff",
      soft: "#ece8ff",
      benefits: [
        ["badge-check", "Confirmação prioritária", "Suas confirmações entram em destaque no fluxo de atendimento."],
        ["sparkles", "Bônus de frequência", "Ganhe mais pontos ao manter uma rotina consistente."],
        ["headphones", "Suporte preferencial", "Atendimento com prioridade em situações sensíveis."],
      ],
    },
    {
      id: "diamond",
      name: "Care Diamond",
      threshold: 600,
      icon: "gem",
      color: "#0f2a3d",
      soft: "#dcebf4",
      benefits: [
        ["diamond", "Experiência Diamond", "O pacote mais completo de benefícios e suporte Care Plus."],
        ["crown", "Campanhas exclusivas", "Convites para desafios, bônus e ações especiais."],
        ["star", "Status máximo", "Reconhecimento visual em toda a jornada de pontos."],
      ],
    },
  ];

  const missions = {
    gain: [
      {
        icon: "calendar-check-2",
        label: "Compareça à consulta agendada",
        detail: "Melhor missão para evoluir sem esforço extra.",
        points: "+15",
      },
      {
        icon: "bell-ring",
        label: "Confirme presença com 24h",
        detail: "Ajuda a Care Plus a reduzir no-show.",
        points: "+10",
      },
      {
        icon: "credit-card",
        label: "Faça pagamento antecipado",
        detail: "Organiza seu atendimento antes da chegada.",
        points: "+20",
      },
      {
        icon: "user-plus",
        label: "Indique alguém que compareça",
        detail: "Indicações válidas aceleram sua jornada.",
        points: "+25",
      },
      {
        icon: "flame",
        label: "Três meses sem faltas ou atrasos",
        detail: "Combo de consistência para subir rápido.",
        points: "+100",
      },
    ],
    loss: [
      {
        icon: "calendar-x-2",
        label: "Falta sem justificativa",
        detail: "Cancela o avanço e atrasa o próximo rank.",
        points: "-50",
      },
      {
        icon: "clock-alert",
        label: "Atraso superior a 15 minutos",
        detail: "A pontualidade mantém a agenda saudável.",
        points: "-15",
      },
      {
        icon: "calendar-minus",
        label: "Cancelamento no mesmo dia",
        detail: "Avise com antecedência sempre que possível.",
        points: "-20",
      },
      {
        icon: "file-x-2",
        label: "Justificativa recusada",
        detail: "Documentos incompletos podem reduzir pontos.",
        points: "-25",
      },
    ],
  };

  const root = document.querySelector(".page-pontos");
  const hero = document.querySelector("#points-hero");
  const currentRankIcon = document.querySelector("#current-rank-icon");
  const currentRankName = document.querySelector("#current-rank-name");
  const currentRankSummary = document.querySelector("#current-rank-summary");
  const heroNextChip = document.querySelector("#hero-next-chip");
  const currentPoints = document.querySelector("#current-points");
  const pointsMissing = document.querySelector("#points-missing");
  const progress = document.querySelector("#rank-progress");
  const progressFill = document.querySelector("#progress-fill");
  const currentRankThreshold = document.querySelector("#current-rank-threshold");
  const nextRankThreshold = document.querySelector("#next-rank-threshold");
  const rankTrack = document.querySelector("#rank-track");
  const benefitsTitle = document.querySelector("#benefits-title");
  const benefitsDescription = document.querySelector("#benefits-description");
  const selectedBenefits = document.querySelector("#selected-benefits");
  const quickMissions = document.querySelector("#quick-missions");
  const modalTriggers = document.querySelectorAll("[data-open-modal]");
  const closeTriggers = document.querySelectorAll("[data-close-modal]");
  const missionButtons = document.querySelectorAll("[data-mission-tab]");
  const modalMissionsList = document.querySelector("#modal-missions-list");

  let selectedRankId = defaultSelectedRankId;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const currentRankIndex = rankConfig.reduce((currentIndex, rank, index) => {
    return userPoints >= rank.threshold ? index : currentIndex;
  }, 0);

  const currentRank = rankConfig[currentRankIndex];
  const nextRank = rankConfig[currentRankIndex + 1] || currentRank;
  const isMaxRank = currentRank.id === nextRank.id;
  const rangeStart = currentRank.threshold;
  const rangeEnd = nextRank.threshold;
  const rangeTotal = Math.max(rangeEnd - rangeStart, 1);

  const progressPercent = isMaxRank
    ? 100
    : clamp(Math.round(((userPoints - rangeStart) / rangeTotal) * 100), 0, 100);

  const missingPoints = isMaxRank
    ? 0
    : Math.max(nextRank.threshold - userPoints, 0);

  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const statusLabel = (index) => {
    if (index < currentRankIndex) {
      return "Desbloqueado";
    }

    if (index === currentRankIndex) {
      return "Rank atual";
    }

    return "Bloqueado";
  };

  const renderHero = () => {
    root.style.setProperty("--active-rank-color", currentRank.color);
    root.style.setProperty("--active-rank-soft", currentRank.soft);

    hero.style.setProperty("--active-rank-color", currentRank.color);
    hero.style.setProperty("--active-rank-soft", currentRank.soft);

    currentRankIcon.setAttribute("data-lucide", currentRank.icon);

    currentRankName.textContent = currentRank.name;

    currentRankSummary.textContent = isMaxRank
      ? "Você chegou ao topo da jornada Care Plus."
      : `${missingPoints} pontos para desbloquear ${nextRank.name}.`;

    heroNextChip.textContent = isMaxRank
      ? "Rank máximo desbloqueado"
      : `Próximo: ${nextRank.name}`;
  };

  const renderProgress = () => {
    currentPoints.textContent = userPoints;
    pointsMissing.textContent = missingPoints;

    progress.setAttribute("aria-valuenow", String(progressPercent));

    progressFill.style.width = `${progressPercent}%`;

    currentRankThreshold.textContent =
      `${currentRank.name} - ${currentRank.threshold} pts`;

    nextRankThreshold.textContent = isMaxRank
      ? "Jornada completa"
      : `${nextRank.name} - ${nextRank.threshold} pts`;
  };

  const renderRankTrack = () => {
    rankTrack.innerHTML = rankConfig.map((rank, index) => {
      const stateClass =
        index < currentRankIndex
          ? "is-complete"
          : index === currentRankIndex
            ? "is-current"
            : "is-locked";

      const isSelected = rank.id === selectedRankId;

      return `
        <button
          class="rank-step ${stateClass}${isSelected ? " is-selected" : ""}"
          type="button"
          data-rank-id="${rank.id}"
          style="--rank-color: ${rank.color}; --rank-soft: ${rank.soft};"
          aria-pressed="${isSelected}"
        >
          <span class="rank-step-medal">
            <i data-lucide="${rank.icon}"></i>
          </span>

          <span class="rank-step-label">
            <strong>${rank.name}</strong>
            <small>${statusLabel(index)}</small>
          </span>

          <span class="rank-step-points">
            ${rank.threshold} pts
          </span>
        </button>
      `;
    }).join("");
  };

  const renderBenefits = () => {
    const selectedRank =
      rankConfig.find((rank) => rank.id === selectedRankId) || currentRank;

    const selectedIndex =
      rankConfig.findIndex((rank) => rank.id === selectedRank.id);

    benefitsTitle.textContent =
      `Benefícios do ${selectedRank.name}`;

    benefitsDescription.textContent =
      selectedIndex > currentRankIndex
        ? `Desbloqueie ao chegar em ${selectedRank.threshold} pontos.`
        : selectedRank.id === currentRank.id
          ? "Você já está aproveitando este nível."
          : "Benefícios já desbloqueados na sua jornada.";

    selectedBenefits.innerHTML = selectedRank.benefits.map(
      ([icon, title, description]) => `
        <article class="benefit-item">
          <i data-lucide="${icon}"></i>

          <div>
            <strong>${title}</strong>
            <p>${description}</p>
          </div>
        </article>
      `
    ).join("");
  };

  const renderMissionItem = (mission, type) => `
    <article class="mission-item${type === "loss" ? " negative" : ""}">
      <i data-lucide="${mission.icon}"></i>

      <div>
        <p>${mission.label}</p>
        <small>${mission.detail}</small>
      </div>

      <strong>${mission.points}</strong>
    </article>
  `;

  const renderQuickMissions = () => {
    quickMissions.innerHTML = missions.gain
      .slice(0, 3)
      .map((mission) => renderMissionItem(mission, "gain"))
      .join("");
  };

  const renderModalMissions = (type) => {
    modalMissionsList.innerHTML = missions[type]
      .map((mission) => renderMissionItem(mission, type))
      .join("");

    refreshIcons();
  };

  const syncSelectedRank = () => {
    document.querySelectorAll(".rank-step").forEach((button) => {
      const isSelected = button.dataset.rankId === selectedRankId;

      button.classList.toggle("is-selected", isSelected);

      button.setAttribute("aria-pressed", String(isSelected));
    });
  };

  const openModal = (modalId) => {
    const modal = document.querySelector(`#${modalId}`);

    if (!modal) {
      return;
    }

    modal.hidden = false;

    document.body.classList.add("modal-open");

    refreshIcons();
  };

  const closeModals = () => {
    document.querySelectorAll(".pontos-modal").forEach((modal) => {
      modal.hidden = true;
    });

    document.body.classList.remove("modal-open");
  };

  rankTrack.addEventListener("click", (event) => {
    const button = event.target.closest("[data-rank-id]");

    if (!button) {
      return;
    }

    selectedRankId = button.dataset.rankId;

    syncSelectedRank();

    renderBenefits();

    refreshIcons();
  });

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openModal(trigger.dataset.openModal);
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeModals);
  });

  missionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      missionButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderModalMissions(button.dataset.missionTab);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModals();
    }
  });

  renderHero();
  renderProgress();
  renderRankTrack();
  renderBenefits();
  renderQuickMissions();
  renderModalMissions("gain");
})();