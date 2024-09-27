import { MainTitle } from "@components/Titles";
import {
  inputComponent,
  buttonComponent,
  selectComponent,
} from "@components/Form";
import Table from "@components/Table";
import DataEmployees from "@backend/Employees";
import { permissions } from "@utils/Tools";
import { DataOportunidad, Attributes } from "@backend/Oportunidad";
import IconMejora from '@icons/mejora.png'


let TableOportunidades;
let previousButton;
let nextButton;
let filterButton;

const formFilter = async () => {
  const attributes = await Attributes.getDataInJSON();
  const employees = await DataEmployees.sortEmployees();
  const responsables = await DataEmployees.getResponsables();
  const view = `
    <form class="row g-1 mt-3">
      ${inputComponent({
        col: "1",
        mdCol: 1,
        xlCol: 1,
        type: "number",
        className: "filter",
        placeholder: "Id",
        id: "id",
        name: "id",
        sizes: "sm",
      })}
      ${selectComponent({
        col: "auto",
        mdCol: "auto",
        xlCol: "auto",
        id: "registrado_por",
        name: "registrado_por",
        placeholder: "Registrado por",
        data: employees,
        textNode: "alias",
        className: "filter",
        sizes: "sm",
      })}
      ${inputComponent({
        type: "text",
        className: "filter",
        placeholder: "Aspecto/Detalle de la mejora o riesgo",
        id: "aspecto",
        sizes: "sm",
      })}
      ${selectComponent({
        col: "auto",
        mdCol: "auto",
        xlCol: "auto",
        id: "responsable",
        name: "responsable",
        placeholder: "Responsable",
        data: responsables,
        textNode: "alias",
        className: "filter",
        sizes: "sm",
      })}
      ${selectComponent({
        col: "auto",
        mdCol: "auto",
        xlCol: "auto",
        id: "status",
        name: "status",
        placeholder: "Status",
        data: attributes,
        textNode: "status",
        className: "filter",
        sizes: "sm",
      })}
      ${buttonComponent({
        col: "auto",
        mdCol: "auto",
        xlCol: "auto",
        type: "button",
        color: "primary",
        title: "Filtrar",
        id: "filter",
        sizes: "sm",
      })}
      ${buttonComponent({
        col: "auto",
        mdCol: "auto",
        xlCol: "auto",
        type: "button",
        color: "success",
        title: "Agregar",
        id: "add",
        sizes: "sm",
      })}
    </form>
    `;
  return view;
};
const columns = {
  id: "Id",
  registrado_por: "Registrado por",
  aspecto: "Aspecto",
  responsable: "Responsable",
  status: "Status",
};
const Oportunidades = async (content) => {
  const data = await DataOportunidad.getDataInJSON();
  const permissionsUser = await permissions();
  const codigo_permisos = permissionsUser ? Number(permissionsUser.num) : 0;
  if (codigo_permisos > 0) {
    let newData
    newData = codigo_permisos < 2 ? data.filter(item => item.registrado_por === permissionsUser.alias || item.responsable === permissionsUser.alias) : data;
    TableOportunidades = new Table({
      columns: columns,
      data: newData.reverse(),
      attrId: "id",
      title: 'aspecto'
    });
    const view = `
    ${MainTitle({
      title: "Listado de <em>Oportunidades y Riesgos</em>",
      urlIcon: IconMejora,
    })}
    ${await formFilter()}
    <div class="mt-3">Filtros aplicados: <span id="info-filtersApply">Ninguno</span></div>
    ${TableOportunidades.createTable()}
    `;
    content.innerHTML = view;
    previousButton = document.getElementById("previous");
    nextButton = document.getElementById("next");
    filterButton = document.getElementById("filter");
    const addButton = document.getElementById("add");
    activeListenerRows();

    previousButton.addEventListener("click", handlePreviousButton);
    nextButton.addEventListener("click", handleNextButton);
    filterButton.addEventListener("click", handleFilterButton);
    addButton.addEventListener(
      "click",
      () => (location.hash = "/add-oportunidad")
    );
  }
  else {location.hash = "/no-permissions"}
};
const handlePreviousButton = () => {
  TableOportunidades.previousButton();
  activeListenerRows();
};
const handleNextButton = () => {
  TableOportunidades.nextButton();
  activeListenerRows();
};
const handleFilterButton = () => {
  const valuesFilter = {};
  const itemsFilter = document.querySelectorAll(".filter");
  itemsFilter.forEach((item) => {
    valuesFilter[item.id] = item.value;
  });
  TableOportunidades.filterButton(valuesFilter);
  activeListenerRows();
};
const handleEditData = (event) => {
  const id = event.target.parentNode.id;
  location.hash = `/oportunidad=${id}/`;
};
const activeListenerRows = () => {
  document
    .querySelectorAll(".row-table")
    .forEach((row) => row.addEventListener("click", handleEditData));
};
async function test() {
  const data = await DataEmployees.getDataInJSON()
}
export default Oportunidades;
