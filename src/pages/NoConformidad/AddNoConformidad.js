import { MainTitle } from "@components/Titles";
import NoConformidades from "@templates/NoConformidad";
import { DataNoConformidad } from "@backend/NoConfomidad";
import { getDataFormValid, isEmptyObjet} from "@utils/Tools";
import { buttonComponent } from "@components/Form";
import DataEmployees from "@backend/Employees";
import IconReject from '@icons/rechazado.png'
import Notificaciones from "@backend/Notificaciones";
const template = new NoConformidades()
let form
const email = new Notificaciones()
const AddNoConfomidad = async (content) => {
    const view = `
      ${MainTitle({title:'Nueva No conformidad', urlIcon: IconReject})}
      ${await template.formInit()} 
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
    form = document.getElementById('formNC')
    await template.setting()

    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", handleSave);
    //
}
const handleSave = async (event) => {
  const data = getDataFormValid(event,form,'.form-control')
  if(!isEmptyObjet(data)) {
    template.modal.saving()
    try {
      data.infoResponsable = await DataEmployees.getEmployeesByAlias(data.responsable)
      data.infoCreator = await DataEmployees.getEmployeesByAlias(data.registrado_por)
      const response = await DataNoConformidad.postCustumize(data);
      if (response && response.status === 200) {
        data['id'] = response.result.updates.updatedData.values[0][0]
        const responseEmail = await email.alta(data);
        const textEmail = responseEmail.status === 200 ? 'Se ha notificado por email ✅' : 'Hubo un problema en su notificación por email ❌'
        
        const text = template.responsableByDefault ? 'La gestión de la misma será <u>evaluada y determinada</u> por' : 'El responsable de su gestión es'
        template.modal.create({
          title: "✔️ Completado",
          content: `
          <p class="text-center">La no conformidad ha sido ingresada.
          <br>${text} <strong>${data.infoResponsable.fullName}</strong>
          <br>📧 ${textEmail}
          </p>`,
        });
        
      }
    } catch (e) {
      console.log(e);
    }

  }
}
export default AddNoConfomidad