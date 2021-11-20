# Hover exec

This is the READMORE for VS Code extension *hover exec*. Tldr? ..check [the README](README.md) instead. The two files use the same structure and content, this one just goes into more detail.

- [Hover exec](#hover-exec)
  - [Features](#features)
  - [Basic hover-exec](#basic-hover-exec)
  - [Javascript scripts](#javascript-scripts)
    - [Examples using `vm` and `eval`](#examples-using-vm-and-eval)
    - [available functions in `vm` and `eval`](#available-functions-in-vm-and-eval)
    - [The `vm` context](#the-vm-context)
    - [Quick specification of `vm` context](#quick-specification-of-vm-context)
    - [using require & globals with vm and eval](#using-require--globals-with-vm-and-eval)
    - [Using nodejs](#using-nodejs)
    - [Scripts with built-in commands](#scripts-with-built-in-commands)
  - [Some examples](#some-examples)
    - [Lua](#lua)
    - [Powershell](#powershell)
    - [Gnuplot](#gnuplot)
    - [Javascript using vm](#javascript-using-vm)
    - [Javascript using node](#javascript-using-node)
    - [More vm, eval and node examples](#more-vm-eval-and-node-examples)
  - [More examples](#more-examples)
    - [Running other programs](#running-other-programs)
    - [Octave](#octave)
    - [Scilab](#scilab)
    - [Python](#python)
    - [Julia](#julia)
    - [Matlab](#matlab)
    - [Gnuplot](#gnuplot-1)
    - [Html and in-browser javascript](#html-and-in-browser-javascript)
    - [Powershell](#powershell-1)
    - [Random strings in javascript](#random-strings-in-javascript)
    - [Regular expression test and usage](#regular-expression-test-and-usage)
    - [Go](#go)
    - [Vitamin b12, dosage vs uptake](#vitamin-b12-dosage-vs-uptake)
    - [Chaining execution codeblocks](#chaining-execution-codeblocks)
  - [One-liners](#one-liners)
    - [One-liners examples](#one-liners-examples)
    - [Quickmath examples](#quickmath-examples)
    - [Windows - control panel](#windows---control-panel)
    - [html & javascript](#html--javascript)
    - [audio one-liners](#audio-one-liners)
    - [One-liners for microsoft management console mmc](#one-liners-for-microsoft-management-console-mmc)
  - [inhere - including tagged sections](#inhere---including-tagged-sections)
  - [Configuration settings](#configuration-settings)
    - [Using vm for configuration settings](#using-vm-for-configuration-settings)
      - [Check settings](#check-settings)
      - [Add new script language](#add-new-script-language)
      - [Other vscode config settings](#other-vscode-config-settings)
  - [Known Issues](#known-issues)
  - [Release Notes](#release-notes)

## Features

*Hover-exec* facilitates execution from within the editor of markdown code blocks in a variety of installed script languages. New script languages can be added with or without configuration.  This is by no means intended as a replacement for the superb vscode notebooks. Instead it simply offers the opportunity, when working with markdown docs, to include 'live' calculations, results, code samples, comparisons and useful links, using a range of possible scripts.

There is also an intention to have a certain compatability with the excellent *markdown preview enhanced* extension. The idea would be to simply include *mpe* requirements in the usual *mpe* {curly brackets} in the command line. There are a number of elements of *hover-exec@ (eg. in-line results, built in javascript execution rather than `node` only, and the different approach to temporary storage of generated script files) which make full compatability difficult at this stage, but many scripts can still be executed in both extensions.

The *hover-exec* extension is activated when a markdown file is opened in the editor.

Hover script exec in action:

  ![](https://raw.githubusercontent.com/rmzetti/hover-exec/master/Hover-exec.gif)

---
## Basic hover-exec 

Hovering over lines starting with ` ``` ` (or lines which start with a single backtick and include an end backtck) will trigger a hover message with an *exec* command in the bottom line. Hovering over ` ``` ` at the end of a block will trigger the message for the start of the block. Clicking the command link on the bottom line of the hover message (or using the shortcut `Alt+/` or `Opt+/` with the cursor anywhere in the block) will execute the code in the code block, and produce output.

---
## Javascript scripts

Javascript code blocks can be executed using the `vm` module, or by using *vscode*'s built in `eval` - and also through [nodejs](#nodejs). The default (command blocks with id `js` ) is to use the `vm` module, `hover-exec` provides, by default, a reasonably substantial `vm context`.

### Examples using `vm` and `eval`

```js      //click this line in the *hover* to execute the block
//```js  //this comment is to show the command line in markdown previews`
//        //the default for the `js` command is to execute using the `vm` module
'test: '+Math.random() =>>test: 0.2549981720136758
aa = function (fruit){alert('I like ' + fruit);} //no 'let' creates a global
//to use predefined variables a..z, don't use 'let'
bb = function (animal){alert('he likes ' + animal);}
```

```js //execute the previous *vm* block first
//```js //execute the previous *vm* block first
bb('dogs');aa('pears'); //uses the globals defined in the previous code block
```

Intermediate results can be viewed in line by appending `=>>` instead of using `console.log()` (see the `swapper` configurations). If it is wished to be strictly correct, and/or compatible with the *markdown preview enhanced* extension (*mpe*), put a comment marker before the `=>>`, eg. for javascript use `// =>>`, for python `# =>>`.  Note that *mpe* will not produce the results in-line.

Other results are produced in an `output` block. Hovering over `output` provides options *output to text* or *delete*. Using the shortcut `Alt+/` or `Opt+/` with the cursor in the `output` block deletes the block.

---
A couple more examples using `vm`, showing use of *vscode* api functions and some extra functions published by `hover-exec` (eg. `alert`). See the next section for other available functions.

```js  //using vm various examples
//```js //using vm, various examples`
let abc="hello, world 3"
let a='hello variable world';
alert(a) //not available in node scripts
a='goodbye world'
vscode.window.showInformationMessage(a) //not available in node scripts
eval('let a=3;2*a*Math.random()')=>>0.12542115380232666
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>>hello 1.720885574862449
process.cwd() =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
console.log(abc)
```
```output
goodbye world 0.24137261061263482
hello, world 3
```

---
```js  //javascript regex tester using vm
// ```js //javascript regex tester using vm`
'abcdefg'.replace(/^.*(bc)/,'$1--') =>>bc--defg
```

---
All the above codeblocks can be executed using `eval` instead of `vm`, eg.

```js :eval  //javascript regex tester using eval
//```js :eval //javascript regex tester using eval`
'abcdefg'.replace(/^.*(bcde)/,'$1--') =>> bcde--fg
```

The difference is that `vm` scripts are executed within a more restricted *context* (see next section).

In the command line (eg. above), using `js` for the codeblock id produces javascript syntax highlighting (it's a quick and dirty approach to provide basic syntax highlighting for a range of scripts), then adding ` :eval` sets the actual exec command to `eval`. 

Note that `vm` and `eval` allow the internal *vscode* API to be used. Installation of `nodejs` is not required for `vm` or `eval` scripts to execute.

---
### available functions in `vm` and `eval`

The following functions are included in `vmContext` by default (and are also available for `eval`):
- abort(): abort current script
- alert(string): provide an alert box (bottom right)
- config: access to *hover-exec* configuration
- delay(usec): delay for specified number of usec
- execShell(string): exec shell command
- global: define and access global functions and variables (persistent over separate script execs)
- globalThis: as for global
- input(string): wait for input (box at top of screen)
- process: access to process module, eg. `process.cwd()` 
- progress(string,usec): show a progress bar (bottom right) for specified usec
- readFile(path): read local file
- writeFile(path,string): write string to local file at full path
- require: for `xyx=require("package")`
- showKey: boolean, show keypressed
- showOk: boolean, show successful execution
- status(string): show `=>string` on status bar
- vscode: access to vscode objects
- write(string): `console.log` to output block
- math: access to `mathjs` objects
- moment: access to `moment` objects
- _ : access to `lodash` objects

---
### The `vm` context
The context for `vm` can be restricted, enlarged or set back to the default. The `vmContext` object can be directly specified by using `eval`. Examples:

```js:eval //show the current context for vm
for (let x in vmContext){
  write(''+x);
}
```
```output
global
globalThis
config
vscode
console
util
process
performance
abort
alert
delay
execShell
input
progress
status
readFile
writeFile
write
require
_
math
moment
__main
```

With this context, for example, the following works in `vm`:

```js //can use lodash
//```js //can use lodash
_.range(0,5)=>>0,1,2,3,4
```

Now reduce the context using `eval`:

```js:eval //reduce the current context for vm (leave 'write' so vm's 'console.log' works)
vmContext={write}
for (let x in vmContext){
  console.log('reduced context:')
  console.log('  {'+x+'}');
}
```
```output
reduced context:
  {write}
```

Now lodash is not available to `vm` scripts:

```js    //can't use lodash in reduced context
//```js //can't use lodash in reduced context
_.range(0,5)=>>
```
```output
error ReferenceError: _ is not defined
```

To get the default back, set `vmContext` to `undefined`:

```js:eval
vmContext=undefined
```

Now `lodash`, part of the default `vmContext` works again

```js    //can now use lodash (etc) again in vm
//```js //can now use lodash (etc) again in vm
_.range(0,5)=>> 0,1,2,3,4
```

In this way, the context used for vm_scripts can be adjusted to be restricted or permissive as necessary.

### Quick specification of `vm` context

By default the `js` command utilises a default context which is progressively expanded by 'naked' function declarations and variable assignments (eg. `a=43;` rather than `let a=43;` or `var a=43;`). So successive codeblocks can build on previously executed ones.

Any `js/vm` codeblock can utilise the following options:

```js:vmdf     //set 'vmContext' to default
//```js:vmdf  //set 'vmContext' to default
//On execution, the vmContext returns to its default
```

and

```js:vmin     //set 'vmContext' to minimum
//```js:vmin  //set 'vmContext' to minimum
//This will set the vmContext to a minimum (basically
//  just including 'write' which enables 'console.log' for output)
```

Apart from resetting `vmContext` at the start, these are normal `js` codeblocks.

---
### using require & globals with vm and eval

Moment, lodash (_) and mathjs (math) are available by default in both `vm` and `eval`.

A function or variable can be set as global (eg. `global.a=a;` see examples below) in either `vm` or `eval` and is then available during the session in both. A global can be deleted (undefined) using, eg. `delete global.a;`

'Naked' assignments (ie. no `let`or `var`) will be available to subsequently executed `js/vm` codeblocks. Global assignments are also available to subsequent `js/vm` codeblocks, and they are also available to subsequently executed 'exec' codeblocks. 

```js :eval //use of lodash and mathjs 
//```js :eval //use of lodash and mathjs 
function xrange(){
   let x1=_.range(0,6.1,6/10);
   let x=math.round(math.exp(math.multiply(x1,math.log(10))));
   return x
}
console.log(xrange())
```
```output
[
       1,       4,    16,
      63,     251,  1000,
    3981,   15849, 63096,
  251189, 1000000
]
```

```js //global function definition
//```js //global function definition
f=global.f=function(m){return 'the meaning of life is '+m;};
f(44-2)=>> the meaning of life is 42
```

```js:eval //use of global from 'vm' in 'eval'
//```js:eval //use of global from 'vm' in 'eval'
f(42)=>> the meaning of life is 42
_.range(0,4)=>> 0,1,2,3
```

```js    //naked function definition (no 'let')
//```js //naked function definition (no 'let')
test = function () {
  console.log('test works')
}
```
```js    //function available to subsequent vm codeblocks
//```js //function available to subsequent codeblocks
test()
```
```output
test works
```

For `eval`, neither 'naked' nor 'var' function defs are available to subsequent `eval` code blocks. Instead, the 'global' prefix needs to be used in the function def, as above.

---
### Using nodejs

The js command by default executes a javascript code block in `nodejs` (assuming that is installed).

```js :node
// ```js :node  //as before, this line shows the command in markdown previews`
console.log('  test using node:\n  '+Math.random())
console.log('  Note: hover-exec on ```output line`, or alt+/ (opt+/) with\n',
    ' the cursor in the output block will delete the output block')
```
```output
  test using node:
  0.5360235800978341
  Note: hover-exec on ```output line`, or alt+/ (opt+/) with
  the cursor in the output block will delete the output block
```

Notes:
- Including `{cmd=node}` in the command line to allow execution also in *markdown preview enhanced* (in-line output will not be available)

---
Note that codeblocks with {cmd...}, as appropriate, can be executed in either *hover-exec* or *markdown preview enhanced* (if you're viewing this also in *mpe*, you can try it both ways)

```js :node {cmd=node}
//```js :node {cmd=node}`
console.log(process.cwd())
console.log('test using node: '+Math.random())
let a=5;console.log(a+Math.random())
```
```output
c:\Users\xxx\OneDrive\Documents\GitHub\hover-exec
test using node: 0.47027243015214704
5.679301773478228
```

```js :node {cmd=node}
// ```js :node {cmd=node}`
process.cwd()  =>>c:\Users\xxx\OneDrive\Documents\GitHub\hover-exec
'test: '+Math.random() =>>test: 0.9716829485200404
let a=5;
a+Math.random() =>>5.907325870290402
```

---
### Scripts with built-in commands

Command lines to conveniently start a number of scripts are included (see [Configuration settings](#configuration-settings) near the end of this `READMORE` for the actual commands):

- javascript (via node)
- eval (built in javascript, with vscode api available)
- vm (built in vm javascript, with vscode api available)
- html
- powershell
- bash
- zsh
- python
- julia
- octave
- scilab
- gnuplot
- matlab
- lua
- go
- pascal

Notes:
- The script language you wish to use (eg `julia`,`nodejs`) needs to have been installed
- Some of the commands to run the scripts ***may need customising*** to suit your particular installation.. see [Changing script configuration](#changing-script-configuration)
- Other script languages may be added - see [Adding another script](#adding-another-script).

## Some examples
In these examples, random numbers & time are used so updated output is easier to spot

### Lua
```lua {cmd=lua54} --*say hello goodbye*
-- ```lua  {cmd=lua54} --*say hello goodbye*`
print("hello & goodbye")
math.randomseed(os.time())
--maybe hover-exec could execute commented lines with in-line
"hello "..math.pi+math.random() =>>hello 3.4279444887858
print('hello '..(44-2+math.random()))
"goodbye"..math.pi+math.random() =>>goodbye3.3987259842488
print("goodbye "..math.pi+math.random())
```
```output
hello & goodbye
hello 42.995219859293
goodbye 3.4225625205094
```

```lua {cmd=lua54} --10 million random number calls
-- ```lua {cmd=lua54} --10 million random number calls`
local t = os.clock();
local t1=0;
local matrix=require "matrix"
math.randomseed(os.time())
for ii=1,10000000 do
t1=t1+math.random();
end
print(t1)
print(os.clock()-t)
```
```output
5000118.1785821
0.317
```

The following example does not use any predefined configs,  just a command and %f to indicate the codeblock temp file is to be used. The default %f ext is `.txt`, but this can be changed by appending the desired ext as in this `lua51` example - many programs will need a specific ext to run.

```lua51.exe %f.lua
--```lua51.exe %f.lua
print("hello & goodbye")
math.randomseed(os.time())
```
```output
hello & goodbye
```

---
### Powershell
Powershell can be used in *mpe*

```pwsh {cmd}
 # ```pwsh {cmd}`
Get-Random -Min 0.0 -Max 1.0 =>>0.583402059778293
"current dir: "+(pwd) =>>current dir: C:\Users\xxx\OneDrive\Documents\Notes
```

---
### Gnuplot
Also works in *mpe*

```gnuplot {cmd}
 # ```gnuplot {cmd}`
$charge << EOD
10-06-2021 2138 100
15-06-2021 2247 79
16-06-2021 0935 79
16-06-2021 1400 74
16-06-2021 1439 70
16-06-2021 2157 70
17-06-2021 0900 69
17-06-2021 1037 68
19-06-2021 1000 56
23-06-2021 1242 44
24-06-2021 2138 36
25-06-2021 1312 34
25-06-2021 1606 30
25-06-2021 2000 100
26-06-2021 1158 93
27-06-2021 2213 84
28-06-2021 1005 80
28-06-2021 2330 76
29-06-2021 1500 70
1-07-2021 22:29 51
2-07-2021 22:32 44
3-07-2021 13:34 42
4-07-2021 14:22 39
5-07-2021 15:10 32
5-07-2021 23:57 21
6-07-2021 18:10 100
7-07-2021 17:02 95
7-07-2021 22:46 93
8-07-2021 16:38 91
9-07-2021 16:08 87
16-07-2021 23:30 66
EOD
set xdata time;
set timefmt "%d-%m-%Y %H%M"
set format x "%d"
set mouse mouseformat 3
plot "$charge" using 1:3 w lp title "charge"
```

---
### Javascript using vm
The `vm` and `eval` commands use vscode's built in capabilities. They are not available in *mpe*.

```js :vm //or just 'js'
// ```js :vm  -- not available in mpe
let abc="abcde"
let a='hello variable world';
alert(a) //nb. alert is not available in node
a='goodbye'
vscode.window.showInformationMessage(a) //not available in node
eval('let a=3;2*a*Math.random()')=>> 5.363093779138538
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>> hello 1.130435129908258
process.cwd() =>> c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
console.log(abc)
```
```output
goodbye 0.9108457907130014
abcde
```

---
### Javascript using node
Run a server on localhost ([click here after running it](http://127.0.0.1:1337))
Also works in *markdown preview enhanced*, (ie. *mpe*)

```js :node {cmd=node}
// ```js :node {cmd=node} -- works in mpe
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World at last!\n');
}).listen(1337, "127.0.0.1");
```

To kill the server use ` ```pwsh` (see the comments below), also in *mpe*

```pwsh {cmd}
 # ```pwsh {cmd} --works in mpe
 # to kill server, exec once & look for pid to kill (line TCP 127.0.0.1:1337 on rhs)
 # then enter pid in kill statement below and exec again
kill 8588
netstat -ano | findstr :13
```

---
### More vm, eval and node examples
Various time and date functions using `vm`

```js      //internal, time & date
// ```js  //internal, time & date  - not in *mpe*
(44-Math.random())=>> 43.70036379934795
//show information message via vscode api, needs cmd eval, not js
progress('Hello whole World',4000)
new Date().toISOString().slice(0,10)=>> 2021-10-09
new Date().toLocaleDateString()=>> 09/10/2021
new Date().toString()=>> Sat Oct 09 2021 21:23:25 GMT+1300 (New Zealand Daylight Time)
new Date().toLocaleString()=>> 09/10/2021, 21:23:25
new Date().getTime()=>> 1633767805966
```

---
Time and date using node ` ```js`

```js :node
new Date().getTime()=>>1633767809508
```

```js :node {cmd=node} //through nodejs
//```js :node {cmd=node} //through nodejs
a=44
// in-line results are calculated but not output in mpe
'answer='+(a-Math.random()) =>>answer=43.79585152762694
console.log(new Date().toISOString().slice(0, 10))
console.log(new Date().toLocaleDateString())
```
```output
2021-10-09
09/10/2021
```

---
## More examples

### Running other programs
Here are a couple of very simple examples for sending the contents of a codeblock to other applications. These examples do not use any predefined configs. The other apps here are not scripts and will **not** send changed text back to the codeblock - changed content will need to be saved in the file system in the normal way.

```notepad %f
This is a test
```

```"c:\program files\notepad++\notepad++" %f
This is another test
```

---
### Octave
Use ` ```octave` or ` ```python:octave` to run octave.

```python:octave {cmd="octave-cli"}
 # ```python:octave {cmd=octave} -- {cmd..} is for mpe}
 # ```python gets syntax highlighter
 # nb. need mat2str or num2str for numeric output
num2str(7.1+rand(1))  =>>7.4225
'hello world in-line'  =>>hello world in-line
pwd()  =>>c:\Users\xxx\OneDrive\Documents\Notes
disp('hello world in output section!')
```

---
### Scilab
Use ` ```scilab` to run scilab, or ` ```js :scilab` for some quick and dirty syntax highlighting

```js :scilab
// ```js:scilab {cmd=scilab}
// need to use 'string()' for numeric output
pwd()   =>>c:\Users\xxx\OneDrive\Documents\GitHub\hover-exec
rand("seed",getdate('s')); //set new random sequence
string(rand())+', '+string(rand())   =>>0.4944074, 0.8478804
mprintf('%s',string(rand()))
```
```output
0.468022
```

---
### Python
Use ` ```python` to run python. ` ```python3` can be used if that is the python repl start command

```python {cmd}
 # ```python {cmd}
import os
from random import random
 # the in-line results are effectively commented out for mpe
os.getcwd() =>>c:\Users\xxx\OneDrive\Documents\Notes
45-2+random() =>>43.64590817490019
print('hello world '+str(3*random()+1))
```
```output
hello world 1.0873912369021377
```

---
This one-liner can be used to install packages:
`pwsh python -m pip install pyformulas`

---
In the following example, `{matplotlib=true}` will plot graphs inline in *markdown preview enhanced*. In *hover-exec* they are plotted in a separate window (and can be 'pasted' in using the `paste image` vscode extension) If you also use *markdown memo* the image link can be changed to the wiki form `[[...]]` and viewed on hover. 

```python {cmd matplotlib=true}
  # ```python {cmd matplotlib=true}`
import numpy as np
import matplotlib.pyplot as plt
randnums= np.random.randint(1,101,500)
plt.plot(randnums)
plt.show()
```
Image from running the above codeblock and pasting *Markdown kit*:
           ![[2021-09-08-20-07-12.png]]

---
```python {cmd}
 # ```python {cmd} -- the {cmd} notation is for mpe```
import pyformulas as pf
import matplotlib.pyplot as plt
import numpy as np
import time
fig = plt.figure()
canvas = np.zeros((480,640))
screen = pf.screen(canvas, 'Sinusoid')
start = time.time()
while True:
    now = time.time() - start
    x = np.linspace(now-2, now, 100)
    y = np.sin(2*np.pi*x) + np.sin(3*np.pi*x)
    plt.xlim(now-2,now+1)
    plt.ylim(-3,3)
    plt.plot(x, y, c='black')
    # If we haven't already shown or saved the plot, then we need to draw the figure first...
    fig.canvas.draw()
    image = np.fromstring(fig.canvas.tostring_rgb(), dtype=np.uint8, sep='')
    image = image.reshape(fig.canvas.get_width_height()[::-1] + (3,))
    screen.update(image)
 # screen.close()
```
![[2021-08-03-14-25-04.png]]
![[2021-08-07-23-35-22.png]]

---
### Julia
Julia also works in *mpe*

```julia {cmd}
 # ```julia {cmd}  # works in mpe`
using LinearAlgebra, Statistics, Compat
pwd()  # =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
a=rand(Float64,3);
a         # =>>[0.02624459240064092, 0.9600388686896555, 0.021521940795977468]
b=a;b[2]=42;        # nb. arrays are shallow copied
a         # =>>[0.02624459240064092, 42.0, 0.021521940795977468]
b         # =>>[0.02624459240064092, 42.0, 0.021521940795977468]
println(string("a=",a))
```
```output
a=[0.02624459240064092, 42.0, 0.021521940795977468]
```

---
### Matlab
And `matlab` can be used to run *matlab*, although it's a slow starter...

```matlab 
% ```matlab 
pwd   =>>C:\Users\ralph\AppData\Roaming\Code\User\globalStorage\rmzetti.hover-exec
7*7-7 =>>42
disp("matlab ok!")
```
```output
ok
```

---
### Gnuplot

Gnuplot is a very useful stand-alone plotting facility. It is particularly useful for *hover-exec* because all the scripting languages can output gnuplot commands along with data in the output block and it can be immediatedly plotted.

Use `gnuplot` to run *gnuplot* - note that data bracketed by #tag_speed is used 'in here' (see later in this file, and the backtick quotes are required when the tag is referred to).

```gnuplot
#inhere `#tag_speed`
set logscale x
plot "$speed" w lp title "speed"
```

---
### Html and in-browser javascript
In browser javascript can be used
The following three examples are from the [js1k demos](https://js1k.com/). Can probably get this to work in *mpe*...

```html {cmd="C:/Program Files/Google/Chrome/Application/chrome.exe" stdin}
<!-- ```html  --`*what am I going to do now* tunnel-->
<head>modified slightly from [tunnel](https://js1k.com/2010-first/demo/763)</head>
<body style="margin:0;width:100%;background:#000815;overflow:hidden"> 
<canvas id="c"></canvas> 
<script> 
lt='lineTo',b=Math,i=b.sin,j=b.cos,k=document,bs=k.body.style,n=k.getElementById('c');
o=n.getContext('2d');p=n.width=innerWidth*1.2,q=n.height=innerHeight*1.2;
r=-p/2,s=-q/2;o.translate(-r,-s);u=q/4;len=92;
v=[' 1111','11','  1','11',' 1111','','11111','  1','11111','','11111',' 1  1','11111','','    1','11111','    1','','','11111',' 1  1','11111','','11111','   11','  1','   11','11111','','','11111','','',' 111','1   1','11  1','',' 111','1   1',' 111','','11111','','11111','   11','  11','11111','',' 111','1   1','11  1','','','    1','11111','    1','',' 111','1   1',' 111','','','11111','1   1',' 111','',' 111','1   1',' 111','','','11111','   11','  11','11111','',' 111','1   1',' 111','',' 1111','11','  1','11',' 1111','','','1 1 1','  1 1','   1'];
w=-20,x=2*b.PI/30,y=.1875;
function C(b,a,c){return'rgb('+~~b+','+~~a+','+~~c+')'}
setInterval('o.fillStyle=0;o.fillRect(r,s,p,q);g=+new Date;y-=.0625;if(y<0){y+=.1875;w++}for(d=0,h=31;h--;){l=h*.1875+y,z=200-200/(3+y)*l,m=z/2;o.strokeStyle=C(m,m,m);for(A=i(l+g/1700)*70,B=j(l+g/1100)*70,c=[],a=0;a<120;a+=4){t=a/4,f=t*x+b.PI+i(g/3700),e=u/l;c[a]=A+j(f)*e;c[a+1]=B+i(f)*e;c[a+2]=A+j(f+x)*e;c[a+3]=B+i(f+x)*e;f=(w+h)%len;e=z/4;o.fillStyle=C(+(v[f]?v[f][t-3]:0)?b.max(150+~~(105*i(g/100)),e):m/4,t%16==0&&(h+w)%12?255:e,e);if(d){o.beginPath();o.moveTo(c[a],c[a+1]);o[lt](c[a+2],c[a+3]);o[lt](d[a+2],d[a+3]);o[lt](d[a],d[a+1]);o.fill();o.stroke()}}d=c}',50);
</script></body>
```

```html --psychedelic
<!-- ```html  -- `psychedelic -->
<html>
<head> </head>
<body> 
<canvas id='canv' display='block'></canvas> 
<script> 
var c = document.getElementById('canv'), fst,
    $ = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;
window.addEventListener('resize',function(){
  c.width = window.innerWidth;
  c.height = window.innerHeight;
},false);
function mob(a, b, c) {
  var pa = a[0] * a[0] + a[1] * a[1],
      pb = b[0] * b[0] + b[1] * b[1],
      pc = c[0] * c[0] + c[1] * c[1];
  var y = (
    (a[0] - b[0]) * (pb - pc) - (b[0] - c[0]) * (pa - pb)
  ) / (
    2 * (b[1] - a[1]) * (b[0] - c[0]) - 2 * (a[0] - b[0]) * (c[1] - b[1])
  ),
      x = (pa - pb + 2 * (b[1] - a[1]) * y) / (2 * (a[0] - b[0])),
      r = Math.sqrt((x - a[0]) * (x - a[0]) + (y - a[1]) * (y - a[1]));
  return [x, y, r];
}
function arcs(x, y, r) {
  var c = mob_arc(x, y, r);
  if (c[2] > 10) return;
  $.beginPath();
  $.arc(c[0], c[1], c[2]/1.65, 0, Math.PI*2, false);
  $.fill();
  $.closePath();
}
function mob_pt(x, y) {
  var denom = (x + 1) * (x + 1) + y * y;
  return [(x * x - 1 + y * y) / denom, 2 * y / denom];
}
function mob_arc(x, y, r) {
  var a = mob_pt(x - r, y),
      b = mob_pt(x + r, y),
      c = mob_pt(x, y + r);
  return mob(a, b, c);
}
function cmul(w, z) {
  return [
    w[0] * z[0] - w[1] * z[1],
    w[0] * z[1] + w[1] * z[0]
  ];
}
function rotate(z, theta) {
  return cmul(z, [Math.cos(theta), Math.sin(theta)]);
}
function modulus(p) {
  return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}
function crecip(z) {
  var d = z[0] * z[0] + z[1] * z[1];
  return [z[0] / d, -z[1] / d];
}
function spiral(r, st, delta, opts) {
  var rd = crecip(delta),
      md = modulus(delta),
      mrd = 1 / md,
      colidx = opts.i,
      cols = opts.fill,
      min_d = opts.min_d,
      max_d = opts.max_d;
  for (var q = st, mod_q = modulus(q); mod_q < max_d; q = cmul(q, delta), mod_q *= md) {
    $.fillStyle = cols[colidx];
    arcs(q[0], q[1], mod_q * r);
    colidx = (colidx + 1) % cols.length;
  }
  colidx = ((opts ? opts.i : 0) + cols.length - 1) % cols.length;
  for (var q = cmul(st, rd), mod_q = modulus(q); mod_q > min_d; q = cmul(q, rd), mod_q *= mrd) {
    $.fillStyle = cols[colidx];
    arcs(q[0], q[1], mod_q * r);
    colidx = (colidx + cols.length - 1) % cols.length;
  }
}
var p = 9, q = 36;
root={a:[1.203073257697729,0.06467009356882296],
b:[1.0292303580593238,0.19576340274878198],
r:0.09666227205856094};
var rep = 20000;
function anim(t) {
  $.setTransform(1, 0, 0, 1, 0, 0);
  $.clearRect(0, 0, c.width, c.height);
  $.translate(Math.round(c.width / 2), Math.round(c.height / 2));
  $.scale(250, 250);
  var beg = rotate(root.a, Math.PI * 2 * t);
  for (var i = 0; i < q; i++) {
    spiral(root.r, beg, root.a, {
      fill: ['#EB1E23', '#D9DFD1', '#008F86'],
      i: (i) % 3.5,
      min_d: 1e-3,
      max_d: 1e3
    });
    beg = cmul(beg, root.b);
  }
}
function run(ts) {
  if (!fst) fst = ts;
  anim(((ts - fst) % rep) / rep);
  window.requestAnimationFrame(run);
}
run();
</script></body>
</html>
```

```html --breathing galaxies
<!-- ```html breathing galaxies` --> 
<html> 
<head> 
<title>JS1k: Breathing Galaxies (1020 bytes)</title> 
<script type="text/javascript"> 
window.onload = function () {
	C = Math.cos; // cache Math objects
	S = Math.sin;
	PP=Math.PI;
	SW=screen.availWidth*1.1;
	SH=screen.availHeight;
	U = 0;
	w = window;
	j = document;
	d = j.getElementById("c");
	c = d.getContext("2d");
	W = d.width = SW;
	H = d.height = SH;
	c.fillRect(0, 0, W, H); // resize <canvas> and draw black rect (default)
	c.globalCompositeOperation = "lighter"; // switch to additive color application
	c.lineWidth = 0.2;
	c.lineCap = "round";
	var bool = 0, 
		t = 0; // theta
	d.onmousemove = function (e) {
		if(window.T) {
			if(D==9) { D=Math.random()*15; f(1); }
			clearTimeout(T);
		}
		X = e.pageX; // grab mouse pixel coords
		Y = e.pageY;
		a=0; // previous coord.x
		b=0; // previous coord.y 
		A = X, // original coord.x
		B = Y; // original coord.y
		R=(e.pageX/W * 999>>0)/999;
		r=(e.pageY/H * 999>>0)/999;
		U=e.pageX/H * 360 >>0;
		D=9;
		g = 360 * PP / 180;
		T = setInterval(f = function (e) { // start looping spectrum
			c.save();
			c.globalCompositeOperation = "source-over"; // switch to additive color application
			if(e!=1) {
				c.fillStyle = "rgba(0,0,0,0.02)";
				c.fillRect(0, 0, W, H); // resize <canvas> and draw black rect (default)
			}
			c.restore();
			i = 255; while(i --) { //25
				c.beginPath();
				if(D > 450 || bool) { // decrease diameter
					if(!bool) { // has hit maximum
						bool = 1;
					}
					if(D < 0.1) { // has hit minimum
						bool = 0;
					}
					t -= g; // decrease theta
					D -= 0.1; // decrease size
				}
				if(!bool) {
					t += g; // increase theta
					D += 0.1; // increase size
				}
				q = (R / r - 1) * t; 
// create hypotrochoid from current mouse position, and setup variables (see: http://en.wikipedia.org/wiki/Hypotrochoid)
				x = (R - r) * C(t) + D * C(q) + (A + (X - A) * (i /25)) + (r - R); // center on xy coords
				y = (R - r) * S(t) - D * S(q) + (B + (Y - B) * (i /25));
				if (a) { // draw once two points are set
					c.moveTo(a, b);
					c.lineTo(x,y)
				}
				c.strokeStyle = "hsla(" + (U % 360) + ",100%,50%,0.75)"; // draw rainbow hypotrochoid
				c.stroke();
				a = x; // set previous coord.x
				b = y; // set previous coord.y
			}
			U -= 0.5; // increment hue
			A = X; // set original coord.x
			B = Y; // set original coord.y
		}, 16);
	}
	j.onkeydown = function(e) { a=b=0; R += 0.05 }
	//d.onmousemove({pageX:300, pageY:290})
            setInterval ( "d.onmousemove({pageX:Math.random()*SW, pageY:Math.random()*SH})",
                Math.random()*1000 )
}
</script> 
<style> 
body { margin: 0; overflow: hidden; }
</style> 
</head> 
<body> 
<canvas id="c"></canvas> 
</body> 
</html>
```

---
### Powershell

Use `pwsh` to run powershell, or `pwsh {cmd}` to also use in *mpe*

```pwsh {cmd}
 # ```pwsh {cmd}`
pwd
```

---
### Random strings in javascript

```js :node {cmd=node} //works in mpe
// ```js :node {cmd=node} //works in mpe`
//random string generation see https://gist.github.com/6174/6062387
a=Math.random().toString(36).substring(2, 15)
a =>>yelvv0rat5
a=[...Array(60)].map(_=>(Math.random()*36|0).toString(36)).join``
a =>>n38rvxi2oeynm4m9q9bqn42rmrsrvs4rkpyq869ilzpt1c2ncvocdo1g9pnh
a=[...Array(30)].map(_=>((Math.random()*26+10)|0).toString(36)).join``
a =>>xlqhgxarvwrxbghygaumqqopxyypik
console.log(a)
Math.random(36).toString(36).substring(2,3) =>>b
```

---
```js :node {cmd=node} //string jumbler, works in mpe
// ```js :node {cmd=node} //string jumbler, works in mpe`
function swapStr(str,n){
    var arr = [...str];
    for (let k = 0; k<n; k++) {
    i=Math.random()*str.length|0;
    j=Math.random()*str.length|0;
    [arr[i],arr[j]]=[arr[j],arr[i]]
    }
    return arr.join('');
}
console.log(swapStr('portsmouth',100))
```

---
```js :node {cmd=node} //generate random string
// ```js :node {cmd=node} //generate random string`
function randch(n){
  return ''+Math.random().toString(36).substring(2,2+n)
}
randch(36) =>>daevdymyo6p
console.log(randch(36))
```

---
### Regular expression test and usage

```js     //javascript regex tester using vm
// ```js //javascript regex tester (use node for mpe)`
// if not using md preview enhanced, use = >> instead of // = (less faint)
"xys {cmd='js'} th".replace(/.*cmd=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'') =>> js
Math.random()*100   =>> 88.421425704524
```

---

```js :node {cmd=node} //javascript regex tester using node
// ```js :node {cmd=node} //javascript regex tester`
'abcdefg'.replace(/^.*(bc)/,'$1Baa') =>>bcBaadefg
Math.random()*100   =>>36.993060297486615
console.log(Math.random()*100) //this for *mpe*
```
```output
9.777445434760335
```

---
another regex example

```js :node {cmd=node}
// ```js :node {cmd=node}`
var myRe = new RegExp('d(b+)d', 'g');
var myArray = myRe.exec('xxdbbbdwerwr');
myArray =>>dbbbd,bbb
if(myArray!==null){
  myArray.index =>>2
  myArray.input =>>xxdbbbdwerwr
  myArray.input[myRe.lastIndex] =>>w
}
myRe.source =>>d(b+)d
myRe.lastIndex =>>7
console.log(myRe)
```
```output
/d(b+)d/g
```

---
and again ```js :node {cmd=node}`

```js :node  {cmd=node} //find one+ chars followed by a space 
// ```js :node  {cmd=node} //find one+ chars followed by a space`
var re = /\w+\s/g;
var str = 'fee fi fo fum';
var myArray = str.match(re); 
console.log(myArray)
```

---
### Go
Using go as a 'scripting language'

```go
// ```go`
package main
import "fmt"
func main() {
    var a[5]int
    fmt.Println("emp:", a)
    a[4] = 42
    fmt.Println("set:", a)
    fmt.Println("get:", a[4])
    fmt.Println("len:", len(a))
    b := [5]int{1,2,3,4,5}
    fmt.Println("dcl:", b)
    var twoD [2][3]int
    for i := 0; i < 2; i++ {
        for j := 0; j < 3; j++ {
            twoD[i][j] = i + j
        }
    }
    fmt.Println("2d: ", twoD)
}
```

---
### Vitamin b12, dosage vs uptake

```js    //using 'vm' for input
//```js //using 'vm' for input
let d=await input('dosage ug?')/1 // /1 converts to number, also note 'await'
let u=1.5*d/(d+1.5)+(1-1.5/(d+1.5))*0.009*d
' uptake='+u  =>> uptake=5.982053838484545
console.log(u)
```
```output
5.982053838484545
```

---
### Chaining execution codeblocks

Here a javascript codeblock produces output in the form of an `output:gnuplot` codeblock. This block is labelled as an `output` and so will be replaced if the javascript is executed again. Because it is also labelled with `:gnuplot' it can be directly executed in the usual ways to produce the plot.

```js {cmd=node}
// ```js :node {cmd=node}`

//_=require("lodash")
//math=require("mathjs")
//moment=require("moment")

function xrange(){
   let x1=_.range(0,6.1,6/19);
   let x=math.round(math.exp(math.multiply(x1,math.log(10))));
   return x
}
let x=xrange();
let nruns=0,tim=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let j=0,n=0,ii=0;
tim=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
for (ii=0;ii<x.length;ii++) {
  n=x[ii];
  let rr=_.range(0,n),m=1,i=0,t1=0;
  for (i=0;i<rr.length;i++) {rr[i]=math.random()};
  let rr1=rr,rr2=rr;
  if (n<100){m=10000} else if (n<5000){m=1000}
    else if (n<20000){m=500} else {m=100};
  m=m;t1=moment.now();
  for (i=0;i<m;i++){
    rr=math.add(math.dotMultiply(rr1,rr2),rr1);
  }
  t1=(moment.now()-t1)/n/m/1000;//msec->sec
  tim[j++]=2/t1/1e6;
}
console.log('```output :gnuplot noinline')
console.log('#tag_speed') //id tag for other scripts to use the data
console.log('$speed << EOD')
for (ii=0;ii<x.length;ii++) {
console.log(x[ii],tim[ii])
}
console.log('EOD')
console.log('#tag_speed') //same id tag at end of data
console.log('set logscale x')
console.log('plot "$speed" w lp title "speed"')
```
```output :gnuplot noinline
#tag_speed
$speed << EOD
1 0.29411764705882354
2 0.7547169811320754
4 1.5384615384615388
9 2.7692307692307696
18 4.864864864864865
38 7.6767676767676765
78 10.064516129032258
162 11.571428571428573
336 12.444444444444445
695 13.238095238095237
1438 13.192660550458719
2976 13.43566591422122
6158 14.091533180778033
12743 13.911572052401747
26367 6.033638443935927
54556 9.803414195867024
112884 9.66472602739726
233572 11.242936221419978
483293 12.291276703967446
1000000 12.099213551119176
EOD
#tag_speed
set logscale x
plot "$speed" w lp title "speed"
```

---
## One-liners

*One-liners* starting and ending with single backticks will simply be executed on click, and usually do not produce output back into the editor. Pre-defined variables (`%c` current folder, `%e` current file pathname, `%f` temp file pathname, `%p` temp files path, `%n` temp file name) can be used in the line (and the default `.txt` extension can be changed by appending, for example, `.ext` to the variable). Notes/comments can be added after the closing quote:

### One-liners examples
NB. Note only *single* backticks for one-liners

`notepad README.md`       //exec notepad
`notepad %caa.html`      //exec notepad with file from current folder
`notepad %f.py`     //exec notepad with temp file `temp.py`
`notepad %f.out.txt`        //& with temp output file (temp.txt.out.txt)
`"C:/Program Files/Notepad++/notepad++" %e`  //exec notepad++ with %e editor file
`explorer`                         //explore
`explorer /select,"%f"`     //explore temp folder

### Quickmath examples

Another useful facility is *quickmath*. A math expression of the form `5-sqrt(2)=` anywhere will be evaluated on hover and the result will be shown immediately  in the hover message. Clicking the hover result will copy it to the clipboard. Note that the expression is surrounded by single backticks (backticks are the norm for *hover-exec*), and there needs to be `=` before the last backtick (essentially to stop popups for other backtick quoted strings).

A few more *quickmath* expressions: `254cm in inches=` will show 100inches in the hover message,  `[1,2,3,4]*5=`,  `cos(45deg)=`,  `sin(0.81)^2+cos(0.81)^2=`,  `cos(pi/2)=`,  `sin([10,45,90] deg)=`,  `range(0,4,0.5)=`,  `(2+2i)*(1+2i)=` , `3:6=`, `1:0.1:5=`.

More information can be fount at [*mathjs 'math.evaluate'*](https://mathjs.org/docs/reference/functions/evaluate.html).

---
### Windows - control panel
`control /name Microsoft.DevicesAndPrinters`
`control mouse`
`control /name Microsoft.ProgramsAndFeatures`
`pwsh explorer --% shell:::{ED7BA470-8E54-465E-825C-99712043E01C}`   //godmode
`devmgmt.msc`               //devices
`mmc diskmgmt.msc`     //disk management

---
### html & javascript

`"C:\Program Files\Google\Chrome\Application\chrome.exe" %c/aa.html` //chrome with html file - can use %c etc in one-liners
`html <script>location.href='https://whatamigoingtodonow.net/'</script>` //browser with url
`html <script>location.href="/%caa.html"</script>` //browser with html file - %c etc in one-liners only
`html <h1 align='center' >Hello %c</h1><br><h1 align='center' >Hello /%c</h1>`    //default browser text
`streamlit run heatmap_time_series.py`    //exec with spaces and filename
`js console.log(7*7-7)`
`vm progress(''+(7*7-7),4000)`  //quick calculator output via message

---
### audio one-liners

`html <audio id="a2" controls autoplay src="%cassets/clear.mp3"/>`
`"c:\Program Files (x86)\Windows Media Player\wmplayer.exe" "%cassets/clear.mp3"`
`pwsh start wmplayer  "%cassets/clear.mp3"`

---
### One-liners for microsoft management console mmc
`mmc azman.msc`	Authorization Manager	Manage Authorization Stores
`mmc certlm.msc`	Certificates Local Computer	Loads the list of certificates of the local computer.
`mmc certmgr.msc`	Certificates	Loads the list of certificates of the user
`mmc comexp.msc`	Component Services	Loads Component Services, Event Viewer, and Services.
`mmc compmgmt.msc`	Computer Management	Includes System Tools (Task Scheduler, Event Viewer, Shared Folders, Local Users and Groups, Performance and Device Manager), Storage (Disk Management), and Services and Applications (Services and WMI Control)
`mmc devmgmt.msc`	Device Manager	Opens the Device Manager to manage hardware and devices.
`mmc diskmgmt.msc`	Disk Management	Opens Disk Management to administrate connected storage devices.
`mmc eventvwr.msc`	Event Viewer	Opens the Event Viewer which displays operating system, software, and hardware events.
`mmc fsmgmt.msc`	Shared Folders	Loads the list of shared folders, sessions, and open files
`mmc gpedit.msc`	Group Policy Editor	Loads the Group Policy Editor to manage system policies
`mmc lusrmgr.msc`	Local Users and Groups	Interface to manage local users and user groups.
`mmc perfmon.msc`	Performance Monitor	Loads the Windows Performance Monitor
`mmc printmanagement.msc`	Print Management	Manage printers.
`mmc rsop.msc`	Resultant Set of Policies	List policies, full results only available through command line tool gpresult
`mmc secpol.msc`	Local Security Policy	- account policies, public key policies, or advanced audit policy configuration
`mmc services.msc`	Services Manager	Loads the list of installed services to manage them.
`mmc taskschd.msc`	Task Scheduler	Loads the Task Scheduler to manage tasks
`mmc tpm.msc`	Trusted Platform Module Management	Manage the TPM on the local device.
`mmc wf.msc`	Windows Firewall	Starts Windows Firewall with Advanced Security.
`mmc wmimgmt.msc`	WMI Management	Configure and Control the Windows Management Instrumentation Service.

---
## inhere - including tagged sections

The following line in a code block

```
#inhere `#tag_speed`
```

will include a group of lines surrounded with the #tag-speed tag. To see what will be included, hover over the tag in the `inhere` line. Note that:

1. Tags must either stand alone in a line, or ed the line (eg. tags can have comment markers in front of them)
2. Within the `#inhere` line, the tag must be surrounded with backticks (*hover-exec* uses back-ticks to indicate potential hovers)
3. To include lines from another file use the format (the file path can include `%c` current folder & `%p` temp files folder)

```
#inhere file_path `#tag`
```

---
## Configuration settings

The startup commands for scripts included by default are as follows (nb. `%f` provides the appropriate temporary file path & name, and the notation `%f.py`, for example, indicates that the temporary file extension `.py` should be used - the default is `.txt` ):

  "octave":"octave \"%f.m\"",
  "matlab":"matlab -sd %p.m -batch temp",
  "matlab_comment":"if %p.m needs to be \"%p.m\" then add /, ie. \"%p.m/\" ",
  "scilab":"scilex -quit -nb -f \"%f.sci\" ",
  "python":"python \"%f.py\"",
  "python3":"python3 \"%f.py\"",
  "streamlit":"streamlit run \"%f.py\" ",
  "julia":"julia \"%f.jl\"",
  "gnuplot":"gnuplot -p -c \"%f.gp\"",
  "pwsh":"pwsh -f \"%f.ps1\"",
  "bash":"bash \"%f.sh\"",
  "zsh":"zsh -f \"%f.sh\"",
  "lua54":"lua54 \"%f.lua\"",
  "lua53":"lua53 \"%f.lua\"",
  "lua":"lua54 \"%f.lua\"",
  "js":"vm",
  "vm":"vm",
  "eval":"eval",
  "node":"node \"%f.js\"",
  "javascript":"node \"%f.js\"",
  "html":"\"%f.html\"",
  "firefox":"firefox \"%f.html\"",
  "chrome":"google-chrome-stable \"%f.html\"",
  "test":"test -c \"%f.tst\"",
  "go":"go run \"%f.go\"",
  "pascal": "fpc \"%f.pas\" -v0 && \"%ptemp\" "
  "buddvs":"buddvs \"%f.txt\" " // *buddvs* is a local scripting language

Any of these can be changed to suit the system in use using vscode `settings` under the `hover-exec` extension.

Also note that there is no actual requirement to include a script startup command in the configuration file for the script to be used - they simply make code block setup slightly easier.

Basically if the command works in the terminal (using the full file name of course), and returns output to the terminal, then it will work as a *hover-exec* command  (on Windows, use "double quotes" if there are spaces in the file path).

For example, on windows, *hover-exec* will run the following script as a `cmd.exe` `.bat` file, because `.bat` files autostart `cmd.exe` :

```%f.bat
@echo off
dir *.json
echo Congratulations! Your first batch file was executed successfully.
```
```output
 Volume in drive C is OS
 Volume Serial Number is B054-2449

 Directory of c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec

26/07/2021  09:08 pm               485 .eslintrc.json
02/11/2021  12:27 pm           116,622 package-lock.json
07/11/2021  09:15 am             4,518 package.json
09/10/2021  06:00 pm               619 tsconfig.json
               4 File(s)        122,244 bytes
               0 Dir(s)  252,360,884,224 bytes free
Congratulations! Your first batch file was executed successfully.
```

There is also a set of strings called `swappers` which enable moving the output of a line so that it appears *in-line*, within the codeblock itself and can be accessed in the *hover-exec* configuration.

As an example, the *swapper* for javascript (`vm`, `eval` & `node`) is `console.log('=>>'+($1))` which takes the line `($1)` and prints it starting with the string `=>>`.

The *swapper* for *julia* is `println(string(\"=>>\",$1))`, where the double quotes required by *julia* have to be escaped `\"` because they are part of a *json* string 


---
### Using vm for configuration settings

*hover-exec* has the ability to view and alter its own config settings via *vm* or *eval* script (*node* can't access the vscode api)

#### Check settings

For a given codeblock, in the hover message for the command line there is a `config` link, If this is clicked, a new (executable) codeblock will be produced. In that codeblock will be the current setting for the codeblock script. For `python`:

```python
 # this is python 'code' example for config check
 # the following codeblock is produced by clicking *config* in the python hover
```
```js :vm noInline
//this script can change, add or undefine a config setting
let s={"python":"python \"%f.py\""};
//s={"python":undefined}; //uncomment this to undefine python
let scripts=config.get('scripts');
let merge=Object.assign({},scripts,s);
if(await config.update('scripts',merge,1)){}
console.log('new config:',config.get('scripts.python'))
```
```output
new config: python "%f.py"
```

The first line shows the python config. So the start command is `python %f.py`. A basic check is if command line python should run when this command is run in a terminal (minus the `%f.py`).

#### Add new script language

If there is a need to add a new scripting language, say `newlang`, this can be done using the settings configuration for *hover-exec*, and following the obvious patterns.

It can also be done using `vm` or `eval` since the *vscode* configuration settings can be accessed with the scripts.

First write a fenced codeblock labelled newlang:

```newlang
//a newlang comment line
```

Then hover over the command line and click config. In this case, the following template is output: 

```js :vm noInline
//this script can change, add or undefine a config setting
let s={"newlang":"put_start_command_here %f.txt"};
//s={"newlang":undefined}; //uncomment this to undefine newlang
let scripts=config.get('scripts');
let merge=Object.assign({},scripts,s);
if(await config.update('scripts',merge,1)){}
console.log('new config:',config.get('scripts.newlang'))
```

The first line provides the `newlang` setting command. Replace `put_start_command_here` with the `newlang` start command, and change the `txt` extension at the end as appropriate. If backslashes are used in a path, they should be escaped, ie. `\\`. Similarly if `"` is used it should be entered as `\"`

Once the script has been set up, execute using the hover in the usual way, then delete the block. Check it as in the previous section or open *hover-exec* settings and view the JSON settings file.

---
#### Other vscode config settings

Other *vscode* configuration settings can also be accessed:

```js :vm noinline
// ```js :vm noinline  --eval is not available in mpe`
let c=vscode.workspace.getConfiguration('');
console.log("editor font size= "+c.get("editor.fontSize"))
//c.update("editor.fontSize",12,1) //to change it
```
```output
editor font size= 12
```

---
## Known Issues

This is a beta version.

Note that in all scripting languages included (except a 'home-grown' one *buddvs*, and to some extent *vm* and *eval*, which allow definition of *global* variables and functions), the script starts from scratch when the code block is executed, the same as if the command file were executed from scratch from the command prompt. In other words, assigned variables do not carry over into the next script execution.

This kind of approach is best suited for small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages.  To help with this there is also an *include* capability, known as `#inhere` (to distinguish from *includes* in scripts) which allows utilising output or data elsewhere in the file or in other files.

Matlab takes a substantial amount of time to run a codeblock (ie. the startup time for matlab to run a 'batch file' is nearly 10s on a Ryzen laptop). However, other included scripts are generally fairly fast (see the demo gif above). Although this is a Matlab startup issue, it undermines the use of `matlab` within `hover-exec`.

---
## Release Notes

Initial beta release was 0.6.1
Published using: vsce package/publish
