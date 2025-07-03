document.getElementById("form-capitalizacion").addEventListener("submit", function (e) {
  e.preventDefault();

  const montoFinal = parseFloat(document.getElementById("ahorro-monto").value);
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

  const n = frecuenciaMap[frecuencia];
  const totalPeriodos = unidadPlazo === "anios" ? plazo * n : (plazo / 12) * n;
  const tasaPorPeriodo = tasaAnual / n;

  // Cálculo de la cuota (anualidades ordinarias)
  const cuota = (montoFinal * tasaPorPeriodo) / (Math.pow(1 + tasaPorPeriodo, totalPeriodos) - 1);

  let tablaHTML = "";
  let saldo = 0;

  for (let i = 1; i <= totalPeriodos; i++) {
    const interes = saldo * tasaPorPeriodo;
    saldo += interes + cuota;

    tablaHTML += `
      <tr>
        <td>${i}</td>
        <td>${saldo.toFixed(2)}</td>
        <td>${interes.toFixed(2)}</td>
        <td>${cuota.toFixed(2)}</td>
        <td>${(interes + cuota).toFixed(2)}</td>
      </tr>`;
  }

  document.getElementById("capitalizacion-body").innerHTML = tablaHTML;
  document.getElementById("tabla-capitalizacion-container").classList.remove("hidden");
});
