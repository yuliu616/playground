// 'yamljs' wont support node.js 'module' mode
let YAML = require('yamljs');
let fs = require('fs');

console.log('start');

let hello = fs.readFileSync("./files/hello.YAML", {encoding: 'utf-8'});
console.log('hello(raw) =\n' + hello);
console.log('hello(parsed) =', JSON.stringify(YAML.parse(hello), null, 2));
console.log();

let favArticles = fs.readFileSync("./files/favArticles.YAML", {encoding: 'utf-8'});
console.log('favArticles(raw) =\n' + favArticles);
console.log('favArticles(parsed) =', JSON.stringify(YAML.parse(favArticles), null, 2));
console.log();

let people1 = fs.readFileSync("./files/people1.YAML", {encoding: 'utf-8'});
console.log('people1(raw) =\n' + people1);
console.log('people1(parsed) =', JSON.stringify(YAML.parse(people1), null, 2));
console.log();

let shoppingList = fs.readFileSync("./files/shoppingList.YAML", {encoding: 'utf-8'});
console.log('shoppingList(raw) =\n' + shoppingList);
console.log('shoppingList(parsed) =', JSON.stringify(YAML.parse(shoppingList), null, 2));
console.log();

let multi = fs.readFileSync("./files/multi.YAML", {encoding: 'utf-8'});
console.log('multi(raw) =\n' + multi);
for (it of multi.split(/^--[-]+$/m)){
  console.log('item of multi(parsed) =', JSON.stringify(YAML.parse(it), null, 2));
}
console.log();
