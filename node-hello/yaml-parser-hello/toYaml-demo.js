// 'yamljs' wont support node.js 'module' mode
let YAML = require('yamljs');
let fs = require('fs');

let indentSpace = 2;
let inlineForDepthOver = 10;

{
  let data = {
    "id": 12001,
    "firstName": "peter",
    "lastName": "li",
    "gender": "MALE",
    "dateOfBirth": "1990-10-25"
  };
  let str = YAML.stringify(data, inlineForDepthOver, indentSpace);
  console.log('YAML for json:');
  console.log(str);
}

{
  let data = [
    "milk tea",
    "cola",
    "rice",
    "orange juice",
    "bread",
    "batteries",
    "牛肉",
    "烧肉"
  ];
  let str = YAML.stringify(data, inlineForDepthOver, indentSpace);
  console.log('YAML for json:');
  console.log(str);
}

{
  let data = {
    "articles": [
      {
        "type": "blogger",
        "author": "alexander",
        "published": "2020-01-15T16:25:45Z",
        "isGood": true,
        "tag": [
          "green",
          "nice"
        ],
        "content": "Features are marked as legacy rather than being deprecated if their use does no harm, and they are widely relied upon within the npm ecosystem. Bugs found in legacy features are unlikely to be fixed.\nUse caution when making use of Experimental features, particularly within modules. Users may not be aware that experimental features are being used. Bugs or behavior changes may surprise users when Experimental API modifications occur. To avoid surprises, use of an Experimental feature may need a command-line flag. Experimental features may also emit a warning."
      },
      {
        "type": "blogger",
        "author": "may",
        "published": "2020-04-24T17:21:11Z",
        "isGood": true,
        "tag": [
          "blue",
          "story"
        ],
        "content": "Clusters of Node.js processes can be used to run multiple instances of Node.js that can distribute workloads among their application threads. When process isolation is not needed, use the worker_threads module instead, which allows running multiple application threads within a single Node.js instance."
      }
    ]
  };
  let str = YAML.stringify(data, inlineForDepthOver, indentSpace);
  console.log('YAML for json:');
  console.log(str);
}
