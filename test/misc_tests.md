## Hover-exec miscellaneous comparative tests

This provides various tests for scripts run in the VSCode extension *hover-exec*. All the test files are best viewed in the editor. Type or copy one of the following in any instance of the editor - hover to see the path/name, then click the path/name to open the file in the editor. If the cursor is in the command, using the shortcut alt+/ or opt+/ will open the file.

`edit %h/README`            //%h is a hover-exec command line variable giving the extension path \
`edit %h/READMORE`       //extended README \
`edit %h/test/basic_tests` //basic tests \
`edit %h/test/misc_tests`  //benchmark tests and REPLs \

NB. Each of the above commands (highlighted in preview) must be surrounded by single backticks. The 'edit' one-liners need not start in col 1.

Using *hover-exec* in the vscode editor on these files will allow live testing and comparison with the test outputs provided. Note that any changes made to these files will be reverted if *hover-exec* is updated, so save the file locally if you want to keep changes.

## Contents
- [Hover-exec miscellaneous comparative tests](#hover-exec-miscellaneous-comparative-tests)
- [Contents](#contents)
- [Javascript tests](#javascript-tests)
  - [using console.log](#using-consolelog)
  - [array operations](#array-operations)
  - [timing in javascript (without using moment.js)](#timing-in-javascript-without-using-momentjs)
  - [speed of eval vs Function within javascript code](#speed-of-eval-vs-function-within-javascript-code)
- [Javascript in the browser](#javascript-in-the-browser)
- [Plotting comparison](#plotting-comparison)
  - [Data for the plots](#data-for-the-plots)
- [Simple cross-platform cross-script speed tests](#simple-cross-platform-cross-script-speed-tests)
  - [Javascript tests: 'vm', 'eval' and 'node'](#javascript-tests-vm-eval-and-node)
  - [Javascript in the browser](#javascript-in-the-browser-1)
  - [Test using 'go' as a scripting language](#test-using-go-as-a-scripting-language)
  - [Test using 'python'](#test-using-python)
  - [Test using 'lua'](#test-using-lua)
  - [Pascal test](#pascal-test)
  - [Octave test](#octave-test)
  - [Test using scilab](#test-using-scilab)
  - [Julia test](#julia-test)
- [Configuration](#configuration)
  - [View and alter as a set ('scripts, 'swappers,'repls')](#view-and-alter-as-a-set-scripts-swappersrepls)
  - [View and alter a specific setting](#view-and-alter-a-specific-setting)

## Javascript tests

Commands:

>      `js` or `js:vm` to use `vm`
>      `js:node` to use node
>      `js:eval` to use `eval`.

For javascript in the browser see the following section [Javascript in the browser](#javascript-in-the-browser)

### using console.log

```js
// '''js //can use js, js:eval or js:node
let name='Fred'
'hello '+name+', how are you '+3+' doing, ok?'=>>hello Fred, how are you 3 doing, ok?
console.log('hello %s, how are you %s doing', name,3,', ok?')
```
>      Test output (also identical output in-line):
>      hello Fred, how are you 3 doing , ok?


### array operations

```js
// '''js //uses vm by default
// '''js:eval //uses js syntax highlight and eval to exec
// '''js:node // uses js syntax highlight and nodejs to exec
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
b=a.find((el) => el[0]==='hello')
b=>>hello,true
console.log("hello ".repeat(3))
```
>      Test output (mostly in-line):
>      hello hello hello


### timing in javascript (without using moment.js)

```js //can use js, js:eval or js:node
// '''js //can use js, js:eval or js:node
// the following line is required by node, ignored by eval & vm
const {performance}=require('perf_hooks');
let array1 = Array(1000000).fill(42);
let p=performance.now();
console.time('timer')
let t=Date.now()
array1=array1.map(x => Math.random())
array1=array1.map(String)
performance.now()-p=>>530.5593000017107
console.timeEnd('timer')  //vm & eval output this in dev-tools console only
console.log(array1.slice(0,2))
console.log('hello ',Date.now()-t)
console.log('abc',Date.now(),'def')
```
>      Test output
>      [ '0.5418360655969707', '0.19301233896461345' ]
>      hello  531
>      abc 1650601634968 def

---

### speed of eval vs Function within javascript code

```js:node
// '''js //can use js, js:eval or js:node
let n=1e6; //in the debugger use 1e5 (crashes for 1e6)
let expr = "7*7-7";
let result,t1, t2;
let p = Date.now();
for (let i = 0; i < n; i++) { //speed test loop
  result = Function("return " + expr)();
}
t1 = Date.now() - p
'check result='+result =>>check result=42
p = Date.now();
for (let i = 0; i < n; i++) { //speed test loop
  result = eval( expr );
}
'check result='+result =>>check result=42
t2 = Date.now() - p
console.log('- for n=',n,': using Function',t1,'msec using eval',t2,'msec')
```
>      Test output:
>      js:node for n= 1000000 : using Function 675 msec using eval 190 msec
>      js:eval   for n= 1000000 : using Function 574 msec using eval 164 msec
>      js:vm    for n= 1000000 : using Function 858 msec using eval 364 msec
>      NB: in the debugger use n=1e5 (crashes for n=1e6)

---

## Javascript in the browser
On windows use `html` to use the default browser, on linux use `html:firefox`, or `html:chrome` or whatever is installed, and, if needed, check the *hover-exec* configuration for `firefox` (or `chrome`)

```html
<!-- '''html //test output shown in the browser -->
<!--            //along with calculation timings -->
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
  t+=t1+array1.slice(-5);
  let expr = "7*7-7",n=1e6;
  let result=0;
  p = performance.now();
  for (let i=0; i<n; i++) { //speed test loop
    result = eval( expr );
  }
  t+='\n\n >> '+result;
  t+=t1+Math.round(performance.now()-p)+'ms';
  result=0;
  p = performance.now();
  for (let i=0; i<n; i++) { //speed test loop
    result = Function("return " + expr)();
  }
  t+='\n >> '+result;
  t+=t1+Math.round(performance.now()-p)+'ms';
  r2.innerText=t;
}
</script>
<h1 align="center"><br>Test results</h1>
<p align="center"> time to see live results: from 0.25 to 25 sec. depending on processor </p>
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
<br> result.slice(-5) = 42,42,42,42,42
<br> 
<br> eval test, check result is 42
<br> time = ~200ms
<br> Function test, check result is 42
<br> time (Asus ~2020) = ~450ms
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

These tests all use the same data utilising *hover-exec*'s #inhere macro. 
To see the data quickly, hover over a line containing an *inhere* tag reference (not in preview).

```html  //chartjs
<!-- '''html //test using chartjs -->
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
<!-- '''html //test using plotly -->
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
<!-- '''html //test using google charts -->
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

```js : gnuplot
# '''js: gnuplot? //test using *gnuplot*, (js: gives some artificial syntax highlighting)
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

### Data for the plots

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

## Simple cross-platform cross-script speed tests

Each test is a loop run 1e7, 1e8 or 1e9 times (depending on the script speed), with speed calculated in 1m iterations per sec.

These test all use straightforward calculations within a loop, rather than specific numerical packages.

### Javascript tests: 'vm', 'eval' and 'node'

The following code block can be executed with the code block identifier set to `js` or `js:vm` for the vscode `vm` to execute, to 'js:eval' for vscode's built-in `eval` to execute, or to `js:node` for nodejs to execute. Note that to execute with `nodejs`, that package must have been previously installed on the system and should be executable with the command `node`.

```js  //can be 'js' to use vm, 'js:eval' to use 'eval', or 'js:node' to use nodejs
// '''js  //can be 'js' to use vm, 'js:eval' to use 'eval', or 'js:node' to use nodejs
//timing and speed results for the three alternatives should be similar
const {performance}=require('perf_hooks'); //ignored by eval & vm
let iter=1e8;
let n=0.01;
let t1=performance.now();
for (let i=1;i<=iter;i++){ n*=i;n++;n=n/i; }
let t2=performance.now();
let tot=(t2-t1)/1000;
console.log("total time ",Math.round(tot*100)/100," sec")
console.log("speed ",Math.round(iter/tot/1e6*10)/10," million iterations per sec")
```
>      Test output (vm, eval & node are fairly similar)
>      total time  0.47  sec
>      speed  212.3  million iterations per sec

### Javascript in the browser

This will execute the same javascript code in the default browser:

```html
<!-- '''html -->
<script>
function test(){
let iter=1e8;
let n=0.01;
let t1=performance.now();
for (let i=1;i<=iter;i++){ n*=i;n++;n=n/i; }
let t2=performance.now();
let tot=(t2-t1)/1000;
r1.innerText=""+Math.round(tot*100)/100+" sec";
r2.innerText=""+Math.round(iter/tot/1e6*10)/10+" million iterations per sec";
}
</script>
<h1 align="center"><br>Test results</h1>
<p align="center"><b>Total time:</b>
<div id="r1" align="center"><i>calculating ...</i></div>
<p align="center"><b>Speed:</b>
<div id="r2" align="center"></div>
<script>
r1=document.getElementById("r1");
r2=document.getElementById("r2");
//window.setTimeout(function() {test();},150);
test()
</script>
```
>      Test output (in the browser, can click browser reload to repeat):
>      Total time: 0.47 sec
>      Speed: 210.7 million iterations per sec

A similar speed to `js`, `eval` and `node`.

### Test using 'go' as a scripting language

If `go` is installed, it can be used as a scripting language

>      `go` should be executable in a terminal using > go
>      The required files go.sum and go.mod need to be present in the
>      globalStorage/temp folder. The path of this folder can be
>      seen by hovering over the following line (in the editor):

`%g` //hover here to see the path of *hover-exec*'s temp folder.

```go //speed test 2
// '''go //speed test 2
package main
import ("fmt";"time")
func main() {
    var iter int=1e9
    var t1,t2 int64
    var n,t float64
    n=0.01
    t1=time.Now().UnixNano()
    for i:=1;i<=iter;i++ {
      n*=float64(i);
      n++;
      n=n/float64(i);
    }
    t2=time.Now().UnixNano()
    t=float64(t2-t1)/1e9  //sec
    fmt.Printf("total time %.3v sec\n",t)
    fmt.Printf("speed  %.5v million iterations per sec\n",float64(iter)/t/1e6)
}
```
>      Test output:
>      total time 0.24 sec
>      speed  4170 million iterations per sec
>      (ie. about 20 times faster than javascript)

### Test using 'python'

Again, the appropriate `python` needs to be executed when the `python` command is executed in a terminal. For this run, 'python 3.8.7` was used. Note that fewer iterations have been used because it takes rather longer than *javascript* or *go*.

```python //speed test
# '''python //speed test
from time import time
m=1e7  # note: fewer iterations than for js or go
n=0.01
tt=time()
for ii in range(1,round(m+1)):
    n*=ii
    n+=1
    n=n/ii
tt1=time()-tt
print("total time ",round(tt1,2)," sec")
print("speed ",round(m/tt1/1e6,4)," million iterations per sec")
```
>      Test output:
>      total time  1.68  sec
>      speed  5.958  million iterations per sec

ie. for this test javascript is about 30x faster than python

### Test using 'lua'

Lua must be installed, and the config startup script should match the installation. If `lua54` is installed, the config start command should use `lua54` - check the `hover-exec` configuration and make sure the command used matches you installation. Note that the the first bit of the id `js:lua` is used to provide some simple-minded syntax highlighting (via the `js` highlighter) - the hover message makes it clear that `lua` is the actual command.

```js:lua  //10 million random number calls
-- '''lua {cmd=lua53} //10 million random number calls`
local m=1e8;  -- note: fewer iterations than for js or go
local n=0.01;
local tt = os.clock();
for ii=1,m do
  n=n*ii;
  n=n+1;
  n=n/ii;
end
local tt1=os.clock()-tt;
print("total time ",math.floor(tt1*100)/100," sec")
print("speed ",math.floor(m/tt1/1e6*100)/100," million iterations per sec")
```
>      Test output:
>      total time 	1.05	 sec
>      speed 	94.87	 million iterations per sec

So about 15x faster than python on this benchmark, and about half the speed of javascript.

### Pascal test

This assumes freepascal is installed.

```js:pascal //executes freepascal compile and run
// '''js:pascal //js used here for quick & dirty syntax highlighter
//      if there is a pascal syntax highlighter, just use '''pascal
program Hello;
  uses Math,SysUtils,DateUtils;
  var i,m:int64;
        a,t1:extended;
begin //30
  m:=100000000; //fewer iterations (1e8)
  t1:=now;
  a:=0.01;
  for i:=1 to m do
  begin
      a:=a*i;
      a:=a+1;
      a:=a/i;
  end;
  t1:=(now-t1)*3600*24;
  writeln('``output'); //removes compiler preface in result
  writeln('time= ',t1:6:2,' sec');
  writeln('speed= ',m/t1/1e6:6:2,' million iterations per sec')
end.
```
>      Test output:
>      time=   1.03 sec
>      speed=  97.09 million iterations per sec

That's about half the speed of the javascript code

### Octave test

```python:octave
# '''python:octave
a=1.0;
t=time;
m=1000000; # 1e6
for i=1:m
  a=a*i;
  a=a+1;
  a=a/i;
endfor
disp(strcat('time= ',num2str(time-t),' sec'))
disp(strcat('speed= ',num2str(m/(time-t)/1e6),' million iterations per sec'))
```
>      Test output:
>      time=1.7275 sec
>      speed=0.57593 million iterations per sec

That's one tenth of python's speed.

### Test using scilab

```js:scilab
// '''js:scilab
tic();
a=1.1;
m=1000000; //1e6
for x=1:1:m
a=a*x;
a=a+1;
a=a/x;
end
t=toc();
mprintf('Time: %.2f sec\n',t)
mprintf('Speed: %.2f  million iterations per sec\n',m/t/1e6)
```
>      Test output:
>      Time: 1.15 sec
>      Speed: 0.87  million iterations per sec

About 50% faster than octave

### Julia test

```julia
# '''julia
m=10000000; # 1e7
a=1.1;
t=time();
for i in 1:m;
  global a=a*i; a=a+1; a=a/i;
end;
t=time()-t;
# println(a)
println("time= ",round(t,digits=2)," sec")
println("speed= ",round(m/t/1e6,digits=3)," million iterations per sec")
```
>      Test output:
>      time= 1.69 sec
>      speed= 5.917 million iterations per sec

About the same speed as python.

## Configuration

### View and alter as a set ('scripts, 'swappers,'repls')
This code block shows all settings for `scripts','swappers' or 'repls'
The are shown in another executable code block ready to update after changes

```js noInline  //noinline is necessary to ensure =>> in strings is not misinterpreted
// '''js noInline              //view and update settings for
let settings='scripts';    // 'scripts', 'swappers', 'repls'
config = vscode.workspace.getConfiguration("hover-exec");
let k=config.get(settings)
console.log('output:eval noinline //exec here to make any changes permanent')
console.log("//nb. the hover shows that default for '''output:eval is to exec 'eval', not to delete the 'output' block")
console.log("//      use '[delete block]' in the hover (top right) to delete")
console.log('let settings="'+settings+'";');
console.log('let s=',k)
console.log("if(config.update(settings,s,1)){write(settings+' updated!');}")
```

### View and alter a specific setting
This template code block can spefy a new or existing cmdid, and its start or swapper command

```js noInline      //noinline is necessary to ensure =>> in strings is not misinterpreted
// '''js noInline  //template to change, add or undefine (remove) a specific config setting
let settings='scripts';  //can use 'scripts', 'swappers', 'repls'
config = vscode.workspace.getConfiguration("hover-exec");
let k=config.get(settings)
let s={"newlang":"python \"%f.py\""};   //specify cmdid & start command, or
//s={"newlang":undefined};                   //uncomment this to undefine cmdid
let merge=Object.assign({},scripts,s);
if(await config.update('scripts',merge,1)){}
console.log('new config:',config.get('scripts.python'))
```


