import { MainTitle } from "@components/Titles";
import Oportunidad from "@templates/Oportunidad";
import { DataOportunidad } from "@backend/Oportunidad";
import { getDataFormValid, isEmptyObjet} from "@utils/Tools";
import { buttonComponent } from "@components/Form";
import DataEmployees from "@backend/Employees";
import IconMejora from '@icons/mejora.png'
import Notificaciones from "../../backend/Notificaciones";
//Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eum atque iure aliquid distinctio cumque expedita aliquam dicta, facilis provident magni, recusandae tenetur animi quo, quis quos alias? Beatae, maxime.
const template = new Oportunidad()
const email = new Notificaciones()
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
    form = document.getElementById('formOportunidad')
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
      //Buscar datos del "Responsable"
      data.infoResponsable = await DataEmployees.getEmployeesByAlias(data.responsable)
      //Validar la respuesta
      if (typeof data.infoResponsable === 'object') {
        //Respuesta del "Responsable" ✅
        const save_om = await DataOportunidad.postCustumize(data);
        if (save_om && save_om.status === 200) {
          //Respuesta del "Registro OM" ✅
          data['id'] = save_om.result.updates.updatedData.values[0][0]
          try {
            //Buscar datos del "Creador"
            data.infoCreator = await DataEmployees.getEmployeesByAlias(data.registrado_por);
            //Validar la respuesta
            if (typeof data.infoCreator === 'object') {
              //Respuesta del "Creador" ✅
              const send_email = await email.altaOportunidad(data);
              if(send_email && send_email.status === 200) {
                const message = `
                La ${data.tipo} ha sido ingresada ✅
                <br>El responsable de su gestión es <strong>${data.infoResponsable.fullName}</strong>
                <br>📧 Se ha notificado por email ✅
                `
                template.modal.success(message)
              }
              else {
                const message = `
                La ${data.tipo} ha sido ingresada ✅.
                <br>El responsable de su gestión es <strong>${data.infoResponsable.fullName}</strong>
                <br>📧 No se ha podido enviar el mail de notificación ❌
                <br><em> Toma las siguientes medidas:</em>
                <ul>
                <li>Comunicate con <strong>${data.infoResponsable.fullName}</strong> para darle aviso del desvío</li>
                <li>Comunicate con <strong>El encargado del sector de sistemas</strong> por el inconveniente en la notificación 📧</li>
                </ul>
                `
                template.modal.warning(message)
              }
            }
            else {
              //Respuesta del "Creador" ❌
              template.modal.problems('No se pudieron obtener los datos del "Creador"')
            }
          }
          catch (e) {
            console.log(e);
          }
        }
        else {
          //Respuesta del "Registro OM" ❌
          template.modal.problems(`No se pudo guardar la ${data.tipo}`)
        }
      }
      else {
        //Respuesta del "Responsable" ❌
        template.modal.problems('No se pudieron obtener los datos del "Responsable"')
      } 
      location.hash = "/"
      
    } catch (e) {
      console.log(e);
    }

  }
}
export default AddOportunidad