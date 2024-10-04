import { MainTitle } from "@components/Titles";
import {
  inputComponent,
  buttonComponent,
  selectComponent,
} from "@components/Form";
import Table from "@components/Table";
import { DataNoConformidad, Attributes } from "@backend/NoConfomidad";
import DataEmployees from "@backend/Employees";
import IconReject from "@icons/rechazado.png";
import { permissions } from "@utils/Tools";

let TableTrailers;
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
        sizes: "sm",
      })}
      ${selectComponent({
        col: "auto",
        mdCol: "auto",
        xlCol: "auto",
        id: "tipo_desvio",
        name: "tipo_desvio",
        placeholder: "Tipo de desvío",
        data: attributes,
        textNode: "tipo_desvio",
        className: "filter",
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
        placeholder: "Desvío",
        id: "desvio",
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
  tipo_desvio: "Tipo",
  desvio: "Desvio",
  responsable: "Responsable",
  status: "Status",
};
const NoConformidades = async (content) => {
  
  const data = await DataNoConformidad.getDataInJSON();
  const total = data.filter(item => item.responsable === '').length;
  const permissionsUser = await permissions();
  const codigo_permisos = permissionsUser ? Number(permissionsUser.num) : 0;
  if (codigo_permisos > 0) {
    let newData
    newData = codigo_permisos < 2 ? data.filter(item => item.registrado_por === permissionsUser.alias || item.responsable === permissionsUser.alias) : data;
    TableTrailers = new Table({
      columns: columns,
      data: newData.reverse(),
      attrId: "id",
      title: 'desvio'
    });
    const view = `
    ${MainTitle({
      title: "Listado de <em>Salidas No Conformes</em>",
      urlIcon: IconReject,
    })}
    ${await formFilter()}
    <div class="mt-3">Filtros aplicados: <span id="info-filtersApply">Ninguno</span></div>
    ${TableTrailers.createTable()}
    <div class="mt-5 mb-2 text-end">
      <span class="badge text-bg-danger">Total NC Sin Responsable: </span>
      <span class="badge text-bg-dark" id="total-sin-resp"></span>
    </div>
    
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
      () => (location.hash = "/add-no-confomidad")
    );
    const totalNC = document.getElementById('total-sin-resp')
    totalNC.textContent = total 
  }
  else {location.hash = "/no-permissions"}
};
const handlePreviousButton = () => {
  TableTrailers.previousButton();
  activeListenerRows();
};
const handleNextButton = () => {
  TableTrailers.nextButton();
  activeListenerRows();
};
const handleFilterButton = () => {
  const valuesFilter = {};
  const itemsFilter = document.querySelectorAll(".filter");
  itemsFilter.forEach((item) => {
    valuesFilter[item.id] = item.value;
  });
  TableTrailers.filterButton(valuesFilter);
  
  activeListenerRows();
};
const handleEditData = (event) => {
  const id = event.target.parentNode.id;
  location.hash = `/no-conformidad=${id}/`;
};
const activeListenerRows = () => {
  document
    .querySelectorAll(".row-table")
    .forEach((row) => row.addEventListener("click", handleEditData));
};
export default NoConformidades;
