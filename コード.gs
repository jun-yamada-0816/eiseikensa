function doGet(e) {
  const template = HtmlService.createTemplateFromFile('index');
  template.deployURL = ScriptApp.getService().getUrl();
  const htmlOutput = template.evaluate();
  return htmlOutput;
}

function doPost(e) {
  if (e.parameter.eiseikensa) {
    const selectedValue = e.parameter.eiseikensa; // ボタンの値を取得
    const valueC = selectedValue.split(' ')[0]; // C列の値を取得
    const valueD = selectedValue.split(' ')[1]; // D列の値を取得
    const template = HtmlService.createTemplateFromFile('eiseikensa');
    template.deployURL = ScriptApp.getService().getUrl();


    // 今日の日付のシートを取得または作成
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d');
    let dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(today);

    // 今日の日付のシートが存在しない場合
    if (!dataSheet) {
        // 「空」シートをコピーして新しいシートを作成
        const emptySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('空');
        if (emptySheet) {
            dataSheet = emptySheet.copyTo(SpreadsheetApp.getActiveSpreadsheet()).setName(today);
        }
    }

    const registeredRow = dataSheet.createTextFinder(valueC).matchEntireCell(true).findNext();

    let employeeData = [];
    if (registeredRow) {
      const registeredRowIndex = registeredRow.getRow();
      employeeData = dataSheet.getRange(registeredRowIndex, 4, 1, dataSheet.getLastColumn()).getValues()[0];
    }

    template.selectedValue = selectedValue;  // 値をテンプレートに渡す
    template.valueC = valueC;  // 値をテンプレートに渡す
    template.valueD = valueD;  // 値をテンプレートに渡す
    template.createSanitary = createSanitary(employeeData, valueC, valueD); // 他のデータも渡す
    const htmlOutput = template.evaluate();
    return htmlOutput;
  }

  if (e.parameter.submit) {
    const valueC = e.parameter.valueC;
    const valueD = e.parameter.valueD;

    Logger.log("valueC: " + valueC);
    Logger.log("valueD: " + valueD);

    // 今日の日付のシートを取得または作成
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d');
    let dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(today);
    
    const timestamp = new Date();
    let employeeData = [timestamp, valueC, valueD];

    const item1 = e.parameter[`item1`] === '✔' ? '✔' : '';
    const item2 = e.parameter[`item2`] === '✔' ? '✔' : '';
    const item3 = e.parameter[`item3`] === '✔' ? '✔' : '';
    const item4 = e.parameter[`item4`] === '✔' ? '✔' : '';
    const item5 = e.parameter[`item5`] === '✔' ? '✔' : '';
    const item6 = e.parameter[`item6`] === '✔' ? '✔' : '';
    const item7 = e.parameter[`item7`] === '✔' ? '✔' : '';
    const item8 = e.parameter[`item8`] === '✔' ? '✔' : '';
    const item9 = e.parameter[`item9`] === '✔' ? '✔' : '';
    const item10 = e.parameter[`item10`] === '✔' ? '✔' : '';
    const item11 = e.parameter[`item11`] === '✔' ? '✔' : '';
    const item12 = e.parameter[`item12`] === '✔' ? '✔' : '';
    const item13 = e.parameter[`item13`] === '✔' ? '✔' : '';
    const item14 = e.parameter[`item14`] === '✔' ? '✔' : '';
    const item15 = e.parameter[`item15`] === '✔' ? '✔' : '';
    const item16 = e.parameter[`item16`] === '✔' ? '✔' : '';
    const item17 = e.parameter[`item17`] === '✔' ? '✔' : '';
    const item18 = e.parameter[`item18`] === '✔' ? '✔' : '';
    const item19 = e.parameter[`item19`] === '✔' ? '✔' : '';
    const item20 = e.parameter[`item20`] === '✔' ? '✔' : '';
    const item21 = e.parameter[`item21`] === '✔' ? '✔' : '';
    const item22 = e.parameter[`item22`] === '✔' ? '✔' : '';
    const item23 = e.parameter[`item23`] === '✔' ? '✔' : '';
    const item24 = e.parameter[`item24`] === '✔' ? '✔' : '';
    const item25 = e.parameter[`item25`] === '✔' ? '✔' : '';
    const item26 = e.parameter[`item26`] === '✔' ? '✔' : '';
    const text1 = e.parameter[`text1`] || '';
    const text2 = e.parameter[`text2`] || '';
    employeeData.push(item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11, item12, item13, item14, item15, item16, item17, item18, item19, item20, item21, item22, item23, item24, item25, item26, text1, text2);

    const registeredRow = dataSheet.createTextFinder(valueC).matchEntireCell(true).findNext();
    if (registeredRow) {
      const registeredRowIndex = registeredRow.getRow();
      dataSheet.getRange(registeredRowIndex, 1, 1, employeeData.length).setValues([employeeData]);
    } else {
      dataSheet.appendRow(employeeData);
    }

    const lastRow = dataSheet.getLastRow();
    const dataRange = dataSheet.getRange(3, 1, lastRow - 1, dataSheet.getLastColumn());
    const data = dataRange.getValues();

    // 「社員マスタ」シートのA列をvalueCで検索し、該当列のC列に〇を記入
    const employeeMasterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('社員マスタ');
    const masterRow = employeeMasterSheet.createTextFinder(valueC).matchEntireCell(true).findNext();
    if (masterRow) {
      const masterRowIndex = masterRow.getRow();
      employeeMasterSheet.getRange(masterRowIndex, 3).setValue('〇');
    }

    const template = HtmlService.createTemplateFromFile('index');
    template.deployURL = ScriptApp.getService().getUrl();
    return template.evaluate();
  }

  if (e.parameter.modoru) {
    const template = HtmlService.createTemplateFromFile('index');
    template.deployURL = ScriptApp.getService().getUrl();
    const htmlOutput = template.evaluate();
    return htmlOutput;
  } 
}

function showDatePicker() {
  const html = HtmlService.createHtmlOutput(`
    <input type="date" id="dateInput">
    <button onclick="submitDate()">実行</button>
    <div id="progressMessage" style="margin-top: 10px;"></div>
    <script>
      function submitDate() {
        const datePickerValue = document.getElementById('dateInput').value;
        const progressMessage = document.getElementById('progressMessage');
        if (datePickerValue) {
          progressMessage.textContent = '処理中...'; // 進捗メッセージを表示

          const dateObj = new Date(datePickerValue);
          const formattedDate = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
          google.script.run.withSuccessHandler(function() {
            progressMessage.textContent = '処理が完了しました。'; // 進捗メッセージを更新
            google.script.run.additionalFunction(formattedDate);
            google.script.host.close();
          }).newsheet(formattedDate);
        }
      }
    </script>
  `);
  SpreadsheetApp.getUi().showModalDialog(html, '日付を選択して実行してください');
}

function newsheet() {
  // 現在の日付を取得
  var formattedDate = getCurrentDate(); // 日付フォーマットを正しく取得してください
  Logger.log("Formatted Date: " + formattedDate);
  
  // シート名を取得
  var sheetNames = getSheetNames(formattedDate);
  Logger.log("Sheet Names: " + sheetNames); // 取得したシート名をログに出力
  
  // 「ライン」シートを取得
  var lineSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ライン');
  
  if (lineSheet) {
    // A2から下のセルをクリア
    lineSheet.getRange('A2:A').clearContent();

    // 除外する値の配列
    const excludeValues = ['配置未定(当日欠勤者)', '他工場応援', '欠勤'];

    // シート名を書き込む
    let rowIndex = 2; // 行のインデックス
    for (var i = 0; i < sheetNames.length; i++) {
      // 書き込むシート名が除外値に含まれていないかをチェック
      if (!excludeValues.includes(sheetNames[i])) {
        lineSheet.getRange(rowIndex, 1).setValue(sheetNames[i]);
        rowIndex++; // 書き込んだら行をインクリメント
      }
    }
  } else {
    Logger.log("'ライン' sheet not found."); // シートが見つからない場合
  }

  // 今日の日付のシートを取得または作成
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d');
  let dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(today);

  // 今日の日付のシートが存在しない場合
  if (!dataSheet) {
      // 「空」シートをコピーして新しいシートを作成
      const emptySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('空');
      if (emptySheet) {
          dataSheet = emptySheet.copyTo(SpreadsheetApp.getActiveSpreadsheet()).setName(today);
      }
  }

  // 今日の日付のシートを作成した場合に「社員マスタ」シートのC列の2行目以降をクリア
  if (dataSheet) {
    const employeeMasterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('社員マスタ');

    if (employeeMasterSheet) {
        // C列の2行目から最終行までクリア
        const lastRow = employeeMasterSheet.getLastRow(); // 最終行を取得
        if (lastRow >= 2) { // 2行目が存在する場合のみクリア
            employeeMasterSheet.getRange(2, 3, lastRow - 1).clearContent(); // C列の2行目から最終行までをクリア
        }
    } else {
        Logger.log("社員マスタシートが見つかりません。");
    }
  }

  var excludeValues = ['配置未定(当日欠勤者)', '他工場応援', '欠勤'];
  var formattedDate = getCurrentDate();
  Logger.log(excludeValues);
  Logger.log(formattedDate);

  var folderId = '1HJSr9i4708_syMsnzqjl7W1sjTcayUYg';
  var files = DriveApp.getFolderById(folderId).getFilesByName('080_' + formattedDate + '_作業時間管理書');
  
  var sheetNames = [];

  // 除外するシート名を確認し、該当のシート名を取得
  while (files.hasNext()) {
      var file = files.next();
      var spreadsheet = SpreadsheetApp.open(file);
        
    // 各シートをループして、除外値に該当するシート名を探す
    for (var i = 0; i < spreadsheet.getSheets().length; i++) {
      var sheet = spreadsheet.getSheets()[i];
      var sheetName = sheet.getName();

      if (excludeValues.includes(sheetName)) {
        sheetNames.push(sheetName);
        var values = sheet.getRange('C8:C' + sheet.getLastRow()).getValues();
        
        // 左端の0を取り除く
        var cleanedValues = values.flat().map(function(value) {
            return value.toString().replace(/^0+/, '');
        });

        // 「社員マスタ」シートを取得
        var masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('社員マスタ');
        var filter = masterSheet.getFilter();
        if (filter != null) {
          masterSheet.getFilter().remove();
        }

        for (var j = 0; j < cleanedValues.length; j++) {
          var employeeId = cleanedValues[j];
          var masterData = masterSheet.getRange('A:A').getValues();

          // 社員マスタで検索
          for (var k = 0; k < masterData.length; k++) {
            if (masterData[k][0] == employeeId) {
                // シート名に応じてC列に記入
                var writeValue = '';
                if (sheetName == '配置未定(当日欠勤者)') {
                    writeValue = '当欠';
                } else if (sheetName == '他工場応援') {
                    writeValue = '応援';
                } else if (sheetName == '欠勤') {
                    writeValue = '欠勤';
                }
                masterSheet.getRange(k + 1, 3).setValue(writeValue); // C列は3番目のカラム
                break; // 該当社員が見つかったらループを抜ける
            }
          }
        }
      }
    }
  } 
}

function getSheetNames(formattedDate) {
  var sheetNames = [];
  
  var files = DriveApp.getFolderById('1HJSr9i4708_syMsnzqjl7W1sjTcayUYg').getFilesByName('080_' + formattedDate + '_作業時間管理書');

  while (files.hasNext()) {
    var file = files.next();
    var spreadsheet = SpreadsheetApp.open(file);
    var sheets = spreadsheet.getSheets();

    for (var i = 0; i < sheets.length; i++) {
      var sheet = sheets[i];
      sheetNames.push(sheet.getName());
    }
  }
  return Array.from(new Set(sheetNames));
}

function getD8Values(sheetName, formattedDate) {
  // get a collection of all files
  var files = DriveApp.getFolderById('1HJSr9i4708_syMsnzqjl7W1sjTcayUYg').getFilesByName('080_' + formattedDate + '_作業時間管理書');

  // ファイルを参照し、その中の指定されたシートを探す
  while (files.hasNext()) {
    var file = files.next(); // 次のファイルを取得
    var spreadsheet = SpreadsheetApp.open(file); // スプレッドシートとして開く
    var sheet = spreadsheet.getSheetByName(sheetName); // 指定されたシートを取得

    if (sheet) {
      var range = sheet.getRange('C8:D' + sheet.getLastRow()); // D8から最終行までの値を取得
      var values = range.getValues(); // 2次元配列として値を取得
      return values.filter(row => row[0] && row[1]); // C列とD列が両方非空の行のみをフィルタリング
    }
  }

  return []; // シートが見つからない場合は空の配列を返す
}

function getCurrentDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1; 
  var day = today.getDate();
  return year + '-' + month + '-' + day; 
}

function getlineNames() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('ライン');
  var range = sheet.getRange('A2:A' + sheet.getLastRow());
  var values = range.getValues().flat();

  return values; // A列のシート名を返す
}

function createSanitary(employeeData) {
  let employeeDataIndex = 0;
  const hasEmployeeData = Array.isArray(employeeData);
  let calendarHtml = ``;

  // 日付のシートを参照
  const item1 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item2 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item3 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item4 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item5 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item6 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item7 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item8 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item9 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item10 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item11 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item12 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item13 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item14 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item15 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item16 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item17 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item18 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item19 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item20 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item21 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item22 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item23 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item24 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item25 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const item26 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] === '✔' : false;
  const text1 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] : '';
  const text2 = hasEmployeeData && employeeDataIndex < employeeData.length ? employeeData[employeeDataIndex++] : ''; 

  calendarHtml += `<div style="display: block;"><h5>●日常確認（該当で『✔』 ）</h5></div>`;
  calendarHtml += `<div style="display: block;"><h5>　Kiểm tra hàng ngày (đánh dấu ✔ nếu có liên quan)</h5></div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item1" value="✔" ${item1 ? 'checked' : ''}> 手洗い・ローラー掛を実施した（Đã thực hiện rửa tay và dùng con lăn.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item2" value="✔" ${item2 ? 'checked' : ''}> 作業服・靴等の状態（Tình trạng trang phục làm việc và giày dép.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item3" value="✔" ${item3 ? 'checked' : ''}> 作業服・靴等着用状況（Tình trạng mặc trang phục làm việc và giày dép.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item4" value="✔" ${item4 ? 'checked' : ''}> ひげ・過度な化粧等（Râu và trang điểm quá mức.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item5" value="✔" ${item5 ? 'checked' : ''}> 爪の長さ（Chiều dài của móng tay.）</div>`;
  calendarHtml += `<div style="display: block;"><br></div>`;

  calendarHtml += `<div style="display: block;"><h5>●健康状態（該当で『✔』 ）</h5></div>`;
  calendarHtml += `<div style="display: block;"><h5>　Tình trạng sức khỏe (đánh dấu ✔ nếu có liên quan)</h5></div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item6" value="✔" ${item6 ? 'checked' : ''}> 貧血、高・低血圧がある（Có thiếu máu, huyết áp cao hoặc thấp.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item7" value="✔" ${item7 ? 'checked' : ''}> 発熱(37.0)以上ある（Có sốt (trên 37.0 độ).）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item8" value="✔" ${item8 ? 'checked' : ''}> 下痢・吐き気がある（Có dấu hiệu tiêu chảy hoặc buồn nôn.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item9" value="✔" ${item9 ? 'checked' : ''}> 手指怪我がある（Có thương tích ở tay.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item10" value="✔" ${item10 ? 'checked' : ''}> 歯科治療 治療中（Đang trong quá trình điều trị nha khoa.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item11" value="✔" ${item11 ? 'checked' : ''}> 歯科治療 異常がない（Không có bất thường trong điều trị nha khoa.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item12" value="✔" ${item12 ? 'checked' : ''}> 黄疸がある（Có dấu hiệu vàng da.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item13" value="✔" ${item13 ? 'checked' : ''}> 目、鼻分泌物がある（Có chất nhầy ở mắt và mũi.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item14" value="✔" ${item14 ? 'checked' : ''}> その他風邪の症状がある（Có triệu chứng cảm cúm khác.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item15" value="✔" ${item15 ? 'checked' : ''}> 腰痛がある（Có đau lưng.）</div>`;
  calendarHtml += `<div style="display: block;"><br></div>`;

  calendarHtml += `<div style="display: block;"><h5>●持ち込み確認（該当で『✔』 ）</h5></div>`;
  calendarHtml += `<div style="display: block;"><h5>　Kiểm tra đồ mang theo (đánh dấu ✔ nếu có liên quan)</h5></div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item16" value="✔" ${item16 ? 'checked' : ''}> メガネ（Kính mắt.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item17" value="✔" ${item17 ? 'checked' : ''}> ヘアピン（Kẹp tóc.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item18" value="✔" ${item18 ? 'checked' : ''}> ヘアゴム（dây buộc tóc.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item19" value="✔" ${item19 ? 'checked' : ''}> 義歯等（Răng giả.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item20" value="✔" ${item20 ? 'checked' : ''}> 医療器具等（Dụng cụ y tế.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item21" value="✔" ${item21 ? 'checked' : ''}> 会社指定絆創膏（Băng vết thương theo quy định của công ty.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item22" value="✔" ${item22 ? 'checked' : ''}> フォークリフト免許証（Giấy phép lái xe nâng.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item23" value="✔" ${item23 ? 'checked' : ''}> 薬等（Thuốc.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item24" value="✔" ${item24 ? 'checked' : ''}> コンタクト 使用者（Người sử dụng kính áp tròng.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item25" value="✔" ${item25 ? 'checked' : ''}> コンタクト 紛失した者（Người đã mất kính áp tròng.）</div>`;
  calendarHtml += `<div style="display: block;"><br></div>`;

  calendarHtml += `<div style="display: block;"><h5>●指導者記入欄</h5></div>`;
  calendarHtml += `<div style="display: block;"><h5>　Ô ghi thông tin của người hướng dẫn</h5></div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item26" value="✔" ${item26 ? 'checked' : ''}> 指導有（Có chỉ đạo.）</div>`;
  calendarHtml += `<div style="display: block;">指導実施者（Người thực hiện chỉ đạo.）<br><input type="text" name="text1" placeholder="テキスト入力" value="${text1}" style="width: 80%; max-width: 100%;"></div>`;
  calendarHtml += `<div style="display: block;"><br></div>`;
  calendarHtml += `<div style="display: block;">補記（Ghi chú thêm.）<br><input type="text" name="text2" placeholder="テキスト入力" value="${text2}" style="width: 80%; max-width: 100%;"></div>`;
  
  return calendarHtml; // HTMLを戻り値として返す
}
