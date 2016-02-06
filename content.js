function makeRowSelector(rowIndex) {
  return 'tr:nth-child(' + (2 + rowIndex) + ')';
}

function makeHoursColumnSelector(rowIndex) {
  return 'td:nth-child(' + (6 + rowIndex) + ')';
}

function getTimeSheetTable() {
  return $('div.ui-popup.ui-popup_active_true iframe').contents().find('#ctl00_mainArea_pnlUpd');
}

function getTotalRows(timeSheetTable) {
  return timeSheetTable.find('tr').length - 2;
}

function getTpNumberFromLink(link) {
  return link ? link.replace(/^.*\/([^/]+)$/, '$1') : '';
}

function getTpNumber(timeSheetTable, rowIndex) {
  var linkLocationInRow = 'td:nth-child(3) a:nth-child(1)',
  link = timeSheetTable.find(makeRowSelector(rowIndex) + ' ' + linkLocationInRow).attr('href');

  return getTpNumberFromLink(link);
}

function fillDayMap(timeSheetTable) {
  var tpMap = {},
  totalRows = getTotalRows(timeSheetTable),
  rowIndex;

  
  for (var columnIndex = 0; columnIndex < 7; columnIndex++) {
    var totalHours = {};
    for (var rowIndex = 0; rowIndex < totalRows; rowIndex++) {  
      var tp = getTpNumber(timeSheetTable, rowIndex);

      var inputSelector = makeRowSelector(rowIndex) + ' ' + makeHoursColumnSelector(columnIndex) + ' input';
      var inputElement = timeSheetTable.find(inputSelector);
      totalHours[tp] = inputElement ? parseFloat(inputElement.val()) : 0;
    }
    tpMap[columnIndex] = totalHours;
  }

  return tpMap;
}

function getEntries(tpMap) {
  return $.map(tpMap, function (v, k) { return {tp: k, hours: v} });
}

function getWorkedTpEntries(tpMap) {
  return getEntries(tpMap).filter(function (e) { return e.hours > 0});
}

function getWorkedTpNumbers(workedTpEntries) {
  return workedTpEntries.map(function (x) { return x.tp; }).reduce(function (a, v) { return a + ", " + v; });
}

function getTotalHours(workedTpEntries) {
  return workedTpEntries.map(function (x) { return x.hours; }).reduce( function (a, v) { return a + v; });
}

function getDetailedHours(workedTpEntries) {
  return workedTpEntries.reduce(function (a, v) { a[v.tp] = v.hours; return a; }, {});
}

// Inform the background page that 
// this tab should have a page-action
chrome.runtime.sendMessage({
  from:    'content',
  subject: 'showPageAction'
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  // First, validate the message's structure
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data 
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`)
var domInfo = {
  storiesOrBugs: fillDayMap(getTimeSheetTable())
};

    // Directly respond to the sender (popup), 
    // through the specified callback */
    response(domInfo);
  }
});