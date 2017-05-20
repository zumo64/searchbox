import { resolve } from 'path';
import routes from './server/routes/routes';

export default function (kibana) {
  return new kibana.Plugin({
    
    require: ['elasticsearch'],


    uiExports: {
      
      app: {
        title: 'Searchbox',
        description: 'Search Resuts Helper',
        main: 'plugins/searchbox/app'
      },
      
      
      translations: [
        resolve(__dirname, './translations/es.json')
      ],
      
      
      hacks: [
        'plugins/searchbox/hack'
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
};
