import { MainTitle } from "@components/Titles";
import NoConformidades from "@templates/NoConformidad";
import { DataNoConformidad } from "@backend/NoConfomidad";
import { permissions, getHash, loadInputsById, getDataFormValid, isEmptyObjet, today , listenerChangeEvent} from "@utils/Tools";
import { buttonComponent } from "@components/Form";
import { DataSegProveedores } from "../../backend/SeguimientoProveedores";
import ReclamoProveedor from "../../templates/ReclamoProveedor";
const template = new ReclamoProveedor()
let ID
let form
let hasInitDate

const SeguimientoProveedor = async (content) => {
    ID = getHash().replace("seguimiento_proveedor=", "");
    const data = await DataSegProveedores.getDataById(ID);
    if(typeof data === 'object') {
      console.log(data)  
      const view = `
        ${MainTitle({title:'Gestión de Reclamo a proveedor'})}
        ${await template.form()} 
        <hr>
        <div class="row g-1 my-3">
          ${buttonComponent({
            type: "button",
            color: "success",
            id: "saveButton",
            title: "Guardar",
            col: "auto",
            xlCol: "auto",
            mdCol: "auto",
          })}
        </div>
      `
      
      
      content.innerHTML = view;
      const forms = document.querySelectorAll('form')
      forms.forEach(element => {
        loadInputsById(data,element)
      });
      console.log(forms)
      //loadInputsById(data,form)
    }
    
  /* const permissionsUser = await permissions();
  const codigo_permisos = Number(permissionsUser.num)
  const canGestion = codigo_permisos > 0
  
  
  const isCreator = nc.registrado_por === permissionsUser.alias
  const isResponse = nc.responsable === permissionsUser.alias
  const canSeeNC = canGestion && (isCreator || isResponse || codigo_permisos === 3)
  if (canSeeNC) {
    hasInitDate = nc.fecha_inicio!=''
      const view = `
        ${MainTitle({title:'Gestión de Salidas No Conformes'})}
        ${await template.formCompleted(true)} 
        <hr>
        <div class="row g-1 my-3">
          ${buttonComponent({
            type: "button",
            color: "success",
            id: "saveButton",
            title: "Guardar",
            col: "auto",
            xlCol: "auto",
            mdCol: "auto",
          })}
        </div>
      `
      content.innerHTML = view;
      await template.setting(nc)
      form = document.getElementById('formNC')
      loadInputsById(nc,form)
      listenerChangeEvent(form)
      const saveButton = document.getElementById("saveButton");
      saveButton.addEventListener("click", handleSave);
  }
  else {
    location.hash = "/no-permissions"
  } */
}
const handleSave = async (event) => {
  const data = getDataFormValid(event,form,'.change-save, .test')
  if(!isEmptyObjet(data)) {
    template.modal.create({
      title: "🔄 Actualizar datos",
      content: `
            <p class="text-center">Actualizando los datos, por favor espere ⌛</p>
            `,
    });
    template.modal.disableCloseButtons();
    try {
      if(!hasInitDate) {
        data.fecha_inicio = today
      }
      const response = await DataNoConformidad.updateData({
        colName: "id",
        id: ID,
        values: data,
      });
      if (response && response.status === 200) {
        
        template.modal.create({
          title: "✔️ Completado",
          content: '<p class="text-center">Actualizado correctamente</p>',
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
export default SeguimientoProveedor