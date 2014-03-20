var Handlebars = require('handlebars');
Handlebars.registerHelper('col', function () {
  return '<th>' + this.name + ' ' + '</th>';
});
Handlebars.registerHelper('body', function (rows, cols, options) {
  var out = '';
  rows.forEach(function (row) {
    out += '<tr> ';
    cols.forEach(function (col) {
      out = out + '<td>' + row[col.name] + '</td>';
    });
    out += ' </tr>';
  });
  return out;
});
module.exports = Handlebars;