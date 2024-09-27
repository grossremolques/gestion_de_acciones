import { MainTitle } from "@components/Titles";
import NoConformidades from "@templates/NoConformidad";
import { DataNoConformidad } from "@backend/NoConfomidad";
import { getDataFormValid, isEmptyObjet, permissions} from "@utils/Tools";
import { buttonComponent } from "@components/Form";
import DataEmployees from "@backend/Employees";
import IconReject from '@icons/rechazado.png'
import Notificaciones from "@backend/Notificaciones";
import {DataSegProveedores} from "../../backend/SeguimientoProveedores";
const template = new NoConformidades()
let form
const email = new Notificaciones()
const AddNoConfomidad = async (content) => {
  const permissionsUser = await permissions();
  const codigo_permisos = Number(permissionsUser.num)
  const isGestorProv = codigo_permisos > 1;
    const view = `
      ${MainTitle({title:'Nueva No conformidad', urlIcon: IconReject})}
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
    `
    content.innerHTML = view;
    form = document.getElementById('formNC')
    await template.setting()

    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", handleSave);
}
const handleSave = async (event) => {
  const data = getDataFormValid(event,form,'.form-control')
  if(!isEmptyObjet(data)) {
    template.modal.saving()
    try{
      //Buscar datos del "Responsable"
      data.infoResponsable = await DataEmployees.getEmployeesByAlias(data.responsable)
      //Validar la respuesta
      if (typeof data.infoResponsable === 'object') {
        //Respuesta del "Responsable" ✅
        const save_nc = await DataNoConformidad.postCustumize(data);
        if (save_nc && save_nc.status === 200) {
          //Respuesta del "Registro NC" ✅
          data['id'] = save_nc.result.updates.updatedData.values[0][0]
          const responsableByDefault = template.responsableByDefault ? 'La gestión de la misma será <u>evaluada y determinada</u> por' : 'El responsable de su gestión es'
          try{
            //Buscar datos del "Creador"
            data.infoCreator = await DataEmployees.getEmployeesByAlias(data.registrado_por);
            //Validar la respuesta
            if (typeof data.infoCreator === 'object') {
              //Respuesta del "Creador" ✅
              let reclamoResponse
              if(data.reclamo_proveedor === 'Sí') {reclamoResponse = await handleReclamoProveedor(data)}
              
              const send_email = await email.altaNoConformidad(data);
              if(send_email && send_email.status === 200) {
                
                const message = `
                La no conformidad ha sido ingresada ✅
                <br>${responsableByDefault} <strong>${data.infoResponsable.fullName}</strong>
                <br>📧 Se ha notificado por email ✅
                ${reclamoResponse ? `<br>${reclamoResponse}` : ''}
                `
                template.modal.success(message)
              }
              else {
                const message = `
                La no conformidad ha sido ingresada ✅.
                <br>${responsableByDefault} <strong>${data.infoResponsable.fullName}</strong>
                ${reclamoResponse ? `<br>${reclamoResponse}` : ''}
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
              template.modal.problems('No se pudieron obtener los datos del "Responsable"')
            }
          } 
          catch (e) {
            console.log(e);
          }
        }
        else {
          //Respuesta del "Registro NC" ❌
          template.modal.problems(`No se pudo guardar la no conformidad`)
        }
      }
      else {
        //Respuesta del "Responsable" ❌
        template.modal.problems('No se pudieron obtener los datos del "Responsable"')
      } 
      
    }
    catch (e) {
      console.log(e);
    }
    
  }
  else {
    const message = `
    Por favor, revisa el formulario.
    `
    template.modal.warning(message)
  }
}
const handleReclamoProveedor = async (data) => {
  data['id_nc'] = data.id
  try {
    const response = await DataSegProveedores.postCustumize(data);
    if (response && response.status === 200) {
      //Respuesta del "Seguimiento a Proveedores" ✅
      data['id'] = response.result.updates.updatedData.values[0][0];
      try{
        //Buscar datos del "Creador"
        data.infoComprador = await DataEmployees.getEmployeesByAlias('TEST');
        data.infoCreator = await DataEmployees.getEmployeesByAlias(data.registrado_por);
        //Validar la respuesta
        if (typeof data.infoCreator === 'object' && typeof data.infoComprador === 'object') {
          //Respuesta del "Creador" ✅
          const send_email = await email.altaReclamoProveedor(data);
          if(send_email && send_email.status === 200) {
            return `🚧 ${data.infoComprador.fullName} fué notificado sobre el reclamo al proveedor ✅`
          }
          else {
            return `🚧 ${data.infoComprador.fullName} no pudo notificado sobre el reclamo al proveedor ❌`
          }
        }
        else {
          //Respuesta del "Creador" ❌
          template.modal.problems('No se pudieron obtener los datos del "Responsable"')
        }
      } 
      catch (e) {
        console.log(e);
      }
      
    }
    else {
      //Respuesta del "Seguimiento a Proveedores" ❌
      template.modal.problems(`No se pudo guardar en Seguimiento a Proveedores`)
    }
    return response
  }
  catch (e) {
    console.log(e);
  }

}

export default AddNoConfomidad