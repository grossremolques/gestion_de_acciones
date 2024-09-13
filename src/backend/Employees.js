import ApiServices from "./ApiServices";
const SheetId = process.env.SHEETID_EMPLOYEES;
class Employees extends ApiServices {
  constructor(props) {
    super(props);
  }
  async getEmployees() {
    try {
      const response = await this.getDataInJSON();
      const employees = response.map((item) => {
        item.fullName = `${item.apellido} ${item.nombre}`;
        return item;
      });
      employees.push({fullName: 'No aplica', alias : 'No aplica'})
      return employees;
    } catch (e) {
      console.log(e);
    }
  }
  //ordenar
  async sortEmployees() {
    try {
      const response = await this.getEmployees();
      const sort = response.sort((a, b) => {
        if (a.apellido < b.apellido) {
          return -1;
        }
        if (a.apellido > b.apellido) {
          return 1;
        }
        return 0;
      })
      return sort;
    } catch (e) {
      console.log(e);
    }
  }
  async getResponsables() {
    try {
      const response = await this.sortEmployees();
      const responsables = response.filter(item => item.email_empresa!='' && item.activo === 'Sí' && item.tipo_personal === 'INTERNO');
      return responsables;
    } catch (e) {
      console.log(e);
    }
  }
  async getActiveUser() {
    try {
      const email = await this.getEmail();
      const response = await this.getEmployees();
      const user = response.find((item) => item.email_empresa === email);
      return user;
    } catch (e) {
      console.log(e);
    }
  }
  async getLegajo() {
    try {
      const response = await this.getActiveUser();
      return response.legajo;
    } catch (e) {
      console.log(e);
    }
  }
  async getLegajoByAlias(alias) {
    try {
      const response = await this.getEmployees();
      const employ = response.find(item => item.alias === alias)
      return employ.legajo;
    } catch (e) {
      console.log(e);
    }
  }
  async getEmployeesByAlias(alias) {
    try {
      const response = await this.getEmployees();
      const employ = response.find(item => item.alias === alias)
      return employ;
    } catch (e) {
      console.log(e);
    }
  }
}
const DataEmployees = new Employees({
  sheetId: SheetId,
  nameSheet: "Registro",
  rowHead: 1,
});
export default DataEmployees;
