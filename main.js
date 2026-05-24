// Desplazamiento suave al menú
document.getElementById("verMenu").addEventListener("click", function(){
    document.getElementById("platillos").scrollIntoView({
        behavior: "smooth"
    });
});

// Formateo automático de teléfono salvadoreño (####-####)
document.getElementById('telefono').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 4) v = v.slice(0,4) + '-' + v.slice(4);
    this.value = v;
});

// Asignación visual instantánea al tipear número de personas
document.getElementById('personas').addEventListener('input', function () {
    const n = parseInt(this.value);
    const badge = document.getElementById('mesa-badge');
    if (!isNaN(n) && n >= 1 && n <= 20) {
        document.getElementById('mesa-num').textContent = asignarMesa(n);
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
});

// Lógica de asignación de mesas según capacidad
function asignarMesa(n) {
    if (n <= 2)  return 'Mesa 1 — Íntima (2 pers.)';
    if (n <= 4)  return 'Mesa 2 — Estándar (4 pers.)';
    if (n <= 6)  return 'Mesa 3 — Grupal (6 pers.)';
    if (n <= 10) return 'Mesa 4 — Salón Privado (10 pers.)';
    return 'Mesa 5 — Salón Grande (hasta 20 pers.)';
}

// Formateo estético de fecha en español
function formatearFecha(f) {
    const [y, m, d] = f.split('-');
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${parseInt(d)} de ${meses[parseInt(m)-1]} de ${y}`;
}

// Formateo de hora a formato 12 horas (AM/PM)
function formatearHora(h) {
    const [hh, mm] = h.split(':');
    const hora = parseInt(hh);
    const ampm = hora >= 12 ? 'p.m.' : 'a.m.';
    const hora12 = hora % 12 || 12;
    return `${hora12}:${mm} ${ampm}`;
}

// Helper para alternar visualmente los estados de error
function setError(id, errId, hasError) {
    document.getElementById(id).classList[hasError ? 'add' : 'remove']('error');
    document.getElementById(errId).classList[hasError ? 'add' : 'remove']('visible');
    return !hasError;
}

// Validación integral del formulario
function validar() {
    const nombre   = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const personas = parseInt(document.getElementById('personas').value);
    const fecha    = document.getElementById('fecha').value;
    const hora     = document.getElementById('hora').value;

    const hoy = new Date(); 
    hoy.setHours(0,0,0,0);
    const fechaDate = fecha ? new Date(fecha + 'T00:00:00') : null;

    let ok = true;
    ok = setError('nombre',   'err-nombre',   nombre.length < 2) && ok;
    ok = setError('telefono', 'err-telefono', !/^\d{4}-\d{4}$/.test(telefono)) && ok;
    ok = setError('personas', 'err-personas', isNaN(personas) || personas < 1 || personas > 20) && ok;
    ok = setError('fecha',    'err-fecha',    !fechaDate || fechaDate < hoy) && ok;
    ok = setError('hora',     'err-hora',     !hora) && ok;
    return ok;
}

// Acción principal: procesar reservación
function reservar() {
    if (!validar()) return;

    const nombre   = document.getElementById('nombre').value.trim();
    const personas = parseInt(document.getElementById('personas').value);
    const fecha    = document.getElementById('fecha').value;
    const hora     = document.getElementById('hora').value;
    const mesa     = asignarMesa(personas);

    // Inyectar datos en la tarjeta de éxito
    document.getElementById('conf-nombre-texto').textContent = nombre;
    document.getElementById('conf-fecha').textContent        = formatearFecha(fecha);
    document.getElementById('conf-hora').textContent         = formatearHora(hora);
    document.getElementById('conf-personas').textContent     = personas + (personas === 1 ? ' persona' : ' personas');
    document.getElementById('conf-mesa').textContent         = mesa;

    // Lanzar animación fluida
    const conf = document.getElementById('confirmacion');
    conf.classList.remove('visible');       
    conf.style.display = 'none';
    void conf.offsetWidth; // Trigger reflow para reiniciar CSS animation                 
    conf.style.display = 'block';
    conf.classList.add('visible');
    conf.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Funcionalidad básica Modo Oscuro
document.getElementById('modoOscuro').addEventListener('click', () => {
    document.body.classList.toggle('oscuro');
});

// Activar modo oscuro al tocar cualquier platillo
document.querySelectorAll('.card-platillo').forEach(platillo => {
    platillo.addEventListener('click', () => {
        document.body.classList.toggle('oscuro');
    });
});