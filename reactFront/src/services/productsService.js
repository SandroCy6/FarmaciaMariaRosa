// Obtener productos de localStorage (admin) o JSON
export const getProducts = async () => {
  if (localStorage.getItem('adminProducts')) {
    return JSON.parse(localStorage.getItem('adminProducts'));
  } else {
    try {
      const res = await fetch('./data/products.json');
      return await res.json();
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }
};

// Seleccionar los 4 productos mejor calificados (aleatorio entre los 8 mejores)
export const pickBestRated = (products, count = 4) => {
  const sorted = products.slice().sort((a, b) => b.rating - a.rating);
  const top = sorted.slice(0, 8);
  // Shuffle
  for (let i = top.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [top[i], top[j]] = [top[j], top[i]];
  }
  return top.slice(0, count);
};
