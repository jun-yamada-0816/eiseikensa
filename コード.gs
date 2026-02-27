function doGet(e) {
  const template = HtmlService.createTemplateFromFile('index');
  template.deployURL = ScriptApp.getService().getUrl();
  const htmlOutput = template.evaluate();
  return htmlOutput;
}

function doPost(e) {
    const selectedValue = e.parameter.eiseikensa; // ボタンの値を取得
    const valueC = selectedValue.split(' ')[0]; // C列の値を取得
    const valueD = selectedValue.split(' ')[1]; // D列の値を取得
    const template = HtmlService.createTemplateFromFile('eiseikensa');
    template.deployURL = ScriptApp.getService().getUrl();
    template.selectedValue = selectedValue;  // 値をテンプレートに渡す
    template.valueC = valueC;  // 値をテンプレートに渡す
    template.valueD = valueD;  // 値をテンプレートに渡す
    template.createSanitary = createSanitary(); // 他のデータも渡す
    const htmlOutput = template.evaluate();
    return htmlOutput;
}

function getSheetNames(formattedDate) {
  var sheetNames = [];
  
  var files = DriveApp.getFolderById('17mxwrQgzB5MZbDrTaO1qZBrUZdMjetC7').getFilesByName('080_' + formattedDate + '_作業時間管理書');

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
  var files = DriveApp.getFolderById('17mxwrQgzB5MZbDrTaO1qZBrUZdMjetC7').getFilesByName('080_' + formattedDate + '_作業時間管理書');

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
  
  calendarHtml += `<div style="display: block;"><h5>●日常確認（該当で『✔』 ）Kiểm tra hàng ngày (đánh dấu ✔ nếu có liên quan)</h5></div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item1" value="✔" ${item1 ? 'checked' : ''}> 手洗い・ローラー掛を実施した（Đã thực hiện rửa tay và dùng con lăn.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item2" value="✔" ${item2 ? 'checked' : ''}> 作業服・靴等の状態（Tình trạng trang phục làm việc và giày dép.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item3" value="✔" ${item3 ? 'checked' : ''}> 作業服・靴等着用状況（Tình trạng mặc trang phục làm việc và giày dép.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item4" value="✔" ${item4 ? 'checked' : ''}> ひげ・過度な化粧等（Râu và trang điểm quá mức.）</div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item5" value="✔" ${item5 ? 'checked' : ''}> 爪の長さ（Chiều dài của móng tay.）</div>`;
  calendarHtml += `<div style="display: block;"><br></div>`;
  calendarHtml += `<div style="display: block;"><h5>●健康状態（該当で『✔』 ）Tình trạng sức khỏe (đánh dấu ✔ nếu có liên quan)</h5></div>`;
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
  calendarHtml += `<div style="display: block;"><h5>●持ち込み確認（該当で『✔』 ）Kiểm tra đồ mang theo (đánh dấu ✔ nếu có liên quan)</h5></div>`;
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
  calendarHtml += `<div style="display: block;"><h5>●指導者記入欄（Ô ghi thông tin của người hướng dẫn）</h5></div>`;
  calendarHtml += `<div style="display: block;"><input type="checkbox" name="item26" value="✔" ${item26 ? 'checked' : ''}> 指導有（Có chỉ đạo.）</div>`;
  calendarHtml += `<div style="display: block;">指導実施者（Người thực hiện chỉ đạo.）<br><input type="text" name="text1" placeholder="テキスト入力" value="${text1}" style="width: 80%; max-width: 100%;"></div>`;
  calendarHtml += `<div style="display: block;"><br></div>`;
  calendarHtml += `<div style="display: block;">補記（Ghi chú thêm.）<br><input type="text" name="text2" placeholder="テキスト入力" value="${text2}" style="width: 80%; max-width: 100%;"></div>`;
  
  return calendarHtml; // HTMLを戻り値として返す
}
