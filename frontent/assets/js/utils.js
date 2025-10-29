async function cargarDatosGenerico({
  url,
  tablaId,
  columnas = 1,
  callbackMostrarDatos,
  callbackEstadisticas,
}) {
  const tbody = document.querySelector(`#${tablaId} tbody`);
  try {
    // Mostrar spinner de carga
    tbody.innerHTML = `
      <tr>
        <td colspan="${columnas}" class="text-center">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </td>
      </tr>
    `;

    // Llamada al backend
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al cargar datos desde ${url}`);

    // Convertir respuesta
    const datos = await response.json();

    // Actualizar estadísticas si se pasa callback
    if (callbackEstadisticas) callbackEstadisticas(datos);

    // Mostrar datos en tabla
    callbackMostrarDatos(datos);
  } catch (error) {
    console.error(error);
    tbody.innerHTML = `
      <tr>
        <td colspan="${columnas}" class="text-center text-danger">
          <i class="bi bi-exclamation-triangle"></i> Error al cargar datos.
        </td>
      </tr>
    `;
  }
}
