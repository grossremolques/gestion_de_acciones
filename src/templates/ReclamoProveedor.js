import MyCustumeModal from "@components/MyCustumeModal";
import {
  inputComponent,
  buttonComponent,
  selectComponent,
  textarea,
} from "@components/Form";
import {
  AttributesSP,
} from "@backend/SeguimientoProveedores";
import { Attributes } from "@backend/NoConfomidad";
import { SubTitle, MiniSubTitle } from "@components/Titles";
import { settingInputs } from "@utils/Tools";
import IconComplaint from '@icons/complaint.png'
import IconReport from '@icons/complaint-report.png'
class ReclamoProveedor {
  constructor() {
    this.modal = new MyCustumeModal(document.getElementById("modal"));
  }
  async form() {
    const attributes = await AttributesSP.getDataInJSON();
    const attributesNc = await Attributes.getDataInJSON();
    const view = `
    ${await this.dataOfNoConformidad(attributesNc)}
    ${await this.preparingFirstReport(attributes)}
    ${await this.gestion(attributes)}
    `;
    return view;
  }
  async dataOfNoConformidad(attributesNc) {
    const view = `
    <form class="row needs-validation g-1 mt-3 mx-auto border-card pb-2" novalidate id="formNCRP" style="max-width: 1000px">
    ${SubTitle({ title: "Datos del Desvío", urlIcon: IconComplaint })}
        <div class="row g-1">
            ${inputComponent({
              col: "2",
              mdCol: "2",
              xlCol: "2",
              type: "number",
              nameLabel: "Cod Proveedor",
              id: "id_prov",
              name: "id_prov",
              sizes: "sm",
              required: true,
            })}
            ${inputComponent({
              col: "",
              mdCol: "",
              xlCol: "",
              type: "text",
              nameLabel: "Razón Social",
              id: "razon_social",
              name: "razon_social",
              sizes: "sm",
              readonly: true,
            })}
            ${selectComponent({
              col: "12",
              mdCol: "auto",
              xlCol: "auto",
              nameLabel: "P.N.C",
              id: "pnc",
              name: "pnc",
              sizes: "sm",
              data: attributesNc,
              textNode: "pnc",
              required: true,
            })}
            ${inputComponent({
              col: "3",
              mdCol: "3",
              xlCol: "3",
              type: "text",
              nameLabel: "Producto",
              id: "producto",
              name: "producto",
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
              row: "3",
              sizes: "sm",
              required: true,
            })}
        </div>
        <div class="row g-1"> 
          ${buttonComponent({
            type:'button',
            className: 'text-end',
            title: 'Actualiza datos de No Conformidad',
            sizes: 'sm',
            color: 'primary',
            id: 'update-nc'
          })}
        </div>
    </form>
    `;
    return view;
  }
  async preparingFirstReport(attributes) {
    const view = `
    <form class="row needs-validation g-1 mt-3 mx-auto border-card pb-2" novalidate id="formFirstReport" style="max-width: 1000px">
      ${SubTitle({ title: "Datos del Seguimiento a proveedores", urlIcon: IconReport })}
      <div class="row g-1">
        ${inputComponent({
          col: "2",
          mdCol: "2",
          xlCol: "2",
          type: "text",
          nameLabel: "Cod YAVÚ",
          id: "cod_yavu",
          name: "cod_yavu",
          sizes: "sm",
          required: true,
        })}
        ${inputComponent({
          col: "",
          mdCol: "",
          xlCol: "",
          type: "text",
          nameLabel: "Descripción YAVÚ",
          id: "nombre_yavu",
          name: "nombre_yavu",
          sizes: "sm",
          required: true,
        })}
        ${selectComponent({
          col: "12",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Disposición",
          id: "disposicion",
          name: "disposicion",
          sizes: "sm",
          data: attributes,
          textNode: "disposicion",
          required: true,
        })} 
      </div>
      <div class="row g-1"> 
        ${textarea({
          col: "12",
          mdCol: "12",
          xlCol: "12",
          nameLabel: "Detalles de la falla",
          id: "description_de_falla",
          name: "description_de_falla",
          row: "3",
          sizes: "sm",
          required: true,
        })}
      </div>
      <div class="row g-1 align-items-end">
        ${inputComponent({
          col: "",
          mdCol: "",
          xlCol: "",
          type: "text",
          nameLabel: "# Guia envío",
          id: "num_guia",
          name: "num_guia",
          sizes: "sm",
          required: true,
        })}
        ${inputComponent({
          col: "auto",
          mdCol: "auto",
          xlCol: "auto",
          type: "date",
          nameLabel: "Fecha Guia",
          id: "fecha_guia",
          name: "fecha_guia",
          sizes: "sm",
          required: true,
        })}
        ${buttonComponent({
          col: "auto",
          mdCol: "auto",
          xlCol: "auto",
          type:'button',
          id: 'sendFirstReport',
          title: 'Enviar informe',
          color: 'danger',
          sizes:'sm',
          className: 'text-end mt-2'
        })}
      </div>
    </form>
      
    `;
    return view;
  }
  async gestion(attributes) {
    const view = `
    <form class="row needs-validation g-2 my-3 mx-auto" novalidate id="formReclamoProveedor" style="max-width: 1000px">
    ${SubTitle({ title: "Respuesta de proveedor" })}
      <div class="col border-card me-3 px-2"> 
        <div class="row g-1"> 
        ${MiniSubTitle({ title: "Acción Correctiva", mt: 2 })}
          ${selectComponent({
            col: "12",
            mdCol: "5",
            xlCol: "5",
            nameLabel: "Respuesta",
            id: "respuesta",
            name: "respuesta",
            sizes: "sm",
            data: attributes,
            textNode: "respuesta",
            required: true,
          })}
          ${selectComponent({
            col: "12",
            mdCol: "7",
            xlCol: "7",
            nameLabel: "Tiempo de respuesta a Reclamo",
            id: "tiempo_respuesta_1",
            name: "tiempo_respuesta_1",
            sizes: "sm",
            data: attributes,
            textNode: "tiempo_respuesta_1",
            required: true,
          })}
        </div>
        <div class="row g-1"> 
          ${selectComponent({
            col: "12",
            mdCol: "7",
            xlCol: "7",
            nameLabel: "Acc. Correctiva (Proveedor)",
            id: "accion_correctiva_proveedor",
            name: "accion_correctiva_proveedor",
            sizes: "sm",
            data: attributes,
            textNode: "accion_correctiva_proveedor",
            required: true,
          })}
          ${inputComponent({
            col: "",
            mdCol: "5",
            xlCol: "5",
            type: "date",
            nameLabel: "Fecha Plazo",
            id: "fecha_plazo_rec",
            name: "fecha_plazo_rec",
            sizes: "sm",
            required: true,
          })}
        </div>
      </div>
      <div class="col-4 border-card px-2 pb-2"> 
        <div class="row g-1">
          <div class="d-flex justify-content-between align-items-end mt-2">
            ${MiniSubTitle({ title: "Cierre" })}
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" role="switch" id="completarRespuesta">
              <label class="form-check-label small text-primary" for="completarRespuesta">Agregar</label>
            </div>
          </div>
          
          ${inputComponent({
            col: "12",
            mdCol: "12",
            xlCol: "12",
            type: "date",
            nameLabel: "Fecha Cierre",
            id: "fecha_cierre_rec",
            name: "fecha_cierre_rec",
            sizes: "sm",
            required: true,
          })}
          ${selectComponent({
            col: "12",
            mdCol: "12",
            xlCol: "12",
            nameLabel: "Tiempo de respuesta a Gestión",
            id: "tiempo_respuesta_2",
            name: "tiempo_respuesta_2",
            sizes: "sm",
            data: attributes,
            textNode: "tiempo_respuesta_2",
            required: true,
          })}
        </div>
      </div>
      <div class="row g-1"> 
        ${buttonComponent({
          type:'button',
          className: 'text-end',
          title: 'Actualizar datos de Seguimiento a Proveedores',
          sizes: 'sm',
          color: 'success',
          id: 'update-sp'
        })}
      </div>
    </form>
      
    `;
    return view;
  }
  settings(data) {
    const check = document.getElementById('completarRespuesta');
    const disposicion = document.querySelector("#disposicion");
    disposicion.addEventListener("change", () => setDisposicion());
    const setDisposicion = () => {
      const value = document.querySelector("#disposicion").value;
      settingInputs({
        IdInput: "num_guia",
        validation: value != "Devolución",
        value: "No aplica",
      });
      settingInputs({
        IdInput: "fecha_guia",
        validation: value != "Devolución",
        value: "1900-01-01",
      });
    }
    const pnc = document.querySelector('#pnc');
    pnc.addEventListener('change', () => {
      setProducto();
      const producto = document.getElementById('producto');
      producto.classList.add('change-save');
    })
    const setProducto = (dataValue) => {
      const value = document.querySelector('#pnc').value;
      settingInputs({
        IdInput: "producto",
        validation: value != "Otro",
        value: "No aplica",
        data: dataValue ? dataValue : ''
      });
    }
    check.addEventListener('change', () => {
      disableAC()
    })
    console.log(check)
    const disableAC = () => {
      document.getElementById('fecha_cierre_rec').toggleAttribute('disabled', check.checked === false)
      document.getElementById('tiempo_respuesta_2').toggleAttribute('disabled', check.checked === false)
    }
    setProducto(data.producto)
    setDisposicion()
    disableAC()
  }
   
}
export default ReclamoProveedor;
/* 

    </form>
*/