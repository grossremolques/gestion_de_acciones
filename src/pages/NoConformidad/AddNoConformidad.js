import { MainTitle } from "@components/Titles";
import NoConformidades from "@templates/NoConformidad";
import { DataNoConformidad } from "@backend/NoConfomidad";
import { getDataFormValid, isEmptyObjet, permissions } from "@utils/Tools";
import { buttonComponent } from "@components/Form";
import IconReject from "@icons/rechazado.png";
const template = new NoConformidades();
let form;

const AddNoConfomidad = async (content) => {
  const permissionsUser = await permissions();
  const codigo_permisos = Number(permissionsUser.num);
  const isGestorProv = codigo_permisos > 1;
  const view = `
      ${MainTitle({ title: "Nueva No conformidad", urlIcon: IconReject })}
      ${await template.formInit(isGestorProv)} 
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
    `;
  content.innerHTML = view;
  form = document.getElementById("formNC");
  await template.setting();

  const saveButton = document.getElementById("saveButton");
  saveButton.addEventListener("click", handleSave);
};
const handleSave = async (event) => {
  const response = {}
  //Validar Formulario
  const data = getDataFormValid(event, form, ".form-control");
  if (!isEmptyObjet(data)) {
    template.modal.saving();
    response['noConformidad'] = await handleNoConformidad(data)
    //Enviar por correo notificación
    if (data.reclamo_proveedor === "Sí") {
      data['id_nc'] = data.id
      response['reclamo'] = await template.handleReclamo(data)
      //Enviar por correo notificación
    }
    template.modal.create({
      title: '📢 Notificación',
      content: `
      <ul class="list-group list-group-flush">
        <li class="list-group-item">${response.noConformidad.update ? '✅ Guardado exitosamente en <strong>no conformidades</strong>': '❌ Falló el registro del desvío'}</li>
        <li class="list-group-item">${response.noConformidad.email ? `✅ 📧 Se notificó por email exitosamente a <strong>${data.infoResponsable.fullName}</strong>`: `❌ 📧 No fué posible entregar el email a <strong>${data.infoResponsable.fullName}</strong>`}</li>
        ${data.reclamo_proveedor === 'Sí' ? `<li class="list-group-item">${response.reclamo.update ? '✅ Guardado exitosamente en <strong>seguimiento a proveedores</strong>': '❌ Falló el registro del reclamo'}</li>`: ''}
        ${data.reclamo_proveedor === 'Sí' ? `<li class="list-group-item">${response.reclamo.email ? `✅ 📧 Se notificó por email exitosamente a <strong>${data.infoComprador.fullName}</strong>`: `❌ 📧 No fué posible entregar el email a <strong>${data.infoComprador.fullName}</strong>`}</li>`: ''}
      </ul>
      `
    })
  }
}
const handleNoConformidad = async (data) => {
  const response = {}
  const responseUpdate = await saveNoConf(data);
  response['update'] = responseUpdate
  if(responseUpdate){
    const responseEmail = await template.sendEmailToResponsable(data);
    response['email'] = responseEmail
  }
  return response
}
const saveNoConf = async (data) => {
  try {
    const save_nc = await DataNoConformidad.postCustumize(data);
    return save_nc && save_nc.status === 200
  }
  catch(e) {
    console.log(e)
  }
}
export default AddNoConfomidad;
