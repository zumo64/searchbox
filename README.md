# Searchbox

> Search UI wrapper Kibana plugin

## Features
- Autocomplete quick test
- Display paginated Search and Suggesters results 
- Analyzer output quick test
- Type as you go (TAYG) results

## Autocomplete quick test
Enter index, type, suggest field name , number of chars that will trigger the search, size of the response.


## Custom Search
- Enter the body of the search including params (use @0, @1 ...  as tokens for the params)
- Specify the param values in the search box 
- add/remove  params using the +/- keys
- toggle type as you Go (TAYG) using the checkbox to see live results 
- switch result tabs between suggestion and hits results

Example of query that returns hits and suggestions  :
```json
{
  "query": {
    "match_all": {}
  }, 
    "suggest": {
        "sugg1" : {
            "prefix" : "watch",
            "completion" : {
                "field" : "suggest_text",
                "fuzzy" : {
                 	"fuzziness" : "2"
                },
                "size": 4,
                "contexts": {
                    "category": [ "generated" ]
                }
            }
        },
        "sugg2" : {
            "prefix" : "watch",
            "completion" : {
                "field" : "suggest_text",
                "fuzzy" : {
                 	 "fuzziness" : "2"
                },
                "size": 4,
                "contexts": {
                    "category": [ "generated" ]
                }
            }
        }
    }
}
```

## Analyzer quick test 
- Enter the index name
- Enter the analyzer name
- Enter the text to analyze
- press "search"





## installation
Plugin works for Kibana 5.x, 6.1.2
distributions available for versions 5.3.3, 5.4.0, 5.4.1,6.1.2
Just replace the right version on the path below

./bin/kibana-plugin install https://github.com/zumo64/searchbox/releases/download/6.1.2/searchbox-6.1.2.zip


## development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following npm tasks.

  - `npm start`

    Start kibana and have it include this plugin

  - `npm start -- --config kibana.yml`

    You can pass any argument that you would normally send to `bin/kibana` by putting them after `--` when running `npm start`

  - `npm run build`

    Build a distributable archive

  - `npm run test:browser`

    Run the browser tests in a real web browser

  - `npm run test:server`

    Run the server tests using mocha

For more information about any of these commands run `npm run ${task} -- --help`.
