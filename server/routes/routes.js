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
          			generated_phrase_suggestion: {
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




   

//request.payload.echo
   server.route({
    	path: '/searchbox/search/',
    	method: 'POST',
    	handler(req, reply) {
          server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'search', {
          	index : 'product',
          	type  : 't',
          	body : ""+req.payload.query
          	
          }).then(function (response) {
        reply(response);
      });
  }
});

}
