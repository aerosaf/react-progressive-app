export function mergeArray(array1, array2) {
  var results = [];
  var arr = array1.concat(array2);
  var len = arr.length;
  var assoc = {};

  while (len--) {
    var item = arr[len];

    if (!assoc[item.id]) {
      results.unshift(item);
      assoc[item.id] = true;
    }
  }
  return results;
}