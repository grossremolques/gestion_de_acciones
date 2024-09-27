import ApiServices from "./ApiServices";
const SheetId = process.env.SHEETID_PROV;
class Proveedores extends ApiServices {
  async sorted() {
    try {
      const response = await this.getDataInJSON();
      const data = response.sort((a, b) => Number(a.id) - Number(b.id));
      return data;
    } catch (e) {
      console.error(e);
    }
  }
  async getProveedor(id) {
    try {
      const response = await this.getDataInJSON();
      const preveedor = response.find((item) => item.id === id);
      return preveedor;
    } catch (e) {
      console.error(e);
    }
  }
}
const DataProveedores = new Proveedores({
  sheetId: SheetId,
  nameSheet: "BASE",
  rowHead: 1,
});
export default DataProveedores;
