



```js:eval
let a=[1,2,3,4,5,6,7,8];
a.slice(2)=>>;
a.slice(0,2)=>>;
a=>>;
a.splice(2)=>>;
a=>>;
a=[1,2,3,4,5,6,7,8];
a=>>;
a.includes(6)=>>;
a.includes(5,-3)=>>;
a.includes(6,-3)=>>;
a.shift(1)=>>;
a=>>;
a.shift(1)=>>;
a=>>;
a.pop(1)=>>;
a=>>;
a.pop(1)=>>;
a=>>;
a.unshift(12)=>>;
a=>>;
a.push(13)=>>;
a=>>;
```

```js
const initialArray = (
  Array(10000000).fill(null)
);
let p=performance.now();
console.time('console timer')
let t=Date.now()
initialArray.map(String)
performance.now()-p=>>171.58370000123978
console.timeEnd('console timer')
'hello '+3=>>hello 3
console.log('hello ',Date.now()-t)
console.log('abc',Date.now(),'def')
```
```output
console timer: 171.752ms
hello  172
abc 1635544401105 def
```

```js
let name='Fred'
console.log('hello %s, how are you %s doing', name,3,'ok?')
```
```output
hello Fred, how are you 3 doing ok?
```

---


```js
let userInput = "2+4";
let result;
let p = Date.now();
for (let i = 0; i < 1e6; i++) {
  result = eval(userInput);
  //result = Function("return " + userInput)();
}
console.log(Date.now() - p);
```
```output
382
```
Note:
- 1e6 `js:node`: using Function, 644msec, using eval, 180msec
- 1e6 `js:eval`:   using Function, 550msec, using eval, 158msec
- 1e6 `js` (vm):  using Function, 840msec, using eval, 370msec
- in the debugger, `vm, eval` much slower (use 1e5,  crashes for 1e6)


---





