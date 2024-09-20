import ApiServices from "./ApiServices";
import { today } from "../utils/Tools";
import DataEmployees from "./Employees";
const SheetId = process.env.SHEETID_NC;
class NoConformidad extends ApiServices {
  async getNC(id) {
    try {
      const response = await this.getDataInJSON();
      return response.find(item => item.id === id)
    }
    catch(e) {
      console.log(e)
    }
  }
  async createId() {
    try {
      const response = await this.getDataInJSON();
      const ids = response.map(item => {
        const num = Number(item.id);
        return Number.isNaN(num) ? 0 : Number(item.id)
      })
      const lastId = Math.max(...ids)
      return lastId +1
    }
    catch(e) {
      console.log(e)
    }
  }
  async postCustumize(data) {
    data['a_espera_cliente'] = 'No'
    data['id'] = await this.createId()
    try {
      const response = await this.postData(data);
      return response
    }
    catch(e) {
      console.log(e)
    }
  }
  async getResponsableByType(type) {
    try {
      const response = await this.getDataInJSON();
      const data = response.find(item => item.tipo === type);
      return data
    }
    catch(e) {
      console.log(e)
    }
  }
  async typePermission(alias) {
    try{
      const response = await this.getDataInJSON();
      return response.find(item => item.alias === alias)
    }
    catch(e) {
      console.log(e)
  }
  }
  
}

const Attributes = new NoConformidad({
  sheetId: SheetId,
  nameSheet: "Otros Atributos",
  rowHead: 1,
});
const DataNoConformidad = new NoConformidad({ sheetId: SheetId, nameSheet: "Registro(TEST)", rowHead: 1 });
const DataResponsable = new NoConformidad({ sheetId: SheetId, nameSheet: "Responsables", rowHead: 1 });
const DataPermisos = new NoConformidad({ sheetId: SheetId, nameSheet: "Permisos", rowHead: 3 });
export { DataNoConformidad, Attributes, DataResponsable, DataPermisos };
