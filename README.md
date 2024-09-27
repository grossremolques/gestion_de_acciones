Tengo este codigo para enviar la iformación a mi base.


```javascript
async postData(data) {
    const today = dayjs(new Date(), "YYYY-DD-MM");
    data.fecha = today.format("DD/MM/YYYY");
    if(data.fecha === 'Invalid Date') {window.alert('¡Hubo un problema al registrar la fecha! ❌ Error: Invalid Date 🗓️')}
    convertGroupDates(data,'en-es')
    const headers = await this.getHeaders();
    const newData = this.convertData(data, headers);
    try {
      let response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: this.range,
        includeValuesInResponse: true,
        insertDataOption: "INSERT_ROWS",
        responseDateTimeRenderOption: "FORMATTED_STRING",
        responseValueRenderOption: "FORMATTED_VALUE",
        valueInputOption: "USER_ENTERED",
        resource: {
          majorDimension: "ROWS",
          range: "",
          values: [newData],
        },
      });
      return response;
    } catch (e) {
      console.log("Problems with postData", e);
    }
  }
```
si aplico lo siguiente:
```javascript
const response = await postData(data);
//y si la respuesta es negativa, me aparecerá 
```
