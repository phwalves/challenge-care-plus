(() => {
  const STORAGE_KEY = "carePlusConsultas";
  const flipCard = document.querySelector("#agendar-flip");
  const formAgendar = document.querySelector("#form-agendar");
  const formCancelar = document.querySelector("#form-cancelar");
  const consultaSelect = document.querySelector("#consulta-cancelar");
  const consultaTitleId = document.querySelector("#consulta-cancelar-id");
  const emptyMessage = document.querySelector("#consulta-empty");
  const fileInput = document.querySelector("#documento-justificativa");
  const fileName = document.querySelector("#consulta-file-name");

  const consultasMock = [
    {
      id: "78AF",
      nome: "Pedro Duarte",
      local: "@peduarte",
      data: "2026-06-10",
      horario: "10:00",
      especialidade: "Cardiologia",
      tipoConsulta: "Consulta presencial",
      status: "agendada",
    },
  ];

  const getConsultas = () => {
    const consultas = localStorage.getItem(STORAGE_KEY);

    if (!consultas) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consultasMock));
      return consultasMock;
    }

    return JSON.parse(consultas);
  };

  const setConsultas = (consultas) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consultas));
  };

  const gerarId = () => {
    const chars = "0123456789ABCDEF";
    return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const consultasAgendadas = () => getConsultas().filter((consulta) => consulta.status === "agendada");

  const atualizarCancelamento = () => {
    const consultas = consultasAgendadas();
    consultaSelect.innerHTML = "";

    consultas.forEach((consulta) => {
      const option = document.createElement("option");
      option.value = consulta.id;
      option.textContent = `#${consulta.id} - ${consulta.especialidade} às ${consulta.horario}`;
      consultaSelect.appendChild(option);
    });

    const hasConsultas = consultas.length > 0;
    consultaSelect.disabled = !hasConsultas;
    formCancelar.querySelector(".consulta-cancelar").disabled = !hasConsultas;
    emptyMessage.hidden = hasConsultas;
    consultaTitleId.textContent = hasConsultas ? consultas[0].id : "----";
  };

  document.querySelectorAll("[data-flip-card]").forEach((button) => {
    button.addEventListener("click", () => {
      flipCard.classList.toggle("is-flipped");
      atualizarCancelamento();
    });
  });

  consultaSelect.addEventListener("change", () => {
    consultaTitleId.textContent = consultaSelect.value || "----";
  });

  fileInput.addEventListener("change", () => {
    fileName.textContent = fileInput.files[0]?.name || "Nenhum arquivo...";
  });

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
    };

    setConsultas([...getConsultas(), novaConsulta]);
    formAgendar.reset();
    document.querySelector("#consulta-presencial").checked = true;
    atualizarCancelamento();
    consultaSelect.value = novaConsulta.id;
    consultaTitleId.textContent = novaConsulta.id;
    flipCard.classList.add("is-flipped");
  });

  formCancelar.addEventListener("submit", (event) => {
    event.preventDefault();

    const consultaId = consultaSelect.value;
    const consultas = getConsultas().map((consulta) => {
      if (consulta.id !== consultaId) {
        return consulta;
      }

      return {
        ...consulta,
        status: "cancelada",
        motivoAusencia: document.querySelector("#motivo-ausencia").value,
        documentoJustificativa: fileInput.files[0]?.name || "",
      };
    });

    setConsultas(consultas);
    formCancelar.reset();
    fileName.textContent = "Nenhum arquivo...";
    atualizarCancelamento();
  });

  atualizarCancelamento();
})();
