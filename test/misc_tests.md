- [Javascript tests](#javascript-tests)
  - [array operations](#array-operations)
  - [timing in javascript (not using moment.js)](#timing-in-javascript-not-using-momentjs)
  - [using console.log](#using-consolelog)
  - [speed of eval vs Function within javascript code](#speed-of-eval-vs-function-within-javascript-code)
  - [Javascript in the browser](#javascript-in-the-browser)
  - [Plotting comparison](#plotting-comparison)
    - [Some data for plots](#some-data-for-plots)
  - [Using scripts via REPL](#using-scripts-via-repl)
    - [Check active REPLs](#check-active-repls)
    - [Using the python repl](#using-the-python-repl)
    - [Lua repl](#lua-repl)
    - [Node repl](#node-repl)
    - [Julia repl](#julia-repl)
    - [Scilab repl](#scilab-repl)
    - [Octave repl](#octave-repl)
    - [R (rterm) repl](#r-rterm-repl)
- [Typescript](#typescript)


# Javascript tests

Commands:
> `js` or `js:vm` to use `vm`
> `js:node` to use node
> `js:eval` to use `eval`.

For javascript in the browser see the last code block.

## array operations

```js
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
a.push(['hello',true])=>>6
a=>>12,3,4,5,6,hello,true
a[5]=>>hello,true
a.push(['goodbye',false])
a=>>12,3,4,5,6,hello,true,goodbye,false
i=a.findIndex((el) => el[0]==='goodbye')=>>6
if(i===-1){i=a.length;} //because if index not found, i=-1, & splice(i,1) wrong
a.splice(i,1)=>>goodbye,false
a=>>12,3,4,5,6,hello,true
a.indexOf(6)=>>4
b=a.find((el) => el[0]==='hell')
b=>>undefined
console.log("hello ".repeat(3))
```
```output
hello hello hello
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
performance.now()-p=>>1564.4390000011772
console.timeEnd('console timer')
console.log(array1.slice(0,2))
console.log('hello ',Date.now()-t)
console.log('abc',Date.now(),'def')
```
```output
console timer: 1.566s
[ '0.42284083411200335', '0.0791851273341857' ]
hello  1569
abc 1637199109775 def
```

## using console.log

```js
let name='Fred'
'hello '+name+', how are you '+3+' doing, ok?'=>>hello Fred, how are you 3 doing, ok?
console.log('hello %s, how are you %s doing', name,3,', ok?')
```

---

## speed of eval vs Function within javascript code

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
157 msec
```
Note:
- 1e6 `js:node`: using Function, 644msec, using eval, 180msec
- 1e6 `js:eval`:   using Function, 550msec, using eval, 158msec
- 1e6 `js` (vm):  using Function, 840msec, using eval, 370msec
- in the debugger use 1e5 (crashes for 1e6), `vm, eval` much slower


---

## Javascript in the browser
On windows use `html` to use the default browser, on linux use `html:firefox`, or `html:chrome` or whatever is installed, and, if needed, check the *hover-exec* configuration for `firefox` (or `chrome`)

```html
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


## Plotting comparison

https://github.com/observablehq/plot 

```html  //chartjs
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
<canvas id="myChart" style="width:100%;max-width:600px"></canvas>
<script>
let a=[ #inhere  `#p1` ]   //note *inhere* is inside the array designator square brackets
let x=Array(a.length/2).fill(0).map((x,i) => a[i*2])
let y1=Array(a.length/2).fill(0).map((x,i) => a[i*2+1])
let b=[ #inhere  `#j1` ] 
let y2=Array(b.length/2).fill(0).map((x,i) => b[i*2+1])
let c=[ #inhere  `#go` ] 
let y3=Array(c.length/2).fill(0).map((x,i) => c[i*2+1])
new Chart("myChart", {
  type: "line",
  data: { labels: x, datasets: 
              [{ data:y1, borderColor: "red", fill: false },
               { data:y2, borderColor: "blue", fill: false },
               { data:y3, borderColor: "green", fill: false },
              ] },
  options: { legend: {display: false} }
});
</script>
```

```html //plotly
 <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
 <!-- Plots go in blank <div> elements. You can size them in the plot layout,  or size the div-->
<div id="plot" style="width:70%;height:400px"></div>
<script>
let lm='lines+markers'
let a=[ #inhere  `#p1` ]   //note *inhere* is inside the array designator square brackets
let b=[ #inhere  `#j1` ] 
let c=[ #inhere  `#go` ] 
let x=Array(a.length/2).fill(0).map((x,i) => Math.log10(a[i*2]))
let y1=Array(a.length/2).fill(0).map((x,i) => a[i*2+1])
let y2=Array(b.length/2).fill(0).map((x,i) => b[i*2+1])
let y3=Array(c.length/2).fill(0).map((x,i) => c[i*2+1])
plot1 = document.getElementById('plot');
Plotly.plot( plot1, [{ x: x, y: y1, mode: lm, name:'pascal' },
                  { x: x, y: y2, mode: lm, name:'javascript' },
                  { x: x, y: y3, mode: lm, name:'go' },]);
</script>
<a href="https://bit.ly/1Or9igj">plotly.js documentation</a>
```


```html //google charts
<div id="chart_div" style="width: 100%; height: 500px;"></div>
<script src="https://www.gstatic.com/charts/loader.js"></script>
<script>
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
  let a=[ #inhere  `#p1` ]
  let b=[ #inhere  `#j1` ] 
  let c=[ #inhere  `#go` ] 
  let x=Array(a.length/2).fill(0).map((x,i) => Math.log10(a[i*2]))
  let d=Array(a.length/2).fill(0).map((e,i)=>[x[i],a[i*2+1],b[i*2+1],c[i*2+1]])
  d=[['x','pascal','javascript','go'], ...d]
  var data = google.visualization.arrayToDataTable(d);
  var options = {
    title:'Speed Comparison',
    hAxis: {title: 'log10(Buffer size)',titleTextStyle:{color: '#222'}},
    vAxis: {minValue: 0}
  };
  var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
  chart.draw(data, options);
  }
</script>
```


```gnuplot
 # first \n needed to distinguish from previous go1 in script etc 
$go1 <<EOD
 #inhere  `#go`
EOD
$pascal1 <<EOD
 #inhere  `#p1`
EOD
$javascript1 <<EOD
 #inhere  `#j1` 
EOD
set logscale x
plot "$javascript1" w lp title "javascript",\
       "$pascal1" w lp title "pascal",\
       "$go1" w lp title "go"
```


### Some data for plots

#p1
1,  2.8481913984619769E+002,
2,  3.2000000000000006E+002,
4,  5.3930160442227304E+002,
9,  5.5069448693630306E+002,
18,  4.9220672682526657E+002,
38,  4.4362464685143249E+002,
78,  4.2469318639675049E+002,
162,  3.8850784210273861E+002,
336,  4.1373705532501759E+002,
695,  4.0941356661070370E+002,
1438,  4.0981270590381087E+002,
2976,  4.0774328614234560E+002,
6158,  4.1207063150259239E+002,
12743,  4.1257614187723925E+002,
26367,  4.1326873674591815E+002,
54556,  4.0725164114438951E+002,
112884,  4.0667517359097167E+002,
233572,  4.0144779152324566E+002,
483293,  3.9295922011303855E+002,
1000000,  3.9015515260938304E+002,
#p1

#j1
1, 25,
2, 36.36363636363636,
4, 800,
9, 900,
18, 1200,
38, 1266.6666666666667,
78, 1300,
162, 270.00000000000006,
336, 1344.0000000000002,
695, 1390,
1438, 1369.5238095238096,
2976, 1384.186046511628,
6158, 1256.734693877551,
12743, 1554.0243902439024,
26367, 1550.9999999999998,
54556, 1515.4444444444443,
112884, 1495.1523178807947,
233572, 1150.6009852216748,
483293, 668.9176470588236,
1000000, 664.8936170212766,
#j1

#go
1,  180.6195249706493,
2.0691380811147897,  761.2722888575386,
4.281332398719393,  804.3837292098438,
8.858667904100825,  1112.4088534062691,
18.32980710832436,  1379.9448248380909,
37.926901907322495,  1374.2129029067175,
78.47599703514611,  1604.760480862666,
162.3776739188721,  1467.356532792988,
335.981828628378,  1973.2297446900686,
695.1927961775605,  1813.4675783945756,
1438.449888287663,  1747.260753938808,
2976.351441631319,  1971.883729329512,
6158.48211066026,  1640.8616941970215,
12742.749857031347,  1962.098385087474,
26366.508987303558,  1925.588743440195,
54555.947811685146,  1963.9029643128854,
112883.78916846885,  1840.5875915896195,
233572.14690901214,  945.4551695526003,
483293.0238571752,  662.0673675355384,
1e+06,  660.4684782172212,
#go

## Using scripts via REPL

Each of the script REPL examples below shows a 'restart' script followed by a normal continuation which shows the script variables are still available.

### Check active REPLs

```js:eval //find active repl
chRepl.length=>> 6
let i=chRepl.findIndex((el)=>el[1]===repl)
i=>> 5
chRepl[i][0]=>> python
```

### Using the python repl
`js:eval repl.kill()` //kills active repl (but use :restart)

```python::restart
from time import time
t=time()
b=0
for c in range(600):
  for a in range(10000):
    b+=1
  b+=1
print(time()-t)
b=>>6000600
```
```output
0.394805908203125
```

```python::
from time import time
b=>>6000600
time()
b # this now produces output because the repl is being used
```
```output
1637747538.1500988
6000600
```

### Lua repl

```lua:lua54:
m=1e7
n=0.01
tt = os.clock()
tt=>>1.003
for ii=1,m do
  n=n*ii
  n=n+1
  n=n/ii
end
tt1=os.clock()-tt
tt1=>>0.418
'ok'
```
```output
ok
```

```lua:lua54:
os.clock()-tt
```

### Node repl

```js:node:restart
let a=0,b=0,c=0,d=0,e=0;
'ok'
```

```js:node:
a+=1 =>>1
b+=10 =>>10
c+=100 =>>100
```

### Julia repl

```julia::restart
x=rand(Float64);_
a=rand(Float64,3);print(string("a=",a,"\nx=",x))
```

```julia::
a=a.+1;_ 
x=x+1;_
print(a,'\n',x)
```
```output
[9.11174469128525, 9.504474944704, 9.05706503358001]
9.441172925172872
```

### Scilab repl

```js:scilab:restart
tic();
a=1.1;
m=1000000; //1e6
for x=1:1:m
a=a*x;
a=a+1.1;
a=a/x;
end
t=toc();
mprintf('Time: %.2f sec',t)
```
```output
Time: 1.33 sec
```

```js:scilab:
mprintf('a equals %.f',a)
mprintf('t equals %.2f',t)
a=a+1;_
```
```output
a equals 31
t equals 1.26
```

### Octave repl

```python:octave:restart
a=1.0;
t=time;
m=1000000; #1e6
for i=1:m
  a=a*i;
  a=a+1.1;
  a=a/i;
endfor
t=time-t;
disp(strcat('time= ',num2str(t),' sec'))
disp(strcat('speed= ',num2str(m/t/1e6),' million iterations per sec'))
```
```output
time=1.6627 sec
speed=0.60145 million iterations per sec
```

```python:octave:
disp('I repeat...')
disp(strcat('time= ',num2str(t),' sec'))
disp(strcat('speed= ',num2str(m/t/1e6),' million iterations per sec'))
```
```output
I repeat...
time=1.6297 sec
speed=0.61359 million iterations per sec
```

### R (rterm) repl

```rterm::restart
a=7*7-7
a=>> 42
noquote(paste('the meaning of life is',a))
```
```output
the meaning of life is 42
```
```rterm::
noquote(paste('.. that was',a))
```
```output
.. that was 42
```

```rterm::restart #data for plots
require(tcltk)
x <- 1:10
y1 <- x*x
y2  <- 2*y1
```

```rterm:: #plotting the above data
windows()
# Stair steps plot
plot(x, y1, type = "S")
# Lines & points plot
windows()
plot(x,y1,type="b",pch=19,col="red",xlab= "x",ylab="y")
lines(x, y2,pch=18,col="blue",type="b",lty=2)
msgBox<-tkmessageBox(title="Plot",message="Close plots first!")
```
```output
 ..timeout
```

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

