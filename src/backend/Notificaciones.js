import { today } from "../utils/Tools";
const site = "http://localhost:3000"; //'https://grossremolques.github.io/gestion_de_acciones/'
const styles = {
    email: "font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; max-width: 400px; color: #333; font-size: 1rem; margin: auto;",
    card: "border: #e7e7e7 solid 1px; padding: 0; background-color: #f7f7f5; border-radius: 15px;",
    card_item: "font-size: 0.9rem; list-style-type: none; border-bottom: #ddd solid 1px; padding: 10px 7px 7px 15px",
    buton_link: "background-color: #dc3545; border: none; padding: 0.35rem 0.5rem; color: white; text-decoration: none; font-size: 0.95rem; border-radius: 0.45rem; width: 100%; display: block; text-align: center; font-weight: 700;"     
}
class Notificaciones {
  async sendEmail(data) {
    try {
      const message =
        "To:" +
        data.recipient +
        "\r\n" +
        "Subject:" +
        data.subject +
        "\r\n" +
        "Content-Type: text/html; charset=utf-8\r\n\r\n" +
        data.body;
      const encodedMessage = btoa(message);
      const sendResponse = await gapi.client.gmail.users.messages.send({
        userId: "me",
        resource: {
          raw: encodedMessage,
        },
      });
      return sendResponse
    } catch (error) {
      console.error(error);
    }
  }
  async alta(data) {
    const body = `
    <div class="email" style="${styles.email}">
        <h1 style="font-size: 1.6rem;line-height: 1.8rem;">Alta de Salida no conforme</h1>
        <p class="lead" style="font-size: 1.1rem">Estimado/a <strong>${data.infoResponsable.fullName}</strong>,</p>
        
        <p class="text-danger">Se ha registrado una <strong>Salida No Conforme</strong> en el sistema. A continuación, se proporcionan los detalles del desvío:</p>
    
        <ul style="${styles.card}">
            <li style="${styles.card_item}"><strong>Registrado por:</strong><br> ${data.infoCreator.fullName}</li>
            <li style="${styles.card_item}"><strong>Fecha de registro:</strong><br> ${today}</li>
            <li style="${styles.card_item}"><strong>ID de la No Conformidad:</strong><br> ${data.id}</li>
            <li style="${styles.card_item}"><strong>Área:</strong><br> ${data.area}</li>
            <li style="${styles.card_item}"><strong>Sector:</strong><br> ${data.sector}</li>
            <li style="${styles.card_item}"><strong>Tipo de desvío:</strong><br> ${data.tipo_desvio}</li>
            <li style="${styles.card_item}"><strong>Origen de la no conformidad:</strong><br> ${data.origen}</li>
            <li style="${styles.card_item}; border-bottom:none"><strong>Responsable de su gestión:</strong><br> ${data.infoResponsable.fullName}</li>
        </ul>
        
        <p>Te recordamos la importancia de gestionar esta salida no conforme con celeridad para minimizar cualquier posible impacto. Por favor, revisa los detalles y actúa en consecuencia.</p>
        
        <p>Si tienes alguna duda o necesitas más información, comunicate con el encargado del <em style="color: blue">Sistema de Gestión de la Calidad</em>.</p>

        <a href="${site}/#/no-conformidad=${data.id}/" style="${styles.buton_link}">Ir a la No conformidad</a>

        <p>Saludos cordiales</p>
    </div>
    `;
    return await this.sendEmail({
      recipient: data.infoResponsable.email_empresa,
      subject: `Nueva Salida no conforme. ID: ${data.id}`,
      body: body,
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
