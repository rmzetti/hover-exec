# Typescript

First install typescript and ts-node globally with
npm i -g typescript ts-node
Then set ts-node as the cmd in your code block:
'''typescript {cmd="ts-node" output="text"}
```js
let this_works = true;
    if (this_works) {
        console.log('It works!');
    }
```


# Javascript tests

Commands:
> `js` or `js:vm` to use `vm`
> `js:node` to use node
> `js:eval` to use `eval`.

For javascript in the browser see the last code block.

## array operations

```js:node
let a=[1,2,3,4,5,6,7,8];
a.slice(2)=>>3,4,5,6,7,8
a.slice(0,2)=>>1,2
a=>>1,2,3,4,5,6,7,8
a.splice(2)=>>3,4,5,6,7,8
a=>>1,2
a=[1,2,3,4,5,6,7,8];
a=>>1,2,3,4,5,6,7,8
a.includes(6)=>>true
a.includes(5,-3)=>>false
a.includes(6,-3)=>>true
a.shift(1)=>>1
a=>>2,3,4,5,6,7,8
a.shift(1)=>>2
a=>>3,4,5,6,7,8
a.pop(1)=>>8
a=>>3,4,5,6,7
a.pop(1)=>>7
a=>>3,4,5,6
a.unshift(12)=>>5
a=>>12,3,4,5,6
a.push(13)=>>6
a=>>12,3,4,5,6,13
```

## timing in javascript (not using moment.js)

```js
const {performance}=require('perf_hooks');
//previous needed by node, ignored by eval & vm
let array1 = Array(1000000).fill(42);
let p=performance.now();
console.time('console timer')
let t=Date.now()
array1=array1.map(x => Math.random())
array1=array1.map(String)
performance.now()-p=>>525.8874999880791
console.timeEnd('console timer')
console.log(array1.slice(0,5))
console.log('hello ',Date.now()-t)
console.log('abc',Date.now(),'def')
```
```output
console timer: 526.087ms
[
  '0.8695901399984176',
  '0.6957363046573073',
  '0.2316370419177154',
  '0.28363856756842964',
  '0.17539279126261254'
]
hello  526
abc 1636275626818 def
```

## using console.log

```js
let name='Fred'
'hello '+name+', how are you '+3+' doing, ok?'=>>hello Fred, how are you 3 doing, ok?
console.log('hello %s, how are you %s doing', name,3,', ok?')
```
```output
hello Fred, how are you 3 doing , ok?
```

---

## speed of eval vs Function within code

```js:eval
let expr = "7*7-7";
let result;
let p = Date.now();
for (let i = 0; i < 1e6; i++) { //speed test loop
  //result = eval( expr );
  result = Function("return " + expr)();
}
console.log('check, result=',result)
console.log(Date.now() - p,'msec');
```
```output
check, result= 42
582 msec
```
Note:
- 1e6 `js:node`: using Function, 644msec, using eval, 180msec
- 1e6 `js:eval`:   using Function, 550msec, using eval, 158msec
- 1e6 `js` (vm):  using Function, 840msec, using eval, 370msec
- in the debugger use 1e5 (crashes for 1e6), `vm, eval` much slower


---

```html
<script>
function test(){
  let t='';
  let a=[1,2,3,4,5,6,7,8];
  t=t+'\n a = '+a;
  t=t+'\n a.slice(2) = '+a.slice(2);
  t=t+'\n a.slice(0,2)= '+a.slice(0,2);
  t=t+'\n note that, still, a= '+a;
  t=t+'\n a.splice(2)= '+a.splice(2);
  t=t+'\n but now a= '+a;
  a=[1,2,3,4,5,6,7,8];
  t=t+'\n reset a, a= '+a;
  t=t+'\n a.includes(6)= '+a.includes(6);
  t=t+'\n a.includes(5,-3)= '+a.includes(5,-3);
  t=t+'\n a.includes(6,-3)= '+a.includes(6,-3);
  t=t+'\n a.shift(1)= '+a.shift(1);
  t=t+'\n a= '+a;
  t=t+'\n a.pop(1)= '+a.pop(1);
  t=t+'\n a= '+a;
  t=t+'\n a.pop(1)= '+a.pop(1)
  t=t+'\n a= '+a;
  t=t+'\n a.unshift(12)= '+a.unshift(12);
  t=t+'\n a= '+a;
  t=t+'\n a.push(13)= '+a.push(13);
  t=t+'\n a= '+a;
  let p=performance.now();
  let array1 = Array(30000000).fill(42);
  array1=array1.map(String)
  t=t+'\n\n time to fill 42 & map array[3e7] to String= '+(performance.now()-p)+'ms';
  t=t+'\n result.slice(0,5)= '+array1.slice(0,5);
  r1.innerText=t;
}
</script>
<h1 align="center"><br>Test results</h1>
<h3><div id="r1" align="center"><i>calculating ...</i></div></h3>
<script>
r1=document.getElementById("r1");
//test();
window.setTimeout(function() {test();},150);
</script>
```








