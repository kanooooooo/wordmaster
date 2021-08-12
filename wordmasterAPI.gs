function doGet() {
    const data = getData();
    const response = ContentService.createTextOutput();
    response.setMimeType(MimeType.JSON);
    response.setContent(JSON.stringify(data));
    return response;  
}

function getData() {

    // シートを取得
    var sheet = getSheet('seya');
    // シートの最終行を取得
    var lastRow = sheet.getLastRow();
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet1 = spreadsheet.getSheetByName('seya');
    const range = sheet1.getRange('A1:E'+ lastRow);
    const values = range.getValues();
    const data = values.map(row => {
        let col = 0;
        return {
            no: row[col++],
            en: row[col++],
            jp: row[col++],
            article: row[col++],
            point: row[col++],
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
  var sheet = getSheet('seya');
  
  // シートの最終行を取得
  var lastRow = sheet.getLastRow();
  
  //新しい結果が入ったら過去の結果を右にずらす
  sheet.insertColumnAfter(5);


  var startNo = params.startNo;
  var endNo = params.endNo;  
  var data = Utilities.parseCsv(params.result);
  sheet.getRange('F'+ startNo + ':F'+ endNo).setValues(data);

  var sheet = getSheet('seya');
  // 前回までの結果(E列)と最後のテスト結果（F列）を取得
  var lastRow = sheet.getLastRow();
  const data_e = sheet.getRange(1, 5, lastRow).getValues(); //E列
  const data_f = sheet.getRange(1, 6, lastRow).getValues(); //F列

  // 結果(E列)を更新
  var results = [];
  for(let i=0; i<lastRow; i++){
    var update = parseInt(data_e[i]) + parseInt(data_f[i]);　//E列 + F列
    if(!isNaN(update)){
      results.push([update]);
    } else {
      results.push([parseInt(data_e[i])]);
    }
  }
  sheet.getRange('E1' + ':E'+ lastRow).setValues(results);
  console.log(results.length)

}

function getSheet(name){
  
  // SSIDからスプレッドシートの取得
  var ssId = '1MtdQ9tD5cTtlaYG01FRaZBifOcn7yesWq53nECfS2ww';
  var ss = SpreadsheetApp.openById(ssId);

  // 指定されたシート名からシートを取得して返却
  var sheet = ss.getSheetByName(name);
  return sheet;
}

// function kano(){
//   var sheet = getSheet('seya');
//   // 前回までの結果(E列)と最後のテスト結果（F列）を取得
//   var lastRow = sheet.getLastRow();
//   const data_e = sheet.getRange(1, 5, lastRow).getValues(); //E列
//   const data_f = sheet.getRange(1, 6, lastRow).getValues(); //F列

//   // 結果(E列)を更新
//   var results = [];
//   for(let i=0; i<lastRow; i++){
//     var update = parseInt(data_e[i]) + parseInt(data_f[i]);　//E列 + F列
//     if(!isNaN(update)){
//       results.push([update]);
//     } else {
//       results.push([parseInt(data_e[i])]);
//     }
//   }
//   sheet.getRange('E1' + ':E'+ lastRow).setValues(results);
//   console.log(results.length)
// }
