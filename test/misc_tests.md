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
performance.now()-p=>>536.840372000006
console.timeEnd('console timer')
console.log(array1.slice(0,2))
console.log('hello ',Date.now()-t)
console.log('abc',Date.now(),'def')
```
```output
0.5222716816069242,0.8364862987362658
hello  537
abc 1636333406714 def
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
  result = eval( expr );
  //result = Function("return " + expr)();
}
console.log('check, result=',result)
console.log(Date.now() - p,'msec');
```
```output
check, result= 42
190 msec
```
Note:
- 1e6 `js:node`: using Function, 644msec, using eval, 180msec
- 1e6 `js:eval`:   using Function, 550msec, using eval, 158msec
- 1e6 `js` (vm):  using Function, 840msec, using eval, 370msec
- in the debugger use 1e5 (crashes for 1e6), `vm, eval` much slower


---

## Javascript in the browser
On windows use `html` to use the default browser, on linux use `html:firefox`, or `html:chrome` or whatever is installed, and check the *hover-exec* configuration for `firefox` (or `chrome`)

```html:chrome
<script>
function test(){
  let t='\n Live:';
  const t1='\n >> ';
  let a=[1,2,3,4,5,6,7,8];
  t+=t1+a;
  t+=t1+a.slice(2);
  t+=t1+a.slice(0,2);
  t+=t1+a;
  t+=t1+a.splice(2);
  t+=t1+a;
  a=[1,2,3,4,5,6,7,8];
  t+=t1+a;
  t+=t1+a.includes(6);
  t+=t1+a.includes(5,-3);
  t+=t1+a.includes(6,-3);
  t+=t1+a.shift(1);
  t+=t1+a;
  t+=t1+a.pop(1);
  t+=t1+a;
  t+=t1+a.pop(1)
  t+=t1+a;
  t+=t1+a.unshift(12);
  t+=t1+a;
  t+=t1+a.push(13);
  t+=t1+a;
  let p=performance.now();
  let array1 = Array(30000000).fill(42);
  array1=array1.map(String)
  t+='\n\n >> '+Math.round(performance.now()-p)+'ms';
  t+=t1+array1.slice(0,5);
  let expr = "7*7-7";
  let result=0;
  p = performance.now();
  for (let i=0; i<1e6; i++) { //speed test loop
    result = eval( expr );
    //result = Function("return " + expr)();
  }
  t+='\n\n >> '+result;
  t+=t1+Math.round(performance.now()-p)+'ms';
  r2.innerText=t;
}
</script>
<h1 align="center"><br>Test results</h1>
<div style="display:flex;align:center">
<div id="r1" style="margin:10;width:45%;color:blue;text-align:right">
<br> Guide (Chrome):
<br> a = 1,2,3,4,5,6,7,8
<br> a.slice(2) = 3,4,5,6,7,8
<br> a.slice(0,2) = 1,2
<br> a = 1,2,3,4,5,6,7,8
<br> a.splice(2) = 3,4,5,6,7,8
<br> but now a = 1,2
<br> reset a = 1,2,3,4,5,6,7,8
<br> a.includes(6) = true
<br> a.includes(5,-3) = false
<br> a.includes(6,-3) = true
<br> a.shift(1)= 1
<br> a = 2,3,4,5,6,7,8
<br> a.pop(1) = 8
<br> a = 2,3,4,5,6,7
<br> a.pop(1) = 7
<br> a = 2,3,4,5,6
<br> a.unshift(12) =  6
<br> a = 12,2,3,4,5,6
<br> a.push(13) = 7
<br> a = 12,2,3,4,5,6,13
<br> 
<br> time to fill 42 & map array[3e7] to String = 492ms
<br> result.slice(0,5) = 42,42,42,42,42
<br> 
<br> eval or Function test, check result = 42
<br> time = 193.5ms
</div>
<div id="r2" style="margin:10;color:red;align:left;">calculating ...</div>
</div>
<script>
r1=document.getElementById("r2");
//test();
window.setTimeout(function() {test();},150);
</script>
```








