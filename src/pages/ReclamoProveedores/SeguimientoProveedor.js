import { MainTitle, SubTitle } from "@components/Titles";
import NoConformidades from "@templates/NoConformidad";
import { DataNoConformidad } from "@backend/NoConfomidad";
import { permissions, getHash, loadInputsById, getDataFormValid, isEmptyObjet, today , listenerChangeEvent} from "@utils/Tools";
import { buttonComponent } from "@components/Form";
import { DataSegProveedores } from "@backend/SeguimientoProveedores";
import ReclamoProveedor from "@templates/ReclamoProveedor";
import DataProveedores from "@backend/Proveedores";
import Notificaciones from "@backend/Notificaciones";
import { inputComponent } from "../../components/Form";
import IconTemplate from '@icons/template.png'
const template = new ReclamoProveedor()
const notificaiones = new Notificaciones()
let ID
let myData

const SeguimientoProveedor = async (content) => {
  ID = getHash().replace("seguimiento_proveedor=", "");
  myData = await DataSegProveedores.getDataById(ID);
  console.log(myData)
  if(typeof myData === 'object') {
    const view = `
      ${MainTitle({title:'Gestión de Reclamo a proveedor'})}
      ${await template.form()}
    `
    content.innerHTML = view;
    const forms = document.querySelectorAll('form')
    forms.forEach(element => {
      loadInputsById(myData,element)
      listenerChangeEvent(element)
    });
    template.settings(myData)
    const btnSendFirstReport = document.getElementById('sendFirstReport');
    const saveNC = document.getElementById("update-nc");
    const saveSP = document.getElementById("update-sp");
    const prov = document.getElementById('id_prov');

    saveNC.addEventListener("click", handleSaveNC);
    saveSP.addEventListener("click", handleSaveSP);
    prov.addEventListener('change', handleProveedor);
    btnSendFirstReport.addEventListener('click', handleSendFirstReport)
  }
}
const handleSaveNC = async (event) => {
  const form = document.querySelector('#formNCRP')
  const data = getDataFormValid(event,form,'.change-save')
  if(!isEmptyObjet(data)) {
    template.modal.create({
      title: "🔄 Actualizar datos",
      content: `
            <p class="text-center">Actualizando los datos, por favor espere ⌛</p>
            `,
    });
    template.modal.disableCloseButtons();
    try{
      const response = await DataNoConformidad.updateData({
        colName: "id",
        id: myData.id_nc,
        values: data,
      });
      if (response && response.status === 200) {
        template.modal.create({
          title: "✅ Completado",
          content: '<p class="">Actualizado correctamente el registro de no conformidades</p>',
        });
      }
    }
    catch (e) {
      console.log(e);
    }
  }
}
const handleSaveSP = async (event) => {
  const form = document.querySelector('#formReclamoProveedor')
  const data = getDataFormValid(event,form,'.change-save')
  if(!isEmptyObjet(data)) {
    template.modal.create({
      title: "🔄 Actualizar datos",
      content: `
      <p class="text-center">Actualizando los datos, por favor espere ⌛</p>
      `,
    });
    template.modal.disableCloseButtons();
    try{
      const response = await DataSegProveedores.updateData({
        colName: "id",
        id: ID,
        values: data,
      });
      if (response && response.status === 200) {
        template.modal.create({
          title: "✅ Completado",
          content: '<p class="">Actualizado correctamente el Seguimiento a Proveedores</p>',
        });
      }
    }
    catch (e) {
      console.log(e);
    }
  }
}
const handleProveedor = async (event) => {
  const id = event.target.value
  const input = document.getElementById("razon_social");
  if (id != "0" && id != "") {
    const prov = await DataProveedores.getProveedor(id);
    if (prov) {
      input.value = prov.razon_social;
    } else {
      input.value = "";
      window.alert("🚨🚨 Proveedor no encontrado 😟");
    }
  }
}
const handleSendFirstReport = async (event) => {
  const form = document.querySelector('#formFirstReport');
  const data = getDataFormValid(event,form,'.change-save');
  if(!isEmptyObjet(data)) {
    const dataCompleted = getDataFormValid(event,form,'.form-control');
    dataCompleted.id=ID;
    dataCompleted.razon_social = document.getElementById('razon_social').value
    template.modal.createLargeModal({
      title: "📧 Enviar Correo a Proveedor",
      content: `
      <div style="max-width: 600px; margin:auto">
        <form class="row needs-validation g-1" novalidate id="formEmails">
          ${inputComponent({
            col: "12",
            mdCol: "12",
            xlCol: "12",
            type: "email",
            nameLabel: "📧 Dirección de correo",
            id: "recipient",
            name: "recipient",
            sizes: "sm",
            className: 'mb-3',
            required: true,
            placeholder: 'Destinatario'
          })}
          <div class="col-12 mb-2 input-group-add">
            <div class="input-group input-group-sm">
              <input type="email" class="form-control emails" placeholder="CC" id="con-copia_0" required>
              <span class="input-group-text btn btn-outline-danger delete disabled">
                <svg style="vertical-align: sub" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
              </span>
              <span class="input-group-text btn btn-outline-primary add">
              <svg style="vertical-align: sub" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
              </svg>
              </span>
            </div>
          </div>
        </form>
        ${SubTitle({title: 'Cuerpo del mensaje', mt: 3, urlIcon: IconTemplate})}
        <div class="pt-3 bg-warning-subtle">
          ${notificaiones.bodyEmailFirstReport(dataCompleted)}
        </div>
      </div>`,
    });
    template.modal.addButtonAction({
      type: 'button',
      id: 'sendEmail',
      title: 'Enviar Email',
      color: 'success'
    })
    const formEmails = document.getElementById('formEmails');
    formEmails.addEventListener('click', (event) => {
      const btnAdd = event.target.closest('.add');
      const btnDelete = event.target.closest('.delete');
      const container = event.target.closest('.input-group-add');
      if(btnAdd) {
        const clone = container.cloneNode(true);
        const index =  Number(container.querySelector('input').id.replace('con-copia_',''))
        clone.querySelector(`#con-copia_${index}`).setAttribute('id',`con-copia_${index + 1}`)
        container.insertAdjacentElement('afterend',clone)
        clone.querySelector('.delete').classList.remove('disabled')
      }
      else if(btnDelete) {
        btnDelete.parentNode.remove()
      }
      
    })
    const buttonSendEmail = document.querySelector('#sendEmail');
    buttonSendEmail.addEventListener('click',async ()=> {
      const email = getDataFormValid(event,formEmails,'input');
      if(!isEmptyObjet(email)) {
        const emails = Array.from(document.querySelectorAll('.emails'));
        email['cc'] = emails.map(item=>item.value)
        dataCompleted['email'] = email;
        const sent = await notificaiones.sendFirstReport(dataCompleted)
        console.log(sent)
      }
    })
  }
}
function mostrarImagen(event) {
  const input = event.target;
  const preview = document.getElementById('preview');
  
  // Validar si hay un archivo seleccionado
  if (input.files && input.files[0]) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
          preview.src = e.target.result; // Mostrar la imagen
          preview.style.display = 'block'; // Hacer visible la imagen
      };
      
      reader.readAsDataURL(input.files[0]); // Leer el archivo como una URL
  }
}


export default SeguimientoProveedor