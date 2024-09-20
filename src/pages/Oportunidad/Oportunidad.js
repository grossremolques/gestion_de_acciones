import { MainTitle } from "@components/Titles";
import Oportunidades from "@templates/Oportunidad";
import { DataOportunidad } from "@backend/Oportunidad";
import { buttonComponent } from "@components/Form";
import DataEmployees from "@backend/Employees";
import IconMejora from "@icons/mejora.png";
import {
  permissions,
  getHash,
  loadInputsById,
  getDataFormValid,
  isEmptyObjet,
  today,
  listenerChangeEvent,
} from "@utils/Tools";
let ID
let hasInitDate
const template = new Oportunidades();
let form;
const Oportunidad = async (content) => {
  const permissionsUser = await permissions();
  const codigo_permisos = Number(permissionsUser.num);
  const canGestion = codigo_permisos > 0;
  ID = getHash().replace("oportunidad=", "");
  const data = await DataOportunidad.getNC(ID);
  const isCreator = data.registrado_por === permissionsUser.alias;
  const isResponse = data.responsable === permissionsUser.alias;
  const canSeeNC =
    canGestion && (isCreator || isResponse || codigo_permisos === 2);
  if (canSeeNC) {
    hasInitDate = data.fecha_inicio!=''
    const view = `
      ${MainTitle({
        title: "Gestionar Oportunidad/Riesgo",
        urlIcon: IconMejora,
      })}
      ${await template.formCompleted(true)} 
      <hr>
      <div class="row g-1 my-3">
        ${buttonComponent({
          type: "button",
          color: "success",
          id: "updateButton",
          title: "Guardar",
          col: "auto",
          xlCol: "auto",
          mdCol: "auto",
        })}
      </div>
    `;
    content.innerHTML = view;
    form = document.getElementById("formOportunidad");
    await template.setting(data);
    loadInputsById(data,form)
    listenerChangeEvent(form)

    const updateButton = document.getElementById("updateButton");
    updateButton.addEventListener("click", handleSave);
  }}
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
      const response = await DataOportunidad.updateData({
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
export default Oportunidad;
