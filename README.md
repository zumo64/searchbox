# searchbox

> Search UI wrapper Kibana plugin

## Features
- Autocomplete quick test
- Display paginated Search and Suggesters results 
- Analyzer output quick test
- Type as you go (TAYG) results

## Autocomplete quick test
Enter index, type, suggest field name , TAYG number of chars that will trigger the search, size of the response


## Custom Search
- Enter the body of the search including params (use @0, @1 ...  as tokens for the params)
- Specify the param values in the search box 
- add/remove  params using the +/- keys
- toggle (TAYG) using the checkbox


## Analysis quick test 
- Enter the index name
- Enter the analyzer name
- Enter the text to analyze
- press "search"


## installation
```sh
#Kibana >= 5.x

./bin/kibana-plugin install https://github.com/zumo64/searchbox/releases/download/0.0.1/searchbox-0.0.1.zip

```

---

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
