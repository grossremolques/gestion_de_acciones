import { MainTitle } from "@components/Titles";
import IconReject from '@icons/rechazado.png'
import IconMejora from '@icons/mejora.png'
const Home = (content) => {
  const view = `
      <div class="container row g-3 mx-auto" style="max-width: 600px">
      ${MainTitle({title:'Gestión de acciones'})}
      <div class="col-12">
        ${card({text_btn:'Agregar no conformidad', img: IconReject, title: 'No conformidades', color: 'danger', link: '#/add-no-confomidad'})}
      </div>
      <div class="col-12">
        ${card({text_btn:'Agregar oportunidad de mejora', img: IconMejora, title: 'Oportunidades de mejoras', color: 'success', link: '#/add-oportunidad'})}
      </div>
      `;
  content.innerHTML = view;
};
const card = (props) => {
  const view = `
  <div class="card mb-3">
  <div class="row g-0">
    <div class="col-md-4 text-center">
      <img src="${props.img}" class="img-fluid rounded-start p-3" alt="..." style="max-width: 170px;">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${props.title}</h5>
        <p class="card-text"></p>
        <a href="${props.link}" class="btn btn-${props.color}">Agregar</a>
      </div>
    </div>
  </div>
</div>
  `
  return view
}
export default Home;
