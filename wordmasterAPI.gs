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
    const range = sheet1.getRange('B1:D422');
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
  
  var params = JSON.parse(e.postData.getDataAsString());  // ※
  //var value = params.value;  // => "AAA"が取れる
  
  //var params = e.postData.getDataAsString();

  // シートを取得
  var sheet = getSheet('シート3');
  
  // シートの最終行を取得
  var lastRow = sheet.getLastRow();
  
  //新しい結果が入ったら過去の結果を右にずらす
  sheet.insertColumnAfter(5);


  var startNo = params.startNo;
  var endNo = params.endNo;  
  var data = Utilities.parseCsv(params.result);
  sheet.getRange('F'+ startNo + ':F'+ endNo).setValues(data);

}

function getSheet(name){
  
  // SSIDからスプレッドシートの取得
  var ssId = '1MtdQ9tD5cTtlaYG01FRaZBifOcn7yesWq53nECfS2ww';
  var ss = SpreadsheetApp.openById(ssId);

  // 指定されたシート名からシートを取得して返却
  var sheet = ss.getSheetByName(name);
  return sheet;
}


