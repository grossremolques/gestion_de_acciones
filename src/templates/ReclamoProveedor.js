import MyCustumeModal from "../components/MyCustumeModal";
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
} from "@components/Form";
import { AttributesSP, DataSegProveedores } from "../backend/SeguimientoProveedores";
import { Attributes } from "../backend/NoConfomidad";
class ReclamoProveedor {
  constructor() {
    this.modal = new MyCustumeModal(document.getElementById("modal"));
  }
  async form() {
    const attributes = await AttributesSP.getDataInJSON();
    const attributesNc = await Attributes.getDataInJSON();
    const data = await DataSegProveedores.getData();
    const view = `
    ${await this.dataOfNoConformidad(attributes, attributesNc)}
    ${await this.gestion(attributes)}
    `;
    return view;
  }
  async dataOfNoConformidad(attributesNc) {
    const view = `
    <form class="row needs-validation g-1 mt-3 mx-auto border-card" novalidate id="formNCRP" style="max-width: 1000px">
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
                readonly: true,
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
    </form>
    `;
    return view;
  }
  async gestion(attributes) {
    const view = `
    <form class="row needs-validation g-1 mt-3 mx-auto border-card" novalidate id="formReclamoProveedor" style="max-width: 1000px">
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
              readonly: true,
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
        <div class="row g-1">
            ${inputComponent({
            col: "3",
            mdCol: "3",
            xlCol: "3",
            type: "text",
            nameLabel: "# Guia envío",
            id: "num_guia",
            name: "num_guia",
            sizes: "sm",
            required: true,
            })}
            ${inputComponent({
            col: "3",
            mdCol: "3",
            xlCol: "3",
            type: "date",
            nameLabel: "Fecha Guia",
            id: "fecha_guia",
            name: "fecha_guia",
            sizes: "sm",
            required: true,
            })}
            ${selectComponent({
            col: "3",
            mdCol: "3",
            xlCol: "3",
            nameLabel: "Respuesta",
            id: "respuesta",
            name: "respuesta",
            sizes: "sm",
            data: attributes,
            textNode: "respuesta",
            required: true,
            })}
            ${selectComponent({
            col: "3",
            mdCol: "3",
            xlCol: "3",
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
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Acc. Correctiva (Proveedor)",
          id: "accion_correctiva_proveedor",
          name: "accion_correctiva_proveedor",
          sizes: "sm",
          data: attributes,
          textNode: "accion_correctiva_proveedor",
          required: true,
        })}
        ${inputComponent({
          col: "2",
          mdCol: "2",
          xlCol: "2",
          type: "date",
          nameLabel: "Fecha Plazo",
          id: "fecha_plazo",
          name: "fecha_plazo",
          sizes: "sm",
          required: true,
        })}
        ${inputComponent({
          col: "2",
          mdCol: "2",
          xlCol: "2",
          type: "date",
          nameLabel: "Fecha Cierre",
          id: "fecha_cierre",
          name: "fecha_cierre",
          sizes: "sm",
          required: true,
        })}
        ${selectComponent({
          col: "12",
          mdCol: "auto",
          xlCol: "auto",
          nameLabel: "Tiempo de respuesta a Gestión",
          id: "tiempo_respuesta_2",
          name: "tiempo_respuesta_2",
          sizes: "sm",
          data: attributes,
          textNode: "tiempo_respuesta_2",
          required: true,
        })}
        </div>
    </form>
    `;
    return view;
  }
}
export default ReclamoProveedor;
