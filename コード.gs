/**
 * Webアプリの初期表示
 */
function doGet(e) {
  const template = HtmlService.createTemplateFromFile('index');
  template.deployURL = ScriptApp.getService().getUrl();
  
  // 表示速度向上のため、事前にライン名と日付を埋め込む
  template.lineNames = getlineNames(); 
  template.initDate = getCurrentDate();
  
  const htmlOutput = template.evaluate();
  return htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * フォーム送信時の処理
 */
function doPost(e) {
  // 従業員選択後の検査画面表示
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

  // データ登録、または戻るボタン
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

    // index画面に戻る
    const template = HtmlService.createTemplateFromFile('index');
    template.deployURL = ScriptApp.getService().getUrl();
    template.lineNames = getlineNames(); 
    template.initDate = getCurrentDate();
    return template.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } 
}

// --- ユーティリティ・準備用関数 ---

function showDatePicker() {
  const html = HtmlService.createHtmlOutput(`
    <div style="font-family:sans-serif; padding:10px;">
      <p>日付を選択して実行してください</p>
      <input type="date" id="dateInput" class="form-control" style="width:100%; margin-bottom:10px;">
      <button onclick="submitDate()" style="background:#007bff; color:white; border:none; padding:8px 15px; border-radius:4px; width:100%;">実行</button>
      <div id="progressMessage" style="margin-top: 10px; font-size:0.9rem; color:#666;"></div>
    </div>
    <script>
      function submitDate() {
        const datePickerValue = document.getElementById('dateInput').value;
        const progressMessage = document.getElementById('progressMessage');
        if (datePickerValue) {
          progressMessage.textContent = '外部ファイルからデータ取得中...';
          const dateObj = new Date(datePickerValue);
          const formattedDate = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
          google.script.run.withSuccessHandler(function() {
            progressMessage.textContent = '完了しました！';
            setTimeout(() => google.script.host.close(), 1000);
          }).newsheet(formattedDate);
        }
      }
    </script>
  `).setWidth(300).setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'データ準備');
}

function newsheet(manualDate) {
  const formattedDate = manualDate || getCurrentDate();
  const sheetNames = getSheetNames(formattedDate);
  const lineSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ライン');
  
  if (lineSheet) {
    lineSheet.getRange('A2:A').clearContent();
    const excludeValues = ['配置未定(当日欠勤者)', '他工場応援', '欠勤'];
    let rowIndex = 2;
    for (var i = 0; i < sheetNames.length; i++) {
      if (!excludeValues.includes(sheetNames[i])) {
        lineSheet.getRange(rowIndex, 1).setValue(sheetNames[i]);
        rowIndex++;
      }
    }
  }

  // 今日のシート準備
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d');
  let dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(today);
  if (!dataSheet) {
      const emptySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('空');
      if (emptySheet) {
          dataSheet = emptySheet.copyTo(SpreadsheetApp.getActiveSpreadsheet()).setName(today);
      }
  }

  // マスターのクリア
  if (dataSheet) {
    const employeeMasterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('社員マスタ');
    if (employeeMasterSheet) {
        const lastRow = employeeMasterSheet.getLastRow();
        if (lastRow >= 2) {
            employeeMasterSheet.getRange(2, 3, lastRow - 1).clearContent();
        }
    }
  }

  // 外部フォルダからの情報同期
  const excludeValuesForSync = ['配置未定(当日欠勤者)', '他工場応援', '欠勤'];
  const folderId = '1WR0pparjXhq7eLUGMPsbOO8WxB7RwCl1';
  const files = DriveApp.getFolderById(folderId).getFilesByName('080_' + formattedDate + '_作業時間管理書');
  
  while (files.hasNext()) {
    const spreadsheet = SpreadsheetApp.open(files.next());
    const sheets = spreadsheet.getSheets();
    for (let i = 0; i < sheets.length; i++) {
      const sheet = sheets[i];
      const sheetName = sheet.getName();
      if (excludeValuesForSync.includes(sheetName)) {
        const values = sheet.getRange('C8:C' + sheet.getLastRow()).getValues();
        const cleanedValues = values.flat().map(v => v.toString().replace(/^0+/, ''));
        const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('社員マスタ');
        if (masterSheet.getFilter()) masterSheet.getFilter().remove();
        const masterData = masterSheet.getRange('A:A').getValues();

        for (let j = 0; j < cleanedValues.length; j++) {
          const employeeId = cleanedValues[j];
          for (let k = 0; k < masterData.length; k++) {
            if (masterData[k][0] == employeeId) {
                const writeValue = (sheetName == '配置未定(当日欠勤者)') ? '当欠' : (sheetName == '他工場応援' ? '応援' : '欠勤');
                masterSheet.getRange(k + 1, 3).setValue(writeValue);
                break;
            }
          }
        }
      }
    }
  } 
}

function getSheetNames(formattedDate) {
  const sheetNames = [];
  const files = DriveApp.getFolderById('1WR0pparjXhq7eLUGMPsbOO8WxB7RwCl1').getFilesByName('080_' + formattedDate + '_作業時間管理書');
  while (files.hasNext()) {
    const spreadsheet = SpreadsheetApp.open(files.next());
    spreadsheet.getSheets().forEach(s => sheetNames.push(s.getName()));
  }
  return Array.from(new Set(sheetNames));
}

function getD8Values(sheetName, formattedDate) {
  const files = DriveApp.getFolderById('1WR0pparjXhq7eLUGMPsbOO8WxB7RwCl1').getFilesByName('080_' + formattedDate + '_作業時間管理書');
  if (files.hasNext()) {
    const sheet = SpreadsheetApp.open(files.next()).getSheetByName(sheetName);
    if (sheet) {
      const range = sheet.getRange('C8:D' + sheet.getLastRow());
      return range.getValues().filter(r => r[0] && r[1]);
    }
  }
  return [];
}

function getCurrentDate() {
  const t = new Date();
  return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
}

function getlineNames() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ライン');
  return s && s.getLastRow() >= 2 ? s.getRange('A2:A' + s.getLastRow()).getValues().flat() : [];
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
