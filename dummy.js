var request = require('request')
  , JSONStream = require('JSONStream')
  , es = require('event-stream')

	var out = JSONStream.stringifyObject('{ ', ' , ', ' }');

	var parser = JSONStream.parse()
  , req = request({url: 'http://54.241.62.90:4273/containers/json?all=1'})
  , logger = es.mapSync(function (data) {
    
      console.error(data)
      console.log(data);
      return data
    })
    
    req.pipe( parser).pipe(out).pipe(logger);