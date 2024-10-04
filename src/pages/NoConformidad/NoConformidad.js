import { MainTitle } from "@components/Titles";
import NoConformidades from "@templates/NoConformidad";
import { DataNoConformidad } from "@backend/NoConfomidad";
import { permissions, getHash, loadInputsById, getDataFormValid, isEmptyObjet, today , listenerChangeEvent, getDataForm} from "@utils/Tools";
import { buttonComponent } from "@components/Form";
import DataEmployees from '@backend/Employees'
const template = new NoConformidades()
let ID
let form
let hasInitDate
let myData
const NoConfomidad = async (content) => {
  const permissionsUser = await permissions();
  const codigo_permisos = Number(permissionsUser.num)
  const canGestion = codigo_permisos > 0
  ID = getHash().replace("no-conformidad=", "");
  myData = await DataNoConformidad.getNC(ID)
  const isCreator = myData.registrado_por === permissionsUser.alias
  const isResponse = myData.responsable === permissionsUser.alias
  const canSeeNC = canGestion && (isCreator || isResponse || codigo_permisos === 3)
  if (canSeeNC) {
    hasInitDate = myData.fecha_inicio!=''
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
        ${codigo_permisos === 3 ? `
          ${buttonComponent({
            type: "button",
            color: "danger",
            id: "updatePRO",
            title: "Actualizar PRO",
            col: "auto",
            xlCol: "auto",
            mdCol: "auto",
            className: 'ms-auto'
          })}
          ` : ''}
      </div>
    `
    content.innerHTML = view;
    await template.setting(myData)
    form = document.getElementById('formNC')
    loadInputsById(myData,form)
    listenerChangeEvent(form)
    const saveButton = document.getElementById("saveButton");
    const updatePRO = document.getElementById("updatePRO");
    saveButton.addEventListener("click", handleUpdate);
    if(updatePRO) {
      updatePRO.addEventListener('click', async() => {
        const data = getDataForm(form, '.change-save');
        const completedData = getDataForm(form, '.form-control');
        if (!isEmptyObjet(data)) {
          template.modal.saving();
          const response = {}
          response['update'] = await updateNoConf(data);
          if(response.update && data.responsable != myData.responsable){ 
            const responseEmail = await template.sendEmailToResponsable(completedData);
            response['email'] = responseEmail
          }
          const infoResponsable = await DataEmployees.getEmployeesByAlias(data.responsable);
          template.modal.create({
            title: '📢 Notificación',
            content: `
            <ul class="list-group list-group-flush">
              <li class="list-group-item">${response.update ? '✅ Actualizado exitosamente en <strong>no conformidades</strong>': '❌ Falló el registro del desvío'}</li>
      
              ${data.responsable != myData.responsable ? `<li class="list-group-item">${response.email ? `✅ 📧 Se notificó por email exitosamente a <strong>${infoResponsable.fullName}</strong>`: `❌ 📧 No fué posible entregar el email a <strong>${infoResponsable.fullName}</strong>`}</li>`: ''}
            </ul>
            `
          })
        }
      })
    }
  }
  else {
    location.hash = "/no-permissions"
  }
}
const handleUpdate = async (event) => {
  const response = {}
  //Validar Formulario
  const data = getDataFormValid(event,form,'.change-save, .test')
  const completedData = getDataFormValid(event,form,'.form-control')
  completedData['id'] = ID
  if (!isEmptyObjet(data)) {
    data.registrado_por = myData.registrado_por
    template.modal.saving();
    response['noConformidad'] = await handleNoConformidad(data, completedData)
    if(data.reclamo_proveedor != myData.reclamo_proveedor) {
      data['id_nc'] = ID
      response['reclamo'] = await template.handleReclamo(data)
    }
    const infoResponsable = await DataEmployees.getEmployeesByAlias(data.responsable);
    const infoComprador = await DataEmployees.getEmployeesByAlias('MAMUL');
    template.modal.create({
      title: '📢 Notificación',
      content: `
      <ul class="list-group list-group-flush">
        <li class="list-group-item">${response.noConformidad.update ? '✅ Actualizado exitosamente en <strong>no conformidades</strong>': '❌ Falló el registro del desvío'}</li>

        ${data.responsable != myData.responsable ? `<li class="list-group-item">${response.noConformidad.email ? `✅ 📧 Se notificó por email exitosamente a <strong>${infoResponsable.fullName}</strong>`: `❌ 📧 No fué posible entregar el email a <strong>${infoResponsable.fullName}</strong>`}</li>`: ''}

        ${data.reclamo_proveedor != myData.reclamo_proveedor && data.reclamo_proveedor === 'Sí' ? `<li class="list-group-item">${response.reclamo.update ? '✅ Guardado exitosamente en <strong>seguimiento a proveedores</strong>': '❌ Falló el registro del reclamo'}</li>`: ''}

        ${data.reclamo_proveedor != myData.reclamo_proveedor && data.reclamo_proveedor === 'Sí' ? `<li class="list-group-item">${response.reclamo.email ? `✅ 📧 Se notificó por email exitosamente a <strong>${infoComprador.fullName}</strong>`: `❌ 📧 No fué posible entregar el email a <strong>${'Matías Muller'}</strong>`}</li>`: ''}
      </ul>
      `
    })
    console.log(response)
  }
}
const handleNoConformidad = async (data, completedData) => {
  if(!hasInitDate) {data.fecha_inicio = today}
  const response = {}
  const responseUpdate = await updateNoConf(data);
  response['update'] = responseUpdate
  if(responseUpdate && data.responsable != myData.responsable){ 

    const responseEmail = await template.sendEmailToResponsable(completedData);
    response['email'] = responseEmail
  }
  return response
}
const updateNoConf = async (data) => {
  try {
    const response = await DataNoConformidad.updateData({
      colName: "id",
      id: ID,
      values: data,
    });
    return response && response.status === 200
  }
  catch(e) {
    console.log(e)
  }
}
export default NoConfomidad