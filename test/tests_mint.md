# Hover-exec README etc for Linux mint

This is the README for VS Code extension *hover-exec*. For more detail, [READMORE](READMORE.md).

- [Hover-exec README etc for Linux mint](#hover-exec-readme-etc-for-linux-mint)
  - [Features](#features)
  - [Basic hover-exec](#basic-hover-exec)
  - [Javascript scripts](#javascript-scripts)
    - [Examples using `vm` and `eval`](#examples-using-vm-and-eval)
    - [Available functions in `vm` and `eval`](#available-functions-in-vm-and-eval)
    - [Using require & globals with vm and eval](#using-require--globals-with-vm-and-eval)
    - [Using nodejs](#using-nodejs)
  - [Other scripts](#other-scripts)
    - [Scripts with command execution strings included](#scripts-with-command-execution-strings-included)
    - [lua](#lua)
    - [python](#python)
    - [scilab](#scilab)
    - [julia](#julia)
    - [shell](#shell)
    - [gnuplot](#gnuplot)
    - [Html](#html)
  - [One-liners and quickmath](#one-liners-and-quickmath)
    - [One-liner and quickmath examples:](#one-liner-and-quickmath-examples)
  - [Configuration settings](#configuration-settings)
  - [Known Issues](#known-issues)
  - [Release Notes](#release-notes)
- [Hover exec READMORE](#hover-exec-readmore)
  - [Features](#features-1)
  - [Basic hover-exec](#basic-hover-exec-1)
  - [Javascript scripts](#javascript-scripts-1)
    - [Examples using `vm` and `eval`](#examples-using-vm-and-eval-1)
    - [available functions in `vm` and `eval`](#available-functions-in-vm-and-eval-1)
    - [The `vm` context](#the-vm-context)
    - [Quick specification of `vm` context](#quick-specification-of-vm-context)
    - [using require & globals with vm and eval](#using-require--globals-with-vm-and-eval-1)
    - [Using nodejs](#using-nodejs-1)
  - [Other scripts](#other-scripts-1)
    - [Script commands](#script-commands)
  - [Some examples](#some-examples)
    - [Lua](#lua-1)
    - [Scripts without pre-defined configs](#scripts-without-pre-defined-configs)
    - [Shell](#shell-1)
    - [Gnuplot](#gnuplot-1)
    - [Javascript using vm](#javascript-using-vm)
    - [Javascript using node](#javascript-using-node)
    - [More vm, eval and node examples](#more-vm-eval-and-node-examples)
  - [More examples](#more-examples)
    - [Running other programs](#running-other-programs)
    - [Octave](#octave)
    - [Scilab](#scilab-1)
    - [Python](#python-1)
    - [Julia](#julia-1)
    - [Gnuplot](#gnuplot-2)
    - [Html and in-browser javascript](#html-and-in-browser-javascript)
    - [Powershell](#powershell)
    - [Random strings in javascript](#random-strings-in-javascript)
    - [Regular expression test and usage](#regular-expression-test-and-usage)
    - [Go](#go)
    - [Vitamin b12, dosage vs uptake](#vitamin-b12-dosage-vs-uptake)
    - [Chaining execution codeblocks](#chaining-execution-codeblocks)
  - [One-liners](#one-liners)
    - [One-liners examples](#one-liners-examples)
    - [Quickmath examples](#quickmath-examples)
    - [html & javascript one-liners](#html--javascript-one-liners)
    - [audio one-liners](#audio-one-liners)
  - [inhere - including tagged sections](#inhere---including-tagged-sections)
    - [Using repl scripts](#using-repl-scripts)
  - [Configuration settings](#configuration-settings-1)
    - [Using vm for configuration settings](#using-vm-for-configuration-settings)
      - [Check settings](#check-settings)
      - [Add new script language](#add-new-script-language)
      - [Other vscode config settings](#other-vscode-config-settings)
  - [Known Issues](#known-issues-1)
  - [Release Notes](#release-notes-1)
- [Hover-exec basic tests](#hover-exec-basic-tests)
    - [Hover](#hover)
    - [Exec](#exec)
    - [Other information from the hover](#other-information-from-the-hover)
    - [Execution via the keyboard, and in-line output](#execution-via-the-keyboard-and-in-line-output)
    - [Final comments](#final-comments)
- [Hover-exec Misc tests](#hover-exec-misc-tests)
  - [Javascript tests](#javascript-tests)
    - [array operations](#array-operations)
    - [timing in javascript (not using moment.js)](#timing-in-javascript-not-using-momentjs)
    - [using console.log](#using-consolelog)
    - [speed of eval vs Function within javascript code](#speed-of-eval-vs-function-within-javascript-code)
    - [Javascript in the browser](#javascript-in-the-browser)
    - [Plotting comparison](#plotting-comparison)
      - [Data for the plots (tagged #p1, #j1, #go)](#data-for-the-plots-tagged-p1-j1-go)
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
- [Hover-exec script tests](#hover-exec-script-tests)
    - [Javascript tests: 'vm', 'eval' and 'node'](#javascript-tests-vm-eval-and-node)
    - [Javascript in the browser](#javascript-in-the-browser-1)
    - [Test using 'go' as a scripting language](#test-using-go-as-a-scripting-language)
    - [Test using 'python'](#test-using-python)
    - [Test using 'lua'](#test-using-lua)
    - [Pascal test](#pascal-test)
    - [Octave test](#octave-test)
    - [Test using scilab](#test-using-scilab)
    - [Julia test](#julia-test)

## Features

*Hover-exec* facilitates execution from within the editor of markdown code blocks in a variety of installed script languages. This is by no means intended as a replacement for the superb vscode notebooks. Instead it simply offers the opportunity, when working with markdown docs, to include 'live' calculations, results, code samples, comparisons and useful links, using a range of possible scripts.

The *hover-exec* extension is activated when a markdown file is opened in the editor.

Hover script exec in action:
  ![](https://raw.githubusercontent.com/rmzetti/hover-exec/master/Hover-exec.gif)

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
'test: '+Math.random() =>>test: 0.33127870876460563
```

Intermediate results can be viewed in line, as above, by appending `=>>` instead of using `console.log()` . Other results are produced in an `output` block. Hovering over `output` provides options *output to text* or *delete*. Using the shortcut `Alt+/` or `Opt+/` with the cursor in the `output` block deletes the block.

---
A couple more examples using `vm`, showing use of *vscode* api functions and some extra functions published by `hover-exec` (eg. `alert`)

```js  //using javascript vm various examples
//js //using javascript vm, various examples
let abc="hello, world 3"
let a='hello variable world';
alert(a) //not available in nodejs scripts
a='goodbye world'
vscode.window.showInformationMessage(a) //not available in node scripts
let b=3;
2*b*Math.random() =>>1.0881637272374518
eval('let b=3; 2*b*Math.random()')=>>2.0873337788702835
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>>hello 1.973257752681334
process.cwd() =>>/home/rm/Documents/hover-exec
console.log(abc)
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
cd =>>/home/rm/Documents/hover-exec
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

```js{cmd=node}:node
//js :node {cmd=node} //the {..} allows execution using *markdown preview enhanced*
console.log('  test using node:\n  '+Math.random())
console.log('  Note: hover-exec on ```output line`, or alt+/ (opt+/) with\n',
    ' the cursor in the output block will delete the output block')
```
```output
  test using node:
  0.31089041492025626
  Note: hover-exec on ```output line`, or alt+/ (opt+/) with
  the cursor in the output block will delete the output block
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

```lua {}  -- say hello & goodbye
-- lua {} --  {} allows syntax highlighting in *mpe*
'hello ' .. 44-2+math.random() =>>hello 42.840187716763
"& goodbye " .. math.pi+math.random() =>>& goodbye 3.5359755802252
print("lua ok") -- this outputs in the output code block below
```
```output
lua1 ok
```

---
### python

```python3 {cmd} # {cmd} allows execution also in *markdown preview enhanced*}
  # python3 {cmd} 
from random import random
45-3+random()     #  =>>42.42075139087035
'hello, world 3!'     #  =>>hello, world 3!
print('python ok')
```
```output
python ok
```

Note that the inline indicator `=>>` has been prefixed by a python comment character `#` (only spavce after) so that *markdown preview enhanced* will execute the code. *hover-exec* will still update the in-line output, but *mpe*, of course, will not.

---
### scilab

```js {cmd=scilab-cli} :scilabcli
//js :scilabcli //using js :scilabcli instead of just scilab provides quick & dirty syntax highlight
//js {cmd=scilab-cli} :scilabcli  {..} will also allow execution in markdown preview enhanced
// scilab needs to use 'string()' for numeric output
pwd()   =>>/home/rm/Documents/hover-exec
rand("seed",getdate('s')); //set new random sequence
'def '+string(rand())+' abc '+string(rand())   =>>def 0.2176655 abc 0.989616
mprintf('%s',string(rand()))
// nb. need to use 'string' for numeric output in scilab
disp('scilab random: '+string(rand()))
```
```output
0.4903821
  "scilab random: 0.2121767"
```

---
### julia

```julia {cmd}
  # julia {cmd} //also works in *mpe*
using LinearAlgebra, Statistics, Compat
a=rand(Float64,3);
a   # =>>[0.8918446930555866, 0.9814459485730513, 0.3234681109822046]
b=a;b[2]=42;                                   # arrays are shallow copied
println(string("a=",a,"\n","b=",b))  # double quotes only for julia strings
```
```output
a=[0.8918446930555866, 42.0, 0.3234681109822046]
b=[0.8918446930555866, 42.0, 0.3234681109822046]
```

---
### shell

```bash {cmd}
  #  zsh {cmd} // show current directory.
echo 'hello'
pwd
ls -l
```

---
### gnuplot

Gnuplot is a very useful stand-alone plotting facility. When using *hover-exec* all scripts can output gnuplot commands along with data in the output block and it can be immediatedly plotted (see the  [READMORE](READMORE.md)).

```gnuplot {cmd} # {cmd} allows execution in *markdown preview enhanced*
 #gnuplot {cmd} # {cmd} allows execution in *markdown preview enhanced*
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
```output
qt5ct: using qt5ct plugin
```

![[2021-08-31-20-28-22.png]]  (this 'wiki' type link is enabled using *markdown memo*)

 The above is a *png* file created (using the *paste image* extension) from a screen copy of the plot window.

---
### Html

```firefox //all required html is in the codeblock below
<!-- html //tunnel *what am I going to do now*  -->
<head>modified slightly from [tunnel](https://js1k.com/2010-first/demo/763)</head>
<title>tunnel</title>
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

Another useful facility is *quickmath*. A math expression of the form `5-sqrt(2)=` anywhere will be evaluated on hover (using *mathjs* `math.evaluate(..)`) and the result will be shown immediately  in the hover message. Clicking the hover result will copy it to the clipboard. Note that the expression is surrounded by single backticks, and there needs to be `=` before the last backtick (essentially to stop popups for other quoted strings).

---
### One-liner and quickmath examples:

exec editor with file in current folder:
`xed '%cREADME.md'`

exec editor with temp file (%f):
`xed '%f'`

file management
`nemo`

explore folder and select file:
`nemo '%cREADME.md'`>

show storage devices:
`gnome-disks`

exec firefox with href, or showing html text
`firefox <script>location.href= 'https://whatamigoingtodonow.net/'</script>`
`firefox <h1>Hello world!</h1>`

And finally, a few more *quickmath* expressions: `254cm in inches=` will show 100inches in the hover message (using [*mathjs 'math.evaluate'*](https://mathjs.org/docs/reference/functions/evaluate.html)),  `[1,2,3,4]*5=`,  `cos(45deg)=`,  `sin(0.81)^2+cos(0.81)^2=`,  `cos(pi/2)=`,  `sin([10,45,90] deg)=`,  `range(0,4,0.5)=`,  `(2+2i)*(1+2i)=` , `3:6=`, `1:0.1:5=`, `7*7-7=` . NB. Copy to clipboard with a click.

---
## Configuration settings

The startup commands for scripts included by default are as follows (nb. `%f` provides the appropriate temporary file path & name, and the notation `%f.py`, for example, indicates that the temporary file extension `.py` should be used - the default is `.txt` ):

```js //exec this for a list of start commands in hover-exec config
sort=o=>Object.keys(o).sort().reduce((r, k)=>(r[k]=o[k],r),{});
console.log(sort(config.get('scripts')));
```

Any of these can be changed to suit the system in use using vscode `settings` under the `hover-exec` extension.

Also note that there is no actual requirement to include a script startup command in the configuration file for the script to be used - they just make the code block command simpler.

Basically if the command works in the terminal (using the full file name of course), and returns output to the terminal, then it will work as a *hover-exec* command  (on Windows, use "double quotes" if there are spaces in the file path).

There is also a set of strings called `swappers` which enable moving the output of a line so that it appears *in-line*, within the code block itself. Check the  [READMORE](READMORE.md).

---
## Known Issues

This is a beta version.

Note that in all scripting languages included, except *js:vm* and *js:eval* which allow definition of *global* variables and functions, the script starts from scratch when the code block is executed. In other words, assigned variables do not carry over into the next script execution. This kind of approach is best suited for small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages. To help with this there is also an *include* capability, known as `#inhere` (to distinguish from *includes* in scripts) - see the [READMORE](READMORE.md).

However scripts can also be run using their REPL version, if this is available - eg. for node, lua, octave, scilab, r, julia - see the [READMORE](READMORE.md), or [misc_tests](test/misc_tests.md). For REPLs, successive script execution will recognise previously defined variables and functions. 

Matlab takes a substantial amount of time to run a codeblock (ie. the startup time for matlab to run a 'batch file' is about 5s on a Ryzen laptop). Although this is a Matlab startup issue, it undermines the use of `matlab` within `hover-exec`. Also I haven't been able to get a MATLAB based REPL working (unlike, for example, Octave, which is fairly strightforward.

The startup times for other included scripts are generally fairly minimal (see the demo gif above). 

---
## Release Notes

Initial beta release was 0.6.1
Published using: vsce package/publish

---

# Hover exec READMORE

This is the READMORE for VS Code extension *hover exec*. Tldr? ..check [the README](README.md) instead. The two files use the same structure and basic content, this one just goes into more detail.

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

```js  //click this line in the *hover* to execute the block
//js  //this comment is to show the command line in markdown previews
//    //the default for the `js` command is to execute using the `vm` module
'test: '+Math.random() =>>test: 0.3614734966867881
aa = function (fruit){alert('I like ' + fruit);} //no 'let' creates a global variable
bb = function (animal){alert('he likes ' + animal);}
```

```js //execute the previous *vm* block first
//js //execute the previous *vm* block first
bb('dogs'); //uses the globals defined in the previous code block
aa('pears');//vscode alert boxes shown bottom right 
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
eval('let a=3;2*a*Math.random()')=>>3.0169290458379496
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>>hello 1.5018953922163263
process.cwd() =>>/home/rm/Documents/hover-exec
console.log(abc)
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
(view the above in *mpe* to see the difference)

Note that `vm` and `eval` allow the internal *vscode* API to be used. Installation of `nodejs` is not required for `vm` or `eval` scripts to execute.


---
### available functions in `vm` and `eval`

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
aa
bb
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

Now lodash is not available to `vm` scripts:

```js //can't use lodash in reduced context
//js //can't use lodash in reduced context
_.range(0,5)=>>0,1,2,3,4
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

'Naked' assignments (ie. no `let`or `var`) will be available to subsequently executed `js/vm` codeblocks. Global assignments are also available to subsequent `js/vm` codeblocks, and they are also available to subsequently executed 'eval' codeblocks. 

```js:eval //use of lodash and mathjs 
//js:eval //use of lodash and mathjs 
function xrange(){
   let x1=_.range(0,6.1,6/10);
   let x=math.round(math.exp(math.multiply(x1,math.log(10))));
   return x
}
console.log(xrange())
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
```js //function available to subsequent vm codeblocks
//js  //function available to subsequent codeblocks
test()
```

For `eval`, neither 'naked' nor 'var' function defs are available to subsequent `eval` code blocks. Instead, the 'global' prefix needs to be used in the function def, as above.

---
### Using nodejs

The js command by default executes a javascript code block in `nodejs` (assuming that is installed).

```js :node
//js :node  //as before, this line shows the command in markdown previews
console.log('  test using node:\n  '+Math.random())
console.log('  Note: hover-exec on ```output line`, or alt+/ (opt+/) with\n',
    ' the cursor in the output block will delete the output block')
```
```output
  test using node:
  0.33272755453096314
  Note: hover-exec on ```output line`, or alt+/ (opt+/) with
  the cursor in the output block will delete the output block
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
c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
test using node: 0.12443021356881268
5.761054468373911
```

```js {cmd=node} :node
//js {cmd=node} :node
process.cwd()  =>>/home/rm/Documents/hover-exec
'test: '+Math.random() =>>test: 0.2610678205710395
let a=5;
a+Math.random() =>>5.91578100897446
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

```lua {cmd} --10 million random number calls
--lua {cmd=lua54} --10 million random number calls
local t = os.clock();
local t1=0;
math.randomseed(os.time())
for ii=1,10000000 do
t1=t1+math.random();
end
print(t1)
print(os.clock()-t)
```
```output
4999970.5299922
0.398799
```

### Scripts without pre-defined configs

A range of operating system commands can be executed in one-liners try the following (execute from the line with `alt+/`, & remove the result immediately with just a down arrow then `alt+/` again):

`man man`
`ls` //show h-e folder contents
`ls '%c'` //show current folder contents
`ls %p` //show temp folder contents
`grep --help` //show grep help

The following example does not use any predefined configs, just an operating system command with %f standing for the temp file name. The default %f ext is `.txt`, but this can be changed by appending the desired ext as in this `lua51` example - most programs will need a specific ext to run. Note that the temp files are saved in the standard vscode temp files location. They can be opened in vscode by clicking on [last script] or [last result] in the hover display.

One-liner:
`echo 'hello' && perl -e 'print int(rand(65000-2000)) + 2000'`


```echo 'hello' && perl '%f.pl'
print int(rand(65000-2000)) + 2000;
print "\n";
$name="me";
print "Hello, ${name} ... you will soon be a Perl addict!";
```
```output
hello
47756
Hello, me ... you will soon be a Perl addict!
```

---
### Shell

```zsh {cmd}
#  zsh {cmd} // show current directory.
echo 'hello'
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
eval('let a=3;2*a*Math.random()')=>> 1.6334490866360731
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>> hello 1.6299855395762226
process.cwd() =>> /home/rm/Documents/hover-exec
console.log(abc)
```
```output
goodbye 0.34473124379324305
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
console.log('[click here](http://127.0.0.1:1337)')
```
Note. If there is an EACCESS error in windows, use 'net stop winnat' and then 'net start winnat' in an admin terminal.

To kill the server use

```bash {cmd}
 # bash {cmd} --works in mpe
 # to kill server, exec once & look for pid to kill (line TCP 127.0.0.1:1337 on rhs)
 # then enter pid in kill statement below and exec again
kill 57166,57168
netstat -ano | grep '1337'
```

---
### More vm, eval and node examples
Various time and date functions using `vm`

```js      //time & date using internal javascript via vm
//js      //time & date using internal javascript via vm - not in *mpe*
(44-Math.random())=>>43.153181479383214
//show information message via vscode api
progress('Hello whole World',4000)
new Date().toISOString().slice(0,10)=>>2021-12-16
new Date().toLocaleDateString()=>>16/12/2021
new Date().toString()=>>Thu Dec 16 2021 19:12:08 GMT+1300 (New Zealand Daylight Time)
new Date().toLocaleString()=>>16/12/2021, 7:12:08 pm
new Date().getTime()=>>1639635128128
```

---
Time and date using node

```js {cmd=node} :node  //through nodejs
//js {cmd=node} :node  //through nodejs
a=44
// in-line results are calculated but not output in mpe
'answer='+(a-Math.random()) =>>answer=43.212331259670826
new Date().getTime()=>>1639174726862
console.log(new Date().toISOString().slice(0, 10))
console.log(new Date().toLocaleDateString())
```
```output
2021-12-10
11/12/2021
```

---
## More examples

### Running other programs
Here are a couple of very simple examples for sending the contents of a codeblock to other applications. These examples do not use any predefined configs. The other apps here are not scripts and will **not** send changed text back to the codeblock - changed content will need to be saved in the file system in the normal way.

```xed "%f"
This is a test
```

---
### Octave
Use `octave` or `python:octave` to run octave. Using 'python' as the command id provides syntax highlighting, adding :octave uses octave. The {...} is for *markdown preview enhanced* 

```python {cmd="octave-cli"} :octave
 # python:octave {cmd=octave} -- {cmd..} is for mpe
 # python gets syntax highlighter
 # nb. need mat2str or num2str for numeric output
num2str(7.1+rand(1))  =>>7.6431
'hello world in-line'  =>>hello world in-line
pwd()  =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
disp('hello world in output section!')
```

---
### Scilab
Use `scilab` to run scilab, or `js :scilab` for some quick and dirty syntax highlighting

```js {cmd=scilab} :scilabcli
//js {cmd=scilab} :scilab -- {cmd..} is for mpe
//need to use 'string()' for numeric output
mprintf('%s\n',pwd())
rand("seed",getdate('s')); //set new random sequence
string(rand())+', '+string(rand())   =>>0.9685034, 0.7220744
mprintf('%s',string(rand()))
```
```output
/home/rm/Documents/hover-exec
0.7798814
```

---
### Python
Use `python` to run python. `python3` can be used if that is the python repl start command

```python {cmd}
 #python {cmd}  # {cmd} is for markdown preview enhanced
import os
from random import random
 # the in-line results are effectively commented out for mpe
os.getcwd() =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
45-2+random() =>>43.072709564590994
print('hello world '+str(3*random()+1))
```
```output
hello world 1.633804499436842
```

---
This one-liner can be used to install packages:
`pip install pyformulas`
Issues? Some help from [here](https://stackoverflow.com/questions/44538746): 
0. sudo apt-get install python3-pip (or python-pip)
1. sudo apt-get install libasound-dev portaudio19-dev libportaudio2 libportaudiocpp0
2. sudo apt-get install ffmpeg libav-tools 
3. sudo apt-get install python-pyaudio
4. pip install pyaudio
5. pip install pyformulas
(What worked for me was 0, followed by 1,4 & 5)

---
In the following example, `{matplotlib=true}` will plot graphs inline in *markdown preview enhanced*. In *hover-exec* they are plotted in a separate window (and can be 'pasted' in using the `paste image` vscode extension) If you also use *markdown memo* the image link can be changed to the wiki form `[[...]]` and viewed on hover. 

```python3 {cmd matplotlib=true}
  #python3 {cmd matplotlib=true}
import numpy as np
import matplotlib.pyplot as plt
randnums= np.random.randint(1,101,500)
plt.plot(randnums)
plt.show()
```
Image from running the above codeblock and pasting via *Markdown kit*:
  ![[READMORE_matplotlib example.png]]

---
```python3 {cmd} # endless plot
 # python3 {cmd} -- {cmd} is for mpe
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
 # cancel execution, then close plot
```

`gnome-system-monitor` //to cancel python3 if plot continues...

---
### Julia
Julia also works in *mpe*

```julia {cmd}
 # julia {cmd}  # works in mpe
using LinearAlgebra, Statistics, Compat
pwd()  # =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
a=rand(Float64,3);
a         # =>>[0.30800697352407513, 0.14164449731032192, 0.9243624629393834]
b=a;b[2]=42;        # nb. arrays are shallow copied
a         # =>>[0.30800697352407513, 42.0, 0.9243624629393834]
b         # =>>[0.30800697352407513, 42.0, 0.9243624629393834]
println(string("a=",a))
```
```output
a=[0.30800697352407513, 42.0, 0.9243624629393834]
```

---
### Gnuplot

Gnuplot is a very useful stand-alone plotting facility. It is particularly useful for *hover-exec* because all the scripting languages can output gnuplot commands along with data in the output block and it can be immediatedly plotted.

Use `gnuplot` to run *gnuplot* - note that data bracketed by #tag_speed is used 'in here' (see later in this file, and the backtick quotes are required when the tag is referred to).

```gnuplot
#inhere `#tag_speed`  # hover to view the data
set logscale x
plot "$speed" w lp title "speed"
```

---
### Html and in-browser javascript
In browser javascript can be used
The following three examples are from the [js1k demos](https://js1k.com/). Can probably get this to work in *mpe*...

```firefox   <!--*what am I going to do now* tunnel-->
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

```firefox --psychedelic
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

```firefox --breathing galaxies
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

Use `pwsh` to run powershell, or `pwsh {cmd}` to also use in *mpe*, and linux/mac if  powershell is available.

```pwsh {cmd}
 # ```pwsh {cmd}`
pwd
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
```output
ousprtomth
```

---
```js {cmd=node} :node //generate random string
//js {cmd=node} :node //generate random string
function randch(n){
  return ''+Math.random().toString(36).substring(2,2+n)
}
randch(36) =>>daevdymyo6p
console.log(randch(36))
```

---
### Regular expression test and usage

```js //javascript regex tester using vm
//js //javascript regex tester (use node for mpe)
// if not using md preview enhanced, use = >> instead of // = (less faint)
"xys {cmd='js'} th".replace(/.*cmd=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'') =>> js
Math.random()*100   =>> 88.421425704524
```

---

```js {cmd=node} :node //javascript regex tester using node
//js {cmd=node} :node //javascript regex tester
'abcdefg'.replace(/^.*(bc)/,'$1Baa') =>>bcBaadefg
Math.random()*100   =>>33.01236229866507
console.log(Math.random()*100) //this for *mpe*
```
```output
51.58886690089142
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
' uptake='+u  =>> uptake=9.043850267379678
console.log(u)
```
```output
9.043850267379678
```

---
### Chaining execution codeblocks

Here a javascript codeblock produces output in the form of an `output:gnuplot` codeblock. This block is labelled as an `output` and so will be replaced if the javascript is executed again. Because it is also labelled with `:gnuplot' it can be directly executed in the usual ways to produce the plot.

```js
//js
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
console.log('``output :gnuplot noinline')
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
1 0.4166666666666667
2 0.851063829787234
4 1.702127659574468
9 3.272727272727273
18 6.666666666666667
38 12.666666666666666
78 21.36986301369863
162 27
336 39.529411764705884
695 43.4375
1438 44.246153846153845
2976 45.09090909090909
6158 51.31666666666667
12743 49.97254901960784
26367 39.95
54556 36.98711864406779
112884 35.95031847133758
233572 36.69630793401414
483293 35.61481208548268
1000000 33.266799733865604
EOD
#tag_speed
set logscale x
plot "$speed" w lp title "speed"
```

---
## One-liners

*One-liners* starting and ending with single backticks will simply be executed on click, and usually do not produce output back into the editor. Pre-defined variables (`%c` current folder, `%e` current file pathname, `%f` temp file pathname, `%p` temp files path, `%n` temp file name) can be used in the line (and the default `.txt` extension can be changed by appending, for example, `.ext` to the variable). Notes/comments can be added after the closing quote:

### One-liners examples
NB. Note only *single* backticks for one-liners, but still must begin in col 1.

`console.log(process.platform)`
```output
Error: Command failed: console.log(process.platform)
/bin/sh: 1: Syntax error: word unexpected (expecting ")")
,/bin/sh: 1: Syntax error: word unexpected (expecting ")")
```

*Mint:*
exec editor with file in current folder:
`xed '%cREADME.md'`
exec editor with temp file (%f):
`xed '%f'`
file management
`nemo`
explore folder and select file:
`nemo '%cREADME.md'`>
show storage devices:
`gnome-disks`
open firefox with href, or showing html text
`firefox <script>location.href= 'https://whatamigoingtodonow.net/'</script>`
`firefox <h1>Hello world!</h1>`
use bash direct
`echo $0;pwd;ls -al test/*`

*WSL:*
`"/mnt/c/Program Files/Notepad++/Notepad++.exe" "%cREADME.md"`
`/mnt/c/Users/ralph/AppData/Local/Microsoft/WindowsApps/notepad.exe "%cREADME.md"`
`chrome <h1>Hello world!</h1>`
`echo $0;pwd;cd ~;pwd;cat  .bash_aliases`
`echo 'alias ddd="ls -al"' > output.txt`
`cd ~;ls -al`


### Quickmath examples

Another useful *hover-exec* facility is *quickmath*. A math expression of the form `5-sqrt(2)=` anywhere will be evaluated on hover and the result will be shown immediately  in the hover message. Clicking the hover result will copy it to the clipboard. Note that the expression is surrounded by single backticks (backticks are the norm for *hover-exec*), and there needs to be `=` before the last backtick (essentially to stop popups for other backtick quoted strings).

A few more *quickmath* expressions: `254cm in inches=` will show 100inches in the hover message,  `[1,2,3,4]*5=`,  `cos(45deg)=`,  `sin(0.81)^2+cos(0.81)^2=`,  `cos(pi/2)=`,  `sin([10,45,90] deg)=`,  `range(0,4,0.5)=`,  `(2+2i)*(1+2i)=` , `3:6=`, `1:0.1:5=`, `7*7-7=` .

NB. Copy to clipboard with a click.

More information can be fount at [*mathjs 'math.evaluate'*](https://mathjs.org/docs/reference/functions/evaluate.html).

---
### html & javascript one-liners

`firefox <body style="background-color:#1d1d1d"><img src="%cHover-exec.gif"/>` //can use %c etc in one-liners
`firefox <script>location.href='https://whatamigoingtodonow.net/'</script>` //browser with url
`firefox <h1 align='center' >this: %c</h1><br><h3 align='center' >or this: /%c</h3>`
`js console.log(7*7-7)`
`vm progress(''+(7*7-7),4000)`  //quick calculator output via 4sec message..

---
### audio one-liners

`firefox <h2>French nuclear test<br>Recorded in New Zealand 1996</h2>Played much faster than real time<br><audio id="a2" controls autoplay src="media/fnt2b.mp3"/>` //mint ok
`chrome <audio id="a2" controls autoplay=true src="media/fnt2b.mp3"/>`
`mpv "%cmedia/fnt2b.mp3" ` //*mint* ok but not *wsl*
`zsh "%cmedia/fnt2b.mp3" ` //*mint* ok, but needs two hits, *wsl* fails
`"/mnt/c/Program Files (x86)/Windows Media Player/wmplayer.exe" "%cmedia/fnt2b.mp3"`
`bash mpv "%cmedia/fnt2b.mp3" `

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

```gnuplot
$speed <<EOD
#inhere %ctest/misc_tests.md `#p1` // hover to view the data
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
  'julia',     'lua',
  'lua54',     'node',
  'octave',    'python',
  'python3',   'r',
  'rterm',     'scilab',
  'scilabcli'
]
```

The indication to *hover-exec* that the REPL should be used is to append a second colon. In other words, the command line looks like `id:command:`  Optionally, after the second colon, `restart` can be appended to indicate that the REPL should be restarted.

```python3::restart  # restart resets the python REPL
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

```python3::  # this will continue from the last with variable and functions intact
from time import time
b=b+1
b=>>6000601
"time from the restart",time()-t
b # this now produces output because the repl is being used
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
  julia: 'julia "%f.jl"',
  juliamac: '/Applications/Julia-1.6.app/Contents/Resources/julia/bin/julia "%f.jl"',
  lua: 'lua "%f.lua"',
  lua54: 'lua54 "%f.lua"',
  matlab: 'matlab -nodesktop -sd "%p.m/" -batch temp',
  node: 'node "%f.js"',
  octave: 'octave "%f.m"',
  pascal: 'fpc "%f.pas" -v0 && "%ptemp" ',
  pwsh: 'pwsh -f "%f.ps1"',
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

Basically if the command works in the terminal (using the full file name of course), and returns output to the terminal, then it will work as a *hover-exec* command  (on Windows, use "double quotes" if there are spaces in the file path).

For example, on windows, *hover-exec* will run the following script as a `cmd.exe` `.bat` file, because `.bat` files autostart `cmd.exe` :

```%f.bat //demo cmd execution (windows) without script setup
@echo off
dir *.json
echo Congratulations! Your batch file was executed successfully.
```

There is also a set of strings called `swappers` which enable moving the output of a line so that it appears *in-line*, within the codeblock itself and can be accessed in the *hover-exec* configuration.

As an example, the *swapper* for javascript (`vm`, `eval` & `node`) is `console.log('=>>'+($1))` which takes the line `($1)` and prints it starting with the string `=>>`.

The *swapper* for *julia* is `println(string(\"=>>\",$1))`, where the double quotes required by *julia* have to be escaped `\"` because they are part of a *json* string 

```js
sort=o=>Object.keys(o).sort().reduce((r, k)=>(r[k]=o[k],r),{});
console.log(sort(config.get('swappers')));
```
```output
{
  buddvs: "write('=>>'+$1);",
  eval: "console.log('=>>',($1))",
  go: "'=>>'+($1)",
  js: "console.log('=>>'+($1))",
  julia: 'println(string("=>>",$1))',
  lua: "print('=>>'..($1))",
  lua54: "print('=>>'..($1))",
  matlab: 'disp(["=>>"+($1)])',
  node: "console.log('=>>'+($1))",
  octave: "disp(['=>>' $1])",
  pascal: "writeln('=>>',$1);",
  pwsh: "'=>>'+($1)",
  python: "print('=>>'+str($1))",
  python3: "print('=>>'+str($1))",
  r: "cat('=>>',$1,'\\n')",
  rterm: "cat('=>>',$1,'\\n')",
  scilab: "mprintf('=>>'+string($1)+'\\n')",
  scilabcli: "mprintf('=>>'+string($1)+'\\n')",
  vm: "console.log('=>>',($1))",
  zsh: "'=>>'+($1)"
}
```

And the configuration for REPLs
```js
sort=o=>Object.keys(o).sort().reduce((r, k)=>(r[k]=o[k],r),{});
console.log(sort(config.get('repls')));
```
```output
{
  julia: [ 'julia', [ '-i -q' ], "print('\\f')", [], [] ],
  lua: [
    'lua',
    [ '-i' ],
    'print(utf8.char(12))',
    [],
    [ '^>.*?\\n', '', '^(>+ )+', '' ]
  ],
  lua54: [
    'lua54',
    [ '-i' ],
    'print(utf8.char(12))',
    [],
    [ '^>.*?\\n', '', '^(>+ )+', '' ]
  ],
  node: [
    'node',
    [ '-i' ],
    "console.log('\\f')",
    [],
    [ 'undefined\\n', '', '^(>+ )+', '' ]
  ],
  octave: [ 'octave', [ '-q' ], 'disp("\\f")', [], [] ],
  python: [
    'python',
    [ '-q', '-i', '-u' ],
    "print('\\f')",
    [ '^(\\S.*)$', '\n$1' ],
    []
  ],
  python3: [
    'python3',
    [ '-q', '-i', '-u' ],
    "print('\\f')",
    [ '^(\\S.*)$', '\n$1' ],
    []
  ],
  r: [ 'r', [], "cat('\\f')", [], [ '\\[\\d+\\]', '' ] ],
  rterm: [
    'rterm',
    [ '-q', '--no-echo' ],
    "cat('\\f')",
    [],
    [ '\\[\\d+\\]', '' ]
  ],
  scilab: [ 'scilex', [ '-nb' ], 'mprintf(ascii(12))', [], [] ],
  scilabcli: [ 'scilab-cli', [ '-nb' ], 'mprintf(ascii(12))', [], [] ]
}
```


---
### Using vm for configuration settings

*hover-exec* has the ability to view and alter its own config settings via *vm* or *eval* script (*node* can't access the vscode api)

#### Check settings

For a given codeblock, in the hover message for the command line there is a `config` link, If this is clicked, a new (executable) codeblock will be produced. In that codeblock will be the current setting for the codeblock script. For `python`:

```python
 # this is python 'code' example for config check
 # the following codeblock is produced by clicking *config* in the python hover
```

The first line shows the python config. So the start command is `python %f.py`. A basic check is if command line python should run when this command is run in a terminal (minus the `%f.py`).

#### Add new script language

If there is a need to add a new scripting language, say `newlang`, this can be done using the settings configuration for *hover-exec*, and following the obvious patterns.

It can also be done using `vm` or `eval` since the *vscode* configuration settings can be accessed with the scripts.

First write a fenced codeblock labelled newlang with the appropriate command - if this is done correctly the code block should execute in the new script

```newlang %f.nu
-- a newlang comment line
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
```output
editor font size= 12
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


# Hover-exec basic tests

The following basic tests are carried out with the code block id `js` . This requires nothing other than `vscode` and the `hover-exec` extension to be installed, and will use `vscode`'s built in `vm` for exec. For each test, what should happen or be seen is commented. The two remaining main sections after this are 'Misc tests' which covers other scripting languages and REPLs, and 'Script tests' which includes some benchmark style tests.

### Hover
Opening a markdown file (eg. this one) in the vscode editor will activate the `hover-exec` extension. To check, after opening the editor, hover over the start line `js ...` or end line of the code block. The following hover message will appear:

      >   hover-exec: js [`config`] [`ref`] [`delete block`]
      >   open: [`last script`] [`last result`]
      >   `js //this is a code block with id 'js'`

The message shows `hover-exec` followed by the code block id (`js`). The bottom line (with the comment) provides the main `exec` function.

```js   //this is a code block with id 'js'
alert('hello world')
console.log('goodbye world')
```

### Exec
When the bottom line of the hover message is clicked the script will execute, and, in accordance with the script,  an 'alert' box will appear (bottom right of the vscode window) with `(i) hello world` in it.

Other 'clickable' areas will provide information as follows:

Hover over [`last script`] to show the `path/name` of the code to be executed. Clicking that will open the file in the editor. The contents of the block will be in the file if the script has been executed. Similarly, `last result` will show any text output that was produced. There will be no content for the above case, but when the following script is executed, the `last result` command should show the same output seen in the editor:

```js //when executed 'hello world' will be visible in a following code block titled 'output'.
// The 'random' function call is included so changes to the output are noticeable
console.log('    > hello world '+(3+Math.random()))
```

The file accessed via `last result` in the hover message will also show 'hello world'. Hovering  over the first or last line of the output block will show two options, `delete output` and `output to text`. The last option simply removes the code block triple backtick lines, leaving the contents as markdown text:

    > hello world 1.234...

Also, a brief note (see later) that `hover-exec` *quickmath* is enabled - just type a math expression inside single backticks and end with `=`, eg. `7*7-7=`. Hovering over the expression will show the answer (using *mathjs evaluate*). Clicking the answer will copy it to the clipboard.

### Other information from the hover

When hovering over the main code block start or end lines below:

```js
console.log('the meaning of life: ', 7*7-7)
```
```output
the meaning of life:  42
```

The right hand `[delete block]` option will delete the code block (`ctrl-z` if it's an accident!)

The `[ref]` option will provide some further information on possible shortcuts that can be used in command lines (none of these are useful for `js` itself though)

```js
//show the [ref] output
```
```output
*hover-exec:* predefined strings:
 - %f `full_path/name.ext` of temp file
 - %p `full_path/` for temporary files
 - %c `full_path/` of the current folder
 - %e `full_path/` of the editor file
 - %n `name.ext` of temporary file
 - The default ext is specified by appending .ext, eg. %f.py
 - In windows, if needed, /%f etc produces /c:/linux/web/style/path/
Currently:
% f = /home/rm/.config/Code/User/globalStorage/rmzetti.hover-exec/temp.js
% p = /home/rm/.config/Code/User/globalStorage/rmzetti.hover-exec/
% c = /home/rm/Documents/hover-exec/
% e = /home/rm/Documents/hover-exec/test/tests_mint.md
% n = temp.js
```

And finally the `[config]` option will show the configuration entry for the command:

```js
//show the [config] output
```
```js :vm noInline
//this script can change, add or undefine a config setting
let s={"js":"vm"};
//s={"js":undefined}; //uncomment this to undefine js
let scripts=config.get('scripts');
let merge=Object.assign({},scripts,s);
if(await config.update('scripts',merge,1)){}
console.log('new config:',config.get('scripts.js'))
```

Note that the `[config]` output is in the form of another executable `js` code block. All of the entries that have been predefined can be viewed in this way, or by simply viewing the configuration entries in `vscode` settings for `hover-exec` (in the `settings.json` file). The script above offers the opportunity to change the setting (not recommended for the `js`  command above, at least not right now...)

### Execution via the keyboard, and in-line output

The `hover-exec` extension offers two further facilities. The first is that code blocks can be executed by using the keyboard shortcut `Alt+/` or `Opt+/` when the cursor is inside the code block. If the `Alt+/` or `Opt+/` is used when the cursor is inside an `output` code block, the output block is deleted.

The second is that output can be positioned in-line (within the code block) if this is appropriate:

```js //show calculation results in-line
let a='the meaning of life';
console.log('Normally output is shown in an output block');
console.log('which is positioned after the script.');
a+' is '+(7*7-7+Math.random()) =>>the meaning of life is 42.9900028834206
console.log('It can also be useful to display results');
console.log('next to the calculation which produced them');
```

Inline results are produced by using `=>>` at the end of a script line (as above). Note that in-line results do not need `console.log`, this is provided by the config section called `swappers`, which in effect 'swap' the output from the `output` block to the appropriate line in the original script.

Note that no checking is performed for in-line output. For example, it is not particularly useful to have in-line results produced inside a loop:

```js //in-line results in a loop (not recommended)
'this is ok...'=>>this is ok...
for (let i=0;i<5;i++){
    'i='+i+', i**2='+(i**2) =>>i=0, i**2=0
}
'but this ends up in the wrong place'=>>i=1, i**2=1
```
```output
=>>i=2, i**2=4
=>>i=3, i**2=9
=>>i=4, i**2=16
=>>but this ends up in the wrong place
```

Note that only the first result of the loop execution will made available in-line, the rest are left in the `output` block. If there are further in-line results requested, they will not appear in the right place. So: `do not request in-line results for statements in a loop!`

Also note that lines with `=>>` appended are not actually legal javascript. To produce legal javascript simply precede `=>>` with a comment marker, ie for javascript use `// =>>` This will still be updated on execution in the same way.

### Final comments

The above basic tests should all produce identical results to those shown after `hover-exec` has been installed in `vscode`.

Other 'test' files will look at a broader range of script languages, but the techniques above essentially apply to all.

# Hover-exec Misc tests

## Javascript tests

Commands:
> `js` or `js:vm` to use `vm`
> `js:node` to use node
> `js:eval` to use `eval`.

For javascript in the browser see the last code block.

### array operations

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
sample output:
hello hello hello

### timing in javascript (not using moment.js)

```js
const {performance}=require('perf_hooks');
//previous needed by node, ignored by eval & vm
let array1 = Array(1000000).fill(42);
let p=performance.now();
console.time('console timer')
let t=Date.now()
array1=array1.map(x => Math.random())
array1=array1.map(String)
performance.now()-p=>>524.8087039999664
console.timeEnd('console timer')
console.log(array1.slice(0,2))
console.log('hello ',Date.now()-t)
console.log('abc',Date.now(),'def')
```
sample output:
console timer: 352.565ms
[ '0.8274583877764645', '0.38997267766979515' ]
hello  353
abc 1639382858216 def

### using console.log

```js
let name='Fred'
'hello '+name+', how are you '+3+' doing, ok?'=>>hello Fred, how are you 3 doing, ok?
console.log('hello %s, how are you %s doing', name,3,', ok?')
```
sample output:
hello Fred, how are you 3 doing , ok?

---

### speed of eval vs Function within javascript code

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
sample output:
check, result= 42
140 msec


Note alternatives:
- 1e6 `js:node`: using Function, 644msec, using eval, 180msec
- 1e6 `js:eval`:   using Function, 550msec, using eval, 158msec
- 1e6 `js` (vm):  using Function, 840msec, using eval, 370msec
- in the debugger use 1e5 (crashes for 1e6), `vm, eval` much slower


---

### Javascript in the browser
On windows use `html` to use the default browser, on linux use `html:firefox`, or `html:chrome` or whatever is installed, and, if needed, check the *hover-exec* configuration for `firefox` (or `chrome`)

```firefox //sample results in browser
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
Sample output is included in the displayed html.


### Plotting comparison

The data is provided for each using *hover-exec's* `inhere` function (hover over '#inhere' to see the data)


```firefox  //chartjs
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

```firefox //plotly
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

```firefox //google charts
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
 # swipe or cmd+tab to see plot
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


#### Data for the plots (tagged #p1, #j1, #go)

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

### Using scripts via REPL

Each of the script REPL examples below shows a 'restart' script followed by a normal continuation which shows the script variables are still available.

#### Check active REPLs

```js:eval //find active repl
chRepl.length=>> 6
let i=chRepl.findIndex((el)=>el[1]===repl)
i=>> 5
chRepl[i][0]=>> python
```

#### Using the python repl
`js:eval repl.kill()` //kills active repl (but use :restart)

```python3::restart
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
0.33997249603271484
```

```python3::
from time import time
b=b+1
b=>>6000603
time()
b # this now produces output because the repl is being used
```
```output
1639777512.3097332
6000603
```

There must be two colons after 'python3' to ensure REPL mode is used. Appending restart, restarts the REPL. Without the extra colon in the above codeblock, or executing without previously executing the 'restart' codeblock, the exec will fail because 'tt' will be undefined 

#### Lua repl
not working for macos yet

```lua::restart
m=1e7
n=0.01
tt = os.clock()
tt=>>0.0019
for ii=1,m do
  n=n*ii
  n=n+1
  n=n/ii
end
tt1=os.clock()-tt
tt1=>>0.584259
print('ok')
```

```lua:: --must have two ':'  for REPL mode
print(os.clock()-tt)
```

NB. See comments for the python example above.

#### Node repl

```js:node:restart
let a=0,b=0,c=0,d=0,e=0;
'ok'
```

```js:node:
a+=1 =>>3
b+=10 =>>30
c+=100 =>>300
```
NB. See comments for the python example above.

#### Julia repl

```julia::restart
x=rand(Float64);
a=rand(Float64,3);
print(string("a=",a,"\nx=",x));
```

```julia::
a=a.+1;_ 
x=x+1;_
print(a,'\n',x)
```
NB. See comments for the python example above.

#### Scilab repl

```js:scilabcli:restart
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

```js:scilabcli:
mprintf('a equals %.f',a)
mprintf('t equals %.2f',t)
a=a+1;
```
NB. See comments for the python example above.

#### Octave repl

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
time=1.9276 sec
speed=0.51879 million iterations per sec
```

```python:octave:
disp('I repeat...')
disp(strcat('time= ',num2str(t),' sec'))
disp(strcat('speed= ',num2str(m/t/1e6),' million iterations per sec'))
```

#### R (rterm) repl

```r::restart
a=7*7-7
a=>> 42 
print(noquote(paste('the meaning of life is',a)))
```
```r::
print(noquote(paste('.. that was',a)))
```

## Typescript

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

# Hover-exec script tests

The following tests will use an implementation of a simple 'benchmark' to demonstrate the use of a variety of script languages within a single markdown file Don't panic *python* users, it's a very simple benchmark - very similar to that from [javascript is fast](https://jyelewis.com/blog/2021-09-28-javascript-is-fast/) , adjusted to avoid potential floating point overflow.

### Javascript tests: 'vm', 'eval' and 'node'

The following code block can be executed with the code block identifier set to `js` or `js:vm` for the vscode `vm` to execute, to 'js:eval' for vscode's built-in `eval` to execute, or to `js:node` for nodejs to execute. Note that to execute with `nodejs`, that package must have been previously installed on the system and should be executable with the command `node`.

```js:node  //can be 'js' to use vm, 'js:eval' to use 'eval', or 'js:node' to use nodejs
//timing and speed results for the three alternatives should be similar
const {performance}=require('perf_hooks'); //ignored by eval & vm
let iter=1e8;
let n=0;
let t1=performance.now();
for (let i=1;i<=iter;i++){ n*=i;n++;n=n/i; }
let t2=performance.now();
let tot=(t2-t1)/1000;
console.log("total time ",Math.round(tot*100)/100," sec")
console.log("speed ",Math.round(iter/tot/1e6*10)/10," million iterations per sec")
```

> Example output (vm, eval & node are fairly similar)
> total time  0.47  sec
> speed  212.3  million iterations per sec

### Javascript in the browser

This will execute the same javascript code in the default browser:

```firefox
<script>
function test(){
let iter=1e8;
let n=0;
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
test()
</script>
```

> Example output
> Total time: 0.47 sec, safari 0.56
> Speed: 210.7 million iterations per sec, safari 179.9

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

> Example output
> total time 0.24 sec
> speed  4170 million iterations per sec

ie. about 20 times faster than javascript, 500 times faster than python

### Test using 'python'

Again, the appropriate `python` needs to be executed when the `python` command is executed in a terminal. For this run, 'python 3.8.7` was used. Note that fewer iterations have been used because it takes rather longer.

```python3 //speed test
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

> Example output
> total time  1.68  sec
> speed  5.958  million iterations per sec

ie. for this test javascript is about 30x faster than python

### Test using 'lua'

Lua must be installed, and the config startup script should match the installation. If `lua54` is installed, the config start command should use `lua54` - check the `hover-exec` configuration and make sure the command used matches you installation. Note that the the first bit of the id `js:lua` is used to provide some simple-minded syntax highlighting (via the `js` highlighter) - the hover message makes it clear that `lua` is the actual command.

```js:lua //10 million random number calls
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
total time 	2.37	 sec
speed 	42.01	 million iterations per sec
```

> Example output:
> total time 	1.05	 sec
> speed 	94.87	 million iterations per sec

So about 15x faster than python on this benchmark, and about half the speed of javascript.

### Pascal test

```js:pascal
//not checked for linux/wsl
program Hello;
  uses Math,SysUtils,DateUtils;
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
  writeln('time= ',t1:6:2,' sec');
  writeln('speed= ',m/t1/1e6:6:2,' million iterations per sec')
end.
```

> Example output:
> time=   1.03 sec
> speed=  97.09 million iterations per sec

That's about half the speed of the javascript code

### Octave test

```octave
a=1.0;
t=time;
m=1000000; # 1e6
for i=1:m
  a=a*i;
  a=a+1.1;
  a=a/i;
endfor
disp(strcat('time= ',num2str(time-t),' sec'))
disp(strcat('speed= ',num2str(m/(time-t)/1e6),' million iterations per sec'))
```
```output
time=2.1015 sec
speed=0.47148 million iterations per sec
```

> Example output:
> time=1.7275 sec
> speed=0.57593 million iterations per sec

That's one tenth of python's speed.

### Test using scilab

```js:scilabcli
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
Time: 0.52 sec
Speed: 1.92  million iterations per sec
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
time= 1.56 sec
speed= 6.41 million iterations per sec
```

>Example output:
>time= 1.79 sec
> speed= 5.583 million iterations per sec

About the same speed as python.



