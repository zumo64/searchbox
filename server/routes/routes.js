export default function (server) {

  server.route({
    path: '/api/searchbox/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });


   server.route({
    	path: '/searchbox/suggest/{index}/{type}/{fuzz}/{size}/{field}/{query}',
    	method: 'GET',
    	handler(req, reply) {
          server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'search', {
          	index : req.params.index,
          	type  : req.params.type,
          	body : {
          		suggest: {
          			suggestions : {
          				prefix : ""+req.params.query,
      					completion : {
                			field : ""+req.params.field,
                			fuzzy : {
                 			   fuzziness : ""+req.params.fuzz
                			},
                			size: ""+req.params.size,
                			contexts: {
                    			category: [ 'generated' ]
                			}
            			}
      				}
    			}
          	}
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
          server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'indices.analyze', {
          	index : ""+req.payload.index,
          	text : ""+req.payload.text,
          	analyzer : ""+req.payload.analyzer
          }).then(function (response) {
        reply(response);
      });
  }
});

}
