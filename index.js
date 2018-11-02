import routes from './server/routes/routes';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'searchbox',
    uiExports: {
      app: {
        title: 'Searchbox',
        description: 'Search plugin',
        main: 'plugins/searchbox/app',
        styleSheetPath: require('path').resolve(__dirname, 'public/app.scss'),
      },
      hacks: [
        'plugins/searchbox_6_4/hack'
      ]
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

   init(server, options) {
      // Add server routes and initalize the plugin here
      routes(server);
    }
  });
}