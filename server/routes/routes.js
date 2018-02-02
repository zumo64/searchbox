export default function (server) {

  server.route({
    path: '/api/searchbox/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });


  

  server.route({
      path: '/searchbox/suggest/',
      method: 'POST',
      handler(req, reply) {
          server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'search', {
            index : ""+req.payload.index,
            type  : ""+req.payload.type,
            body : JSON.parse(req.payload.body)
          }).then(function (response) {
        reply(response);
      });
    }
  });


   

// Custom Search
   server.route({
    	path: '/searchbox/search/',
    	method: 'POST',
    	handler(req, reply) {
          server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'search', {
          	index : ""+req.payload.index,
          	type  : ""+req.payload.type,
          	body : ""+req.payload.query,
          	size : ""+req.payload.pageSize,
          	from :  ""+req.payload.pageSize * req.payload.pageNumber
          	
          }).then(function (response) {
        reply(response);
      });
  }
});




   // Custom Search
   server.route({
    	path: '/searchbox/analyze/',
    	method: 'POST',
    	handler(req, reply) {
        var jRequest = {           
            body : {
              text : ""+req.payload.text,
              analyzer : ""+req.payload.analyzer
            }
          }
        if (req.payload.index != null && req.payload.index != "") {
         jRequest[index] = ""+req.payload.index
        }

        server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'indices.analyze', jRequest).then(function (response) {
        reply(response);
      });
  }
});

}
