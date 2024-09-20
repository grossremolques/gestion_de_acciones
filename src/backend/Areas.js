import ApiServices from "./ApiServices";
import { options } from "@components/Form";
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
  async getSectores(data) {
    const inputArea = document.getElementById("area");
    const loadSectores = async (data) => {
      const area = data ? data.area : inputArea.value;
      try {
        const sectores = await this.getSectoresByArea(area);
        const input = document.getElementById("sector");
        const optionsSectores = options({ data: sectores, textNode: "sector" });
        input.innerHTML = optionsSectores;
        input.value = data ? data.sector : "";
      } catch (e) {
        console.log(e);
      }
    };
    if (data) {
      await loadSectores(data);
    }
    inputArea.addEventListener("change", async () => {
      await loadSectores();
    });
  }
}
const DataAreas = new Areas({
  sheetId: SheetId,
  nameSheet: "Areas y Sectores",
  rowHead: 1,
});
export default DataAreas;
