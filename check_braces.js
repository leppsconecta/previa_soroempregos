const fs = require('fs');
const path = 'c:\\Users\\lepps\\OneDrive\\Desktop\\Projetos DEV\\sorogrupos-main\\src\\pages\\private\\Vagas.tsx';
const content = fs.readFileSync(path, 'utf8');

let braces = 0; // []
let parens = 0; // ()
let curlies = 0; // {}
let totalLines = content.split('\n').length;

for (let i = 0; i < content.length; i++) {
  let char = content[i];
  if (char === '{') curlies++;
  if (char === '}') curlies--;
  if (char === '(') parens++;
  if (char === ')') parens--;
  if (char === '[') braces++;
  if (char === ']') braces--;
}

console.log(`Results for ${path}:`);
console.log(`Lines: ${totalLines}`);
console.log(`Curlies balance: ${curlies === 0 ? 'BALANCED' : curlies}`);
console.log(`Parens balance: ${parens === 0 ? 'BALANCED' : parens}`);
console.log(`Braces balance: ${braces === 0 ? 'BALANCED' : braces}`);
