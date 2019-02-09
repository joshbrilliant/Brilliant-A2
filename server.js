var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var result = {};
    if (query['cmd'] == 'CalcCharge')
    {
      result = CalcCharge(query);
    }
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function CalcCharge(query)
{
  if (query['checkBal'] == undefined || isNaN(query['checkBal']) || query['checkBal'] == null)  
    throw Error("Invalid value for checkBal");
    
  if (query['savingsBal'] == undefined || isNaN(query['savingsBal']))  
    throw Error("Invalid value for savingsBal");
    
  if (query['checks'] == undefined || query['checks'] < 0 || isNaN(query['checks']))  
    throw Error("Invalid value for checks");
  
  var charge = 0;
  if (query['checkBal'] < 1000 && query['savingsBal'] < 1500)  
    {
      charge = (query['checks'] * 0.15);
    }
  var result = {'charge' : charge}; 
  return result;
}
