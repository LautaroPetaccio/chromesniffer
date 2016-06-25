/* Add a listener to the onMessage event */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  /* Adding a request type can  */
  if(request && request.type === "data_to_send") {
    var form_data = {data: JSON.stringify(request.data), url: sender.tab.url};
    upload(form_data);
  }
  /* Use sendResponse to make the call asynchronous */
  sendResponse({});
});

function upload(form_data) {
  /* Creates a new XMLHttp request to send the form data to our server */
  var xhr = new XMLHttpRequest();

  /* Set the page and the POST method */
  xhr.open("POST", "http://localhost:3000/extension", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  /* Set the data as two form fields, data and url */
  xhr.send("data=" + encodeURIComponent(form_data.data) + "&url=" + encodeURIComponent(form_data.url));
}