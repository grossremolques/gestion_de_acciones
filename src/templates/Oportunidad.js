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
import IconAnalisis from "../assets/icons/analisis.png";
import IconPlanDeAccion from "../assets/icons/plan-de-accion.png";
import IconImplemantacion from "../assets/icons/coordinador.png";
import { DataOportunidad, Attributes } from "../backend/Oportunidad";
import DataEmployees from "../backend/Employees";
import DataAreas from "../backend/Areas";
import MyCustumeModal from "../components/MyCustumeModal";
import IconVerificacion from "../assets/icons/verificar.png";
import IconPlanVrif from "../assets/icons/lupa.png";
import { settingInputs } from "../utils/Tools";

let isNew;
class Oportunidades {
  constructor() {
    this.modal = new MyCustumeModal(document.getElementById("modal"));
  }
  async formCompleted(completed) {
    isNew = false;
    const attributes = await Attributes.getDataInJSON();
    const employees = await DataEmployees.sortEmployees();
    const areas = await DataAreas.getDataInJSON();
    const responsables = await DataEmployees.getResponsables();
    const view = `
    <form class="row needs-validation g-1 mt-3 mx-auto border-card" novalidate id="formOportunidad" style="max-width: 1000px">
    ${await this.declaracion(
      attributes,
      employees,
      areas,
      responsables,
      completed
    )}
    ${await this.gestion(attributes)}
    ${await this.implementacion(employees)}
    ${await this.verificacion(attributes )}
    </form>
    `;
    return view;
  }
  async formInit() {
    isNew = true;
    const attributes = await Attributes.getDataInJSON();
    const employees = await DataEmployees.sortEmployees();
    const responsables = await DataEmployees.getResponsables();
    const areas = await DataAreas.getDataInJSON();
    const view = `
    <form class="row needs-validation g-1 mt-3 mx-auto border-card" novalidate id="formOportunidad" style="max-width: 1000px">
      ${await this.declaracion(attributes, employees, areas, responsables)}
    </form>
    `;
    return view;
  }
  async declaracion(attributes, employees, areas, responsables, completed) {
    const view = `
    ${SubTitle({ title: "Declaración", urlIcon: IconFrom })}
    <div class="row g-1">
      ${
        completed
          ? `
        ${inputComponent({
          col: "auto",
          mdCol: "auto",
          xlCol: "auto",
          type: "date",
          nameLabel: "Fecha",
          id: "fecha",
          name: "fecha",
          sizes: "sm",
          readonly: true,
        })}
        `: ""
      }
      ${selectComponent({
        col: "",
        mdCol: "",
        xlCol: "",
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
        mdCol: "",
        xlCol: "",
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
        mdCol: "",
        xlCol: "",
        nameLabel: "Sector",
        id: "sector",
        name: "sector",
        sizes: "sm",
        textNode: "sector",
        required: true,
      })}
      ${selectComponent({
        col: "12",
        mdCol: "",
        xlCol: "",
        nameLabel: "Tipo",
        id: "tipo",
        name: "tipo",
        sizes: "sm",
        data: attributes,
        textNode: "tipo",
        required: true,
      })}
    </div>
    <div class="row g-1">
      ${textarea({
        col: "12",
        mdCol: "12",
        xlCol: "12",
        nameLabel: "Aspecto o Detalles de la Oportunidad/Riesgo",
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
          title: "Análisis",
          urlIcon: IconAnalisis,
          mt: 2,
          color: "body-secondary",
        })}
        ${textarea({
          col: "12",
          mdCol: "12",
          xlCol: "12",
          nameLabel: "Causa",
          id: "causa",
          name: "causa",
          row: "1",
          sizes: "sm",
          required: true,
        })}
        ${selectComponent({
          col: "auto",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "FODA",
          id: "foda",
          name: "foda",
          sizes: "sm",
          data: attributes,
          textNode: "foda",
          required: true,
        })}
        ${textarea({
          col: "12",
          mdCol: "",
          xlCol: "",
          nameLabel: "Analisi FODA",
          id: "analisis_foda",
          name: "analisis_foda",
          row: "1",
          sizes: "sm",
          required: true,
        })}
    </div>
    <div class="row g-1">  
        ${MiniSubTitle({
          title: "Plan de acción",
          urlIcon: IconPlanDeAccion,
          mt: 2,
          color: "body-secondary",
        })}
        ${textarea({
          col: "12",
          mdCol: "",
          xlCol: "",
          nameLabel: "Acciones a tomar",
          id: "accion",
          name: "accion",
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
  async implementacion(employees) {
    const view = `
    <div class="d-flex justify-content-between align-items-end mt-3">
      ${SubTitle({ title: "Implementación", urlIcon: IconImplemantacion })}
      <div class="form-check form-switch mb-2">
        <input class="form-check-input" type="checkbox" role="switch" id="completarImplementacion">
        <label class="form-check-label small text-danger" for="completarImplementacion">Agregar más tarde</label>
      </div>
    </div>
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
      className: "gestion",
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
      className: "gestion",
    })}
    <div class="row g-1">  
     ${MiniSubTitle({
       title: "Parametros de la verificacón de eficacia",
       urlIcon: IconPlanVrif,
       mt: 2,
       color: "body-secondary",
     })}
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
        className: "gestion",
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
        className: "gestion",
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
        className: "gestion",
      })}
    </div>
    `;
    return view;
  }
  async verificacion(attributes) {
    const view = `
    <div class="d-flex justify-content-between align-items-end mt-3">
      ${SubTitle({
        title: "Verificación de Eficacia",
        urlIcon: IconVerificacion,
      })}
      <div class="form-check form-switch mb-2">
        <input class="form-check-input" type="checkbox" role="switch" id="completarVerificacion">
        <label class="form-check-label small text-success" for="completarVerificacion">Verificar</label>
      </div>
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
              textNode: "resultado",
              required: true,
              className: "gestion",
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
              className: "gestion",
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
              className: "gestion",
            })}
        </div>
    `;
    return view;
  }
  async setting(data) {
    await DataEmployees.handleUser(data)
    await DataAreas.getSectores(data)
    this.handleAnular(data)
    this.handleImplemantacion(data)
    this.handleVerificacion(data)
  }
  handleAnular(data) {
    if (data) {
      const inputAnular = document.getElementById("anular");
      const setting = (data) => {
        const anular = data ? data.anular : inputAnular.value;
        const parametros = [
          {
            IdInput: "comentario_anulacion",
            validation: anular != "Sí",
            value: "No aplica",
          },
          {
            IdInput: "fecha_anulacion",
            validation: anular != "Sí",
            value: "1900-01-01",
          },
          {
            IdInput: "causa",
            validation: anular === "Sí",
            value: "No aplica",
          },
          {
            IdInput: "foda",
            validation: anular === "Sí",
            value: "No aplica",
          },
          {
            IdInput: "analisis_foda",
            validation: anular === "Sí",
            value: "No aplica",
          },
          {
            IdInput: "accion",
            validation: anular === "Sí",
            value: "No aplica",
          },
          {
            IdInput: "fecha_plazo",
            validation: anular === "Sí",
            value: "1900-01-01",
          },
          {
            IdInput: "fecha_impl",
            validation: anular === "Sí",
            value: "1900-01-01",
          },
          {
            IdInput: "comentarios_impl",
            validation: anular === "Sí",
            value: "No aplica",
          },
          {
            IdInput: "met_verif_ef",
            validation: anular === "Sí",
            value: "No aplica",
          },
          {
            IdInput: "responsable_ef",
            validation: anular === "Sí",
            value: "No aplica",
          },
          {
            IdInput: "fecha_prev_ef",
            validation: anular === "Sí",
            value: "1900-01-01",
          },
          {
            IdInput: "resultado_ef",
            validation: anular === "Sí",
            value: "No aplica",
          },
          {
            IdInput: "comentario_ef",
            validation: anular === "Sí",
            value: "No aplica",
          },
          {
            IdInput: "fecha_ef",
            validation: anular === "Sí",
            value: "1900-01-01",
          },
        ];
        parametros.map((item) => settingInputs(item));
      };
      if (inputAnular.value === "") {
        inputAnular.value = "No";
        inputAnular.classList.add("test");
      }
      setting(data);
      inputAnular.addEventListener("change", () => {
        setting();
      });
    }
  }
  handleImplemantacion(data) {
    const completarImplementacion = document.querySelector("#completarImplementacion");
    if(data){
      const setting = () => {
        console.log(23)
        const parametros = [
          {
            IdInput: "fecha_impl",
            validation: completarImplementacion.checked,
            value: "",
          },
          {
            IdInput: "comentarios_impl",
            validation: completarImplementacion.checked,
            value: "",
          },
          {
            IdInput: "met_verif_ef",
            validation: completarImplementacion.checked,
            value: "",
          },
          {
            IdInput: "responsable_ef",
            validation: completarImplementacion.checked,
            value: "",
          },
          {
            IdInput: "fecha_prev_ef",
            validation: completarImplementacion.checked,
            value: "",
          },
        ];
        parametros.map((item) => settingInputs(item));
      };
      
      completarImplementacion.addEventListener("change", () => {
        setting();
      });
    }
  }
  handleVerificacion(data) {
    if (data) {
      const verif = data.status != "Ejecutada" && data.status != "Verificada"
      const completarVerificacion = document.getElementById("completarVerificacion");
      completarVerificacion.toggleAttribute("disabled",verif); //Desabilita boton para agregar verificación si no esta en es status correcto.
      const setting = (verificacion) => {
        const parametros = [
          {
            IdInput: "resultado_ef",
            validation: verificacion,
            value: "",
          },
          {
            IdInput: "comentario_ef",
            validation: verificacion,
            value: "",
          },
          {
            IdInput: "fecha_ef",
            validation: verificacion,
            value: "",
          },
        ];
        parametros.map((item) => settingInputs(item));
      };
      completarVerificacion.addEventListener('change' , (event) => {
        const check = !event.target.checked;
        setting(check)
      })
      setting(verif)
    }
    
  }
}
export default Oportunidades;
