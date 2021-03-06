function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

// Update the relevant fields with the new data
function setDOMInfo(info) {
  var days = ['Lunes', 'Martes','Miercoles','Jueves', 'Viernes', 'Sabado','Domingo'];
  for (var i = 0; i < 7; i++) {
    var pto = 0, holiday = 0, worked = 0;

    var day = info.storiesOrBugs[i];
    for (var tpnumber in day) {
      if (day.hasOwnProperty(tpnumber)) {
        if (1117 == tpnumber) {
          pto += day[tpnumber];
        } else if (2486 == tpnumber) {
          holiday += day[tpnumber];
        } else{
          worked += day[tpnumber];
        };
      }
    }
    day["pto"] = pto;
    day["holiday"] = holiday;
    day["worked"] = worked;

    $('.'+days[i]+'.PTO').val(pto);
    $('.'+days[i]+'.Holiday').val(holiday);
    $('.'+days[i]+'.Laborado').val(worked);
  };

  renderStatus("Informacion cargada desde TP");
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
      tabs[0].id,
      {from: 'popup', subject: 'DOMInfo'},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script)
        setDOMInfo);
  });
});


/*
document.addEventListener('DOMContentLoaded', function() {
      renderStatus('Loaded!');
      getStoriesOrBugs();
});

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    $(message).html(request.source);
  }
});

function onWindowLoad() {

  var message = $('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.html('There was an error injecting script : \n' + chrome.runtime.lastError.message);
    }
  });

}

window.onload = onWindowLoad;*/