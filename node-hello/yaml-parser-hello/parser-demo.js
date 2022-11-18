import { readFileSync } from 'node:fs';
import * as YAML from 'yaml';

console.log('start');

let hello = readFileSync("./files/hello.YAML", {encoding: 'utf-8'});
console.log('hello(raw) =\n' + hello);
console.log('hello(parsed) =', JSON.stringify(YAML.parse(hello), null, 2));
console.log();

let favArticles = readFileSync("./files/favArticles.YAML", {encoding: 'utf-8'});
console.log('favArticles(raw) =\n' + favArticles);
console.log('favArticles(parsed) =', JSON.stringify(YAML.parse(favArticles), null, 2));
console.log();

let people1 = readFileSync("./files/people1.YAML", {encoding: 'utf-8'});
console.log('people1(raw) =\n' + people1);
console.log('people1(parsed) =', JSON.stringify(YAML.parse(people1), null, 2));
console.log();

let shoppingList = readFileSync("./files/shoppingList.YAML", {encoding: 'utf-8'});
console.log('shoppingList(raw) =\n' + shoppingList);
console.log('shoppingList(parsed) =', JSON.stringify(YAML.parse(shoppingList), null, 2));
console.log();

let multi = readFileSync("./files/multi.YAML", {encoding: 'utf-8'});
console.log('multi(raw) =\n' + multi);
console.log('multi(parsed) =', JSON.stringify(YAML.parseAllDocuments(multi), null, 2));
console.log();
