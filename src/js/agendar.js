(() => {
  const STORAGE_KEY = "carePlusConsultas";
  const formAgendar = document.querySelector("#form-agendar");
  const consultasList = document.querySelector("#consultas-list");
  const consultasCount = document.querySelector("#consultas-count");
  const consultasEmpty = document.querySelector("#consultas-empty");
  const accordionSections = document.querySelectorAll("[data-accordion-section]");
  const accordionTriggers = document.querySelectorAll("[data-accordion-trigger]");
  let activeAccordion = "form";
  let accordionInicializado = false;

  const mensagensPadrao = [
    "Sua consulta foi confirmada",
    "Você tem uma mensagem",
  ];

  const consultasMock = [
    {
      id: "78AF",
      nome: "Pedro Duarte",
      local: "@peduarte",
      data: "2025-09-04",
      horario: "10:00",
      especialidade: "Cardiologia",
      tipoConsulta: "Consulta presencial",
      status: "agendada",
      mensagens: mensagensPadrao,
      notificacaoAtiva: false,
    },
  ];

  const normalizarConsulta = (consulta) => ({
    ...consulta,
    data: consulta.data || new Date().toISOString().slice(0, 10),
    status: consulta.status || "agendada",
    mensagens: consulta.mensagens?.length ? consulta.mensagens : mensagensPadrao,
    notificacaoAtiva: Boolean(consulta.notificacaoAtiva),
  });

  const getConsultas = () => {
    const consultas = localStorage.getItem(STORAGE_KEY);

    if (!consultas) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consultasMock));
      return consultasMock;
    }

    try {
      return JSON.parse(consultas).map(normalizarConsulta);
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consultasMock));
      return consultasMock;
    }
  };

  const setConsultas = (consultas) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consultas));
  };

  const abrirAccordion = (sectionName) => {
    activeAccordion = sectionName;

    accordionSections.forEach((section) => {
      const isActive = section.dataset.accordionSection === sectionName;
      section.classList.toggle("is-open", isActive);
    });

    accordionTriggers.forEach((trigger) => {
      const isActive = trigger.dataset.accordionTrigger === sectionName;
      trigger.setAttribute("aria-expanded", String(isActive));
    });
  };

  const consultasAgendadas = () => (
    getConsultas().filter((consulta) => consulta.status === "agendada")
  );

  const gerarId = () => {
    const chars = "0123456789ABCDEF";
    return Array.from(
      { length: 4 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const dataConsulta = (data) => {
    const [ano, mes, dia] = data.split("-").map(Number);
    return new Date(ano, mes - 1, dia);
  };

  const formatarData = (data) => {
    if (!data) {
      return "Data pendente";
    }

    return dataConsulta(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const tituloMes = (data) => {
    const titulo = dataConsulta(data).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    return titulo.charAt(0).toUpperCase() + titulo.slice(1);
  };

  const calendarioResumo = (data) => {
    const consultaData = dataConsulta(data);
    const diaSelecionado = consultaData.getDate();
    const inicio = Math.max(1, diaSelecionado - 3);
    const dias = Array.from({ length: 7 }, (_, index) => inicio + index);

    return dias.map((dia, index) => `
      <span class="calendar-day${dia === diaSelecionado ? " selected" : ""}">
        ${index === 0 && dia > 1 ? "..." : dia}
      </span>
    `).join("");
  };

  const renderConsulta = (consulta) => {
    const id = escapeHtml(consulta.id);
    const fileId = `documento-${id}`;
    const motivoId = `motivo-${id}`;
    const mensagens = consulta.mensagens.map((mensagem) => `
      <li class="consulta-message">
        <span></span>
        <div>
          <strong>${escapeHtml(mensagem)}</strong>
          <small>1 hora atrás</small>
        </div>
      </li>
    `).join("");

    return `
      <article class="consulta-card-item" data-consulta-id="${id}">
        <div class="consulta-summary">
          <div class="consulta-summary-content">
            <span class="consulta-summary-id">#${id}</span>
            <h3>${escapeHtml(consulta.especialidade)}</h3>
            <p>${escapeHtml(formatarData(consulta.data))} às ${escapeHtml(consulta.horario)}</p>
            <small>${escapeHtml(consulta.tipoConsulta)} · ${escapeHtml(consulta.local)}</small>
          </div>
          <div class="consulta-summary-actions">
            <button class="consulta-action" type="button" data-action="detalhes">
              Detalhes
            </button>
            <button class="consulta-action danger" type="button" data-action="cancelar">
              Cancelar
            </button>
          </div>
        </div>

        <div class="consulta-complete">
          <div class="consulta-card-flip">
            <section class="consulta-face consulta-face-front">
              <div class="consulta-details-card">
                <div class="consulta-details-header">
                  <h2 class="agendar-title">Verificar informações da Consulta - #${id}</h2>
                  <p class="agendar-description">Você tem ${consulta.mensagens.length} mensagens</p>
                </div>

                <div class="consulta-calendar">
                  <strong>${escapeHtml(tituloMes(consulta.data))}</strong>
                  <div class="calendar-weekdays">
                    <span>Dom</span>
                    <span>Seg</span>
                    <span>Ter</span>
                    <span>Qua</span>
                    <span>Qui</span>
                    <span>Sex</span>
                    <span>Sab</span>
                  </div>
                  <div class="calendar-days">
                    ${calendarioResumo(consulta.data)}
                  </div>
                </div>

                <div class="consulta-notification">
                  <i data-lucide="bell-ring"></i>
                  <div>
                    <strong>Ativar notificação</strong>
                    <p>Enviar notificações no aparelho registrado</p>
                  </div>
                  <button
                    class="notification-toggle${consulta.notificacaoAtiva ? " active" : ""}"
                    type="button"
                    data-action="notificacao"
                    aria-label="Ativar notificação"
                  ></button>
                </div>

                <ul class="consulta-messages">
                  ${mensagens}
                </ul>

                <div class="consulta-detail-actions">
                  <button class="consulta-action" type="button" data-action="resumo">
                    Resumo
                  </button>
                  <button class="consulta-action danger" type="button" data-action="flip-cancelar">
                    Cancelar
                  </button>
                </div>
              </div>
            </section>

            <section class="consulta-face consulta-face-back">
              <form class="agendar-card cancelar-card" data-cancel-form>
                <div class="agendar-header">
                  <div class="agendar-title-group">
                    <h2 class="agendar-title">Cancelar Consulta - #${id}</h2>
                    <h4 class="agendar-description">
                      Seu pedido será cancelado e avaliado pela equipe de integridade da CarePlus.
                    </h4>
                  </div>
                </div>

                <div class="consulta-select-field">
                  <label class="consulta-label" for="${motivoId}">Motivo da ausência</label>
                  <select class="consulta-select" name="motivoAusencia" id="${motivoId}" required>
                    <option value="">Selecione</option>
                    <option value="Conflito de horário">Conflito de horário</option>
                    <option value="Problema de saúde">Problema de saúde</option>
                    <option value="Imprevisto pessoal">Imprevisto pessoal</option>
                    <option value="Outro motivo">Outro motivo</option>
                  </select>
                </div>

                <div class="consulta-file-field">
                  <label class="consulta-label" for="${fileId}">
                    Envie seu documento de justificativa
                  </label>
                  <label class="consulta-file-control" for="${fileId}">
                    <span>Envie o arquivo</span>
                    <strong>Nenhum arquivo...</strong>
                  </label>
                  <input class="consulta-file" type="file" name="documentoConsulta" id="${fileId}" />
                </div>

                <button class="consulta-cancelar" type="submit">
                  <i data-lucide="circle-x"></i>
                  <span>Cancelar Consulta</span>
                </button>

                <button class="consulta-back-detail" type="button" data-action="flip-detalhes">
                  Voltar aos detalhes
                </button>
              </form>
            </section>
          </div>
        </div>
      </article>
    `;
  };

  const atualizarIcones = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const renderConsultas = () => {
    const consultas = consultasAgendadas();
    const total = consultas.length;

    consultasCount.textContent = total === 1
      ? "Você tem 1 consulta agendada"
      : `Você tem ${total} consultas agendadas`;

    consultasEmpty.hidden = total > 0;
    consultasList.innerHTML = consultas.map(renderConsulta).join("");
    atualizarIcones();

    if (!accordionInicializado) {
      abrirAccordion(total > 0 ? "consultas" : "form");
      accordionInicializado = true;
    }

    if (total === 0 && activeAccordion === "consultas") {
      abrirAccordion("form");
    }
  };

  const atualizarConsulta = (id, updater) => {
    const consultas = getConsultas().map((consulta) => (
      consulta.id === id ? updater(consulta) : consulta
    ));

    setConsultas(consultas);
    renderConsultas();
  };

  formAgendar.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(formAgendar);
    const novaConsulta = {
      id: gerarId(),
      nome: formData.get("nome"),
      local: formData.get("local"),
      data: formData.get("data"),
      horario: formData.get("horario"),
      especialidade: formData.get("especialidade"),
      tipoConsulta: formData.get("tipoConsulta"),
      status: "agendada",
      mensagens: ["Sua consulta foi confirmada"],
      notificacaoAtiva: false,
    };

    setConsultas([...getConsultas(), novaConsulta]);
    formAgendar.reset();
    document.querySelector("#consulta-presencial").checked = true;
    renderConsultas();
    abrirAccordion("consultas");
  });

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      abrirAccordion(trigger.dataset.accordionTrigger);
    });
  });

  consultasList.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
      return;
    }

    const card = button.closest(".consulta-card-item");
    const id = card?.dataset.consultaId;

    if (!card || !id) {
      return;
    }

    const action = button.dataset.action;
    const flip = card.querySelector(".consulta-card-flip");

    if (action === "detalhes") {
      card.classList.add("is-expanded");
      flip.classList.remove("is-canceling");
    }

    if (action === "cancelar") {
      card.classList.add("is-expanded");
      flip.classList.add("is-canceling");
    }

    if (action === "resumo") {
      card.classList.remove("is-expanded");
      flip.classList.remove("is-canceling");
    }

    if (action === "flip-cancelar") {
      flip.classList.add("is-canceling");
    }

    if (action === "flip-detalhes") {
      flip.classList.remove("is-canceling");
    }

    if (action === "notificacao") {
      const consultas = getConsultas().map((consulta) => {
        if (consulta.id !== id) {
          return consulta;
        }

        return {
          ...consulta,
          notificacaoAtiva: !consulta.notificacaoAtiva,
        };
      });

      setConsultas(consultas);
      button.classList.toggle("active");
    }
  });

  consultasList.addEventListener("change", (event) => {
    if (!event.target.matches(".consulta-file")) {
      return;
    }

    const fileName = event.target
      .closest(".consulta-file-field")
      .querySelector("strong");

    fileName.textContent = event.target.files[0]?.name || "Nenhum arquivo...";
  });

  consultasList.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.target;
    const card = form.closest(".consulta-card-item");
    const id = card.dataset.consultaId;
    const formData = new FormData(form);

    atualizarConsulta(id, (consulta) => ({
      ...consulta,
      status: "cancelada",
      motivoAusencia: formData.get("motivoAusencia"),
      documentoJustificativa: form.querySelector(".consulta-file").files[0]?.name || "",
    }));
  });

  renderConsultas();
})();
