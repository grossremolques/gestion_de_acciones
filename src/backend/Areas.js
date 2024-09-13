import ApiServices from "./ApiServices";
const SheetId = process.env.SHEETID_AREAS
class Areas extends ApiServices {
  constructor(props) {
    super(props);
  }
  async getSectoresByArea(area) {
    try {
      const data = await this.getDataInJSON();
      return data.filter(item => item.area === area)
    }
    catch(e) {
      console.log(e)
    }
  }
}
const DataAreas = new Areas({
  sheetId: SheetId,
  nameSheet: "Areas y Sectores",
  rowHead: 1,
});
export default DataAreas;
