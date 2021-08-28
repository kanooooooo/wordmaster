const sheet_name = "seya";
const dashboard_name = "dashboard01";


function doGet(e) {
  const response = ContentService.createTextOutput();

  if(e.parameter.choice == "analyzed_data"){
    var sheet = getSheet(dashboard_name);
    let cell = sheet.getRange(2,6);
    let analyzedData = analyzeData();
    var start = 0;
    var end =  0;

    for (i=1; i<=analyzedData.length; i++) {
      cell.offset(i, 0).setValue(analyzedData[i]);
    } 

    response.setMimeType(MimeType.JSON);
    response.setContent(JSON.stringify(analyzedData));
    return response;
  }

  const data = getData();
  response.setMimeType(MimeType.JSON);
  response.setContent(JSON.stringify(data));
  return response;  
}


function setValue(analyzedData, cell, start, end) {
  for (i=start; i<=end; i++) {
    cell.offset(i, 0).setValue(analyzedData[i]);
  }
}


function test02(){
  var c = {"startNo":1,
           "endNo":10,
           "result":[{"no":1,"pt":3,"good":6,"bad":1,"count":7,"total":-7,"error":16.67,"time":3.46,"slog":["1",-1,-1,-1,-1,-1,-1]},{"no":2,"pt":3,"good":6,"bad":1,"count":7,"total":-7,"error":16.67,"time":2.26,"slog":["1",-1,-1,-1,-1,-1,-1]},{"no":3,"pt":-1,"good":7,"bad":0,"count":7,"total":-5,"error":0,"time":2.94,"slog":["-1",-1,-1,-1,-1,-1,-1]},{"no":4,"pt":3,"good":6,"bad":3,"count":9,"total":-5,"error":37.5,"time":2.86,"slog":["1",-1,-1,-1,-1,-1,-1,1,1]},{"no":5,"pt":3,"good":4,"bad":3,"count":7,"total":-3,"error":50,"time":4.47,"slog":["1",-1,-1,-1,-1,1,1]},{"no":6,"pt":3,"good":7,"bad":2,"count":9,"total":-7,"error":25,"time":2.56,"slog":["1",-1,-1,-1,1,-1,-1,-1,-1]},{"no":7,"pt":3,"good":6,"bad":1,"count":7,"total":-7,"error":16.67,"time":3.37,"slog":["1",-1,-1,-1,-1,-1,-1]},{"no":8,"pt":3,"good":6,"bad":1,"count":7,"total":-7,"error":16.67,"time":3.04,"slog":["1",-1,-1,-1,-1,-1,-1]},{"no":9,"pt":3,"good":6,"bad":1,"count":7,"total":-7,"error":16.67,"time":2.45,"slog":["1",-1,-1,-1,-1,-1,-1]},{"no":10,"pt":3,"good":4,"bad":3,"count":7,"total":-3,"error":50,"time":5.05,"slog":["1",-1,-1,-1,-1,1,1]}]}

  var l = doPost(JSON.stringify(c));
  return l;
}


function getData(e) {

  // シートを取得
  var sheet = getSheet(sheet_name);
  // シートの最終行を取得
  var lastRow = sheet.getLastRow();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet1 = spreadsheet.getSheetByName(sheet_name);
  const range = sheet1.getRange('A1:E'+ lastRow);
  const values = range.getValues();
  const data = values.map(row => {
    let col = 0;
    return {
      no: row[col++],
      en: row[col++],
      jp: row[col++],
      article: row[col++],
      digest: row[col++],
    }
  });

  for (i=0; i < data.length; i++) {
    if (data[i].digest == '') {
      data[i].digest =  {"no":data[i].no, "pt":3, "good":0, "bad":0, "count":0, "total":0, "error":0, "time":0, "slog":[]};
    } else {
      data[i].digest = JSON.parse(data[i].digest);
    }
  }
  //console.log(data);
  return data;
}


function doPost(e) {
  
  var params = JSON.parse(e.postData.getDataAsString());  // 
  //var params = JSON.parse(e);//テスト用

  // シートを取得
  var sheet = getSheet(sheet_name);
  //sheet.getRange('A1:A1').setValue(e.postData.getDataAsString());

  // シートの最終行を取得
  var lastRow = sheet.getLastRow();
  
  var startNo = params.startNo;
  var endNo = params.endNo;  
  var result = params.result;

  //更新すべき部分を更新
  for (i=0; i < result.length; i++) {
    sheet.getRange(result[i].no, 5).setValue(JSON.stringify(result[i]));
  }

  //E列のデータ更新
  //sheet.getRange('E1' + ':E'+ lastRow).setValues(string_result);
}


function getSheet(name){

  // SSIDからスプレッドシートの取得
  var ssId = '1MtdQ9tD5cTtlaYG01FRaZBifOcn7yesWq53nECfS2ww';
  var ss = SpreadsheetApp.openById(ssId);

  // 指定されたシート名からシートを取得して返却
  var sheet = ss.getSheetByName(name);
  return sheet;
}


function update() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let cell = sheet.getActiveCell();
  let value = cell.offset(0, -12).getValue();
  let old_data = JSON.parse(cell.offset(0, -7).getValue());
  var no = JSON.parse(cell.offset(0, -11).getValue());
  var pt = old_data.pt;
  var good = old_data.good;
  var bad = old_data.bad;
  var counts = old_data.count + 1;
  var total = old_data.total;
  var error = old_data.error;
  var time = old_data.time;
  var slog = old_data.slog;

  if (value == 'o') {
    pt = pt - 1;
    good = good + 1;
    total = total + 1;
    slog.unshift(-1);
  } else if (value == 'x') {
    pt = 3;
    bad = bad + 1;
    total = total - 1;
    slog.unshift(1);
  }

  error = Math.round(((bad / counts) * 100) * 100)/100 ;
  time = Math.round(((time * counts + 3.5) / (counts)) * 100) / 100;

  return JSON.stringify({"no":no, "pt":pt, "good":good, "bad":bad, "count":counts, "total":total, "error":error, "time":time, "slog":slog})
  //cell.offset(0, 0).setValue(update)
}

function collector() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let cell = sheet.getActiveCell();
  let lastRow = sheet.getLastRow();
  let result = [];

  for(i=0; i < lastRow; i++){
    result.push(JSON.parse(cell.offset(i, -1).getValue()));
  }
  return JSON.stringify(result);
}


function analyzeData(start, end) {
  let sheet = getSheet(sheet_name);
  var lastRow = sheet.getLastRow();
  let analyzeData = [];

  for(j=start; j<=end; j++){
    let cell = sheet.getRange(j,5);
    let count = 0;
    let good = 0;
    let bad = 0;
    let error = 0;
    let total = 0;

    let time = 0.0;
    let time_count = 0.0;

    for (i=0; i < 50; i++) {
      let value = Number(cell.offset(0, i).getValue());
      if (value != 0) {
        if (value == -1) {
          good++;
          total += value;
          count++;
        }
        if (value == 1) {
          bad++;
          total += value;
          count++;
        }
        if (value != 1 && value != -1) {
          time += value;
          time_count++;
        }
      }
    }
    error = Math.round(  ((bad / count) * 100)  * 100)/100;
    time = Math.round(time / time_count * 100) / 100;

    analyzeData.push({"no":j, "good":good, "bad":bad, "count":count, "total":total, "error":error, "time":time});
  }
  console.log(analyzeData);
  return analyzeData;
}


function profile() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let cell = sheet.getActiveCell();

  let count = 0;
  let good = 0;
  let bad = 0;
  let error = 0;
  let total = 0;

  let time = 0.0;
  let time_count = 0.0;

  let slog = [];

  for (i=1; i < 100; i++) {
    let value = Number(cell.offset(0, i).getValue());
    if (value != 0) {
      if (value == -1) {
        good++;
        slog.push(-1);
        total += value;
        count++;
      }
      if (value == 1) {
        bad++;
        slog.push(1);
        total += value;
        count++;
      }
      if (value != 1 && value != -1) {
        time += value;
        time_count++;
      }
    }
  }
  error = Math.round(((bad / count) * 100) * 100)/100 ;
  time = Math.round(time / time_count * 100) / 100;
  let pt = Number(cell.offset(0, -1).getValue());
  let no = Number(cell.offset(0, -5).getValue());

  return JSON.stringify({"no":no, "pt":pt, "good":good, "bad":bad, "count":count, "total":total, "error":error, "time":time, "slog":slog});
}
