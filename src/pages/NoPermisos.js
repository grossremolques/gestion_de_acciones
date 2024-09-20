import IconNoPermisos from '@icons/restriction.png'
const NoPermisos = (content) => {
    const view = `
      <div class="m-auto" style="max-width:700px; display: grid; place-items: center; height: 500px;">
        <div class="row align-items-center">
          <div class="col-12 col-md">
            <img src="${IconNoPermisos}" style="width: 100%" alt="">
          </div>
          <div class="col-12 col-md-9 text-center text-md-end">
            <h1>No tienes permisos!</h1>
            <p class="lead">Tu usuario no está habilitado para la gestión de acciones, solo puedes dar de alta.</p>
            <a class="btn btn-dark" href="/#">Ir al inicio</a>
          </div>
        </div>
      </div>
      `;
      content.innerHTML = view;
  };
  export default NoPermisos;