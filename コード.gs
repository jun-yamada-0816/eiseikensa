function doGet(e) {
  const template = HtmlService.createTemplateFromFile('index');
  template.deployURL = ScriptApp.getService().getUrl();
  template.lineNames = getlineNames(); 
  template.initDate = getCurrentDate();
  const htmlOutput = template.evaluate();
  return htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  if (e.parameter.eiseikensa) {
    const selectedValue = e.parameter.eiseikensa;
    const valueC = selectedValue.split(' ')[0];
    const valueD = selectedValue.split(' ')[1];
    const template = HtmlService.createTemplateFromFile('eiseikensa');
    template.deployURL = ScriptApp.getService().getUrl();

    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d');
    let dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(today);

    if (!dataSheet) {
        const emptySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('空');
        if (emptySheet) {
            dataSheet = emptySheet.copyTo(SpreadsheetApp.getActiveSpreadsheet()).setName(today);
        }
    }

    const registeredRow = dataSheet.createTextFinder(valueC).matchEntireCell(true).findNext();
    let employeeData = [];
    if (registeredRow) {
      employeeData = dataSheet.getRange(registeredRow.getRow(), 4, 1, dataSheet.getLastColumn()).getValues()[0];
    }

    template.valueC = valueC;
    template.valueD = valueD;
    template.createSanitary = createSanitary(employeeData);
    return template.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }

  if (e.parameter.submit || e.parameter.modoru) {
    if (e.parameter.submit) {
      const valueC = e.parameter.valueC;
      const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d');
      let dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(today);
      
      let employeeData = [new Date(), valueC, e.parameter.valueD];
      for (let i = 1; i <= 26; i++) {
        employeeData.push(e.parameter[`item${i}`] === '✔' ? '✔' : '');
      }
      employeeData.push(e.parameter[`text1`] || '', e.parameter[`text2`] || '');

      const registeredRow = dataSheet.createTextFinder(valueC).matchEntireCell(true).findNext();
      if (registeredRow) {
        dataSheet.getRange(registeredRow.getRow(), 1, 1, employeeData.length).setValues([employeeData]);
      } else {
        dataSheet.appendRow(employeeData);
      }

      const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('社員マスタ');
      const masterRow = masterSheet.createTextFinder(valueC).matchEntireCell(true).findNext();
      if (masterRow) masterSheet.getRange(masterRow.getRow(), 3).setValue('〇');
    }

    const template = HtmlService.createTemplateFromFile('index');
    template.deployURL = ScriptApp.getService().getUrl();
    template.lineNames = getlineNames(); 
    template.initDate = getCurrentDate();
    return template.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } 
}

// --- 共通ロジック ---
function getCurrentDate() {
  const t = new Date();
  return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
}

function getlineNames() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ライン');
  return s && s.getLastRow() >= 2 ? s.getRange('A2:A' + s.getLastRow()).getValues().flat() : [];
}

function getD8Values(sheetName, formattedDate) {
  const files = DriveApp.getFolderById('1WR0pparjXhq7eLUGMPsbOO8WxB7RwCl1').getFilesByName('080_' + formattedDate + '_作業時間管理書');
  if (files.hasNext()) {
    const sheet = SpreadsheetApp.open(files.next()).getSheetByName(sheetName);
    if (sheet) return sheet.getRange('C8:D' + sheet.getLastRow()).getValues().filter(r => r[0] && r[1]);
  }
  return [];
}

function createSanitary(employeeData) {
  let idx = 0;
  const hasData = Array.isArray(employeeData) && employeeData.length > 0;
  const items = Array.from({length: 26}, () => hasData ? employeeData[idx++] === '✔' : false);
  const t1 = hasData ? employeeData[idx++] : '';
  const t2 = hasData ? employeeData[idx++] : '';

  const labels = [
    ["手洗い・ローラー掛を実施した", "Đã thực hiện rửa tay/con lăn"],
    ["作業服・靴等の状態", "Tình trạng trang phục/giày"],
    ["作業服・靴等着用状況", "Tình trạng mặc trang phục/giày"],
    ["ひげ・過度な化粧等", "Râu/trang điểm quá mức"],
    ["爪の長さ", "Chiều dài móng tay"],
    ["貧血、高・低血圧がある", "Có thiếu máu/huyết áp cao/thấp"],
    ["発熱(37.0)以上ある", "Có sốt (trên 37.0 độ)"],
    ["下痢・吐き気がある", "Tiêu chảy/buồn nôn"],
    ["手指怪我がある", "Có thương tích ở tay"],
    ["歯科治療 治療中", "Đang điều trị nha khoa"],
    ["歯科治療 異常がない", "Không có bất thường nha khoa"],
    ["黄疸がある", "Có dấu hiệu vàng da"],
    ["目、鼻分泌物がある", "Có chất nhầy ở mắt/mũi"],
    ["その他風邪の症状がある", "Triệu chứng cảm cúm khác"],
    ["腰痛がある", "Có đau lưng"],
    ["メガネ", "Kính mắt"],
    ["ヘアピン", "Kẹp tóc"],
    ["ヘアゴム", "Dây buộc tóc"],
    ["義歯等", "Răng giả"],
    ["医療器具等", "Dụng cụ y tế"],
    ["会社指定絆創膏", "Băng vết thương quy định"],
    ["フォークリフト免許証", "Bằng lái xe nâng"],
    ["薬等", "Thuốc"],
    ["コンタクト 使用者", "Người dùng kính áp tròng"],
    ["コンタクト 紛失した者", "Người mất kính áp tròng"],
    ["指導有", "Có chỉ đạo"]
  ];

  let html = `<div class="list-group list-group-flush">`;
  labels.forEach((label, i) => {
    if ([0, 5, 15, 25].includes(i)) {
      const titles = ["●日常確認 / Kiểm tra hàng ngày", "●健康状態 / Tình trạng sức khỏe", "●持ち込み確認 / Đồ mang theo", "●指導者記入欄 / Người hướng dẫn"];
      html += `<div class="list-group-item bg-light font-weight-bold py-3 text-primary">${titles[[0, 5, 15, 25].indexOf(i)]}</div>`;
    }
    html += `
    <label class="list-group-item d-flex justify-content-between align-items-center py-3" style="cursor:pointer">
      <div>
        <div class="mb-0 font-weight-bold" style="font-size:0.95rem">${label[0]}</div>
        <small class="text-muted font-italic">${label[1]}</small>
      </div>
      <input type="checkbox" name="item${i+1}" value="✔" ${items[i] ? 'checked' : ''} style="width:25px; height:25px;">
    </label>`;
  });
  
  html += `
    <div class="p-3 bg-white">
      <div class="form-group mb-3">
        <label class="small font-weight-bold">指導実施者 / Người thực hiện chỉ đạo</label>
        <input type="text" name="text1" class="form-control" value="${t1}">
      </div>
      <div class="form-group mb-0">
        <label class="small font-weight-bold">補記 / Ghi chú thêm</label>
        <input type="text" name="text2" class="form-control" value="${t2}">
      </div>
    </div>
  </div>`;
  
  return html;
}
