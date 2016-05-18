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


function xml2json(xml) {
  try {
    var obj = {};
    if (xml.children.length > 0) {
      for (var i = 0; i < xml.children.length; i++) {
        var item = xml.children.item(i);
        var nodeName = item.nodeName;

        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = xml2json(item);
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];

            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xml2json(item));
        }
      }
    } else {
      obj = xml.textContent;
    }
    return obj;
  } catch (e) {
      console.log(e.message);
  }
}
