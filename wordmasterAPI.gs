function doGet() {
    const data = getData();
    const response = ContentService.createTextOutput();
    response.setMimeType(MimeType.JSON);
    response.setContent(JSON.stringify(data));
    return response;  
}

function getData() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet1 = spreadsheet.getSheetByName('シート3');
    const range = sheet1.getRange('A1:C103');
    const values = range.getValues();
    const data = values.map(row => {
        let col = 0;
        return {
            en: row[col++],
            jp: row[col++],
            article: row[col++],
        }
    });
    console.log(data);
    return data;
}

function doPost(e) {
  const reqParam = e.parameter;
  const sheetNo = parseInt(reqParam.sheetNo) || 1;
  sheet = ss.getSheets()[sheetNo - 1];
  var data = JSON.parse(reqParam.data);
  postJsonToSpreadSheet(data);
  return ContentService.createTextOutput(JSON.stringify({ result: "post done" })); //JSONを返すとエラーにならない？ 
}
function postJsonToSpreadSheet(arrObj) {
  //受け付けるJSONは、[{key1:data1, key2:data2,....},...]、オブジェクトが配列になっている形式
  //オブジェクトのキーがスプレッドシートの項目名として1行目に入力される
  sheet.clear();
  //タイトル行を書き込み
  const keys = [Object.keys(arrObj[0])];//setValuesには必ず2次元配列を渡すので [ ] で囲んで2次元配列にする
  sheet.getRange(1, 1, 1, keys[0].length).setValues(keys);//項目名を書き込み
  //オブジェクトからデータ書き込み用の2次元配列を作成
  const arrToWrite = arrObj.map((obj) => {
    const arr = [];
    for (const key of keys[0]) { arr.push(obj[key]); }
    return arr;
  });
  const lastColumn = arrToWrite[0].length; //1個め配列の長さ＝カラムの数を取得する
  const lastRow = arrToWrite.length;   //行の数を取得する
  sheet.getRange(2, 1, lastRow, lastColumn).setValues(arrToWrite);
}

