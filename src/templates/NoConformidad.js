import {
  inputComponent,
  selectComponent,
  textarea,
  options,
} from "../components/Form";
import { SubTitle, MiniSubTitle } from "../components/Titles";
import IconFrom from "../assets/icons/checklist.png";
import IconClient from "../assets/icons/client.png";
import IconContencion from "../assets/icons/avoid-problem.png";
import IconGestion from "../assets/icons/gestion.png";
import IconCancelar from "../assets/icons/cancelado.png";
import IconProveedor from "../assets/icons/supply-man.png";
import IconProblemSolving from "../assets/icons/problem-solving.png";
import IconImplemantacion from "../assets/icons/coordinador.png";
import IconVerificacion from "../assets/icons/verificacion.png";
import { Attributes } from "../backend/NoConfomidad";
import DataEmployees from "../backend/Employees";
import DataAreas from "../backend/Areas";
import MyCustumeModal from "../components/MyCustumeModal";
import { DataResponsable } from "@backend/NoConfomidad";
import DataClients from "../backend/Clients";

let isNew;
class NoConformidades {
  constructor() {
    this.modal = new MyCustumeModal(document.querySelector("#modal"));
    this.responsableByDefault = false;
  }
  async formCompleted(completed) {
    isNew = false;
    const attributes = await Attributes.getDataInJSON();
    const employees = await DataEmployees.sortEmployees();
    const areas = await DataAreas.getDataInJSON();
    const responsables = await DataEmployees.getResponsables();
    const view = `
    <form class="row needs-validation g-1 mt-3 mx-auto border-card" novalidate id="formNC" style="max-width: 1000px">
    ${await this.declaracion(
      attributes,
      employees,
      areas,
      responsables,
      completed
    )}
    <div class="row g-1">
    ${await this.cliente(attributes)}   
    </div>
    <div class="row g-1">
      ${await this.contencion(attributes, completed)}
    </div>
      ${await this.gestion(attributes)}
    
    <div class="row g-1">  
    <hr>
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
    const areas = await DataAreas.getDataInJSON();
    const responsables = await DataEmployees.getResponsables();
    const view = `
    <form class="row needs-validation g-1 mt-3 mx-auto border-card" novalidate id="formNC" style="max-width: 1000px">
      ${await this.declaracion(attributes, employees, areas, responsables)}
      <div class="row g-1">
      ${await this.cliente(attributes)}   
      </div>
      <div class="row g-1">
        ${await this.contencion(attributes)}
      </div>
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
      `
        : ""
    }
        ${selectComponent({
          col: "12",
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
    </div>
    <div class="row g-1">
        ${selectComponent({
          col: "12",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Tipo de desvío",
          id: "tipo_desvio",
          name: "tipo_desvio",
          sizes: "sm",
          data: attributes,
          textNode: "tipo_desvio",
          required: true,
        })}
        ${selectComponent({
          col: "12",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Procedimiento",
          id: "procedimiento",
          name: "procedimiento",
          sizes: "sm",
          data: attributes,
          textNode: "procedimiento",
          required: true,
        })}
        ${selectComponent({
          col: "12",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Documento",
          id: "documento",
          name: "documento",
          sizes: "sm",
          data: attributes,
          textNode: "documento",
          required: true,
        })}
        ${inputComponent({
          col: "6",
          mdCol: "",
          xlCol: "",
          type: "text",
          nameLabel: "Pieza",
          id: "pieza",
          name: "pieza",
          sizes: "sm",
          required: true,
        })}
        ${selectComponent({
          col: "6",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "P.N.C",
          id: "pnc",
          name: "pnc",
          sizes: "sm",
          data: attributes,
          textNode: "pnc",
          required: true,
        })}
    </div>
    <div class="row g-1">
      ${inputComponent({
        col: "6",
        mdCol: "3",
        xlCol: "3",
        type: "text",
        nameLabel: "Producto",
        id: "producto",
        name: "producto",
        sizes: "sm",
        required: true,
      })}
      ${selectComponent({
        col: "6",
        mdCol: "auto",
        xlCol: "auto",
        nameLabel: "Manufactura",
        id: "manufactura",
        name: "manufactura",
        sizes: "sm",
        data: attributes,
        textNode: "manufactura",
        required: true,
      })}
      ${selectComponent({
        col: "12",
        mdCol: "",
        xlCol: "",
        nameLabel: "Origen",
        id: "origen",
        name: "origen",
        sizes: "sm",
        data: attributes,
        textNode: "origen",
        required: true,
      })}
      ${inputComponent({
        col: "6",
        mdCol: "2",
        xlCol: "2",
        type: "text",
        nameLabel: "Trazabilidad",
        id: "trazabilidad",
        name: "trazabilidad",
        sizes: "sm",
        required: true,
      })}
      ${inputComponent({
        col: "6",
        mdCol: "2",
        xlCol: "2",
        type: "text",
        nameLabel: "ID orden",
        id: "id_ot",
        name: "id_ot",
        sizes: "sm",
        required: true,
      })}
    </div>
    <div class="row g-1">
        ${textarea({
          col: "12",
          mdCol: "12",
          xlCol: "12",
          nameLabel: "Desvío",
          id: "desvio",
          name: "desvio",
          row: "4",
          sizes: "sm",
          required: true,
          placeholder: "Detalle el/los inconvenientes presentados",
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
    </div>
    `;
    return view;
  }
  async cliente(attributes) {
    const view = `
    ${SubTitle({
      title: "Información de reclamo de cliente",
      urlIcon: IconClient,
      mt: 4,
    })}
    ${inputComponent({
      col: "12",
      mdCol: "3",
      xlCol: "2",
      type: "number",
      nameLabel: "ID Cliente",
      id: "id_cliente",
      name: "id_cliente",
      sizes: "sm",
      required: true,
    })}
    ${inputComponent({
      col: "12",
      mdCol: "",
      xlCol: "",
      type: "text",
      nameLabel: "Razón Social",
      id: "razon_social",
      name: "razon_social",
      sizes: "sm",
      readonly: true,
    })}
    ${inputComponent({
      col: "12",
      mdCol: "",
      xlCol: "auto",
      type: "date",
      nameLabel: "Fecha turno (opc)",
      id: "fecha_prog_at",
      name: "fecha_prog_at",
      sizes: "sm",
    })}
    ${
      !isNew
        ? `
    ${selectComponent({
      col: "12",
      mdCol: "auto",
      xlCol: "auto",
      nameLabel: "¿A espera de cliente? (*)",
      id: "a_espera_cliente",
      name: "a_espera_cliente",
      sizes: "sm",
      data: attributes,
      textNode: "si_no",
      required: true,
    })}
    `
        : ""
    }
    `;
    return view;
  }
  async contencion(attributes, completed) {
    const view = `
    <div class="d-flex justify-content-between align-items-end mt-3">
      ${SubTitle({ title: "Contención", urlIcon: IconContencion })}
      <div class="form-check form-switch mb-2">
        <input class="form-check-input" type="checkbox" role="switch" id="completarContencion">
        <label class="form-check-label small text-primary" for="completarContencion">Agregar</label>
      </div>
    </div>
    <p class="small text-success mb-1">Una contención es una acción inmediata tomada para evitar la propagación o el agravamiento de una no conformidad. <strong>No soluciona la causa raíz</strong>, pero controla temporalmente sus efectos hasta implementar una corrección definitiva.</p>
    <p class="small text-danger p">Dar un <strong>aviso</strong> no se considera una contención. Complete esta sección solo si efectivamente existe una contención al desvío, de lo contrario, NO COMPLETE ESTA SECCIÓN.</p>
    <div class="row g-1">
      <div class="col-12 col-md-2">
        <div class="row g-1">
          ${selectComponent({
            col: "12",
            mdCol: "12",
            xlCol: "12",
            nameLabel: "Tipo de contencion",
            id: "tipo_contencion",
            name: "tipo_contencion",
            sizes: "sm",
            data: attributes,
            textNode: "tipo_contencion",
            required: true,
          })}
          ${
            completed
              ? `
            ${inputComponent({
              col: "12",
              mdCol: "12",
              xlCol: "12",
              type: "number",
              nameLabel: "OTR",
              id: "id_otr",
              name: "id_otr",
              sizes: "sm",
              required: true,
              className: 'gestion'
            })}
            `
              : ""
          }
          
        </div>
      </div>
      ${textarea({
        col: "12",
        mdCol: "",
        xlCol: "",
        nameLabel: "Contención",
        id: "contencion",
        name: "contencion",
        row: "4",
        sizes: "sm",
        required: true,
      })}
    </div>
    `;
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
          className: 'gestion'
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
          className: 'gestion'
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
          className: 'gestion'
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
          className: 'gestion'
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
          className: 'gestion'
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
          className: 'gestion'
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
          className: 'gestion'
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
          className: 'gestion'
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
          className: 'gestion'
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
          className: 'gestion'
        })}
    </div>
    `;
    return view;
  }
  async implementacion() {
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
      className: 'gestion'
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
      className: 'gestion'
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
          className: 'gestion',
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
          className: 'gestion',
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
          className: 'gestion',
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
              className: 'gestion',
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
              className: 'gestion',
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
              className: 'gestion',
            })}
        </div>
    `;
    return view;
  }
  setting(data) {
    this.handleUser(data);
    this.getSectores(data);
    this.handleTipoDesvio(data);
    this.handlePNC(data);
    this.handleReclamoCliente(data);
    this.handleTrazabilidad(data);
    this.handleDocumento(data);
    this.handleContencion(data);
    this.handleAnular(data);
    this.handleReclamoProveedor(data);
    this.handleAccionCorrect(data);
    this.handleImplementación(data);
    this.handleCliente(data);
    this.handleProveedor(data);
  }
  async handleUser(data) {
    if (!data) {
      try {
        const user = await DataEmployees.getActiveUser();
        const input = document.querySelector("#registrado_por");
        input.value = user.alias;
      } catch (e) {
        console.log(e);
      }
    }
  }
  async getSectores(data) {
    const inputArea = document.querySelector("#area");
    const loadSectores = async (data) => {
      const area = data ? data.area : inputArea.value;
      try {
        const sectores = await DataAreas.getSectoresByArea(area);
        const input = document.querySelector("#sector");
        const optionsSectores = options({ data: sectores, textNode: "sector" });
        input.innerHTML = optionsSectores;
        input.value = data ? data.sector : "";
      } catch (e) {
        console.log(e);
      }
    };
    if (data) {
      await loadSectores(data);
    }
    inputArea.addEventListener("change", async () => {
      await loadSectores();
    });
  }
  handleTipoDesvio(data) {
    const inputTipo_desvio = document.querySelector("#tipo_desvio");
    const setting = (data) => {
      const tipo_desvio = data ? data.tipo_desvio : inputTipo_desvio.value;
      const parametros = [
        {
          IdInput: "procedimiento",
          validation: tipo_desvio != "Procedimiento",
          value: "No aplica",
        },
        {
          IdInput: "documento",
          validation: tipo_desvio != "Información técnica (prod)",
          value: "No aplica",
        },
        {
          IdInput: "pieza",
          validation: tipo_desvio != "Falta de pieza (prod)",
          value: "No aplica",
        },
        {
          IdInput: "pnc",
          validation: tipo_desvio != "Producto no conforme",
          value: "No aplica",
        },
        {
          IdInput: "producto",
          validation: tipo_desvio != "Producto no conforme",
          value: "No aplica",
        },
        {
          IdInput: "manufactura",
          validation: tipo_desvio != "Producto no conforme",
          value: "No aplica",
        },
        {
          IdInput: "id_ot",
          validation: tipo_desvio != "Información técnica (prod)",
          value: "No aplica",
        },
      ];
      parametros.map((item) => this.settingInputs(item));
      this.handleResponsable(data);
    };
    if (data) {
      setting(data);
    }
    inputTipo_desvio.addEventListener("change", () => {
      setting();
    });
  }
  handlePNC(data) {
    const inputPNC = document.querySelector("#pnc");
    const setting = (data) => {
      const pnc = data ? data.pnc : inputPNC.value;
      this.settingInputs({
        IdInput: "producto",
        validation: pnc != "Otro",
        value: "No aplica",
      });
    };
    if (data) {
      setting(data);
    }
    inputPNC.addEventListener("change", () => {
      setting();
    });
  }
  handleReclamoCliente(data) {
    const inputOrigen = document.querySelector("#origen");
    const setting = (data) => {
      const origen = data ? data.origen : inputOrigen.value;
      const validation = origen != "Reclamo de cliente";
      const parametros = [
        {
          IdInput: "id_cliente",
          validation: validation,
          value: 0,
        },
        {
          IdInput: "razon_social",
          validation: validation,
          value: "No aplica",
        },
        {
          IdInput: "fecha_prog_at",
          validation: validation,
          value: "1900-01-01",
        },
        {
          IdInput: "a_espera_cliente",
          validation: validation,
          value: "No aplica",
        },
      ];
      parametros.map((item) => this.settingInputs(item));
      this.handleResponsable(data);
    };
    if (data) {
      setting(data);
    }
    inputOrigen.addEventListener("change", () => {
      setting();
    });
  }
  handleTrazabilidad(data) {
    const inputDocumento = document.querySelector("#documento");
    const inputOrigen = document.querySelector("#origen");
    const setting = (data) => {
      const documento = data ? data.documento : inputDocumento.value;
      const origen = data ? data.origen : inputOrigen.value;
      const validDocument = documento === "Legajo" || documento === "Controles";
      const validOrigen = origen === "Reclamo de cliente";
      const validation = validDocument || validOrigen;
      this.settingInputs({
        IdInput: "trazabilidad",
        validation: !validation,
        value: "No aplica",
      });
    };
    if (data) {
      setting(data);
    }
    inputDocumento.addEventListener("change", () => {
      setting();
    });
    inputOrigen.addEventListener("change", () => {
      setting();
    });
  }
  async handleDocumento(data) {
    const inputDocumento = document.querySelector("#documento");
    const setting = async (data) => {
      const documento = data ? data.documento : inputDocumento.value;
      this.settingInputs({
        IdInput: "id_ot",
        validation:
          documento === "Legajo" ||
          documento === "Controles" ||
          documento === "No aplica",
        value: "No aplica",
      });
      this.handleResponsable(data);
    };
    if (data) {
      setting(data);
    }
    inputDocumento.addEventListener("change", () => {
      setting();
    });
  }
  async handleResponsable(data) {
    if (!data) {
      const tipo_desvio = document.querySelector("#tipo_desvio").value;
      const documento = document.querySelector("#documento").value;
      const origen = document.querySelector("#origen").value;
      let responsable;
      if (origen === "Reclamo de cliente") {
        const data = await DataResponsable.getResponsableByType(origen);
        responsable = data.responsable;
      } else if (tipo_desvio === "Procedimiento") {
        const data = await DataResponsable.getResponsableByType(tipo_desvio);
        responsable = data.responsable;
      } else if (documento != "No aplica" && documento != "") {
        const data = await DataResponsable.getResponsableByType(documento);
        responsable = data.responsable;
      } else {
        responsable = "MAROT";
      }
      const input = document.querySelector("#responsable");
      input.value = responsable;
    }
  }
  handleContencion(data) {
    const completarContencion = document.querySelector("#completarContencion");
    const setting = () => {
      const parametros = [
        {
          IdInput: "tipo_contencion",
          validation: !completarContencion.checked,
          value: "No aplica",
        },
        {
          IdInput: "contencion",
          validation: !completarContencion.checked,
          value: "A definir por responsable",
        },
      ];
      parametros.map((item) => this.settingInputs(item));
    };
    if (!data) {
      setting();
    }
    completarContencion.addEventListener("change", () => {
      setting();
    });
  }
  handleAnular(data) {
    if (data) {
      const inputAnular = document.querySelector("#anular");
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
        ];
        parametros.map((item) => this.settingInputs(item));
      };
      if (inputAnular.value === "") {
        inputAnular.value = "No";
        inputAnular.classList.add('test')
      }
      setting(data);
      inputAnular.addEventListener("change", () => {
        setting();
      });
    }
  }
  handleReclamoProveedor(data) {
    if (data) {
      const inputReclamoPrv = document.querySelector("#reclamo_proveedor");
      const setting = (data) => {
        const reclamo_proveedor = data
          ? data.reclamo_proveedor
          : inputReclamoPrv.value;
        const parametros = [
          {
            IdInput: "id_prov",
            validation: reclamo_proveedor != "Sí",
            value: 0,
          },
          {
            IdInput: "razon_social_prov",
            validation: reclamo_proveedor != "Sí",
            value: "No aplica",
          },
        ];
        parametros.map((item) => this.settingInputs(item));
      };
      if (inputReclamoPrv.value === "") {
        inputReclamoPrv.value = "No";
        inputReclamoPrv.classList.add('test')
      }
      setting(data);
      inputReclamoPrv.addEventListener("change", () => {
        setting();
      });
    }
  }
  handleAccionCorrect(data) {
    if (data) {
      const completarImplementacion = document.querySelector(
        "#completarImplementacion"
      );
      const inputReqAcc = document.querySelector("#requiere_acc");
      const setting = (data) => {
        const requiere_acc = data ? data.requiere_acc : inputReqAcc.value;
        const parametros = [
          {
            IdInput: "justificacion_no_acc",
            validation: requiere_acc != "No",
            value: "No aplica",
          },
          {
            IdInput: "causa",
            validation: requiere_acc != "Sí",
            value: "No aplica",
          },
          {
            IdInput: "accion_correctiva",
            validation: requiere_acc != "Sí",
            value: "No aplica",
          },
          {
            IdInput: "fecha_plazo",
            validation: requiere_acc != "Sí",
            value: "1900-01-01",
          },
          {
            IdInput: "fecha_impl",
            validation: requiere_acc != "Sí",
            value: "1900-01-01",
          },
          {
            IdInput: "comentarios_impl",
            validation: requiere_acc != "Sí",
            value: "No aplica",
          },
          {
            IdInput: "met_verif_ef",
            validation: requiere_acc != "Sí",
            value: "No aplica",
          },
          {
            IdInput: "responsable_ef",
            validation: requiere_acc != "Sí",
            value: "No aplica",
          },
          {
            IdInput: "fecha_prev_ef",
            validation: requiere_acc != "Sí",
            value: "1900-01-01",
          },
          {
            IdInput: "resultado_ef",
            validation: requiere_acc != "Sí",
            value: "No aplica",
          },
          {
            IdInput: "comentario_ef",
            validation: requiere_acc != "Sí",
            value: "No aplica",
          },
          {
            IdInput: "fecha_ef",
            validation: requiere_acc != "Sí",
            value: "1900-01-01",
          },
        ];
        parametros.map((item) => this.settingInputs(item));
        completarImplementacion.toggleAttribute(
          "disabled",
          requiere_acc != "Sí"
        );
        completarImplementacion.checked = requiere_acc != "Sí";
      };
      setting(data);
      inputReqAcc.addEventListener("change", () => {
        setting();
      });
    }
  }
  handleImplementación(data) {
    const completarImplementacion = document.querySelector(
      "#completarImplementacion"
    );
    const setting = (data) => {
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
        {
          IdInput: "resultado_ef",
          validation: completarImplementacion.checked,
          value: "",
        },
        {
          IdInput: "comentario_ef",
          validation: completarImplementacion.checked,
          value: "",
        },
        {
          IdInput: "fecha_ef",
          validation: completarImplementacion.checked,
          value: "",
        },
      ];
      parametros.map((item) => this.settingInputs(item));
    };
    if (data) {
      if (data.requiere_acc === "Sí") {
        setting(data);
      }
    }
    if (completarImplementacion) {
      completarImplementacion.addEventListener("change", () => {
        setting();
      });
    }
  }
  async handleCliente(data) {
    const inputID_Cliente = document.querySelector("#id_cliente");
    const setting = async (data) => {
      const input = document.querySelector("#razon_social");
      const id_cliente = data ? data.id_cliente : inputID_Cliente.value;
      if (id_cliente != "0" && id_cliente != "") {
        const cliente = await DataClients.getClient(id_cliente);
        if (cliente) {
          input.value = cliente.razon_social;
        } else {
          inputID_Cliente.value = "";
          input.value = "";
          window.alert("🚨🚨 Cliente no encontrado 😟");
        }
      }
    };
    if (data) {
      setting(data);
    }
    inputID_Cliente.addEventListener("change", (event) => {
      const valid = event.target.value != "0" && event.target.value != "";
      if (valid) {
        setting();
      } else {
        window.alert("Ingrese un valor válido");
      }
    });
  }
  async handleProveedor(data) {
    if (data) {
      const inputID_Proveedor = document.querySelector("#id_prov");
      const setting = async (data) => {
        const input = document.querySelector("#razon_social_prov");
        const id_prov = data ? data.id_prov : inputID_Proveedor.value;
        console.log(id_prov);
        if (id_prov != "0" && id_prov != "") {
          const prov = await DataClients.getClient(id_prov);
          if (prov) {
            input.value = prov.razon_social;
          } else {
            inputID_Proveedor.value = "";
            input.value = "";
            window.alert("🚨🚨 Proveedor no encontrado 😟");
          }
        }
      };
      setting(data);
      inputID_Proveedor.addEventListener("change", (event) => {
        const valid = event.target.value != "0" && event.target.value != "";
        if (valid) {
          setting();
        } else {
          window.alert("Ingrese un valor válido");
        }
      });
    }
  }
  settingInputs(props) {
    const input = document.querySelector(`#${props.IdInput}`);
    if (input) {
      input.toggleAttribute("disabled", props.validation);
      if (!props.data) {
        input.value = props.validation ? props.value : "";
        input.classList.toggle('test', props.validation)
      }
    }
  }
}
export default NoConformidades;
