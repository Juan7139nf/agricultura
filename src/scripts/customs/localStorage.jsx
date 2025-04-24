const obtenerUsuarioDeLocalStorage = () => {
  const usuario = localStorage.getItem("user");
  return usuario ? JSON.parse(usuario) : null;
};

export { obtenerUsuarioDeLocalStorage };
