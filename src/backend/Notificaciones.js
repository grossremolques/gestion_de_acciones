import { today } from "../utils/Tools";
import DataEmployees from "@backend/Employees";
const site = 'https://grossremolques.github.io/gestion_de_acciones/'
const styles = {
  email:
    "font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; max-width: 500px; color: #333; font-size: 1rem; margin: auto;",
  card: "border: #e7e7e7 solid 1px; padding: 0; background-color: #f7f7f5; border-radius: 15px;",
  card_item:
    "font-size: 0.9rem; list-style-type: none; border-bottom: #ddd solid 1px; padding: 10px 7px 7px 15px",
  buton_link:
    "border: none; padding: 0.35rem 0.5rem; color: white; text-decoration: none; font-size: 0.95rem; border-radius: 0.45rem; width: 100%; display: block; text-align: center; font-weight: 700;",
  color_btn_red: "background-color: #dc3545;",
  color_btn_purple: "background-color: #6610f2;",
  color_btn_blue: "background-color: #0d6efd;",
};
class Notificaciones {
  async sendEmail(data) {
    try {
      const boundary = "foo_bar_baz"; // Un delimitador para separar las partes del correo
      let message =
        "To:" + data.recipient + "\r\n" + 
        (data.cc && data.cc.length > 0 ? "Cc: " + data.cc.join(", ") + "\r\n" : "") + // Añadir CC si hay correos
        "Subject:" +
        data.subject +
        "\r\n" +
        "Content-Type: multipart/mixed; boundary=" +
        boundary +
        "\r\n\r\n" +
        "--" +
        boundary +
        "\r\n" +
        "Content-Type: text/html; charset=UTF-8\r\n\r\n" + data.body + "\r\n\r\n";

      //"Content-Type: text/html; charset=utf-8\r\n\r\n" + data.body;
      // Si hay adjuntos, los añadimos
      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((attachment) => {
          message +=
            "--" +
            boundary +
            "\r\n" +
            "Content-Type: " +
            attachment.mimeType +
            '; name="' +
            attachment.filename +
            '"\r\n' +
            'Content-Disposition: attachment; filename="' +
            attachment.filename +
            '"\r\n' +
            "Content-Transfer-Encoding: base64\r\n\r\n" +
            attachment.data +
            "\r\n\r\n";
        });
      }
      message += "--" + boundary + "--";
      const encodedMessage = btoa(message); // Convertir a base64
      const sendResponse = await gapi.client.gmail.users.messages.send({
        userId: "me",
        resource: {
          raw: encodedMessage,
        },
      });
      return sendResponse;
    } catch (error) {
      console.error(error);
    }
  }
  async altaNoConformidad(data) {
    const infoResponsable = await DataEmployees.getEmployeesByAlias(data.responsable);
    const infoCreator = await DataEmployees.getEmployeesByAlias(data.registrado_por);
    if (typeof infoResponsable === "object" && typeof infoCreator === "object") {
      const body = `
      <div class="email" style="${styles.email}">
        <h1 style="font-size: 1.6rem;line-height: 1.8rem;">Alta de Salida no conforme</h1>
        <p class="lead" style="font-size: 1.1rem">Estimado/a <strong>${infoResponsable.fullName}</strong>,</p>
        
        <p class="text-danger">Se ha registrado una <strong>Salida No Conforme</strong> en el sistema. A continuación, se proporcionan los detalles del desvío:</p>
        <ul style="${styles.card}">
          <li style="${styles.card_item}"><strong>Registrado por:</strong><br> ${infoCreator.fullName}</li>
          <li style="${styles.card_item}"><strong>Fecha de registro:</strong><br> ${today}</li>
          <li style="${styles.card_item}"><strong>ID de la No Conformidad:</strong><br> ${data.id}</li>
          <li style="${styles.card_item}"><strong>Área:</strong><br> ${data.area}</li>
          <li style="${styles.card_item}"><strong>Sector:</strong><br> ${data.sector}</li>
          <li style="${styles.card_item}"><strong>Tipo de desvío:</strong><br> ${data.tipo_desvio}</li>
          <li style="${styles.card_item}"><strong>Origen de la no conformidad:</strong><br> ${data.origen}</li>
          <li style="${styles.card_item}; border-bottom:none"><strong>Responsable de su gestión:</strong><br> ${infoResponsable.fullName}</li>
        </ul>
        
        <p>Te recordamos la importancia de gestionar esta salida no conforme con celeridad para minimizar cualquier posible impacto. Por favor, revisa los detalles y actúa en consecuencia.</p>
        
        <p>Si tienes alguna duda o necesitas más información, comunicate con el encargado del <em style="color: blue">Sistema de Gestión de la Calidad</em>.</p>

        <a href="${site}/#/no-conformidad=${data.id}/" style="${styles.color_btn_red} ${styles.buton_link}">Ir a la No conformidad</a>

        <p>Saludos cordiales</p>
      </div>
      `;
      return await this.sendEmail({
        recipient: infoResponsable.email_empresa,
        subject: `Nueva Salida no conforme. ID: ${data.id}`,
        body: body,
      });
    }
  }
  async altaOportunidad(data) {
    const body = `
    <div class="email" style="${styles.email}">
        <h1 style="font-size: 1.6rem;line-height: 1.8rem;">Alta de ${data.tipo}</h1>
        <p class="lead" style="font-size: 1.1rem">Estimado/a <strong>${data.infoResponsable.fullName}</strong>,</p>
        
        <p>Se ha registrado una <strong>${data.tipo}</strong> en el sistema. A continuación, se proporcionan los detalles:</p>
    
        <ul style="${styles.card}">
            <li style="${styles.card_item}"><strong>Registrado por:</strong><br> ${data.infoCreator.fullName}</li>
            <li style="${styles.card_item}"><strong>Fecha de registro:</strong><br> ${today}</li>
            <li style="${styles.card_item}"><strong>ID de la ${data.tipo}:</strong><br> ${data.id}</li>
            <li style="${styles.card_item}"><strong>Área:</strong><br> ${data.area}</li>
            <li style="${styles.card_item}"><strong>Sector:</strong><br> ${data.sector}</li>
            <li style="${styles.card_item}"><strong>Aspecto:</strong><br> ${data.aspecto}</li>
            <li style="${styles.card_item}; border-bottom:none"><strong>Responsable de su gestión:</strong><br> ${data.infoResponsable.fullName}</li>
        </ul>
        
        <p>Te recordamos la importancia de gestionar esta ${data.tipo} de manera rápida para fomentar la optimización continua y mitigar posibles riesgos futuros. Por favor, revisa los detalles y toma las acciones necesarias para maximizar el impacto positivo en el proceso.</p>
        
        <p>Si tienes alguna duda o necesitas más información, comunicate con el encargado del <em style="color: blue">Sistema de Gestión de la Calidad</em>.</p>

        <a href="${site}/#/oportunidad=${data.id}/" style="${styles.color_btn_purple} ${styles.buton_link}">Ir a la ${data.tipo}</a>

        <p>Saludos cordiales</p>
    </div>
    `;
    return await this.sendEmail({
      recipient: data.infoResponsable.email_empresa,
      subject: `${data.tipo}. ID: ${data.id}`,
      body: body,
    });
  }
  async altaReclamoProveedor(data) {
    try {
      const infoComprador = await DataEmployees.getEmployeesByAlias('MAMUL');
      const infoCreator = await DataEmployees.getEmployeesByAlias(data.registrado_por);
      if (typeof infoComprador === "object" && typeof infoCreator === "object") {
        const body = `
        <div class="email" style="${styles.email}">
            <h1 style="font-size: 1.6rem;line-height: 1.8rem;">Alta de reclamo a proveedor</h1>
            <p class="lead" style="font-size: 1.1rem">Estimado/a <strong>${infoComprador.fullName}</strong>,</p>
            <p>Se ha registrado una <strong>no conformidad</strong> en el sistema, la cual a generado un <strong>Reclamo a proveedor</strong>. A continuación, se proporcionan los detalles del desvío:</p>
            <ul style="${styles.card}">
              <li style="${styles.card_item}"><strong>Registrado por:</strong><br> ${infoCreator.fullName}</li>
              <li style="${styles.card_item}"><strong>Fecha de registro:</strong><br> ${today}</li>
              <li style="${styles.card_item}"><strong>ID de la no conformidad:</strong><br> ${data.id_nc}</li>
              <li style="${styles.card_item}"><strong>Proveedor:</strong><br> ${data.razon_social_prov}</li>
              <li style="${styles.card_item}"><strong>Producto:</strong><br> ${data.pnc === "Otro" ? data.producto : data.pnc}</li>
              <li style="${styles.card_item}"><strong>Desvío:</strong><br> ${data.desvio}</li>
            </ul>
            <p>Te recordamos la importancia de gestionar este reclamo con el proveedor y hacer un seguimiento riguroso para asegurar una resolución oportuna. Por favor, revisa los detalles, comunícate con el proveedor y actúa en consecuencia.</p>
            
            <p>Si tienes alguna duda o necesitas más información, comunicate con el encargado del <em style="color: blue">Sistema de Gestión de la Calidad</em>.</p>
    
            <a href="${site}/#/seguimiento_proveedor=${data.id}/" style="${
          styles.color_btn_blue
        } ${styles.buton_link}">Ir al reclamo</a>
    
            <p>Saludos cordiales</p>
        </div>
        `;
        return await this.sendEmail({
          recipient: infoComprador.email_empresa,
          subject: `Reclamo a proveedor. ID: ${data.id}`,
          body: body,
        });
      }
      else {
      }
    }
    catch(e) {
      console.log(e)
    }
  }
  bodyEmailFirstReport(data) {
    return `
    <div class="email" style="${styles.email}">
      <h1 style="font-size: 1.6rem;line-height: 1.8rem;">Alta de Reclamo a Proveedor</h1>
      <p style="font-size: 1.1rem">Estimado/a <strong>${data.razon_social}</strong>,</p>
      
      <p>Esperamos que se encuentre bien. Nos dirigimos a usted en relación con un producto no conforme identificado recientemente:</p>
  
      <ul style="${styles.card}">
        <li style="${styles.card_item}"><strong>ID:</strong><br> ${data.id}</li>
        <li style="${styles.card_item}"><strong>Producto:</strong><br> ${data.nombre_yavu}</li>
        <li style="${styles.card_item}"><strong>Detalle del desvío:</strong><br> ${data.description_de_falla}</li>
        <li style="${styles.card_item}"><strong>Disposición tomada:</strong><br> ${data.disposicion}</li>
        <li style="${styles.card_item}"><strong>Número guía de envío:</strong><br> ${data.num_guia}</li>
        <li style="${styles.card_item}; border-bottom:none"><strong>Fecha de guía:</strong><br> ${data.fecha_guia}</li>
      </ul>
      <p>Dado lo anterior, solicitamos de su parte una respuesta a la brevedad posible con relación a este reclamo, le facilitamos un formulario de respuesta, por favor, completelo:</p>
      <a href="https://forms.gle/5JqxFHMcrm6VqwtR9" target="_blank" style="${ styles.color_btn_red} ${styles.buton_link}">Formulario de Respuesta</a>
      <p style="margin-top: 15px">Agradecemos de antemano su colaboración y quedamos atentos al envío del formulario.</p>
      <p>Saludos cordiales</p>
    </div>
    `;
  }
  //https://docs.google.com/forms/d/1xAAJYtrseswMQaYFdDmA4d22UDjh1-lAsI-LojGPV7w/edit
  async sendFirstReport(data) {
    return await this.sendEmail({
      recipient: data.email.recipient,
      cc: data.email.cc,
      subject: `Informe de producto no conforme. ID: ${data.id}`,
      body: this.bodyEmailFirstReport(data),
    });
  }
  async Actualización() {}
  async CambioStatus() {}
  async listLabels() {
    try {
      const response = await gapi.client.gmail.users.labels.list({
        userId: "me",
      });

      const labels = response.result.labels;
      console.log("Labels:", labels);

      return labels;
    } catch (error) {
      console.error("Error al listar etiquetas:", error);
    }
  }
}
export default Notificaciones;
