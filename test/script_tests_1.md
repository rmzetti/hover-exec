## Hover-exec script tests 1

The following tests will use an implementation of a simple 'benchmark' to demonstrate the use of a variety of script languages within a single markdown file Don't panic *python* users, it's a very simple benchmark - vary similar to that from [javascript is fast](https://jyelewis.com/blog/2021-09-28-javascript-is-fast/) , adjusted to avoid potential floating point overflow.

- [Hover-exec script tests 1](#hover-exec-script-tests-1)
  - [Javascript tests: 'vm', 'eval' and 'node'](#javascript-tests-vm-eval-and-node)
  - [Javascript in the browser](#javascript-in-the-browser)
  - [Test using 'go' as a scripting language](#test-using-go-as-a-scripting-language)
  - [Test using 'python'](#test-using-python)
  - [Test using 'lua'](#test-using-lua)
  - [Pascal test](#pascal-test)
  - [Octave test](#octave-test)
  - [Test using scilab](#test-using-scilab)
  - [Julia test](#julia-test)


### Javascript tests: 'vm', 'eval' and 'node'

The following code block can be executed with the code block identifier set to `js` or `js:vm` for the vscode `vm` to execute, to 'js:eval' for vscode's built-in `eval` to execute, or to `js:node` for nodejs to execute. Note that to execute with `nodejs`, that package must have been previously installed on the system and should be executable with the command `node`.

```js  //can change to 'js:eval' to use 'eval', or 'js:node' to use nodejs
//timing and speed results for the three alternatives should be similar
let s=process.cwd().replace(/\\/g,'/');
//this 'require' is not actually required for 'vm' and 'eval' (moment is pre-installed), but only for `node`
let moment=require(s+"/node_modules/moment");
//the `require` may need tailoring for your system (eg. something like the following could be necessary)
//let moment=require(s+"/moment.min.js");
let iter=1e9;
let n=0;
let t1=moment.now();
for (let i=1;i<=iter;i++){ 
  n*=i;
  n++; 
  n=n/i;
}
let t2=moment.now();
let tot=(t2-t1)/1000;
console.log("total time ",Math.round(tot*100)/100," sec")
console.log("speed ",Math.round(iter/tot/1e6*10)/10," million iterations per sec")
```
```output
total time  5.22  sec
speed  191.7  million iterations per sec
```

> Example output
> total time  5.22  sec
> speed  191.7  million iterations per sec

### Javascript in the browser

This will execute the same javascript code in the default browser - it uses `moment` from a cdn - a local source would load rather faster.

```html //javascript in the browser
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
<script>
function test(){
let iter=1e9;
let n=0;
let t1=moment.now();
for (let i=1;i<=iter;i++){ n*=i;n++;n=n/i; }
let t2=moment.now();
let tot=(t2-t1)/1000;
res1.innerText=""+Math.round(tot*100)/100+" sec";
res2.innerText=""+Math.round(iter/tot/1e6*10)/10+" million iterations per sec";
}
</script>
<h1>Test results</h1>
<p>Total time: <div id="res1"></div></p>
<p>Speed: <div id="res2"></div></p>
<script>
res1=document.getElementById("res1");
res2=document.getElementById("res2");
test();
</script>
```

> Example output
> Total time: 4.81 sec
> Speed: 208.1 million iterations per sec

A similar speed to `js`, `eval` and `node`.

### Test using 'go' as a scripting language

If `go` is installed, it can be used as a scripting language (`go` should be executable in a terminal using the command `go`)

```go //speed test 2
package main
import ("fmt";"time")
func main() {
    var iter int=1e9
    var t1,t2 int64
    var n,t float64
    n=0
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
```output
total time 0.24 sec
speed  4170 million iterations per sec
```

> Example output
> total time 0.24 sec
> speed  4170 million iterations per sec

ie. about 6 times faster than javascript.

### Test using 'python'

Again, the appropriate `python` needs to be executed when the `python` command is executed in a terminal. For this run, 'python 3.8.7` was used. Note that fewer iterations have been used because it takes rather longer.

```python //speed test
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
```output
total time  1.68  sec
speed  5.958  million iterations per sec
```

> Example output
> total time  1.68  sec
> speed  5.958  million iterations per sec

ie. for this test javascript is about 30x faster than python

### Test using 'lua'

Lua must be installed, and the config startup script should match the installation. For this system, `lua54` is installed, and so the config start command uses `lua54` - check the `hover-exec` configuration and make sure the command used matches you installation. Note that the id `js:lua54` is used to provide some simple-minded syntax highlighting (via the `js` highlighter)

```js:lua54  //10 million random number calls
-- ```lua {cmd=lua54} //10 million random number calls`
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
```output
total time 	1.05	 sec
speed 	94.87	 million iterations per sec
```

> Example output:
> total time 	1.05	 sec
> speed 	94.87	 million iterations per sec

So about 15x faster than python on this benchmark, and about half the speed of javascript.

### Pascal test

```js:pascal
program Hello;
  uses Math,SysUtils,DateUtils,Windows;
  var i,m:int64;
        a,t1:extended;
begin //30
  m:=100000000; //fewer iterations (1e8)
  t1:=now;
  a:=1;
  for i:=1 to m do
  begin
      a:=a*i;
      a:=a+1.1;
      a:=a/i;
  end;
  t1:=(now-t1)*3600*24;
  writeln('```output');
  writeln('time= ',t1:6:2,' sec');
  writeln('speed= ',m/t1/1e6:6:2,' million iterations per sec')
end.
```
```output
time=   1.04 sec
speed=  96.25 million iterations per sec
```

> Example output:
> time=   1.03 sec
> speed=  97.09 million iterations per sec

That's about half the speed of the javascript code

### Octave test

```python:octave
a=1.0;
t=time;
m=1000000; //1e6
for i=1:m
  a=a*i;
  a=a+1.1;
  a=a/i;
endfor
disp(strcat('time= ',num2str(time-t),' sec'))
disp(strcat('speed= ',num2str(m/(time-t)/1e6),' million iterations per sec'))
```
```output
time=1.7275 sec
speed=0.57593 million iterations per sec
```

> Example output:
> time=1.7275 sec
> speed=0.57593 million iterations per sec

That's one tenth of python's speed.

### Test using scilab

```js:scilab
tic();
a=1.1;
m=1000000; //1e6
for x=1:1:m
a=a*x;
a=a+1.1;
a=a/x;
end
t=toc();
mprintf('Time: %.2f sec\n',t)
mprintf('Speed: %.2f  million iterations per sec\n',m/t/1e6)
```
```output
Time: 1.15 sec
Speed: 0.87  million iterations per sec
```

> Example output:
> Time: 1.15 sec
> Speed: 0.87  million iterations per sec

About 50% faster than octave

### Julia test

```julia
m=10000000; # 1e7
a=1.1;
t=time();
for i in 1:m;
  global a;
  a=a*i;
  a=a+1.1
  a=a/i;
end;
t=time()-t;
println("time= ",round(t,digits=2)," sec")
println("speed= ",round(m/t/1e6,digits=3)," million iterations per sec")
```
```output
time= 1.79 sec
speed= 5.583 million iterations per sec
```

>Example output:
>time= 1.79 sec
> speed= 5.583 million iterations per sec

About the same speed as python.



