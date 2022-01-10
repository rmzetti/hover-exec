# Hover-exec README

This is the README for VS Code extension *hover-exec*. For more detail, [READMORE](READMORE.md). Some of the examples here are Windows specific - for mac and linux/wsl see [README_mac](README_mac.md) or [README_wsl](README_wsl.md).

- [Hover-exec](#hover-exec)
  - [Features](#features)
  - [Basic hover-exec](#basic-hover-exec)
  - [Javascript scripts](#javascript-scripts)
    - [Examples using `vm` and `eval`](#examples-using-vm-and-eval)
    - [Available functions in `vm` and `eval`](#available-functions-in-vm-and-eval)
    - [Using require & globals with vm and eval](#using-require--globals-with-vm-and-eval)
  - [Other scripts](#other-scripts)
    - [Scripts with command execution strings included](#scripts-with-command-execution-strings-included)
    - [nodejs](#nodejs)
    - [lua](#lua)
    - [python](#python)
    - [scilab](#scilab)
    - [julia](#julia)
    - [powershell](#powershell)
    - [gnuplot](#gnuplot)
    - [Html](#html)
  - [One-liners and quickmath](#one-liners-and-quickmath)
    - [One-liner and quickmath examples:](#one-liner-and-quickmath-examples)
  - [Configuration settings](#configuration-settings)
  - [Known Issues](#known-issues)
  - [Release Notes](#release-notes)

## Features

*Hover-exec* facilitates execution from within the editor of markdown code blocks in a variety of installed script languages. This is by no means intended as a replacement for the superb vscode notebooks. Instead it simply offers the opportunity, when working with markdown docs, to include 'live' calculations, results, code samples, comparisons and useful links, using a range of possible scripts.

The *hover-exec* extension is activated when a markdown file is opened in the editor.

Hover script exec in action:
  ![](https://raw.githubusercontent.com/rmzetti/hover-exec/master/Hover-exec.gif)
  ![](Hover-exec.gif)

---
## Basic hover-exec 
Hovering over lines starting with ` ``` `  (or lines which start with a single backtick and include an end backtick) will trigger a hover message with an *exec* command as the bottom line, as in the *gif* above. Hovering over ` ``` ` at the end of a block will trigger the message for the start of the block. Clicking the command link on the bottom line of the hover message (or using the shortcut `Alt+/` or `Opt+/` with the cursor anywhere in the block) will execute the code in the code block, and produce output.

---
## Javascript scripts

Javascript code blocks can be executed using the `vm` module, also by using *vscode*'s built in `eval` - and also through [nodejs](#nodejs). The default (command blocks with id `js` ) is to use the `vm` module, `hover-exec` provides, by default, a reasonably substantial `vm context`.

### Examples using `vm` and `eval`

```js  //click this line in the *hover* to execute the block
//js  //this comment is to show the command line in markdown previews
//    //the default for the `js` command is to execute using the `vm` module
console.log("Notice the in-line random number result ")
'test: '+Math.random() =>>test: 0.36573939503551367
```
```output
Notice the in-line random number result
```

Intermediate results can be viewed in line, as above, by appending `=>>` instead of using `console.log()` . Other results are produced in an `output` block. Hovering over `output` provides options *output to text* or *delete*. Using the shortcut `Alt+/` or `Opt+/` with the cursor in the `output` block deletes the block.

---
A couple more examples using `vm`, showing use of *vscode* api functions and some extra functions published by `hover-exec` (eg. `alert`)

```js  //using javascript vm various examples
//js //using javascript vm, various examples
let abc="hello, world 3"
alert(abc) //not available in nodejs scripts
let a='goodbye world'
vscode.window.showInformationMessage(a) //not available in node scripts
let b=3;
2*b*Math.random() =>>3.8977679442468744
eval('let b=3; 2*b*Math.random()')=>>1.2127535482472327
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>>hello 1.5258921831663654
process.cwd() =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
console.log(abc)
```
```output
goodbye world 0.9176600571282423
hello, world 3
```

---
```js  //javascript regex tester
//js  //javascript regex tester
'abcdefg'.replace(/^.*(bc)/,'$1--') =>>bc--defg
```

---
All the codeblocks above can be executed using `eval` instead of `vm`, eg.

```js :eval // javascript regex tester using eval
//js :eval // javascript regex tester using eval
'abcdefg'.replace(/^.*(bcde)/,'$1--') =>> bcde--fg
```

The difference is that `vm` scripts are executed within a more restricted *context* (see next section).

In the command line (eg. above), using `js` for the codeblock id produces javascript syntax highlighting (it's a quick and dirty approach to provide basic syntax highlighting for a range of scripts), then adding ` :node` sets the actual exec command to `node`.

Note that `vm` and `eval` both allow the internal *vscode* API to be used. Installation of `nodejs` is not required for `vm` or `eval` scripts to execute.

---
### Available functions in `vm` and `eval`

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
- math: access to `mathjs` objects (no need to `require('mathjs')`)
- moment: access to `moment` objects (no need to `require('moment')`)
- _ : access to `lodash` objects (no need to `require('lodash')`)

See [READMORE](READMORE.md) for information on restricting or enlarging the vm context.

---
### Using require & globals with vm and eval

Moment, lodash (_) and mathjs (math) are available by default in both `vm` and `eval`.

When using `vm`, function and variable definitions persist across `vm` scripts during the session. A function or variable can be also set as global (eg. `global.a=a;` see examples below) in either `vm` or `eval`, and is then available during the session in both. A global can be removed using, eg. `delete global.a;`

```js //using lodash, mathjs and process in vm
//js //using lodash, mathjs and process in vm
function xrange(){
   let x1=_.range(0,6.1,6/10);
   let x=math.round(math.exp(math.multiply(x1,math.log(10))));
   return x
}
xrange()=>>1,4,16,63,251,1000,3981,15849,63096,251189,1000000
let cd=process.cwd().replace(/\\/g,'/'); //current directory using '/'
cd =>>c:/Users/ralph/OneDrive/Documents/GitHub/hover-exec
```

```js //declare a global function for eval
//js //declare a global function (not needed if just using vm scripts)
f=global.f=function(m){return 'the meaning of life is '+m;};
f(44-2)=>>the meaning of life is 42
```

```js:eval //use the global function (can be used in both *eval* & *vm*)
//js:eval //use the global function (can be used in both *eval* & *vm*)
f(42)=>> the meaning of life is 42
```

See [READMORE](READMORE.md) for more information and examples.

---
### Using nodejs

The `js:node` command executes a javascript code block in `nodejs` (assuming that is installed). 

```js :node
//js :node
console.log('  test using node:\n  '+Math.random())
console.log('  Note: hover-exec on ```output line`, or alt+/ (opt+/) with\n',
    ' the cursor in the output block will delete the output block')
```

---
## Other scripts

### Scripts with command execution strings included

Command lines to conveniently start a number of scripts are included (see [Configuration settings](#configuration-settings) near the end of this `README` for the actual commands):

- vm (vm script, with vscode api included in context)
- eval (built-in javascript, with vscode api available)
- javascript (via node)
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
- The script language (eg `julia`, `nodejs` ..) needs to have been installed
- Some of the commands to run the scripts ***may need customising*** to suit your particular installation - see [Configuration settings](#configuration-settings) below.
- Other script languages may be added. And as an alternative to the standard *vscode* method for changing extension settings, this can also done with `eval` - see the [READMORE](READMORE.md) for examples.

---
### lua

```lua  -- say hello & goodbye
--lua :lua54 -- 'lua' id specifies syntax highlight and default start command
--                    adding ':lua54' would mean use 'lua54' as start command
'hello ' .. 44-2+math.random() =>>hello 42.241483537274
"& goodbye " .. math.pi+math.random() =>>& goodbye 3.3889110656656
print("lua ok") -- this outputs in the output code block below
```
```output
lua ok
```

---
### python

```python
 #python :python3 # adding ':python3' would use 'python3' as start command
from random import random
45-2+random()       #  =>>43.270598821975966
'hello, world 3!'       #  =>>hello, world 3!
print('python ok')
```
```output
python ok
```

Note that the inline indicator `=>>` has been prefixed by a python comment character `#` (only spaces allowed after) so that *markdown preview enhanced* will execute the code. *hover-exec* will still update the in-line output, but *mpe*, of course, will not.

---
### scilab

```js :scilab 
//js :scilab //using js :scilab provides quick & dirty (js) syntax highlight
                //nb. scilab needs to use 'string()' for inline numeric output (uses mprintf)
rand("seed",getdate('s')); //set new random sequence
mprintf('%s\n','test '+string(rand())+' '+pwd());
string(rand())+' '+pwd() =>>0.1805917 c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
string(rand()) =>>0.0540289
//disp('disp puts quotes around strings',rand())
```
```output
test 0.9880022 c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
```

---
### julia

```julia
  #julia
using LinearAlgebra, Statistics, Compat
a=rand(Float64,3);
a   # =>>[0.11769825733706418, 0.7403917922998082, 0.27895554485022145]
b=a;b[2]=42;                                   # arrays are shallow copied
println(string("a=",a,"\n","b=",b))  # double quotes only for julia strings
```
```output
a=[0.11769825733706418, 42.0, 0.27895554485022145]
b=[0.11769825733706418, 42.0, 0.27895554485022145]
```

---
### zsh

```zsh // show current directory
 #zsh // show current directory
pwd
```  

---
### powershell

```pwsh
  # pwsh // random number, show current directory.
  # $PSStyle.OutputRendering = 'PlainText' # stops color codes appearing in output
Get-Random -Min 0.0 -Max 1.0 # =>>0.230122082973887
pwd
```

---
### gnuplot

Gnuplot is a very useful stand-alone plotting facility.
When using *hover-exec* all scripts can output gnuplot commands along with data in the output block and it can be immediatedly plotted (see the  [READMORE](READMORE.md)).

```gnuplot
 #gnuplot
$charge << EOD
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
![[2021-08-31-20-28-22.png]]  (this 'wiki' type link is enabled using *markdown memo*)

 The above is a *png* file created (using the *paste image* extension) from a screen copy of the plot window.

---
### Html

```html // all the html is in the codeblock below
<!-- for mac use html :safari - for wsl use html :chrome - for linux use html :firefox -->
<!-- tunnel *what am I going to do now*  -->
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

---
## One-liners and quickmath

*One-liners* starting with a single backtick *in column 1* and ending with a single backtick can also be executed on hover-click. The pre-defined variables %c current folder, %f temp file full path+name, %p temp file path, %n temp file name can be used (the derived path will be seen in the hover). Comments can be added after the closing quote.

Another useful facility is *quickmath*. A math expression of the form `5-sqrt(2)=` (does not need to start in column 1) will be evaluated on hover (using *mathjs* `math.evaluate(..)`) and the result will be shown immediately  in the hover message. Clicking the hover result will copy it to the clipboard. Note that the expression is surrounded by single backticks, and there needs to be `=` before the last backtick (essentially to stop popups for other quoted strings).

---
### One-liner and quickmath examples:

exec notepad with file in current folder:
`open -a textedit %cREADME.md`  mac
`notepad %cREADME.md`  windows
`gedit %cREADME.md`  linux/wsl
`xedit %cREADME.md`  linux/wsl

exec notepad with temp file (%f):
`open -a textedit %f`  mac
`notepad %f`  windows
`gedit %f`  linux/wsl

open another instance of vscode:
`code -n %f`

explore files, view folders:
`open -a finder ~`  mac 'home'
`open -a finder %c`  mac to view current folder
`explorer ,`  windows view 'ThisPC'
`explorer /select, %cREADME.md`  windows view current folder & select file
`nemo %cREADME.md`  Linux mint view current folder & select file

other examples:
`devmgmt.msc` for windows show devices
`system_profiler SPHardwareDataType` for mac show hardware info
`html <script>location.href= 'https://whatamigoingtodonow.net/'</script>`  windows default browser with href
`html <h1>Hello world!</h1>` windows default browser with some html
`safari <script>location.href= 'https://whatamigoingtodonow.net/'</script>`  mac safari with href
`safari <h1>Hello world!</h1>` mac safari with some html
`firefox <script>location.href= 'https://whatamigoingtodonow.net/'</script>`  linux firefox with href
`firefox <h1>Hello world!</h1>` linux firefox with some html
`chrome <script>location.href= 'https://whatamigoingtodonow.net/'</script>`  wsl chrome with href


And finally, some *quickmath* expressions: `254cm in inches=` will show 100 inches in the hover message (using [*mathjs 'math.evaluate'*](https://mathjs.org/docs/reference/functions/evaluate.html)),  `[1,2,3,4]*5=`,  `cos(45deg)=`,  `sin(0.81)^2+cos(0.81)^2=`,  `cos(pi/2)=`,  `sin([10,45,90] deg)=`,  `range(0,4,0.5)=`,  `(2+2i)*(1+2i)=` , `3:6=`, `1:0.1:5=`, `7*7-7=` .
NB. Copy answer to clipboard with a click.

---
## Configuration settings

The startup commands for scripts included are as follows
nb. `%f` provides the appropriate temporary file path & name
      the notation `%f.py`, for example, indicates that extension `.py` should be used - default is `.txt` :

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
  julia: 'julia "%f.jl"',
  juliamac: '/Applications/Julia-1.6.app/Contents/Resources/julia/bin/julia "%f.jl"',
  lua: 'lua "%f.lua"',
  lua54: 'lua54 "%f.lua"',
  matlab: 'matlab -nodesktop -sd "%p.m/" -batch temp',
  node: 'node "%f.js"',
  octave: 'octave "%f.m"',
  pascal: 'fpc "%f.pas" -v0 && "%ptemp" ',
  pwsh: 'set "NO_COLOR=1" & pwsh -f "%f.ps1" ',
  python: 'python "%f.py"',
  python3: 'python3 "%f.py"',
  r: 'r "%f.r" ',
  rterm: 'rterm -q --no-echo -f "%f.r" ',
  safari: 'open -a safari "%f.html"',
  scilab: 'scilex -quit -nb -f "%f.sci" ',
  scilabcli: 'scilab-cli -quit -nb -f "%f.sci" ',
  streamlit: 'streamlit run "%f.py" ',
  test: 'test -c "%f.tst"',
  vm: 'vm',
  zsh: 'zsh -f "%f.sh"'
}
```

Any of these can be changed to suit the system in use using vscode `settings` under the `hover-exec` extension.

Also note that there is no actual requirement to include a script startup command in the configuration file for the script to be used - they just make the code block command simpler.

Basically if the command works in the terminal (using the full file name of course), and returns output to the terminal, then it will work as a *hover-exec* command  (use "double quotes" if there are spaces in the file path).

For example, on windows, *hover-exec* will run the following script as a `cmd.exe` `.bat` file, because `.bat` files autostart `cmd.exe` :

```%f.bat //demo cmd execution (windows) without script setup
@echo off
dir *.json
echo Congratulations! Your first batch file was executed successfully.
```

On macos
```open -a textedit "%f.txt"
This text can be viewed in the text editor
and saved as required -
changes will not be reflected back into this code block.
```

On linux/wsl
```xedit %f.txt
This text can be viewed in the text editor
and saved as required -
changes will not be reflected back into this code block.
```

There is also a set of strings called `swappers` which enable moving the output of a line so that it appears *in-line*, within the code block itself. Check the  [READMORE](READMORE.md) and files in [test](test) for more info and examples.

---
## Notes and Known Issues

This is a beta version.

Note that in all the demos above, except *js:vm* and *js:eval* which allow definition of *global* variables and functions, the script starts from scratch when the code block is executed. In other words, assigned variables do not carry over into the next script execution. This kind of approach is best suited for small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages.

Scripts can also be run using their REPL version, if this is available - eg. for node, lua, octave, scilab, r, julia - see the [READMORE](READMORE.md), or [misc_tests](test/misc_tests.md). For REPLs, successive script execution will recognise previously defined variables and functions.

There is also an *include* capability, known as `#inhere` (to distinguish from *includes* in scripts) - see the [READMORE](READMORE.md) for details and examples.

Matlab takes a substantial amount of time to run from codeblock exec (ie. the startup time for matlab to run a 'batch file' is about 5s on a Ryzen laptop). Although this is a Matlab startup issue, it undermines the use of `matlab` within `hover-exec`. Also I haven't been able to get a MATLAB based REPL working (unlike, for example, Octave, which is fairly strightforward.)

The startup times for other included scripts are generally fairly minimal (see the demo gif above). 

---
## Release Notes

Initial beta release was 0.6.1
Published using: vsce package/publish
