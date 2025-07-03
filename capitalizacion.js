document.getElementById("form-capitalizacion").addEventListener("submit", function (e) {
  e.preventDefault();

  const montoInicial = parseFloat(document.getElementById("ahorro-monto").value);
  const tasaAnual = parseFloat(document.getElementById("ahorro-tasa").value) / 100;
  const plazo = parseFloat(document.getElementById("ahorro-plazo").value);
  const unidadPlazo = document.getElementById("ahorro-plazo-unidad").value;
  const frecuencia = document.getElementById("ahorro-frecuencia").value;

  const frecuenciaMap = {
    mensual: 12,
    bimestral: 6,
    trimestral: 4,
    semestral: 2,
    anual: 1,
  };

  const n = frecuenciaMap[frecuencia]; // Número de periodos por año
  const totalPeriodos = unidadPlazo === "anios" ? plazo * n : plazo * (n / 12);
  const tasaPorPeriodo = tasaAnual / n;

  let tablaHTML = "";
  let capital = montoInicial;

  for (let i = 1; i <= totalPeriodos; i++) {
    const interes = montoInicial * tasaPorPeriodo;
    capital += interes;

    tablaHTML += `
      <tr>
        <td>${i}</td>
        <td>${montoInicial.toFixed(2)}</td>
        <td>${interes.toFixed(2)}</td>
        <td>${capital.toFixed(2)}</td>
      </tr>`;
  }

  document.getElementById("capitalizacion-body").innerHTML = tablaHTML;
  document.getElementById("tabla-capitalizacion-container").classList.remove("hidden");
});
