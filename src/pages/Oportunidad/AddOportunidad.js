import { MainTitle } from "@components/Titles";
import Oportunidad from "@templates/Oportunidad";
import { DataOportunidad } from "@backend/Oportunidad";
import { getDataFormValid, isEmptyObjet} from "@utils/Tools";
import { buttonComponent } from "@components/Form";
import DataEmployees from "@backend/Employees";
import IconMejora from '@icons/mejora.png'
const template = new Oportunidad()
let form

const AddOportunidad = async (content) => {
    const view = `
      ${MainTitle({title:'Nueva Oportunidad/Riesgo', urlIcon:IconMejora })}
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
    form = document.querySelector('#formOportunidad')
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
      const response = await DataOportunidad.postCustumize(data);
      if (response && response.status === 200) {
        template.modal.create({
          title: "✔️ Completado",
          content: `
          <p class="text-center">Se guardado correctamenet</p>`,
        });
      }
    } catch (e) {
      console.log(e);
    }

  }
  console.log(data)
}
export default AddOportunidad