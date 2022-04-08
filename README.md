# Hover-exec README

This is the README for the VSCode extension *hover-exec*. For more detail, [READMORE](READMORE.md). Once the extension is installed, the README, the READMORE and the test files are best viewed in the editor. Type one of the following in any instance of the editor - hover to see the path, or exec by clicking or alt-/ or opt-/ to open the file in the editor.

`code %x/README.md`            //%x is a hover-exec command variable giving the extension path 
`code %x/READMORE.md`       //extended README
`code %x/test/basic_tests.md` //basic tests
`code %x/test/misc_tests.md`  //benchmark tests and REPLs

NB. Each of the above commands is surrounded by a backtick, and must start in col 1.

Using *hover-exec* in the vscode editor on these files will allow live testing and comparison with the test outputs provided.

## Contents
- [Hover-exec README](#hover-exec-readme)
  - [Contents](#contents)
  - [Features](#features)
  - [Basic hover-exec](#basic-hover-exec)
  - [Javascript scripts](#javascript-scripts)
    - [Examples using vm and eval](#examples-using-vm-and-eval)
    - [Using nodejs](#using-nodejs)
    - [Html and javascript](#html-and-javascript)
  - [Other scripts](#other-scripts)
    - [Scripts with command execution strings included](#scripts-with-command-execution-strings-included)
    - [Python](#python)
    - [Julia](#julia)
    - [Octave](#octave)
    - [Scilab](#scilab)
    - [Lua](#lua)
    - [Gnuplot](#gnuplot)
    - [Bash & zsh](#bash--zsh)
    - [Powershell](#powershell)
  - [One-liners and quickmath](#one-liners-and-quickmath)
    - [One-liner examples:](#one-liner-examples)
    - [Quickmath examples](#quickmath-examples)
  - [Configuration settings](#configuration-settings)
  - [Release Notes and Known Issues](#release-notes-and-known-issues)

---
## Features

*Hover-exec* facilitates execution from within the editor of fenced markdown code blocks in a variety of installed script languages. New script languages can be added with or without configuration. This extension is by no means intended as a replacement for the superb vscode notebooks. Instead it offers the opportunity, when working with markdown docs, to include 'live' calculations, results, code samples, comparisons and useful links, using a range of possible scripts.

The *hover-exec* extension is activated when a markdown file is opened in the editor.

Hover script exec in action:

  ![](https://raw.githubusercontent.com/rmzetti/hover-exec/master/Hover-exec.gif)
  ![](Hover-exec.gif)

---
## Basic hover-exec 

Hovering over fenced code block start or end lines which start with a triple backtick, or lines which start with a single backtick and include an end backtick, will trigger a hover message with an *exec* command in the bottom line. Clicking the command link on the bottom line of the hover message will execute the code in the code block, and produce output.

If the cursor is inside a fenced code block, the code can be quickly executed using the shortcut `Alt+/` or `Opt+/`.

Code blocks which are indented (ie. unfenced), fenced with '~', or not labelled, will not result in a hover message and cannot be executed.

---
## Javascript scripts

Javascript code blocks can be executed using the `vm` module, also by using *vscode*'s built in `eval` - and also through [nodejs](#nodejs) or a *browser*.

### Examples using vm and eval

The code block label `js`  by itself defaults to executing javascript via the built-in `vm` module. Appending `:eval` will instead execute the code block using *eval*.

```js  {cmd=javascript} //click this line in the *hover* to execute the block
//js  //this comment is to show the command line in markdown previews
//    //the default for the `js` command is to execute using the `vm` module
console.log("Note the in-line random number result (not in mpe)")
'test: '+Math.random() // =>>test: 0.6540027777133479
```
>     test output:
>     Note the in-line random number result (not in mpe)

Intermediate results can be viewed in line, as above, by appending `=>>` instead of using `console.log()` . Other results are produced in an `output` block. Hovering over `output` provides options *output to text* or *delete*. Using the shortcut `Alt+/` or `Opt+/` with the cursor in the `output` block deletes the block.

---
A couple more examples using `js`, showing use of *vscode* api functions and some extra functions published by *hover-exec* (eg. `alert`).

```js {cmd=javascript}  :eval
//js //using javascript vm, or append :eval to use the built in eval instead
let abc="hello, world 3"
alert(abc) //alert produces vscode alerts - not available in nodejs scripts
let a='goodbye world'
vscode.window.showInformationMessage(a) //not available in node scripts
let b=3;
2*b*Math.random() =>>0.7782289254464549
eval('let b=3; 2*b*Math.random()')=>>4.972581348554671
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>>hello 1.1375918988008553
process.cwd() =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
console.log(abc)
```
>     test output:
>     goodbye world 0.46809536348325254
>     hello, world 3

---
```js
//js  //javascript regex tester
'abcdefg'.replace(/^.*(bc)/,'$1--') =>>bc--defg
```

```js : eval
//js : eval // javascript regex tester using eval
'abcdefg'.replace(/^.*(bcde)/,'$1--') =>>bcde--fg
```

---
All the code blocks above can be executed using either `eval` or `vm`.
The difference is that `vm` scripts are executed within a more restricted *context* - see [READMORE](READMORE.md) .

In the command line (eg. above), using `js` for the code block id produces javascript syntax highlighting (it's a quick and dirty approach to provide basic syntax highlighting for a range of scripts), then adding `: eval` sets the actual exec command to `eval`.

Note that `vm` and `eval` both allow the internal *vscode* API to be used. Installation of `nodejs` is not required for `vm` or `eval` scripts to execute.

See [READMORE](READMORE.md) for more information and examples.

---
### Using nodejs

The `js:node` command executes a javascript code block in `nodejs` (assuming, of course, `nodejs` has been installed). 

```js : node
//js : node //blanks allowed around the :
console.log('  test using node:\n  '+Math.random())
console.log('  Note: hover-exec on the output line, or alt+/ (opt+/) with\n',
    ' the cursor in the output block will delete the output block')
```
>     test output:
>     test using node:
>     0.43884249391182095
>     Note: hover-exec on the output line, or alt+/ (opt+/) with
>     the cursor in the output block will delete the output block

---
### Html and javascript

```html
<!--Hello world-->
<h1 align='center'>Hello world</h1>
<p>Html will be displayed in the browser
<p id='test'>Text here</p>
<script>
document.getElementById("test").innerHTML="<em>Text via javascript</em>"
</script>
```

```html
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
## Other scripts

### Scripts with command execution strings included

Command lines to conveniently start a number of other scripts are included (see [Configuration settings](READMORE.md#configuration-settings) for the actual command lines used). Some examples (for other script language examples see the [READMORE](READMORE.md)):

- [python](#python)
- [julia](#julia)
- [octave](#octave)
- [scilab](#scilab)
- [lua](#lua)
- [gnuplot](#gnuplot)
- [powershell](#powershell)
- [bash & zsh](#bash-&-zsh)

Notes:
- The script language you wish to use (eg `julia`, `nodejs` ..) needs to have been installed in your system
- Some of the commands to run the scripts ***may need customising*** to suit your particular installation - see [Configuration settings](READMORE.md#configuration-settings).
- Other script languages may be added. In basic usage the script command can be entered via '[config]' in the hover. To achieve in-line capability, use the *hover-exec* extension settings, or as an alternative, this can also done with `eval` - see the [READMORE](READMORE.md) for examples.

---
### Python

```python
 #python :python3 # use this instead to use 'python3' as start command
from random import random
45-2+random()       #  =>>43.6264875741003
'hello, world 3!'       #  =>>hello, world 3!
print('python ok')
```
>     test output (also see inline output):
>     python ok

Note that the inline indicator `=>>` has been prefixed by a python comment character `#` (only spaces allowed after) so that, for example, *markdown preview enhanced* will execute the code. *hover-exec* will still update the in-line output, but *mpe*, of course, will not.

---
### Julia

```julia
  #julia
using LinearAlgebra, Statistics, Compat
a=rand(Float64,3);
a   # =>>[0.9607100451172932, 0.25709634387752067, 0.027822592779326305]
b=a;b[2]=42;                        # arrays are shallow copied here
println(string("a=",a,"\n","b=",b))  # double quotes only for julia strings
```
>     test output (also see inline output):
>     a=[0.9607100451172932, 42.0, 0.027822592779326305]
>     b=[0.9607100451172932, 42.0, 0.027822592779326305]

---

### Octave

Use `octave` or `python:octave` to run octave. Using 'python' as the command id provides syntax highlighting, adding :octave uses octave. The {...} is for *markdown preview enhanced*

```python :octave
 # python:octave {cmd=octave} -- {cmd..} is for mpe
 # python gets syntax highlighter
 # nb. need mat2str or num2str for numeric output
num2str(7.1+rand(1))  =>>7.8169
'hello world in-line'  =>>hello world in-line
pwd()  =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
disp('hello world in output section!')
disp(rand(1))
```
>     test output (also see inline output):
>     hello world in output section!
>     0.1295

---
### Scilab

```js :scilab 
//js :scilab //using js :scilab provides quick & dirty (js) syntax highlight
      //nb. scilab needs to use 'string()' for inline numeric output (uses mprintf)
rand("seed",getdate('s')); //set new random sequence
mprintf('%s\n','test '+string(rand())+' '+pwd());
string(rand())+' '+pwd() =>>0.9321708 c:\Users\rmzetti\GitHub\hover-exec
string(rand()) =>>0.3329656
//disp('disp puts quotes around strings',rand())
```
>     test output (also see inline output):
>     test 0.3161717 c:\Users\rmzetti\GitHub\hover-exec

---
### Lua

```lua  -- say hello & goodbye
--lua :lua54 -- 'lua' id specifies syntax highlight and default start command
--                     adding ':lua54' means use 'lua54' as start command
'hello ' .. 44-2+math.random() -- =>>hello 42.046598765538
"& goodbye " .. math.pi+math.random() =>>& goodbye 3.3082099849202
print("lua ok") -- this outputs in the output code block below
```
>     test output (also see inline output):
>     lua ok

---
### Gnuplot

*Gnuplot* is a very useful stand-alone plotting facility. Assuming *gnuplot* has been installed,  it can be executed within *hover-exec*. In addition, other scripts can output *gnuplot* commands (along with data) in their output block and the data can be immediatedly plotted in a chained fashion (see the  [READMORE](READMORE.md)).

```gnuplot
 #gnuplot //here gnuplot is being used stand-alone
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
![[2021-08-31-20-28-22.png]] (this 'wiki' type link is enabled using *markdown memo*)

 The above is a *png* file created (using the *paste image* extension) from a screen copy of the plot window.

---
### Bash & zsh

```zsh # (macos) show current directory
 #zsh # (macos) show current directory
pwd
```  
>     test output:
>     /home/rmzetti/hover-exec

```bash # (macos, linux, wsl) show current directory
 #bash # (macos, linux) show current directory
pwd
```
>     test output:
>     /home/rmzetti/hover-exec

---
### Powershell

```pwsh # (windows) random number, show current directory
  # pwsh # (windows) random number, show current directory
  # $PSStyle.OutputRendering = 'PlainText' # stops color codes appearing in output
Get-Random -Min 0.0 -Max 1.0 # =>>0.804137573020597
pwd
```
>     test output (also see inline output):
>     Path
>     ----
>     C:\Users\rrmzetti\GitHub\hover-exec


---
## One-liners and quickmath

*One-liners* starting with a single backtick *in column 1* and ending with a single backtick can also be executed with hover-click or the alt-/ or opt-/ shortcut. The pre-defined variables %c current folder, %f temp file full path+name, %p temp file path, %n temp file name can be used (the derived path will be seen in the hover). Comments can be added after the closing quote.

Another useful facility is *quickmath*. A math expression of the form `5-sqrt(2)=` (does not need to start in column 1) will be evaluated on hover (using *mathjs* `math.evaluate(..)`) and the result will be shown immediately  in the hover message. Clicking the hover result will copy it to the clipboard. Note that the expression is surrounded by single backticks, and there needs to be `=` before the last backtick (essentially to stop popups for other quoted strings).

---
### One-liner examples:
default shell simple command execution (result depends on the default shell for vscode)
`pwd` zsh, bash, pwsh, cmd
`ls` zsh,bash, pwsh
`dir` cmd

exec notepad with file in current folder:
`notepad "%cREADME.md"`  --windows
`open -a textedit "%cREADME.md"`  --mac
`gedit "%cREADME.md"`  --linux/wsl
`xedit "%cREADME.md"`  --linux/wsl

exec notepad with temp file (%f):
`open -a textedit "%f"` --mac
`notepad "%f"`  --windows
`xedit "%f"`  --linux/wsl

open another instance of vscode:
`code -n %f`  --windows

explore files, view folders:
`open -a finder ~`  mac 'home'
`open -a finder "%c"`  mac to view current folder
`explorer ,`  windows view 'ThisPC'
`explorer.exe /select, "%cREADME.md"`  windows & wsl view current folder & select file
`nemo "%cREADME.md"`  Linux mint view current folder & select file

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

### Quickmath examples
And finally, some *quickmath* expressions: `254cm in inches=` will show 100 inches in the hover message using [*mathjs 'math.evaluate'*](https://mathjs.org/docs/reference/functions/evaluate.html). More examples:  `[1,2,3,4]*5=`,  `cos(45deg)=`,  `sin(0.81)^2+cos(0.81)^2=`,  `cos(pi/2)=`,  `sin([10,45,90] deg)=`,  `range(0,4,0.5)=`,  `(2+2i)*(1+2i)=` , `3:6=`, `1:0.1:5=`, `7*7-7=` .

NB. Copy the answer in the hover to the clipboard with a click.

---
## Configuration settings

For configuration settings see [READMORE](READMORE.md#configuration-settings)

---

## Release Notes and Known Issues

This is a beta version.

Note that in all the demos above, except *js:vm* and *js:eval* which allow definition of *global* variables and functions, the script starts from scratch when the code block is executed. In other words, assigned variables do not carry over into the next script execution. This kind of approach is best suited for small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages.

Scripts can also be run using their REPL version, if this is available - eg. for node, lua, octave, scilab, r, julia - see the [READMORE](READMORE.md#using-scripts-via-repls), or [misc_tests](test/misc_tests.md). For REPLs, successive script execution will recognise previously defined variables and functions.

There is also an *include* capability, known as `#inhere` (to distinguish from *includes* in scripts) - see the [READMORE](READMORE.md) for details and examples.

Matlab takes a substantial amount of time to run from a code block exec (eg. the startup time for matlab to run a 'batch file' is about 5s on a recent Ryzen laptop). Although this is a Matlab startup issue, it undermines the use of `matlab` within *hover-exec*. Also I haven't been able to get a Matlab based REPL working (unlike, for example, Octave, which is fairly strightforward.)

The startup times for other included scripts are generally fairly minimal (see the demo gif above). 

---

Initial beta release was 0.6.1
Published using: vsce package/publish






