function getMenu() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Menu');
  const [headers, ...menu] = spreadsheet.getDataRange().getDisplayValues();

  const menuDaily = loadMenuForDate("2025-11-13", headers, menu);
  Logger.log(menuDaily)

}

function loadMenuForDate(date, headers, menu) {
  const dateIdx = headers.indexOf('date');
  const menuForDate = menu.filter(row => row[dateIdx] == date);

  const menuObj = [];
  menuForDate.forEach((item, key) => {
    itemObj = {key};
    headers.forEach((h, idx) => {
      itemObj[h] = item[idx];
    })
    menuObj.push(itemObj);
  });
  return menuObj;
}
