import {
  inputComponent,
  buttonComponent,
  selectComponent,
  dataListComponent,
  button,
  input,
  label,
  inputGroup,
  selectGroup,
  textarea,
  options,
} from "../components/Form";
import { MainTitle, SubTitle, MiniSubTitle } from "../components/Titles";
import IconFrom from "../assets/icons/checklist.png";
import IconClient from "../assets/icons/client.png";
import IconContencion from "../assets/icons/avoid-problem.png";
import IconGestion from "../assets/icons/gestion.png";
import IconCancelar from "../assets/icons/cancelado.png";
import IconProveedor from "../assets/icons/supply-man.png";
import IconProblemSolving from "../assets/icons/problem-solving.png";
import IconImplemantacion from "../assets/icons/coordinador.png";
import IconVerificacion from "../assets/icons/verificacion.png";
import { DataOportunidad, Attributes } from "../backend/Oportunidad";
import DataEmployees from "../backend/Employees";
import DataAreas from "../backend/Areas";
import MyCustumeModal from "../components/MyCustumeModal";

let isNew;
class Oportunidad {
  constructor() {
    this.modal = new MyCustumeModal(document.querySelector("#modal"));
  }
  async formCompleted() {
    isNew = false;
    const attributes = await Attributes.getDataInJSON();
    const employees = await DataEmployees.sortEmployees();
    const areas = await DataAreas.getDataInJSON();
    const view = `
    <form class="row needs-validation g-1 mt-3 mx-auto border-card" novalidate id="formOportunidad" style="max-width: 1000px">
    ${await this.declaracion(attributes, employees, areas)}
    <div class="row g-1">
    ${await this.cliente(attributes)}   
    </div>
    <div class="row g-1">
      ${await this.contencion(attributes)}
    </div>
      ${await this.gestion(attributes)}
    
    <div class="row g-1">  
        ${await this.implementacion()}
    </div>
    ${await this.verificacion(attributes, employees)}
    </form>
    `;
    return view;
  }
  async formInit() {
    isNew = true;
    const attributes = await Attributes.getDataInJSON();
    const employees = await DataEmployees.sortEmployees();
    const responsables = await DataEmployees.getResponsables();
    console.log(responsables)
    const areas = await DataAreas.getDataInJSON();
    const view = `
    <form class="row needs-validation g-1 mt-3 mx-auto border-card" novalidate id="formOportunidad" style="max-width: 1000px">
      ${await this.declaracion(attributes, employees, areas, responsables)}
    </form>
    `;
    return view;
  }
  async declaracion(attributes, employees, areas, responsables) {
    const view = `
    ${SubTitle({ title: "Declaración", urlIcon: IconFrom })}
    <div class="row g-1">
        ${selectComponent({
          col: "12",
          mdCol: "3",
          xlCol: "3",
          nameLabel: "Registrado por",
          id: "registrado_por",
          name: "registrado_por",
          sizes: "sm",
          data: employees,
          textNode: "fullName",
          value: "alias",
          required: true,
        })}
        ${selectComponent({
          col: "6",
          mdCol: "3",
          xlCol: "3",
          nameLabel: "Área",
          id: "area",
          name: "area",
          sizes: "sm",
          data: areas,
          textNode: "areas",
          required: true,
        })}
        ${selectComponent({
          col: "6",
          mdCol: "3",
          xlCol: "3",
          nameLabel: "Sector",
          id: "sector",
          name: "sector",
          sizes: "sm",
          textNode: "sector",
          required: true,
        })}
        ${selectComponent({
          col: "12",
          mdCol: "3",
          xlCol: "3",
          nameLabel: "Tipo",
          id: "tipo",
          name: "tipo",
          sizes: "sm",
          data: attributes,
          textNode: "tipo",
          required: true,
        })}
        ${textarea({
          col: "12",
          mdCol: "12",
          xlCol: "12",
          nameLabel: "Aspecto",
          id: "aspecto",
          name: "aspecto",
          row: "6",
          sizes: "sm",
          required: true,
        })}
        ${selectComponent({
          col: "12",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Responsable",
          id: "responsable",
          name: "responsable",
          sizes: "sm",
          data: responsables,
          textNode: "fullName",
          value: "alias",
          required: true,
        })}
    </div>`;
    return view;
  }
  async gestion(attributes) {
    const view = `
    ${SubTitle({ title: "Gestión", urlIcon: IconGestion, mt: 4 })}
    <div class="row g-1">
        ${MiniSubTitle({
          title: "Anular",
          urlIcon: IconCancelar,
          mt: 2,
          color: "body-secondary",
        })}
        ${selectComponent({
          col: "2",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Anular",
          id: "anular",
          name: "anular",
          sizes: "sm",
          data: attributes,
          textNode: "si_no",
          required: true,
        })}
        ${textarea({
          col: "10",
          mdCol: "",
          xlCol: "",
          nameLabel: "¿Por qué se anula?",
          id: "comentario_anulacion",
          name: "comentario_anulacion",
          row: "1",
          sizes: "sm",
          required: true,
        })}
        ${inputComponent({
          col: "12",
          mdCol: "auto",
          xlCol: "auto",
          type: "date",
          nameLabel: "Fecha (*)",
          id: "fecha_anulacion",
          name: "fecha_anulacion",
          sizes: "sm",
          required: true,
        })}
    </div>
    <div class="row g-1">
        ${MiniSubTitle({
          title: "Reclamo a proveedor",
          urlIcon: IconProveedor,
          mt: 2,
          color: "body-secondary",
        })}
        ${selectComponent({
          col: "auto",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Reclamo a proveedor",
          id: "reclamo_proveedor",
          name: "reclamo_proveedor",
          sizes: "sm",
          data: attributes,
          textNode: "si_no",
          required: true,
        })}
        ${inputComponent({
          col: "",
          mdCol: "3",
          xlCol: "2",
          type: "number",
          nameLabel: "ID Prov",
          id: "id_prov",
          name: "id_prov",
          sizes: "sm",
          required: true,
        })}
        ${inputComponent({
          col: "12",
          mdCol: "",
          xlCol: "",
          type: "text",
          nameLabel: "Razón Social",
          id: "razon_social_prov",
          name: "razon_social_prov",
          sizes: "sm",
          readonly: true,
        })}
    </div>
    <div class="row g-1">  
        ${MiniSubTitle({
          title: "Definición de Acciones correctivas",
          urlIcon: IconProblemSolving,
          mt: 2,
          color: "body-secondary",
        })}
        ${selectComponent({
          col: "12",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Req. Acción Corectiva",
          id: "requiere_acc",
          name: "requiere_acc",
          sizes: "sm",
          data: attributes,
          textNode: "si_no",
          required: true,
        })}
        ${textarea({
          col: "12",
          mdCol: "",
          xlCol: "",
          nameLabel: "¿Por qué no requiere acción correctiva?",
          id: "justificacion_no_acc",
          name: "justificacion_no_acc",
          row: "1",
          sizes: "sm",
          required: true,
        })}
    </div>
    <div class="row g-1">  
        ${textarea({
          col: "12",
          mdCol: "",
          xlCol: "",
          nameLabel: "Causa",
          id: "causa",
          name: "causa",
          row: "1",
          sizes: "sm",
          required: true,
        })}
        ${textarea({
          col: "12",
          mdCol: "",
          xlCol: "",
          nameLabel: "Acción correctiva",
          id: "accion_correctiva",
          name: "accion_correctiva",
          row: "1",
          sizes: "sm",
          required: true,
        })}
        ${inputComponent({
          col: "12",
          mdCol: "auto",
          xlCol: "auto",
          type: "date",
          nameLabel: "Fecha plazo",
          id: "fecha_plazo",
          name: "fecha_plazo",
          sizes: "sm",
          required: true,
        })}
    </div>
    `;
    return view;
  }
  async implementacion() {
    const view = `
    ${SubTitle({
      title: "Implementación",
      urlIcon: IconImplemantacion,
      mt: 4,
    })}
    ${inputComponent({
      col: "auto",
      mdCol: "auto",
      xlCol: "auto",
      type: "date",
      nameLabel: "Fecha impl. (*)",
      id: "fecha_impl",
      name: "fecha_impl",
      sizes: "sm",
      required: true,
    })}
    ${textarea({
      col: "",
      mdCol: "",
      xlCol: "",
      nameLabel: "Comentarios de Implementación",
      id: "comentarios_impl",
      name: "comentarios_impl",
      row: "1",
      sizes: "sm",
      required: true,
    })}
    `;
    return view;
  }
  async verificacion(attributes, employees) {
    const view = `
    ${SubTitle({
      title: "Verificación de Eficacia",
      urlIcon: IconVerificacion,
      mt: 4,
    })}
    <div class="row g-1">  
        ${textarea({
          col: "12",
          mdCol: "",
          xlCol: "",
          nameLabel: "Metodología",
          id: "met_verif_ef",
          name: "met_verif_ef",
          row: "1",
          sizes: "sm",
          required: true,
          placeholder: "Indique la metodología de verificación de eficacia",
        })}
        ${selectComponent({
          col: "6",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Responsable",
          id: "responsable_ef",
          name: "responsable_ef",
          sizes: "sm",
          data: employees,
          textNode: "fullName",
          value: "alias",
          required: true,
        })}
        ${inputComponent({
          col: "6",
          mdCol: "auto",
          xlCol: "auto",
          type: "date",
          nameLabel: "Fecha prevista",
          id: "fecha_prev_ef",
          name: "fecha_prev_ef",
          sizes: "sm",
          required: true,
        })}
        </div>
        <div class="row g-1"> 
            ${selectComponent({
              col: "auto",
              mdCol: "auto",
              xlCol: "auto",
              nameLabel: "Resultado",
              id: "resultado_ef",
              name: "resultado_ef",
              sizes: "sm",
              data: attributes,
              textNode: "resultado_ef",
              required: true,
            })}
            ${textarea({
              col: "",
              mdCol: "",
              xlCol: "",
              nameLabel: "Comentarios de verificación de eficacia",
              id: "comentario_ef",
              name: "comentario_ef",
              row: "1",
              sizes: "sm",
              required: true,
            })}
            ${inputComponent({
              col: "12",
              mdCol: "auto",
              xlCol: "auto",
              type: "date",
              nameLabel: "Fecha VEF",
              id: "fecha_ef",
              name: "fecha_ef",
              sizes: "sm",
              required: true,
            })}
        </div>
    `;
    return view;
  }
  async setting() {
    const user = await DataEmployees.getActiveUser();
    //Inputs
    const registrado_por = document.querySelector("#registrado_por");
    const area = document.querySelector("#area");
    //Acciones
    registrado_por.value = user.alias;
    area.addEventListener("change", this.getSectores);
    

  }
  async getSectores(event) {
    const area = event.target.value;
    try {
      const sectores = await DataAreas.getSectoresByArea(area);
      const input = document.querySelector("#sector");
      const optionsSectores = options({ data: sectores, textNode: "sector" }); //options({ data: sectores, textNode: "sector" });
      input.innerHTML = optionsSectores;
    } catch (e) {
      console.log(e);
    }
  }
  
  modify(props) {
    const input = document.querySelector(`#${props.idInput}`);
    if(input) {
    input.toggleAttribute("disabled", props.validation);
      input.value = props.validation
      ? props.valueDafault
        ? props.valueDafault
        : 0
      : "";
  }}
}
export default Oportunidad;
