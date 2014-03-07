


Handlebars.registerHelper('columns', function(colsData, options) {
  var out = "<tr>";

  for(var i=0, l=colsData.length; i<l; i++) {
    out = out + "<th>" + options.fn(colsData[i]) + "</th>";
  }

  return out + "</tr>";
});

Handlebars.registerHelper('body', function(rows, cols ) {
  var tbody = "";

   rows.forEach( function(row){ 
		tbody += "<tr>" ;
		cols.forEach( function(col){
			out = out + "<td>" + row[col] + "</td>";
		});
		tbody += "<tr>" ;

  });

  return tbody ;
});