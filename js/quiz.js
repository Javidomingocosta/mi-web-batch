(() => {
  const form = document.getElementById("quizForm");
  const result = document.getElementById("result");
  const certName = document.getElementById("certName");
  const certDate = document.getElementById("certDate");
  const printBtn = document.getElementById("printBtn");

  if (!form) return;

  const today = new Date();
  const niceDate = today.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });

  function scoreAnswers(data) {
    // Respuestas correctas (puedes cambiarlas)
    const key = {
      q1: "b",  // Batch se ejecuta con cmd.exe
      q2: "a",  // set variable=valor
      q3: "c",  // if exist archivo (...)
      q4: "b",  // for %%i in (...) do ...
      q5: "a"   // echo off oculta comandos
    };
    let score = 0;
    Object.keys(key).forEach(k => {
      if (data.get(k) === key[k]) score++;
    });
    return score;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();

    if (!name) {
      result.textContent = "Escribe tu nombre para poder emitir el certificado.";
      result.style.color = "rgba(255,190,190,.95)";
      return;
    }

    const score = scoreAnswers(data);
    const total = 5;
    const pass = score >= 4;

    if (!pass) {
      result.textContent = `Resultado: ${score}/${total}. Necesitas 4/5 para aprobar. Repasa el curso y vuelve a intentarlo.`;
      result.style.color = "rgba(255,210,150,.95)";
      certName.textContent = "—";
      certDate.textContent = "—";
      printBtn.disabled = true;
      printBtn.style.opacity = ".5";
      return;
    }

    // Aprobado
    result.textContent = `¡Aprobado! ${score}/${total}. Certificado generado abajo.`;
    result.style.color = "rgba(190,255,210,.95)";

    certName.textContent = name;
    certDate.textContent = niceDate;

    // guarda para que se mantenga si recarga
    localStorage.setItem("batchCertName", name);
    localStorage.setItem("batchCertDate", niceDate);

    printBtn.disabled = false;
    printBtn.style.opacity = "1";
  });

  // Cargar certificado anterior
  const savedName = localStorage.getItem("batchCertName");
  const savedDate = localStorage.getItem("batchCertDate");
  if (savedName && savedDate) {
    certName.textContent = savedName;
    certDate.textContent = savedDate;
    printBtn.disabled = false;
    printBtn.style.opacity = "1";
  }

  printBtn?.addEventListener("click", () => window.print());
})();
