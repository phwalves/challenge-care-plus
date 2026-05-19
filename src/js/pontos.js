(() => {
  const modalTriggers = document.querySelectorAll("[data-open-modal]");
  const closeTriggers = document.querySelectorAll("[data-close-modal]");
  const missionButtons = document.querySelectorAll("[data-mission-tab]");
  const missionsList = document.querySelector("#modal-missions-list");

  const missions = {
    gain: [
      ["calendar-check-2", "Comparecimento a uma consulta agendada", "+15"],
      ["bell-ring", "Confirmação de presença com 24h de antecedência", "+10"],
      ["credit-card", "Pagamento antecipado", "+20"],
      ["user-plus", "Indicação que agenda e comparece", "+25"],
      ["flame", "Três meses sem faltas ou atrasos", "+100"],
    ],
    loss: [
      ["calendar-x-2", "Falta sem justificativa", "-50"],
      ["clock-alert", "Atraso superior a 15 minutos", "-15"],
      ["calendar-minus", "Cancelamento no mesmo dia da consulta", "-20"],
      ["file-x-2", "Documento de justificativa recusado", "-25"],
    ],
  };

  const openModal = (modalId) => {
    const modal = document.querySelector(`#${modalId}`);

    if (!modal) {
      return;
    }

    modal.hidden = false;
    document.body.classList.add("modal-open");

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const closeModals = () => {
    document.querySelectorAll(".pontos-modal").forEach((modal) => {
      modal.hidden = true;
    });
    document.body.classList.remove("modal-open");
  };

  const renderMissions = (type) => {
    missionsList.innerHTML = missions[type].map(([icon, label, points]) => `
      <article class="mission-item${type === "loss" ? " negative" : ""}">
        <i data-lucide="${icon}"></i>
        <p>${label}</p>
        <strong>${points}</strong>
      </article>
    `).join("");

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

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
      missionButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderMissions(button.dataset.missionTab);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModals();
    }
  });

  renderMissions("gain");
})();
