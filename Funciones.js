document.addEventListener('DOMContentLoaded', () => {
    
 
    const pcGrid = document.querySelector('.pc-grid');

    if (pcGrid) {
        pcGrid.addEventListener('click', (event) => {
            
            if (event.target.tagName === 'BUTTON') {
                const button = event.target;
                const pcCard = button.closest('.pc-card');
                const badge = pcCard.querySelector('.badge');
                const pcNombre = pcCard.querySelector('h4').textContent;

                
                if (badge.classList.contains('ocupado')) {
                   
                    const confirmar = confirm(`¿Desea finalizar la sesión en ${pcNombre}?`);
                    
                    if (confirmar) {
                        badge.classList.remove('ocupado');
                        badge.classList.add('disponible');
                        badge.textContent = 'Disponible'; 
                        
                        button.textContent = 'Iniciar Sesión';
                        button.classList.remove('btn-danger');
                        
                        alert(`Sesión finalizada en ${pcNombre}. El equipo vuelve a estar disponible.`);
                        actualizarEstadoEquipos();
                    }
                } 
                
                else if (badge.classList.contains('disponible')) {
                    badge.classList.remove('disponible');
                    badge.classList.add('ocupado');
                    badge.textContent = 'Ocupado'; 
                    
                    button.textContent = 'Finalizar';
                    button.classList.add('btn-danger');
                    
                    alert(`Sesión iniciada en ${pcNombre}.`);
actualizarEstadoEquipos();
                }
            }
        });
    }

    
    const btnNuevoCliente = document.querySelector('.btn-primary-sm');
    const tablaClientes = document.querySelector('#clientes .data-table tbody');
    const selectCliente = document.getElementById('select-cliente');

    if (btnNuevoCliente && tablaClientes) {
        btnNuevoCliente.addEventListener('click', () => {
            
            const nombre = prompt('Ingrese el nombre del cliente:');
            if (!nombre) return;

            const correo = prompt('Ingrese el correo electrónico del cliente:');
            if (!correo) return;

            
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                <td>${nombre}</td>
                <td>${correo}</td>
                <td>
                    <button class="btn-sm">Editar</button>
                    <button class="btn-sm">Historial</button>
                </td>
            `;
            tablaClientes.appendChild(nuevaFila);

            
            if (selectCliente) {
                const nuevaOpcion = document.createElement('option');
                nuevaOpcion.value = correo;
                nuevaOpcion.textContent = `${nombre} (${correo})`;
                selectCliente.appendChild(nuevaOpcion);
            }

            alert(`Cliente "${nombre}" registrado exitosamente.`);
        });
    }
    const historialSimulado = {
        "Juan Pérez": [
            { pc: "PC-01", fecha: "2026-09-10", tiempo: "2 horas" },
            { pc: "PC-04", fecha: "2026-09-12", tiempo: "1 hora 30 min" }
        ],
        "María González": [
            { pc: "PC-03", fecha: "2026-09-11", tiempo: "45 minutos" },
            { pc: "PC-02", fecha: "2026-09-13", tiempo: "3 horas" }
        ]
    };

   
    const modal = document.getElementById('modal-historial');
    const modalNombre = document.getElementById('modal-cliente-nombre');
    const modalBody = document.getElementById('modal-historial-body');
    const btnCerrar = document.querySelector('.close-modal');
    const tablaClientesBody = document.querySelector('#clientes .data-table tbody');

    
    if (tablaClientesBody) {
        tablaClientesBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-historial')) {
                const fila = event.target.closest('tr');
                const nombreCliente = fila.children[0].textContent.trim();

                
                modalNombre.textContent = `Historial de ${nombreCliente}`;

                
                modalBody.innerHTML = '';

                
                const sesiones = historialSimulado[nombreCliente] || [
                    { pc: "PC-01", fecha: "2026-09-13", tiempo: "1 hora" }
                ];

                
                sesiones.forEach(sesion => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${sesion.pc}</td>
                        <td>${sesion.fecha}</td>
                        <td>${sesion.tiempo}</td>
                    `;
                    modalBody.appendChild(tr);
                });

                
                modal.style.display = 'flex';
            }
        });
    }

    
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    const btnIniciarTiempo = document.getElementById('btn-iniciar-tiempo');
    const selectPc = document.getElementById('select-pc');
    const contenedorTemporizadores = document.getElementById('contenedor-temporizadores');

    if (btnIniciarTiempo && selectPc && selectCliente && contenedorTemporizadores) {
        
        btnIniciarTiempo.addEventListener('click', () => {
            const pcSeleccionado = selectPc.value; 
            const clienteSeleccionado = selectCliente.options[selectCliente.selectedIndex].text; 
            actualizarEstadoEquipos();

            
            const tarjetasPC = document.querySelectorAll('.pc-card');
            let pcCardEncontrada = null;

            tarjetasPC.forEach(card => {
                const titulo = card.querySelector('h4').textContent;
                if (titulo.includes(pcSeleccionado)) {
                    pcCardEncontrada = card;
                }
            });

            
            if (!pcCardEncontrada) {
                alert(`El equipo ${pcSeleccionado} no se encuentra registrado en el mapa.`);
                return;
            }

            const badge = pcCardEncontrada.querySelector('.badge');
            const buttonPC = pcCardEncontrada.querySelector('button');

            
            if (badge.classList.contains('ocupado')) {
                alert(`El equipo ${pcSeleccionado} ya está ocupado.`);
                return;
            }
            if (badge.classList.contains('deshabilitado') || badge.classList.contains('reservado')) {
                alert(`El equipo ${pcSeleccionado} no está disponible actualmente.`);
                return;
            }

            
            badge.classList.remove('disponible');
            badge.classList.add('ocupado');
            badge.textContent = 'Ocupado';

            if (buttonPC) {
                buttonPC.textContent = 'Finalizar';
                buttonPC.classList.add('btn-danger');
            }

            
            const timerDiv = document.createElement('div');
            timerDiv.classList.add('timer-item');
            timerDiv.id = `timer-${pcSeleccionado}`;

            timerDiv.innerHTML = `
                <div class="timer-info">
                    <span class="timer-cliente">${clienteSeleccionado}</span>
                    <span class="timer-pc">Equipo: ${pcSeleccionado}</span>
                    <span class="timer-clock">00:00:00</span>
                </div>
                <button type="button" class="btn-sm btn-danger btn-finalizar-timer">Finalizar</button>
            `;

            contenedorTemporizadores.appendChild(timerDiv);

            
            let segundos = 0;
            const clockSpan = timerDiv.querySelector('.timer-clock');

            const intervaloId = setInterval(() => {
                segundos++;
                const hrs = String(Math.floor(segundos / 3600)).padStart(2, '0');
                const mins = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
                const secs = String(segundos % 60).padStart(2, '0');
                clockSpan.textContent = `${hrs}:${mins}:${secs}`;
            }, 1000);

            
            
            const btnFinalizarTimer = timerDiv.querySelector('.btn-finalizar-timer');
            btnFinalizarTimer.addEventListener('click', () => {
                const confirmar = confirm(`¿Desea finalizar la sesión de ${clienteSeleccionado} en ${pcSeleccionado}?`);
                if (confirmar) {
                    
                    clearInterval(intervaloId); 

                    
                    badge.classList.remove('ocupado');
                    badge.classList.add('disponible');
                    badge.textContent = 'Disponible';

                    if (buttonPC) {
                        buttonPC.textContent = 'Iniciar Sesión';
                        buttonPC.classList.remove('btn-danger');
                    }

                    
                    enviarABoleta(clienteSeleccionado, pcSeleccionado, segundos);

                    
                    timerDiv.remove();
                    actualizarEstadoEquipos();
                }
            });

            alert(`Sesión iniciada correctamente en ${pcSeleccionado}.`);
        });
    }
    
    const TARIFA_POR_HORA = 1500; 

    const selectActiva = document.getElementById('select-activa');
    const boletaCliente = document.getElementById('boleta-cliente');
    const boletaTiempo = document.getElementById('boleta-tiempo');
    const boletaTarifa = document.getElementById('boleta-tarifa');
    const boletaServicios = document.getElementById('boleta-servicios');
    const boletaTotal = document.getElementById('boleta-total');
    const btnCobrar = document.getElementById('btn-cobrar');
    const totalRecaudadoEl = document.getElementById('total-recaudado');
    const tablaHistorialBody = document.querySelector('#historial .data-table tbody');

    
    let montoPendienteCobro = 0;
    let datosSesionActual = null;

    
    function parseMonto(texto) {
        return parseInt(texto.replace(/[^0-9]/g, '')) || 0;
    }

    function formatMonto(numero) {
        return numero.toLocaleString('es-CL');
    }

    
    window.enviarABoleta = function(nombreCliente, pcNombre, segundosTranscurridos) {
       
        const minutos = Math.max(1, Math.ceil(segundosTranscurridos / 60));
        const horasDecimales = minutos / 60;
        const cobroPC = Math.round(horasDecimales * TARIFA_POR_HORA);
        const serviciosExtras = 500; 
        const total = cobroPC + serviciosExtras;

       
        const tiempoTexto = minutos < 60 
            ? `${minutos} min` 
            : `${Math.floor(minutos / 60)} hr ${minutos % 60} min`;

        selectActiva.innerHTML = `<option value="${pcNombre}">${pcNombre} - Cliente: ${nombreCliente}</option>`;
        if (boletaCliente) boletaCliente.textContent = nombreCliente;
        if (boletaTiempo) boletaTiempo.textContent = tiempoTexto;
        if (boletaTarifa) boletaTarifa.textContent = formatMonto(cobroPC);
        if (boletaServicios) boletaServicios.textContent = formatMonto(serviciosExtras);
        if (boletaTotal) boletaTotal.textContent = formatMonto(total);

        montoPendienteCobro = total;
        datosSesionActual = {
            cliente: nombreCliente,
            pc: pcNombre,
            tiempo: tiempoTexto,
            monto: total
        };

        
        const seccionSesiones = document.getElementById('sesiones');
        if (seccionSesiones) {
            seccionSesiones.scrollIntoView({ behavior: 'smooth' });
        }
    };

    
    if (btnCobrar) {
        btnCobrar.addEventListener('click', () => {
            if (montoPendienteCobro === 0 || !datosSesionActual) {
                alert('No hay ninguna sesión activa cargada para cobrar.');
                return;
            }

            
            const totalActual = parseMonto(totalRecaudadoEl.textContent);
            const nuevoTotal = totalActual + montoPendienteCobro;
            
         
            totalRecaudadoEl.textContent = `$${formatMonto(nuevoTotal)}`;

            
            if (tablaHistorialBody) {
                const hoy = new Date().toISOString().split('T')[0];
                const nuevaFila = document.createElement('tr');
                nuevaFila.innerHTML = `
                    <td>${hoy}</td>
                    <td>${datosSesionActual.cliente}</td>
                    <td>${datosSesionActual.pc}</td>
                    <td>${datosSesionActual.tiempo}</td>
                    <td>$${formatMonto(datosSesionActual.monto)}</td>
                `;
                tablaHistorialBody.appendChild(nuevaFila);
            }

            alert(`Cobro realizado con éxito por $${formatMonto(montoPendienteCobro)}. Se ha actualizado el total recaudado del día.`);

            
            selectActiva.innerHTML = `<option value="">-- Sin sesión seleccionada --</option>`;
            if (boletaCliente) boletaCliente.textContent = '-';
            if (boletaTiempo) boletaTiempo.textContent = '0 min';
            if (boletaTarifa) boletaTarifa.textContent = '0';
            if (boletaServicios) boletaServicios.textContent = '0';
            if (boletaTotal) boletaTotal.textContent = '0';
            
            montoPendienteCobro = 0;
            datosSesionActual = null;
        });
    }
    
    function actualizarEstadoEquipos() {
        const pcCards = document.querySelectorAll('.pc-card');
        const statActivas = document.getElementById('stat-sesiones-activas');
        const statDisponibles = document.getElementById('stat-equipos-disponibles');
        const selectPc = document.getElementById('select-pc');

        let ocupados = 0;
        let disponibles = [];

        pcCards.forEach(card => {
            const badge = card.querySelector('.badge');
            const pcNombre = card.querySelector('h4').textContent.trim();
            const ubicacionTexto = card.querySelector('p').textContent.replace('Ubicación:', '').trim();

            if (badge.classList.contains('ocupado')) {
                ocupados++;
            } else if (badge.classList.contains('disponible')) {
                disponibles.push({ nombre: pcNombre, ubicacion: ubicacionTexto });
            }
        });

        
        if (statActivas) statActivas.textContent = ocupados;
        if (statDisponibles) statDisponibles.textContent = disponibles.length;

        
        if (selectPc) {
            selectPc.innerHTML = '';
            if (disponibles.length === 0) {
                const opt = document.createElement('option');
                opt.value = "";
                opt.textContent = "-- Sin equipos libres disponibles --";
                selectPc.appendChild(opt);
            } else {
                disponibles.forEach(pc => {
                    const opt = document.createElement('option');
                    opt.value = pc.nombre;
                    opt.textContent = `${pc.nombre} (${pc.ubicacion})`;
                    selectPc.appendChild(opt);
                });
            }
        }
    }

    actualizarEstadoEquipos();
});

