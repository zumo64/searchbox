function replyWithError(e, reply) {
  reply({
    title: e.toString(),
    message: e.toString()
  }).code(500);
}

export default function (server) {

    // server.route({
    //     path: '/api/searchbox/example',
    //     method: 'GET',
    //     handler(req, reply) {
    //         reply({
    //             time: (new Date()).toISOString()
    //         });
    //     }
    // });


    server.route({
        path: '/api/searchbox/example',
        method: 'GET',
        handler() {
            return { time: (new Date()).toISOString() };
        }
    });

    server.route({
        path: '/searchbox/suggest/',
        method: 'POST',
        handler: function(req) {
            const response =  server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'search', {
                index: "" + req.payload.index,
                type: "" + req.payload.type,
                body: JSON.parse(req.payload.body)
            }).catch(error => {
                return(error);
            });
            return response;
        }
    });

    // Custom Search
    server.route({
        path: '/searchbox/search/',
        method: 'POST',
        handler: function(req) {
            const response = server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'search', {
                index: "" + req.payload.index,
                type: "" + req.payload.type,
                body: "" + req.payload.query,
                size: "" + req.payload.pageSize,
                from: "" + req.payload.pageSize * req.payload.pageNumber

            })
            return response;
        }
    });

    // Analyze
    server.route({
        path: '/searchbox/analyze/',
        method: 'POST',
        handler:function (req) {
            var jRequest = {
                body: {
                    text: "" + req.payload.text,
                    analyzer: "" + req.payload.analyzer
                }
            }
            if (req.payload.index != null && req.payload.index != "") {
                jRequest.index = "" + req.payload.index
            }

            const response = server.plugins.elasticsearch.getCluster('data')
            .callWithRequest(req, 'indices.analyze', jRequest)
            .catch(error => {
                return(error);
            });
            return response;
        }
    });

    server.route({
        path: '/searchbox/query_index_name/',
        method: 'POST',
        handler: function (req) {
            const response =  server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'cat.indices', {
                index: req.payload.query+"*",
                h: "index"

            }).catch(error => {
                return(error);
            });
            return response;

        }
    });

}
