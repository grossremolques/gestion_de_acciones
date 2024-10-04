import { MainTitle } from "@components/Titles";
import {
  inputComponent,
  buttonComponent,
  selectComponent,
} from "@components/Form";
import Table from "@components/Table";
//import { DataNoConformidad, Attributes } from "@backend/NoConfomidad";
import DataEmployees from "@backend/Employees";
import IconReject from "@icons/rechazado.png";
import { permissions } from "@utils/Tools";
import {DataSegProveedores, AttributesSP} from "@backend/SeguimientoProveedores";
import { Modal } from "bootstrap";
import IconProveedor from "@icons/supply-man.png";

let TableSegProveedores;
let previousButton;
let nextButton;
let filterButton;

const formFilter = async () => {
  const attributes = await AttributesSP.getDataInJSON();
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
      ${inputComponent({
        col: "1",
        mdCol: 1,
        xlCol: 1,
        type: "text",
        className: "filter",
        placeholder: "Producto",
        id: "producto",
        sizes: "sm",
      })}
      ${inputComponent({
        col: "3",
        mdCol: "3",
        xlCol: "3",
        type: "text",
        className: "filter",
        placeholder: "Proveedor",
        id: "razon_social",
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
    </form>
    `;
  return view;
};
const columns = {
  id: "Id",
  razon_social: "Proveedor",
  articulo: "Producto",
  desvio: "Desvio",
  status: "Status",
};
const SegProveedores = async (content) => {
  try {
    const data = await DataSegProveedores.getData();
    if (typeof data === "object") {
      TableSegProveedores = new Table({
        columns: columns,
        data: data.reverse(),
        attrId: "id",
        title: 'desvio'
      });
      const view = `
    ${MainTitle({
      title: "Listado de <em>Segumiento a proveedores</em>",
      urlIcon: IconProveedor,
    })}
    ${await formFilter()}
    <div class="mt-3">Filtros aplicados: <span id="info-filtersApply">Ninguno</span></div>
    ${TableSegProveedores.createTable()}
    `;
      content.innerHTML = view;
      previousButton = document.getElementById("previous");
      nextButton = document.getElementById("next");
      filterButton = document.getElementById("filter");
      activeListenerRows();

      previousButton.addEventListener("click", handlePreviousButton);
      nextButton.addEventListener("click", handleNextButton);
      filterButton.addEventListener("click", handleFilterButton);
    }
  } catch (e) {
    console.log(e);
  }

  /* const permissionsUser = await permissions();
  const codigo_permisos = permissionsUser ? Number(permissionsUser.num) : 0;
  if (codigo_permisos > 0) {
    let newData
    newData = codigo_permisos < 2 ? data.filter(item => item.registrado_por === permissionsUser.alias || item.responsable === permissionsUser.alias) : data;
    
    
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
  }
  else {location.hash = "/no-permissions"} */
};
const handlePreviousButton = () => {
  TableSegProveedores.previousButton();
  activeListenerRows();
};
const handleNextButton = () => {
  TableSegProveedores.nextButton();
  activeListenerRows();
};
const handleFilterButton = () => {
  const valuesFilter = {};
  const itemsFilter = document.querySelectorAll(".filter");
  itemsFilter.forEach((item) => {
    valuesFilter[item.id] = item.value;
  });
  TableSegProveedores.filterButton(valuesFilter);

  activeListenerRows();
};
const handleEditData = (event) => {
  const id = event.target.parentNode.id;
  location.hash = `/seguimiento_proveedor=${id}/`;
};
const activeListenerRows = () => {
  document
    .querySelectorAll(".row-table")
    .forEach((row) => row.addEventListener("click", handleEditData));
};
export default SegProveedores;
