import ApiServices from "./ApiServices";
import DataEmployees from "./Employees";
const SheetId = process.env.SHEETID_OP;
class Oportunidad extends ApiServices {
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
    data['id'] = await this.createId()
    try {
      const response = await this.postData(data);
      return response
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

const Attributes = new Oportunidad({
  sheetId: SheetId,
  nameSheet: "Atributos",
  rowHead: 1,
});
const DataOportunidad = new Oportunidad({ sheetId: SheetId, nameSheet: "Registro", rowHead: 1 });
//const DataResponsable = new Oportunidad({ sheetId: SheetId, nameSheet: "Responsables", rowHead: 1 });
//const DataPermisos = new Oportunidad({ sheetId: SheetId, nameSheet: "Permisos", rowHead: 1 });
export { DataOportunidad, Attributes};
