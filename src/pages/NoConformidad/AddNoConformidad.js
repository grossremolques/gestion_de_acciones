import { MainTitle } from "@components/Titles";
import NoConformidades from "@templates/NoConformidad";
import { DataNoConformidad } from "@backend/NoConfomidad";
import { getDataFormValid, isEmptyObjet} from "@utils/Tools";
import { buttonComponent } from "@components/Form";
import DataEmployees from "@backend/Employees";
import IconReject from '@icons/rechazado.png'
const template = new NoConformidades()
let ID
let form

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
    form = document.querySelector('#formNC')
    await template.setting()

    const saveButton = document.querySelector("#saveButton");
    saveButton.addEventListener("click", handleSave);
    //
}
const handleSave = async (event) => {
  const data = getDataFormValid(event,form,'.form-control')
  if(!isEmptyObjet(data)) {
    template.modal.saving()
    try {
      const responsable = await DataEmployees.getEmployeesByAlias(data.responsable)
      const fullName = responsable.fullName;
      const response = await DataNoConformidad.postCustumize(data);
      if (response && response.status === 200) {
        const text = template.responsableByDefault ? 'La gestión de la misma será evaluada y determinada por' : 'El responsable de su gestión es'
        template.modal.create({
          title: "✔️ Completado",
          content: `
          <p class="text-center">La no conformidad ha sido ingresada.
          <br>${text} <strong>${fullName}</strong>
          </p>`,
        });
      }
    } catch (e) {
      console.log(e);
    }

  }
  console.log(data)
}
export default AddNoConfomidad