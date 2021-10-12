# Hover-exec

This is the README for VS Code extension *hover-exec*. For more detail, [READMORE](READMORE.md).


- [Hover-exec](#hover-exec)
  - [Features](#features)
  - [Basic hover-exec](#basic-hover-exec)
    - [Using vm and eval](#using-vm-and-eval)
    - [available functions in `vm` and `eval`](#available-functions-in-vm-and-eval)
    - [using require and globals with vm and eval](#using-require-and-globals-with-vm-and-eval)
    - [Scripts with default command lines](#scripts-with-default-command-lines)
  - [Some examples](#some-examples)
    - [nodejs](#nodejs)
    - [lua](#lua)
    - [python](#python)
    - [julia](#julia)
    - [powershell](#powershell)
    - [gnuplot](#gnuplot)
    - [scilab](#scilab)
  - [One-liners](#one-liners)
    - [One-liner examples:](#one-liner-examples)
  - [Configuration settings](#configuration-settings)
  - [Known Issues](#known-issues)
  - [Release Notes](#release-notes)

## Features

*Hover-exec* facilitates execution from within the editor of markdown code blocks in a variety of installed script languages. This is by no means intended as a replacement for the superb vscode notebooks. Instead it simply offers the opportunity, when working with markdown docs, to include 'live' calculations, results, code samples, comparisons and useful links, using a range of possible scripts.

The extension is activated when a markdown file is opened in the editor.

Hover script exec in action:
  ![](https://raw.githubusercontent.com/rmzetti/hover-exec/master/Hover-exec.gif)

---
## Basic hover-exec 
Hovering over lines starting with ` ``` `  (or starting with a single backtick and including an end one) will trigger a hover message with an *exec* command as the bottom line, as in the *gif* above. Hovering over ` ``` ` at the end of a block will trigger the message for the start of the block. Clicking the command link on the bottom line of the hover message (or using the shortcut `Alt+/` or `Opt+/` with the cursor anywhere in the block) will execute the code in the code block, and produce output.

---
### Using vm and eval

Javascript code blocks can be executed using *vscode*'s `vm` module, or by using `eval`.

In the command line, using `js` for the codeblock id produces syntax highlighting (it's a quick and dirty approach to provide basic syntax highlighting for a range of scripts), then adding ` :vm` sets the actual exec command to `vm`. Note that `eval` allows the internal *vscode* API to be used. Global objects, including variable and functions, can be used by the '`vm` or `eval` scripts for persisting values to another instance. Installation of `nodejs` is not required for `vm` or `eval` scripts to execute.

```js :vm
// ```js:vm  -- this comment is to show the command line in markdown previews`
'test: '+Math.random() =>> test: 0.3035541346974926
```
Intermediate results can be viewed in line, as above, by appending `=>>` instead of using `console.log()` .

A couple more examples using `vm`, showing use of *vscode* api functions and some extra functions  published by `hover-exec` (eg. `alert`)

```js :vm
// ```js:vm -- as before, this line shows the command in markdown previews`
let abc="hello, world 3"
let a='hello variable world';
alert(a) //not available in node scripts
a='goodbye world'
vscode.window.showInformationMessage(a) //not available in node scripts
eval('let a=3;2*a*Math.random()')=>> 5.830193426022571
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>> hello 1.6208779821072452
process.cwd() =>> c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
console.log(abc)
```
```output
goodbye world 0.40543079423536743
hello, world 3
```

---
```js :vm -- javascript regex tester
// ```js :vm -- javascript regex tester`
'abcdefg'.replace(/^.*(bc)/,'$1--') =>> bc--defg
```

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

See readMore for information on restricting or enlarging the vm context.

---
### using require and globals with vm and eval

Moment, lodash (_) and mathjs (math) are available by default in both `vm` and `eval`.

A function or variable can be set as global (eg. `global.a=a;` see examples below) in either `vm` or `eval` and is then available during the session in both. A global can be deleted using, eg. `delete global.a;`

```js :eval
function xrange(){
   let x1=_.range(0,6.1,6/19);
   let x=math.round(math.exp(math.multiply(x1,math.log(10))));
   return x
}
xrange()=>> 1,2,4,9,18,38,78,162,336,695,1438,2976,6158,12743,26367,54556,112884,233572,483293,1000000
```

```js:eval
let cd=process.cwd().replace(/\\/g,'/'); //current directory using '/'
cd =>> c:/Users/ralph/OneDrive/Documents/Notes
//cd can be used in require, eg. 
```

```js:vm
f=global.f=function(m){return 'the meaning of life is '+m;};
f(44-2)=>> the meaning of life is 42
```

```js:eval
f(42)=>> the meaning of life is 42
_.range(0,4)=>> 0,1,2,3
```

---
### Scripts with default command lines

Command lines to start a number of scripts are included (see [Configuration settings](#configuration-settings) near the end of this `README` for the actual commands):

- eval (built in javascript, with vscode api available)
- vm (vm script, with vscode api included in context)
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

The script language you are using (eg `julia`, `nodejs` ..) needs to have been installed, and ***some of the commands to run the scripts may need customising*** to suit your particular installation - see [Configuration settings](#configuration-settings) below.

Other script languages may be added. And as an alternative to the standard *vscode* method for changing extension settings, this can also done with `eval` - see the [READMORE](READMORE.md) for examples.

---
## Some examples
### nodejs

The js command by default executes a javascript code block in `nodejs` (assuming that is installed). 

```js  {cmd=node}  
// ```js  {cmd=node}  //This comment line is for command visibility in markdown previews.
                                 //NB. {cmd=node} is included to also allow execution in *mpe*.
console.log('  test using node:\n  '+Math.random())
console.log('  Note: hover-exec on ```output line`, or alt+/ (opt+/) with\n',
    ' the cursor in the output block will delete the output block')
```

---
### lua

```lua -- say hello & goodbye
// ```lua
'hello '..(44-2+math.random())=>>hello 42.127742051917
"goodbye "..math.pi+math.random()=>>goodbye 3.2751978374685
print("lua ok") -- this outputs in the output code block below
```

---
### python

```python {cmd}
  # ```python {cmd}  ## {cmd is only to allow execution also in *mpe*}
from random import random
45-2+random()      # =>>43.15413667632507
'hello, world 3!'      # =>>hello, world 3!
print('python ok')
```


Note that the inline indicator `=>>` has been prefixed by a python comment character `#` so that *markdown previw enhanced* will execute the code. *hover-exec* will still update the in-line output, but *mpe*, of course, will not.


---
### julia

```julia {cmd}
  # ```julia {cmd}
using LinearAlgebra, Statistics, Compat
a=rand(Float64,3);
a   # =>>[0.19104707134627685, 0.37870819903566955, 0.06382850245606453]
b=a;b[2]=42;                                   # arrays are shallow copied
println(string("a=",a,"\n","b=",b))  # double quotes only for julia strings
```
```output
a=[0.19104707134627685, 42.0, 0.06382850245606453]
b=[0.19104707134627685, 42.0, 0.06382850245606453]
```

---
### powershell

```pwsh {cmd}
  #  ```pwsh {cmd} // random number, show current directory.
Get-Random -Min 0.0 -Max 1.0 # =>>0.176738379605458
pwd
```
```output
Path
----
C:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
```

---
### gnuplot

```gnuplot {cmd}
  # ```gnuplot {cmd}`
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
### scilab

```js :scilab {cmd=scilab} 
// ```js :scilab {cmd=scilab} 
// using js :scilab instead of just scilab provides quick & dirty syntax highlight
// {cmd=scilab} is for markdown preview enhanced
rand("seed",getdate('s'));
'def '+string(rand())+' abc'=>>def 0.8770073 abc
// nb. need to use 'string' for numeric output in scilab
disp('scilab random: '+string(rand()))
```
```output
  "scilab random: 0.5997802"
```

---
```html
<!-- ```html tunnel *what am I going to do now* -->
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
## One-liners

*One-liners* starting and ending with a single backtick (and starting in col 1) can also be executed on hover-click. The pre-defined variables %c current folder, %f temp file full path+name, %p temp file path, %n temp file name can be used. Comments can be added after the closing quote.

---
### One-liner examples:

exec notepad with file in current folder:
`notepad %cREADME.md`

exec notepad with temp file (%f):
`notepad %f`

exec notepad++:
`"C:/Program Files/Notepad++/notepad++" %cREADME.md`

explore 'This pc':
`explorer ,`>

explore folder:
`explorer /select, %cREADME.md`>

show devices:
`devmgmt.msc`

open default browser with href, or showing html text (note that html is a built in script command, see previous section)

`html <script>location.href= 'https://whatamigoingtodonow.net/'</script>`

`html <h1>Hello world!</h1>`

---
## Configuration settings

The startup commands for scripts included by default are as follows (nb. `%f` provides the appropriate temporary file path & name, and the notation `%f.py`, for example, indicates that the temporary file extension `.py` should be used - the default is `.txt` ):

- "octave":"octave \"%f.m\"",
- "matlab":"matlab -sd %p.m -batch temp",
- "matlab_comment":"if %p.m needs to be \"%p.m\" then add /, ie. \"%p.m/\" ",
- "scilab":"scilex -quit -nb -f \"%f.sci\" ",
- "python":"python \"%f.py\"",
- "python3":"python3 \"%f.py\"",
- "streamlit":"streamlit run \"%f.py\" ",
- "julia":"julia \"%f.jl\"",
- "gnuplot":"gnuplot -p -c \"%f.gp\"",
- "pwsh":"pwsh -f \"%f.ps1\"",
- "bash":"bash \"%f.sh\"",
- "zsh":"zsh -f \"%f.sh\"",
- "lua54":"lua54 \"%f.lua\"",
- "lua53":"lua53 \"%f.lua\"",
- "lua":"lua54 \"%f.lua\"",
- "js":"node \"%f.js\"",
- "eval":"eval",
- "vm":"vm",
- "node":"node \"%f.js\"",
- "javascript":"node \"%f.js\"",
- "html":"\"%f.html\"",
- "firefox":"firefox \"%f.html\"",
- "chrome":"google-chrome-stable \"%f.html\"",
- "test":"test -c \"%f.tst\"",
- "go":"go run \"%f.go\"",
- "buddvs":"buddvs \"%f.txt\" " // *buddvs* is a local scripting language

Any of these can be changed to suit the system in use using vscode `settings`.

There is also a set of strings called `swappers` which enable moving the output of a line so that it appears *in-line*, within the codeblock itself. Check the  [READMORE](READMORE.md).

---
## Known Issues

This is a beta version.

Note that in all scripting languages included (except the 'home-grown' one *buddvs*, and to some extent *vm* and *eval*), the script starts from scratch when the code block is executed, the same as if the command file were executed from scratch from the command prompt. In other words, assigned variables do not carry over into the next script execution. This kind of approach is best suited for small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages.

Matlab takes a substantial amount of time to run a codeblock (ie. the startup time for matlab to run a 'batch file' is nearly 10s on my Ryzen pc). However, other included scripts are generally fairly fast (see the demo gif above).

---
## Release Notes

Initial beta release was 0.6.1
Published using: vsce package/publish
