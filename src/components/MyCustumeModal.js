import { Modal } from "bootstrap";
import { button } from "./Form";
import Loader from "./Loader";
class MyCustumeModal extends Modal {
  constructor(element, options) {
    super(element, options);
  }
  create(props) {
    document.querySelector('.modal-dialog').classList.remove('modal-lg')
    document.querySelector('.modal-dialog').classList.remove('modal-dialog-scrollable')    
    this.deleteButtonAction();
    const buttons = document.querySelectorAll('[data-bs-dismiss="modal"]');
    buttons.forEach((elem) => elem.removeAttribute("disabled", ""));
    document.getElementById("modalLabel").innerHTML = props.title;
    document.querySelector(".modal-body").innerHTML = props.content;
    this.actionCloseButton()
    this.show();
  }
  createLargeModal(props) {
    document.querySelector('.modal-dialog').classList.add('modal-lg')
    document.querySelector('.modal-dialog').classList.add('modal-dialog-scrollable')
    this.deleteButtonAction();
    const buttons = document.querySelectorAll('[data-bs-dismiss="modal"]');
    buttons.forEach((elem) => elem.removeAttribute("disabled", ""));
    document.getElementById("modalLabel").innerHTML = props.title;
    document.querySelector(".modal-body").innerHTML = props.content;
    this.actionCloseButton()
    this.show();
  }
  addButtonAction(props) {
    const btnAction = document.getElementById("btnAction");
    const btn = button(props);
    btnAction.innerHTML = btn;
  }
  deleteButtonAction() {
    const btnAction = document.getElementById("btnAction");
    const button = btnAction.querySelector("button");
    if (button) {
      btnAction.removeChild(button);
    }
  }
  disableCloseButtons() {
    const buttons = document.querySelectorAll('[data-bs-dismiss="modal"]');
    buttons.forEach((elem) => elem.setAttribute("disabled", ""));
  }
  saving() {
    this.create({
      title: "⌛ Guardando",
      content: Loader.templeteLoader(),
    });
    this.disableCloseButtons();
  }
  warning(message) {
    this.create({
      title: "⚠️ Advertencia",
      content: `<p class="text-center">${message}</p>`,
    });
  }
  success(message) {
    this.create({
      title: "✅ Completado",
      content: `<p class="text-center">${message}</p>`,
    });
  }
  holdingRequest() {
    this.create({
      title: "⌛ Procesando",
      content: Loader.templeteLoader(),
    });
    this.disableCloseButtons();
  }
  error(e) {
    console.log(e)
    const messageError = `
        <ul>
          <li>code: ${e.result.error.code}</li>
          <li>message: ${e.result.error.message}</li>
          <li>status: ${e.result.error.status}</li>
        <ul>`
    this.create({
      title: "❌ Error",
      content: `
        <p class="text-center">Hubo un problema</p>
        <code>${messageError}</code>
        `,
    });
  }
  problems(message) {
    const messageError = `
        <p>
          ${message}
        <p>`
    this.create({
      title: "❌ Error",
      content: `
        <p class="text-center">Hubo un problema</p>
        ${messageError}
        `,
    });
  }
  actionCloseButton(callback) {
    const closeButton = document.querySelector(".close-btn");
    closeButton.addEventListener("click", () => {
      this.hide();
    });
  }
}
export default MyCustumeModal;
