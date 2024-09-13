import { MainTitle } from "@components/Titles";
import NoConformidades from "@templates/NoConformidad";
import { DataNoConformidad } from "@backend/NoConfomidad";
import { getHash, loadInputsById, getDataFormValid, isEmptyObjet, today , listenerChangeEvent} from "@utils/Tools";
import { buttonComponent } from "@components/Form";
const template = new NoConformidades()
let ID
let form
let hasInitDate

const NoConfomidad = async (content) => {
  ID = getHash().replace("no-conformidad=", "");
  const nc = await DataNoConformidad.getNC(ID)
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
    form = document.querySelector('#formNC')
    loadInputsById(nc,form)
    listenerChangeEvent(form)
    const saveButton = document.querySelector("#saveButton");
    saveButton.addEventListener("click", handleSave);
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
  console.log(data)
}
export default NoConfomidad