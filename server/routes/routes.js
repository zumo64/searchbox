function replyWithError(e, reply) {
  reply({
    title: e.toString(),
    message: e.toString()
  }).code(500);
}

export default function (server) {

    server.route({
        path: '/api/searchbox/example',
        method: 'GET',
        handler(req, reply) {
            reply({
                time: (new Date()).toISOString()
            });
        }
    });

    server.route({
        path: '/searchbox/suggest/',
        method: 'POST',
        handler(req, reply) {
            server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'search', {
                index: "" + req.payload.index,
                type: "" + req.payload.type,
                body: JSON.parse(req.payload.body)
            }).then(response => {
                reply(response);
            }).catch(error => {
                replyWithError(error, reply);
            });
        }
    });

    // Custom Search
    server.route({
        path: '/searchbox/search/',
        method: 'POST',
        handler(req, reply) {
            server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'search', {
                index: "" + req.payload.index,
                type: "" + req.payload.type,
                body: "" + req.payload.query,
                size: "" + req.payload.pageSize,
                from: "" + req.payload.pageSize * req.payload.pageNumber

            }).then(response => {
                reply(response);
            }).catch(error => {
                replyWithError(error, reply);
            });
        }
    });

    // Custom Search
    server.route({
        path: '/searchbox/analyze/',
        method: 'POST',
        handler(req, reply) {
            var jRequest = {
                body: {
                    text: "" + req.payload.text,
                    analyzer: "" + req.payload.analyzer
                }
            }
            if (req.payload.index != null && req.payload.index != "") {
                jRequest.index = "" + req.payload.index
            }

            server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'indices.analyze', jRequest).then(response => {
                reply(response);
            }).catch(error => {
                replyWithError(error, reply);
            });
        }
    });

    server.route({
        path: '/searchbox/query_index_name/',
        method: 'POST',
        handler(req, reply) {

            server.plugins.elasticsearch.getCluster('data').callWithRequest(req, 'cat.indices', {
                index: req.payload.query,
                h: "index"

            }).then(response => {
                reply(response);
            }).catch(error => {
                reply(null);
            });


        }
    });

}
