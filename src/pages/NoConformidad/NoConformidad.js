import { MainTitle } from "@components/Titles";
import NoConformidades from "@templates/NoConformidad";
import { DataNoConformidad } from "@backend/NoConfomidad";
import { permissions, getHash, loadInputsById, getDataFormValid, isEmptyObjet, today , listenerChangeEvent} from "@utils/Tools";
import { buttonComponent } from "@components/Form";
const template = new NoConformidades()
let ID
let form
let hasInitDate

const NoConfomidad = async (content) => {
  const permissionsUser = await permissions();
  const codigo_permisos = Number(permissionsUser.num)
  const canGestion = codigo_permisos > 0
  ID = getHash().replace("no-conformidad=", "");
  const nc = await DataNoConformidad.getNC(ID)
  const isCreator = nc.registrado_por === permissionsUser.alias
  const isResponse = nc.responsable === permissionsUser.alias
  const canSeeNC = canGestion && (isCreator || isResponse || codigo_permisos === 2)
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
      template.setting(nc)
      form = document.getElementById('formNC')
      loadInputsById(nc,form)
      listenerChangeEvent(form)
      const saveButton = document.getElementById("saveButton");
      saveButton.addEventListener("click", handleSave);
  }
  else {
    location.hash = "/no-permissions"
  }
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
export default NoConfomidad