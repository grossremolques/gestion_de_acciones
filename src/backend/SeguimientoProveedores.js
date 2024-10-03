import ApiServices from "./ApiServices";
import DataProveedores from "./Proveedores"; 
import { DataNoConformidad } from "./NoConfomidad";
import { dataJoin } from "@utils/Tools";
const SheetId = process.env.SHEETID_SEG_PROV;
class SegProveedores extends ApiServices {
  async getData() {
    try{
      const dataProv = await DataProveedores.getDataInJSON();
      if(typeof dataProv === 'object') {
        dataProv.map(item => {
          item['id_prov'] = item.id;
          delete item.id;
          return item
        })
        try {
          const dataNoConf = await DataNoConformidad.getDataInJSON();
          if(typeof dataNoConf === 'object') {
            dataNoConf.map(item => {
              item['id_nc'] = item.id;
              item['status_nc'] = item.status;
              delete item.id;
              delete item.status;
              return item
            })
            dataJoin(dataNoConf, dataProv, 'id_prov','id_prov');
            try {
              const data = await this.getDataInJSON();
              if(typeof data === 'object') {
                dataJoin(data, dataNoConf, 'id_nc','id_nc');
                return data
              }
              else {this.modal.error(e)}
            }
            catch(e) {
              console.log(e)
            }
          }
          else {this.modal.error(e)}
        }
        catch(e) {
          console.log(e)
        }
      }
      else {this.modal.error(e)}
    }
    catch(e) {
      console.log(e)
    }
  }
  async getDataById(id) {
    try {
      const response = await this.getData();
      if(typeof response === 'object') {
        const preveedor = response.find((item) => item.id === id);
        return preveedor;
      }
    } catch (e) {
      console.error(e);
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
}
const DataSegProveedores = new SegProveedores({
  sheetId: SheetId,
  nameSheet: "Copia de Registro",
  rowHead: 1,
});
const AttributesSP = new SegProveedores({
  sheetId: SheetId,
  nameSheet: "Atributos",
  rowHead: 1,
});
export {DataSegProveedores, AttributesSP};
