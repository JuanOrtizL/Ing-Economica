document.addEventListener('DOMContentLoaded', function() {
    // === Referencias a elementos del DOM ===
    // Ya no necesitamos conversionTypeSelect, lo reemplazamos por el contenedor de botones
    const conversionTypeToggle = document.querySelector('.conversion-type-toggle'); 
    
    // Referencias a los formularios individuales
    const formNominalAEfectiva = document.getElementById('form-nominal-a-efectiva');
    const formEfectivaAEfectiva = document.getElementById('form-efectiva-a-efectiva');
    const formEfectivaANominal = document.getElementById('form-efectiva-a-nominal');
    
    // Objeto para mapear los 'data-type' de los botones a los IDs de los formularios
    const formsMap = {
        'nominal-a-efectiva': formNominalAEfectiva,
        'efectiva-a-efectiva': formEfectivaAEfectiva,
        'efectiva-a-nominal': formEfectivaANominal
    };

    const resultadoDiv = document.getElementById('resultado-tasas');

    // === Mapeo de Frecuencias (como ya lo tienes) ===
    const frecuencias = {
        'mensual': 12,
        'bimestral': 6,
        'trimestral': 4,
        'cuatrimestral': 3,
        'semestral': 2,
        'anual': 1
    };

    // --- FUNCIÓN PARA MOSTRAR EL FORMULARIO CORRECTO ---
    function showForm(formIdToShow) {
        // Ocultar todos los formularios
        Object.values(formsMap).forEach(form => {
            if (form) form.classList.add('hidden'); // Asegurarse de que el formulario exista
        });
        resultadoDiv.classList.add('hidden'); // Ocultar el resultado también

        // Mostrar solo el formulario deseado
        const formToShow = formsMap[formIdToShow];
        if (formToShow) {
            formToShow.classList.remove('hidden');
            formToShow.reset(); // Limpiar el formulario al cambiar
        }
    }

    // --- CONTROLADOR PRINCIPAL: Maneja los clics en los botones ---
    if (conversionTypeToggle) { // Asegúrate de que el contenedor de botones exista
        conversionTypeToggle.addEventListener('click', function(event) {
            const clickedButton = event.target.closest('.toggle-btn');
            if (clickedButton) {
                // Remover 'active' de todos los botones en este grupo
                document.querySelectorAll('.conversion-type-toggle .toggle-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                // Añadir 'active' al botón clickeado
                clickedButton.classList.add('active');

                // Obtener el tipo de formulario a mostrar del atributo data-type del botón
                const selectedFormType = clickedButton.dataset.type;
                showForm(selectedFormType); // Llama a la función para mostrar el formulario correcto
            }
        });
    }

    // --- LÓGICA PARA EL FORMULARIO 1: NOMINAL A EFECTIVA ---
    if (formNominalAEfectiva) {
        formNominalAEfectiva.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            const j = parseFloat(formData.get('tasa')) / 100;
            const m1 = frecuencias[formData.get('periodo_conocido')];
            const m2 = frecuencias[formData.get('periodo_deseado')];

            if (isNaN(j) || isNaN(m1) || isNaN(m2) || j <= 0 || m1 <= 0 || m2 <= 0) {
                alert('Por favor, ingrese valores válidos y positivos para todos los campos.');
                resultadoDiv.classList.add('hidden');
                return;
            }

            const i_periodica = j / m1;
            const i_deseada = Math.pow(1 + i_periodica, m1 / m2) - 1;
            
            mostrarResultado(i_deseada, formData.get('periodo_deseado'), 'Efectiva', 'Tasa Efectiva');
        });
    }

    // --- LÓGICA PARA EL FORMULARIO 2: EFECTIVA A EFECTIVA ---
    if (formEfectivaAEfectiva) {
        formEfectivaAEfectiva.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            const i_conocida = parseFloat(formData.get('tasa')) / 100;
            const m1 = frecuencias[formData.get('periodo_conocido')];
            const m2 = frecuencias[formData.get('periodo_deseado')];

            if (isNaN(i_conocida) || isNaN(m1) || isNaN(m2) || i_conocida <= 0 || m1 <= 0 || m2 <= 0) {
                alert('Por favor, ingrese valores válidos y positivos para todos los campos.');
                resultadoDiv.classList.add('hidden');
                return;
            }

            const i_deseada = Math.pow(1 + i_conocida, m1 / m2) - 1;

            mostrarResultado(i_deseada, formData.get('periodo_deseado'), 'Efectiva', 'Tasa Efectiva');
        });
    }

    // --- LÓGICA PARA EL FORMULARIO 3: EFECTIVA A NOMINAL ---
    if (formEfectivaANominal) {
        formEfectivaANominal.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            const i_conocida = parseFloat(formData.get('tasa')) / 100;
            const m1 = frecuencias[formData.get('periodo_conocido')]; // Periodos de la tasa efectiva conocida
            const m2 = frecuencias[formData.get('periodo_deseado')]; // Periodos de capitalización de la nominal deseada

            if (isNaN(i_conocida) || isNaN(m1) || isNaN(m2) || i_conocida <= 0 || m1 <= 0 || m2 <= 0) {
                alert('Por favor, ingrese valores válidos y positivos para todos los campos.');
                resultadoDiv.classList.add('hidden');
                return;
            }

            // Tasa Efectiva Anual (TEA) como puente
            const TEA = Math.pow(1 + i_conocida, m1) - 1;
            
            // Convertir TEA a la Tasa Nominal Anual con capitalización m2
            const j_deseada = m2 * (Math.pow(1 + TEA, (1 / m2)) - 1);

            mostrarResultado(j_deseada, formData.get('periodo_deseado'), 'Nominal', 'Tasa Nominal Anual Capitalizable');
        });
    }

    // --- FUNCIÓN AUXILIAR PARA MOSTRAR EL RESULTADO (Adaptada para el HTML de resultado-tasas) ---
    function mostrarResultado(valor, periodo, tipoTasa, prefijoTitulo) {
        const tasaResultado = valor * 100;
        const periodoTexto = periodo.charAt(0).toUpperCase() + periodo.slice(1);
        
        let tituloFinal = prefijoTitulo;
        if (tipoTasa === 'Nominal') {
            tituloFinal = `${prefijoTitulo} ${periodoTexto}`;
        } else {
            tituloFinal = `${prefijoTitulo} ${periodoTexto}`;
        }

        resultadoDiv.innerHTML = `
            <h3>${tituloFinal}</h3>
            <p id="tasa-convertida">${tasaResultado.toFixed(4)}%</p>
            <small id="tipo-tasa-final"></small>
        `; // La small tag queda vacía, ya que el título ya es descriptivo. Puedes rellenarla si quieres más info.

        resultadoDiv.classList.remove('hidden');
    }

    // === Inicialización al cargar la página ===
    // Muestra el formulario por defecto (Nominal a Efectiva) y activa el botón correspondiente
    const defaultButton = document.querySelector('.conversion-type-toggle .toggle-btn.active');
    if (defaultButton) {
        showForm(defaultButton.dataset.type);
    } else {
        // Fallback si no hay botón activo por defecto (mostrar el primero)
        showForm('nominal-a-efectiva');
        const firstButton = document.querySelector('.conversion-type-toggle .toggle-btn');
        if (firstButton) firstButton.classList.add('active');
    }
});