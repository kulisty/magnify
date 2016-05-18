function saveFix (model) {
  var copy = JSON.parse(JSON.stringify(view.model, null, 2));
  function iter(obj) {
    for (var key in obj) {
      if ((key=='source') || (key=='target')){
        obj[key]=obj[key].id;
      } else {
        if (typeof(obj[key]) == 'object') {
          iter(obj[key]);
        } else {
          //console.log("Key: " + key + " Values: " + obj[key]);
        }
      }
    }
  }
  iter(copy);
  return copy;
}
