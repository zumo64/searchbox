# Searchbox

> Search UI wrapper Kibana plugin

<img src="https://github.com/zumo64/searchbox/blob/master/searchbox.png">


## Features
- Autocomplete quick test viewing results as you typing search terms 
- Display paginated Search and Suggesters results 
- Analyzer output quick test
- Type as you go (TAYG) results

## TAB 1 Autocomplete quick test
Enter index, type, suggest field name , min number of chars that will trigger the search, size of the response.


## TAB 2 Custom Search
- Enter or paste the body of the search on the textArea including parameters (use @0, @1 .. as token values).
- Specify the param values in the search box 
- add/remove  params values using the "+" an "-" icons 
- toggle Type as you Go (TAYG) using the checkbox to see results "live"
- switch result tabs between suggestion and hits to see search/suggestion results

Example of query that returns hits and suggestions taken from https://gist.github.com/zumo64/ce2534b7ac57320ad248d0906e866999
Just paste the code below in the Textarea on the tab "Custom Search"
```json
{
  "query": {
    "match_all": {}
  }, 
  "suggest": {
    "my-suggest-1" : {
      "text" : "@0",
      "term" : {
        "field" : "name"
      }
    },
    "my-suggest-2" : {
      "text" : "@1",
      "phrase" : {
        "field" : "description",
        "max_errors":2,
        "highlight": {
          "pre_tag": "<em>",
          "post_tag": "</em>"
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
latest version available for 6.1.2, 6.1.1
distributions available for versions 5.3.3, 5.4.0, 5.4.1, 6.1.2, 6.1.1
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
