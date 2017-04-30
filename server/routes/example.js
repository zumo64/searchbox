export default function (server) {

  server.route({
    path: '/api/searchbox/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

}
