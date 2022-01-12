# Hover exec

This is the READMORE for VS Code extension *hover exec*. Tldr? ..check [the README](README.md) instead. The two files use the same structure and basic content, this one just goes into more detail.

- [Hover exec](#hover-exec)
  - [Features](#features)
    - [Compatibility with Markdown Preview Enhanced (*mpe*)](#compatibility-with-markdown-preview-enhanced-mpe)
  - [Basic hover-exec](#basic-hover-exec)
  - [Javascript scripts](#javascript-scripts)
    - [Examples using vm and eval](#examples-using-vm-and-eval)
    - [available functions in vm and eval](#available-functions-in-vm-and-eval)
    - [The vm context](#the-vm-context)
    - [Quick specification of `vm` context](#quick-specification-of-vm-context)
    - [using require & globals with vm and eval](#using-require--globals-with-vm-and-eval)
    - [Using nodejs](#using-nodejs)
  - [Other scripts](#other-scripts)
    - [Script commands](#script-commands)
  - [Some examples](#some-examples)
    - [Lua](#lua)
    - [Scripts without pre-defined configs](#scripts-without-pre-defined-configs)
    - [Bash or zsh](#bash-or-zsh)
    - [Gnuplot](#gnuplot)
    - [Javascript using vm](#javascript-using-vm)
    - [Javascript using node](#javascript-using-node)
    - [More vm, eval and node examples](#more-vm-eval-and-node-examples)
  - [More examples](#more-examples)
    - [Octave](#octave)
    - [Scilab](#scilab)
    - [Python](#python)
    - [Julia](#julia)
    - [Gnuplot](#gnuplot-1)
    - [Html and in-browser javascript](#html-and-in-browser-javascript)
    - [Random strings in javascript](#random-strings-in-javascript)
    - [Regular expression test and usage](#regular-expression-test-and-usage)
    - [Go](#go)
    - [Vitamin b12, dosage vs uptake](#vitamin-b12-dosage-vs-uptake)
    - [Chaining execution codeblocks](#chaining-execution-codeblocks)
  - [Running other programs](#running-other-programs)
  - [One-liners](#one-liners)
    - [One-liners examples](#one-liners-examples)
    - [Quickmath examples](#quickmath-examples)
    - [Mac system information](#mac-system-information)
    - [html & javascript](#html--javascript)
    - [audio one-liners](#audio-one-liners)
  - [inhere - including tagged sections](#inhere---including-tagged-sections)
    - [Using repl scripts](#using-repl-scripts)
  - [Configuration settings](#configuration-settings)
    - [Using vm for configuration settings](#using-vm-for-configuration-settings)
      - [Check settings](#check-settings)
      - [Add new script language](#add-new-script-language)
      - [Other vscode config settings](#other-vscode-config-settings)
  - [Known Issues](#known-issues)
  - [Release Notes](#release-notes)

## Features

*Hover-exec* facilitates execution from within the editor of markdown code blocks in a variety of installed script languages. New script languages can be added with or without configuration.  This is by no means intended as a replacement for the superb vscode notebooks. Instead it simply offers the opportunity, when working with markdown docs, to include 'live' calculations, results, code samples, comparisons and useful links, using a range of possible scripts.

The *hover-exec* extension is activated when a markdown file is opened in the editor.

Hover script exec in action:

  ![](https://raw.githubusercontent.com/rmzetti/hover-exec/master/Hover-exec.gif)
  ![](Hover-exec.gif)

### Compatibility with Markdown Preview Enhanced (*mpe*)

There is also an intention to maintain a certain compatability with the excellent *markdown preview enhanced* extension. The idea is to simply include *mpe* requirements in the usual *mpe* {curly brackets} in the command line. There are a number of elements of *hover-exec@ (eg. in-line results, built in javascript execution rather than `node` only, and the different approach to temporary storage of generated script files) which make full compatability difficult at this stage, but many scripts can still be executed in both extensions.

---
## Basic hover-exec 

Hovering over code block start or end lines, which start with a triple backtick, or lines which start with a single backtick and include an end backtick, will trigger a hover message with an *exec* command in the bottom line. Hovering over the triple backtick at the end of a block will trigger the message for the start of the block. Clicking the command link on the bottom line of the hover message (or using the shortcut `Alt+/` or `Opt+/` with the cursor anywhere in the block) will execute the code in the code block, and produce output.

---
## Javascript scripts

Javascript code blocks can be executed using the `vm` module, or by using *vscode*'s built in `eval` - and also through [nodejs](#nodejs). The default (command blocks with id `js` ) is to use the `vm` module, `hover-exec` provides, by default, a reasonably substantial `vm context`.

### Examples using vm and eval

```js  //click this line in the *hover* to execute the block
//js  //this comment is to show the command line in markdown previews
//    //the default for the `js` command is to execute using the `vm` module
'test: '+Math.random() =>>test: 0.9454157386045439
aa = function (fruit){alert('I like ' + fruit);} //no 'let' creates a global variable
bb = function (animal){alert('he likes ' + animal);}
```

```js //execute the previous *vm* block first
//js //execute the previous *vm* block first
bb('dogs');aa('pears'); //uses the globals defined in the previous code block
```

Intermediate results can be viewed in line by appending `=>>` instead of using `console.log()` (see the `swapper` configurations). If it is wished to be strictly correct, and/or compatible with the *markdown preview enhanced* extension (*mpe*), put a comment marker before the `=>>`, eg. for javascript use `// =>>`, for python `# =>>`.  Note, though,  that *mpe* will not produce the results in-line.

Other results are produced in an `output` block. Hovering over `output` provides options *output to text* or *delete*. Using the shortcut `Alt+/` or `Opt+/` with the cursor in the `output` block deletes the block.

---
A couple more examples using `vm`, showing use of *vscode* api functions and some extra functions published by `hover-exec` (eg. `alert`). See the next section for other available functions.

```js  //using vm various examples
//js //using vm, various examples
let abc="hello, world 3"
let a='hello variable world';
alert(a) //not available in node scripts
a='goodbye world'
vscode.window.showInformationMessage(a) //not available in node scripts
eval('let a=3;2*a*Math.random()')=>>4.050290738187304
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>>hello 1.3682216733816874
process.cwd() =>>/Users/kellycogan/Documents/GitHub/hover-exec
console.log(abc)
```
```output
goodbye world 0.7065595286695108
hello, world 3
```

---
```js  //javascript regex tester using vm
//js //javascript regex tester using vm
'abcdefg'.replace(/^.*(bc)/,'$1--') =>>bc--defg
```

---
All the above codeblocks can be executed using `eval` instead of `vm`, eg.

```js :eval  //javascript regex tester using eval
//js :eval //javascript regex tester using eval
'abcdefg'.replace(/^.*(bcde)/,'$1--') =>> bcde--fg
```

The difference is that `vm` scripts are executed within a more restricted *context* (see next section).

In the command line (eg. above), using `js` for the codeblock id produces javascript syntax highlighting (it's a quick and dirty approach to provide basic syntax highlighting for a range of scripts), then adding ` :node` sets the actual exec command to `node` (reflected in the hover display). Note, for example, for this to work with *mpe*, the `{cmd=node}` *mpe* requirement must now go before `:node`, ie. use

```js {cmd=node} :node
//js {cmd=node} :node
console.log('hello')
```
rather than
```js:node {cmd=node}
//js:node {cmd=node}
console.log('hello')
```
(Both work in *hover-exec*, view the above in *mpe* to see the difference)

Note that `vm` and `eval` allow the internal *vscode* API to be used. Installation of `nodejs` is not required for `vm` or `eval` scripts to execute.


---
### available functions in vm and eval

The following functions are included in `vmContext` by default (and are also available to `eval`):
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
### The vm context
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
//js //can use lodash
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

```js //can't use lodash in reduced context
//js //can't use lodash in reduced context
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

```js //can now use lodash (etc) again in vm
//js //can now use lodash (etc) again in vm
_.range(0,5)=>>0,1,2,3,4
```

In this way, the context used for vm_scripts can be adjusted to be restricted or permissive as necessary.

### Quick specification of `vm` context

By default the `js` command utilises a default context which is progressively expanded by 'naked' function declarations and variable assignments (eg. `a=43;` rather than `let a=43;` or `var a=43;`). So successive codeblocks can build on previously executed ones.

Any `js/vm` codeblock can utilise the following options:

```js:vmdf     //set 'vmContext' to default
//js:vmdf     //set 'vmContext' to default
//On execution, the vmContext returns to its default
```

and

```js:vmin     //set 'vmContext' to minimum
//js:vmin    //set 'vmContext' to minimum
//This will set the vmContext to a minimum (ie. just
//including 'write' which enables 'console.log' for output)
console.log('hello')
```
```output
hello
```

Apart from resetting `vmContext` at the start, these are normal `js` codeblocks.

---
### using require & globals with vm and eval

Moment, lodash (_) and mathjs (math) are available by default in both `vm` and `eval`.

A function or variable can be set as global (eg. `global.a=a;` see examples below) in either `vm` or `eval` and is then available during the session in both. A global can be deleted (undefined) using, eg. `delete global.a;`

'Naked' assignments (ie. no `let` or `var`) will be available to subsequently executed `js/vm` codeblocks. Global assignments are also available to subsequent `js/vm` codeblocks, and they are also available to subsequently executed 'eval' codeblocks. 

```js:eval //use of lodash and mathjs 
//js:eval //use of lodash and mathjs 
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
//js //global function definition
f=global.f=function(m){return 'the meaning of life is '+m;};
f(44-2)=>>the meaning of life is 42
```

```js:eval //use of global from 'vm' in 'eval'
//js:eval //use of global from 'vm' in 'eval'
f(42)=>> the meaning of life is 42
_.range(0,4)=>> [ 0, 1, 2, 3 ]
```

```js  //naked function definition (no 'let')
//js //naked function definition (no 'let')
test = function () {
  console.log('test works')
}
```
```js    //function available to subsequent vm codeblocks
//js //function available to subsequent codeblocks
test()
```

For `eval`, neither 'naked' nor 'var' function defs are available to subsequent `eval` code blocks. Instead, the 'global' prefix needs to be used in the function def, as above.

---
### Using nodejs

The js command by default executes a javascript code block in `nodejs` (assuming that is installed).

```js :node
//js :node  //as before, this line shows the command in markdown previews
console.log('test using node:\n'+Math.random())
console.log('  NB: Clicking "delete output" in the "output" line hover message, or typing\n',
    ' alt+/ or opt+/ with the cursor in the output block will delete the output block')
```
```output
test using node:
0.5532550354218875
  NB: Clicking "delete output" in the "output" line hover message, or typing
  alt+/ or opt+/ with the cursor in the output block will delete the output block
```

Note:
- to allow execution also in *markdown preview enhanced*, include `{cmd=node}` in the command line 
-- eg. `js {command=node} :node`.
- in-line output will not be available in *mpe*.

```js {cmd=node} :node
//js {cmd=node} :node
console.log(process.cwd())
console.log('test using node: '+Math.random())
let a=5;console.log(a+Math.random())
```
```output
/Users/kellycogan/Documents/GitHub/hover-exec
test using node: 0.06146033572948717
5.479236723842591
```

```js {cmd=node} :node
//js {cmd=node} :node
process.cwd()  =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
'test: '+Math.random() =>>test: 0.8151737631797151
let a=5;
a+Math.random() =>>5.085366384159352
```

---
## Other scripts

### Script commands

Command lines to conveniently start a number of scripts are included (see [Configuration settings](#configuration-settings) near the end of this `READMORE` for the actual commands used):

- js (or vm) --javascript, with vscode api included in context
- eval --javascript via eval, with vscode api available
- javascript (or node) --javascript using nodejs
- html --html via the default browser
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
- Other script languages may be added - see [Adding another script](#adding-another-script)
- Scripts may be used with adding a config script in settings - see [Scripts without pre-defined configs](###Scripts-without)

## Some examples
In these examples, random numbers & time are used so updated output is easier to spot

### Lua

```lua:lua54 {cmd=lua54} --10 million random number calls
--lua {cmd=lua} -- alternative
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
5000221.2484202
0.277948
```

### Scripts without pre-defined configs

A range of operating system commands can be executed in one-liners try the following (execute from the line with `alt+/` or `opt+/`.
The result can be immediately removed with just a down arrow then `alt+/` or `opt+/' ):

`help`
`dir` //show hover-exec folder contents
`dir %c` //show current folder contents
`dir %p` //show temp folder contents
`findstr /?` //show findstr help

The following example does not use any predefined configs, just an operating system command with %f standing for the temp file name. The default %f ext is `.txt`, but this can be changed by appending the desired ext as in this `lua51` example - most programs will need a specific ext to run. Note that the temp files are saved in the standard vscode temp files location. They can be opened in vscode by clicking on [last script] or [last result] in the hover display.

```echo 'hello' && lua "%f.lua" && echo 'goodbye'
-- echo 'echo' && lua "%f.lua"
print("no seed: "..math.random(100))
math.randomseed(os.time())
print("os.time() as seed: "..math.random(100))
```
```output
hello
no seed: 85
os.time() as seed: 17
goodbye
```

---
### Bash or zsh

Use `zsh` to run zsh

---
```zsh {cmd}
 # zsh {cmd} //{..} is just for mpe
pwd
```

```bash {cmd}
 # bash {cmd}
pwd
ls -l
```

---
### Gnuplot
Also works in *mpe*

```gnuplot {cmd}
 #gnuplot {cmd}
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
//js :vm //or just 'js'   -- not available in mpe
let abc="abcde"
let a='hello variable world';
alert(a) //nb. alert is not available in node
a='goodbye'
vscode.window.showInformationMessage(a) //not available in node
eval('let a=3;2*a*Math.random()')=>> 4.9817317002033175
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>> hello 1.7102252784164906
process.cwd() =>> /Users/kellycogan/Documents/GitHub/hover-exec
console.log(abc)
```
```output
goodbye 0.07262104286720183
abcde
```

---
### Javascript using node
Run a server on localhost ([click here after running it](http://127.0.0.1:1337))
Also works in *markdown preview enhanced*, (ie. *mpe*)

```js {cmd=node} :node
//js :node {cmd=node} -- works in mpe
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World at last!\n');
}).listen(1337, "127.0.0.1");
```
Note. If there is an EACCESS error in windows, use 'net stop winnat' and then 'net start winnat' in an admin terminal.

To kill the server use `pwsh` (see the comments below), also in *mpe*

```zsh
 # zsh server usually killed on 'cancel'
 # to check, exec once & look for pid to kill (line TCP 127.0.0.1:1337)
 # then enter pid in kill statement below and exec again
kill 49845
netstat -an
```

---
### More vm, eval and node examples
Various time and date functions using `vm`

```js      //time & date using internal javascript via vm
//js      //time & date using internal javascript via vm - not in *mpe*
(44-Math.random())=>>43.47462974431822
//show information message via vscode api
progress('Hello whole World',4000)
new Date().toISOString().slice(0,10)=>>2021-12-13
new Date().toLocaleDateString()=>>12/13/2021
new Date().toString()=>>Mon Dec 13 2021 15:38:16 GMT+1300 (New Zealand Daylight Time)
new Date().toLocaleString()=>>12/13/2021, 3:38:16 PM
new Date().getTime()=>>1639363096764
```

---
Time and date using node

```js {cmd=node} :node  //through nodejs
//js {cmd=node} :node  //through nodejs
a=44
// in-line results are calculated but not output in mpe
// 'answer='+(a-Math.random()) =>> 
new Date().getTime()=>>1639363113358
console.log(new Date().toISOString().slice(0, 10))
console.log(new Date().toLocaleDateString())
```
```output
2021-12-13
12/13/2021
```

---
## More examples

### Octave
Use `octave` or `python:octave` to run octave. Using 'python' as the command id provides syntax highlighting, adding :octave uses octave. The {...} is for *markdown preview enhanced* 

```python:octave
 # python:octave
 # python gets syntax highlighter
 # nb. need mat2str or num2str for numeric output
num2str(7.1+rand(1))  =>>7.9624
'hello world in-line'  =>>hello world in-line
pwd()  =>>/Users/kellycogan/Documents/GitHub/hover-exec
disp('hello world in output section!')
```
```output
hello world in output section!
```

---
### Scilab
Use `scilab` to run scilab, or `js :scilab` for some quick and dirty syntax highlighting

```js {cmd=scilab} :scilabcli
//js {cmd=scilab} :scilab -- {cmd..} is for mpe
//need to use 'string()' for numeric output
mprintf('%s\n',pwd())
rand("seed",getdate('s')); //set new random sequence
string(rand())+', '+string(rand())   =>>0.1243828, 0.566921
mprintf('%s',string(rand()))
```
```output
/Users/kellycogan/Documents/GitHub/hover-exec
0.4238979
```

---
### Python
Use `python` to run python. `python3` can be used if that is the python repl start command

```python {cmd}
 #python {cmd}  # {cmd} is for markdown preview enhanced
import os
from random import random
 # the in-line results are effectively commented out for mpe
os.getcwd() =>>/Users/kellycogan/Documents/GitHub/hover-exec
45-2+random() =>>43.52567872735789
print('hello world '+str(3*random()+1))
```
```output
hello world 2.030820793452872
```


---
In the following example, `{matplotlib=true}` will plot graphs inline in *markdown preview enhanced*. In *hover-exec* they are plotted in a separate window (and can be 'pasted' in using the `paste image` vscode extension) If you also use *markdown memo* the image link can be changed to the wiki form `[[...]]` and viewed on hover.

```python {cmd matplotlib=true}
  #python {cmd matplotlib=true}
import numpy as np
import matplotlib.pyplot as plt
randnums= np.random.randint(1,101,500)
plt.plot(randnums)
plt.show()
```

Image from running the above codeblock and pasting via *Markdown kit*:
![[media/READMORE_matplotlib example.png]]

---
```python {cmd} # endless plot
 # python {cmd} -- {cmd} is for mpe
import matplotlib.pyplot as plt
import pyformulas as pf
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
 # cancel, then close plot
```


---
### Julia
Julia also works in *mpe*

```julia {cmd}
 # julia {cmd}  # works in mpe
using LinearAlgebra, Statistics, Compat
pwd()  # =>>/Users/kellycogan/Documents/GitHub/hover-exec
a=rand(Float64,3);
a         # =>>[0.04107204683389565, 0.5769109470477194, 0.23529338206704709]
b=a;b[2]=42;        # nb. arrays are shallow copied
a         # =>>[0.04107204683389565, 42.0, 0.23529338206704709]
b         # =>>[0.04107204683389565, 42.0, 0.23529338206704709]
println(string("a=",a))
```
```output
a=[0.04107204683389565, 42.0, 0.23529338206704709]
```

---
### Gnuplot

Gnuplot is a very useful stand-alone plotting facility. It is particularly useful for *hover-exec* because all the scripting languages can output gnuplot commands along with data in the output block and it can be immediatedly plotted.

Use `gnuplot` to run *gnuplot* - note that data bracketed by #tag_speed is used 'in here' (see later in this file, and the backtick quotes are required when the tag is referred to).

```gnuplot #after exec plot may be hidden - use cmd+tab
#inhere `#tag_speed`  # hover to view the data
set logscale x
plot "$speed" w lp title "speed"
```

---
### Html and in-browser javascript
In browser javascript can be used
The following three examples are from the [js1k demos](https://js1k.com/).

```open "%f.html"   <!--*what am I going to do now* tunnel-->
<!-- html  --*what am I going to do now* tunnel-->
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

```open "%f.html" //psychedelic
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

```open "%f.html" //breathing galaxies
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
### Random strings in javascript

```js {cmd=node} :node //works in mpe
//js {cmd=node} :node //works in mpe
//random string generation see https://gist.github.com/6174/6062387
a=Math.random().toString(36).substring(2, 15)
a =>>fkif1kwmwrt
a=[...Array(60)].map(_=>(Math.random()*36|0).toString(36)).join``
a =>>ilv45y6whytjxdrmfthyblwtsuzr3tcf81yntbr0o74toqfmn8g25sb0xxfn
a=[...Array(30)].map(_=>((Math.random()*26+10)|0).toString(36)).join``
a =>>puapmaciadoztfppmttleubzkbityr
console.log(a)
Math.random(36).toString(36).substring(2,3) =>>9
```

---
```js {cmd=node} :node //string jumbler, works in mpe
//js {cmd=node} :node //string jumbler, works in mpe
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
```js {cmd=node} :node //generate random string
//js {cmd=node} :node //generate random string
function randch(n){
  return ''+Math.random().toString(36).substring(2,2+n)
}
randch(36) =>>fvg68qg9ifi
console.log(randch(36))
```

---
### Regular expression test and usage

```js //javascript regex tester using vm
//js //javascript regex tester (use node for mpe)
// if not using md preview enhanced, use = >> instead of // = (less faint)
"xys {cmd='js'} th".replace(/.*cmd=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'') =>>js
Math.random()*100   =>>99.00164520102285
```

---

```js {cmd=node} :node //javascript regex tester using node
//js {cmd=node} :node //javascript regex tester
'abcdefg'.replace(/^.*(bc)/,'$1Baa') =>>bcBaadefg
Math.random()*100   =>>49.43697507541165
console.log(Math.random()*100) //this for *mpe*
```
```output
63.21400421173333
```

---
another regex example

```js:node
//js:node
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

---
### Go
Using go as a 'scripting language'
If just installed before running this test, restart vscode first 

```go
//go
package main
import "fmt"
func main() {
    var a[5] int
    fmt.Println("emp:", a)
    a[4] = 42
    fmt.Println("set:", a)
    fmt.Println("get:", a[4])
    fmt.Println("len:", len(a))
    b := [5] int {1,2,3,4,5}
    fmt.Println("dcl:", b)
    var twoD [2] [3] int
    for i := 0; i < 2; i++ {
        for j := 0; j < 3; j++ {
            twoD[i][j] = i + j
        }
    }
    fmt.Println("2d: ", twoD)
}
```
```output
emp: [0 0 0 0 0]
set: [0 0 0 0 42]
get: 42
len: 5
dcl: [1 2 3 4 5]
2d:  [[0 1 2] [1 2 3]]
```

---
### Vitamin b12, dosage vs uptake

```js   //using 'vm' for getting input (top of vscode screen)
//js   //using 'vm' for getting input
let d=await input('dosage ug?')/1 // /1 converts to number, also note 'await'
let u=1.5*d/(d+1.5)+(1-1.5/(d+1.5))*0.009*d
' uptake='+u  =>> uptake=23.98560863481911
console.log('for dosage',d,'ug, uptake=',u,'ug')
```
```output
for dosage 2500 ug, uptake= 23.98560863481911 ug
```

---
### Chaining execution codeblocks

Here a javascript codeblock produces output in the form of an `output:gnuplot` codeblock. This block is labelled as an `output` and so will be replaced if the javascript is executed again. Because it is also labelled with `:gnuplot' it can be directly executed in the usual ways to produce the plot.

```js
// js
function xrange(){
   let x1=_.range(0,6.1,6/19);
   let x=math.round(math.exp(math.multiply(x1,math.log(10))));
   return x
}
let x=xrange();
let j=0,n=0,ii=0;
let tim=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
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
1 0.3225806451612903
2 1.3793103448275863
4 2.857142857142857
9 5.625
18 10.285714285714286
38 15.833333333333334
78 21.36986301369863
162 23.142857142857146
336 28.000000000000004
695 28.958333333333332
1438 30.27368421052631
2976 30.83937823834197
6158 32.07291666666667
12743 32.017587939698494
26367 31.767469879518075
54556 30.1414364640884
112884 30.38600269179004
233572 26.068303571428576
483293 29.361664641555283
1000000 30.344409042633895
EOD
#tag_speed
set logscale x
plot "$speed" w lp title "speed"
```

---
## Running other programs
Here are a couple of very simple examples for sending the contents of a codeblock to other applications. These examples do not use any predefined configs. The apps here are not scripting engines and will **not** send changed text back to the codeblock - changed content will need to be saved in the file system in the normal way.

```open -e "%f.txt"
# this is a test
This will now open in TextEdit
```
```open -a safari "%f.html"
<h1>This is a test</h1>
<a href='https://whatamigoingtodonow.net'>Test link</a>
```

---
## One-liners

*One-liners* starting and ending with single backticks will simply be executed on click, and usually do not produce output back into the editor. Pre-defined variables (`%c` current folder, `%e` current file pathname, `%f` temp file pathname, `%p` temp files path, `%n` temp file name) can be used in the line (and the default `.txt` extension can be changed by appending, for example, `.ext` to the variable). Notes/comments can be added after the closing quote:

### One-liners examples
NB. Note only *single* backticks for one-liners, but still must begin in col 1.

`open -a calculator` //open a calculator
`man open` //manual entry for open
`open '/Applications'`
`open ~`            //open home
`open '%p'`         //open temp folder in finder
`open -e README.md` //in texteditor
`open -e '%f.py'`   //exec texteditor with temp file `temp.py`
`open -e '%f.py.out.txt'`  //& with temp output file (temp.txt.out.txt)

### Quickmath examples

Another useful *hover-exec* facility is *quickmath*. A math expression of the form `5-sqrt(2)=` anywhere will be evaluated on hover and the result will be shown immediately  in the hover message. Clicking the hover result will copy it to the clipboard. Note that the expression is surrounded by single backticks (backticks are the norm for *hover-exec*), and there needs to be `=` before the last backtick (essentially to stop popups for other backtick quoted strings).

A few more *quickmath* expressions: `254cm in inches=` will show 100inches in the hover message,  `[1,2,3,4]*5=`,  `cos(45deg)=`,  `sin(0.81)^2+cos(0.81)^2=`,  `cos(pi/2)=`,  `sin([10,45,90] deg)=`,  `range(0,4,0.5)=`,  `(2+2i)*(1+2i)=` , `3:6=`, `1:0.1:5=`.

More information can be fount at [*mathjs 'math.evaluate'*](https://mathjs.org/docs/reference/functions/evaluate.html).

---
### Mac system information
show hardware information
`system_profiler SPHardwareDataType`

show firewall information
`system_profiler SPFirewallDataType`

show all possible profiler datatypes:
`system_profiler -listDataTypes`

---
### html & javascript

`open -a safari %cHover-exec.gif` //chrome with media or html file - can use %c etc in one-liners
`open 'https://whatamigoingtodonow.net/'` //browser with url
`safari <h1 align='center' >this: %c</h1><br><h3 align='center' >or this: /%c</h3>`
`js console.log(7*7-7)`
`vm progress(''+(7*7-7),4000)`  //quick calculator output via 4sec message

---
### audio one-liners

`safari <h2>French nuclear test<br>Recorded in New Zealand 1996</h2>Played much faster than real time<br><audio id="a2" controls autoplay src="media/fnt2b.mp3"/>`
`open -a 'Quicktime Player' "%cmedia/fnt2b.mp3"`
`afplay "%cmedia/fnt2b.mp3"`


---
## inhere - including tagged sections

The following line in a code block
```
#inhere `#tag_speed`
```
will include a group of lines surrounded with the #tag-speed tag. To see what will be included, hover over the tag in the `inhere` line. Note that:
1. Tags must either stand alone in a line, or end the line (eg. tags can have comment markers in front of them)
2. Within the `#inhere` line, the tag must be surrounded with backticks (*hover-exec* uses back-ticks to indicate potential hovers)
3. To include lines from another file use the format
   #inhere file_path/name `#tag`
   (the file path can include `%c` current folder, or `%p` temp files folder):

Example of #inhere use
(on execution, plot may be behind editor, use cmd+tab):
```gnuplot
$speed <<EOD
#inhere %ctest/misc_tests.md `#p1`
EOD
set logscale x
plot "$speed" w lp title "speed"
```

---
### Using repl scripts

Scripts can also be run using the REPL version of the scripting engine. The following REPLs are included in the default configuration:

`js console.log(Object.keys(config.get('repls')).sort())`
```output
[
  'julia',  'lua',
  'lua51',  'lua54',
  'node',   'octave',
  'python', 'python3',
  'r',      'rterm',
  'scilab', 'scilabcli'
]
```

The indication to *hover-exec* that the REPL should be used is to append a second colon. In other words, the command line looks like `id:command:`  Optionally, after the second colon, `restart` can be appended to indicate that the REPL should be restarted.

```python::restart  # restart resets the python REPL
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
0.3452761173248291
```

```python::  # this will continue from the last with variable and functions intact
from time import time
b=b+1
b=>>6000603
"time from the restart",time()-t
b # this now produces output because the repl is being used
```
```output
('time from the restart', 12.551424980163574)
6000603
```

Note that the REPLs often don't need 'print' or its equivalent.

See [misc_tests](test/misc_tests.md) for test code for all included REPLs.

---
## Configuration settings

The startup commands for scripts included by default are as follows (nb. `%f` provides the appropriate temporary file path & name, and the notation `%f.py`, for example, indicates that the temporary file extension `.py` should be used - the default is `.txt` ):

```js
sort=o=>Object.keys(o).sort().reduce((r, k)=>(r[k]=o[k],r),{});
console.log(sort(config.get('scripts')));
```
```output
{
  bash: 'bash "%f.sh"',
  buddvs: 'buddvs "%f.txt" ',
  chrome: 'google-chrome-stable "%f.html"',
  eval: 'eval',
  firefox: 'firefox "%f.html"',
  gnuplot: 'gnuplot -p -c "%f.gp"',
  go: 'go run "%f.go"',
  html: '"%f.html"',
  javascript: 'node "%f.js"',
  js: 'vm',
  julia: '/Applications/Julia-1.6.app/Contents/Resources/julia/bin/julia "%f.jl"',
  juliamac: '/Applications/Julia-1.6.app/Contents/Resources/julia/bin/julia "%f.jl"',
  lua: 'lua "%f.lua"',
  lua51: 'lua51 "%f.lua"',
  lua54: 'lua54 "%f.lua"',
  matlab: 'matlab -sd %p.m -batch temp',
  matlab_comment: 'if %p.m needs to be "%p.m" then add /, ie. "%p.m/" ',
  node: 'node "%f.js"',
  octave: '/Applications/Octave-6.2.0.app/Contents/Resources/usr/bin/octave-octave-app@6.0.90 --no-gui "%f.m"',
  pascal: 'fpc "%f.pas" -v0 && "%ptemp" ',
  pwsh: 'pwsh -f "%f.ps1"',
  python: 'python "%f.py"',
  python3: 'python3 "%f.py"',
  r: 'r "%f.r" ',
  rterm: 'rterm -q --no-echo -f "%f.r" ',
  safari: 'open -a safari "%f.html"',
  scilab: 'scilex -quit -nb -f "%f.sci" ',
  scilabcli: '/Applications/scilab-6.1.1.app/Contents/bin/scilab-cli -quit -nb -f "%f.sci" ',
  streamlit: 'streamlit run "%f.py" ',
  test: 'test -c "%f.tst"',
  vm: 'vm',
  zsh: 'zsh -f "%f.sh"'
}
```

Any of these can be changed to suit the system in use using vscode `settings` under the `hover-exec` extension.

Also note that there is no actual requirement to include a script startup command in the configuration file for the script to be used - they just make the code block command simpler.

Basically if the command works in the terminal (using the full file name of course), and returns output to the terminal, then it will work with a code block as a *hover-exec* command  (use "quotes" if there are spaces in the file path).

```echo 'hello' && lua "%f.lua" && echo 'goodbye'
-- echo 'echo' && lua "%f.lua"
print("no seed: "..math.random(100))
math.randomseed(os.time())
print("os.time() as seed: "..math.random(100))
```

```open -a safari "%f.html"
<h1>This is a test</h1>
<a href='https://whatamigoingtodonow.net'>Test link</a>
```

`man open` //manual entry for 'open' command


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
let s={"python":"python \"%f.py\""}; //{"id":"start command"}
//s={"python":undefined}; //uncomment this to undefine python
let scripts=config.get('scripts');
let merge=Object.assign({},scripts,s);
if(await config.update('scripts',merge,1)){}
console.log('new config:',config.get('scripts.python'))
```

The first line shows the python config. So the start command is `python %f.py`. A basic check is if command line python should run when this command is run in a terminal (minus the `%f.py`).

#### Add new script language

If there is a need to add a new scripting language, say `newlang`, this can be done using the settings configuration for *hover-exec*, and following the obvious patterns.

It can also be done using `vm` or `eval` since the *vscode* configuration settings can be accessed with the scripts.

First write a fenced codeblock labelled newlang with the appropriate command - if this is done correctly the code block should execute in the new script

```newlang '%f.nu'
-- a newlang comment line, click [config] in hover
print(3-2)
```

Second, hover over the new id and click '[config]' in the hover message, this will produce:

```js :vm noInline
//this script can change, add or undefine a config setting
let s={"newlang":"newlang %f.nu"}; //{"id":"start command"}
//s={"newlang":undefined}; //uncomment this to undefine newlang
let scripts=config.get('scripts');
let merge=Object.assign({},scripts,s);
if(await config.update('scripts',merge,1)){}
console.log('new config:',config.get('scripts.newlang'))
```

The first line provides the new setting command which can be changed here if necessary. Make sure the the extension after %f is appropriate. If backslashes are used in a path, they should be escaped, ie. `\\`. Similarly if `"` is used it should be entered as `\"`

Once the script has been set up, execute using the hover in the usual way, then delete the block. Check it as in the previous section or open *hover-exec* settings and view the JSON settings file.

---
#### Other vscode config settings

Other *vscode* configuration settings can also be accessed:

```js :vm noinline
//js :vm noinline  --eval is not available in mpe
let c=vscode.workspace.getConfiguration('');
console.log("editor font size= "+c.get("editor.fontSize"))
//c.update("editor.fontSize",12,1) //to change it
```

---
## Known Issues

This is a beta version.

Note that in all scripting languages included, except *js:vm* and *js:eval* which allow definition of *global* variables and functions, the script starts from scratch when the code block is executed. In other words, assigned variables do not carry over into the next script execution. This kind of approach is best suited for small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages. To help with this there is also an *include* capability, known as `#inhere` (to distinguish from *includes* in scripts) - see [inhere](#inhere---including-tagged-sections).

However scripts can also be run using their REPL version, if this is available - eg. for node, lua, octave, scilab, r, julia - see the [READMORE](READMORE.md), or [misc_tests](test/misc_tests.md). For REPLs, successive script execution will recognise previously defined variables and functions. 


---
## Release Notes

Initial beta release was 0.6.1
Published using: vsce package/publish
