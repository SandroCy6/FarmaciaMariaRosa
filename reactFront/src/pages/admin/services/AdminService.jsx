const API_BASE = "http://127.0.0.1:8081/api";

const fetchOptions = {
  headers: {
    "Content-Type": "application/json",
  },
};

// ==================== LOTES ====================

export const obtenerLotes = async () => {
  try {
    const response = await fetch(`${API_BASE}/lotes`, {
      method: "GET",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error cargando lotes:", error);
    throw error;
  }
};

export const crearLote = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/lotes`, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creando lote:", error);
    throw error;
  }
};

export const actualizarLote = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE}/lotes/${id}`, {
      method: "PUT",
      ...fetchOptions,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error actualizando lote:", error);
    throw error;
  }
};

export const eliminarLote = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/lotes/${id}`, {
      method: "DELETE",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error eliminando lote:", error);
    throw error;
  }
};

// ==================== CLIENTES ====================

export const obtenerClientes = async () => {
  try {
    const response = await fetch(`${API_BASE}/clientes`, {
      method: "GET",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error cargando clientes:", error);
    throw error;
  }
};

export const actualizarCliente = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE}/clientes/${id}`, {
      method: "PUT",
      ...fetchOptions,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error actualizando cliente:", error);
    throw error;
  }
};

// ==================== PRODUCTOS ====================

export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_BASE}/productos`, {
      method: "GET",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error cargando productos:", error);
    throw error;
  }
};

export const crearProducto = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/productos`, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creando producto:", error);
    throw error;
  }
};

export const actualizarProducto = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE}/productos/${id}`, {
      method: "PUT",
      ...fetchOptions,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error actualizando producto:", error);
    throw error;
  }
};

export const eliminarProducto = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/productos/${id}`, {
      method: "DELETE",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error eliminando producto:", error);
    throw error;
  }
};

// ==================== CATEGORÍAS ====================

export const obtenerCategorias = async () => {
  try {
    const response = await fetch(`${API_BASE}/categorias`, {
      method: "GET",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error cargando categorías:", error);
    throw error;
  }
};

export const crearCategoria = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/categorias`, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creando categoría:", error);
    throw error;
  }
};

export const actualizarCategoria = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE}/categorias/${id}`, {
      method: "PUT",
      ...fetchOptions,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error actualizando categoría:", error);
    throw error;
  }
};

export const eliminarCategoria = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/categorias/${id}`, {
      method: "DELETE",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    throw error;
  }
};

export const obtenerReservas = async () => {
  try {
    const response = await fetch(`${API_BASE}/reservas`, {
      method: "GET",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error cargando reservas:", error);
    throw error;
  }
};

export const obtenerReservaPorId = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/reservas/${id}`, {
      method: "GET",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error cargando reserva:", error);
    throw error;
  }
};

export const crearReserva = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/reservas`, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creando reserva:", error);
    throw error;
  }
};

export const actualizarReserva = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE}/reservas/${id}`, {
      method: "PUT",
      ...fetchOptions,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error actualizando reserva:", error);
    throw error;
  }
};

export const eliminarReserva = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/reservas/${id}`, {
      method: "DELETE",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error eliminando reserva:", error);
    throw error;
  }
};
export const obtenerMensajes = async () => {
  try {
    const response = await fetch(`${API_BASE}/mensajes`, {
      method: "GET",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error cargando mensajes:", error);
    throw error;
  }
};

export const obtenerMensajePorId = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/mensajes/${id}`, {
      method: "GET",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error cargando mensaje:", error);
    throw error;
  }
};

export const eliminarMensaje = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/mensajes/${id}`, {
      method: "DELETE",
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error eliminando mensaje:", error);
    throw error;
  }
};
