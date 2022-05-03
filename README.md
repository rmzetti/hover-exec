# Hover-exec README

This is the README for the VSCode extension *hover-exec*. Once the extension is installed, the README, the READMORE and the test files are best viewed in the editor. This is because *hover-exec* is all about facilitating the execution of markdown codeblocks in the editor, and the README etc have many example codeblocks that can be executed to try it out.

To help with this, *hover-exec* provides a command to open the README in the editor:

- After the extension has been installed, type *ctrl+shift+p* to open the commands, then type *h*, and you will see the command *open the hover-exec README*. Click the command to open this README in the editor.

From inside the editor the following 'one-liners' are available - hover over the line, then click the command to open the file in the editor.   If the cursor is in the line the shortcut alt-/ or opt-/ can be used instead of the hover command.

`code %h/README.md`            - open the *hover-exec* *README* (this file) in the editor \
`code %h/READMORE.md`       - open the *READMORE*, which cover the same ground as the README but in more detail \
`code %h/test/basic_tests.md`  - open *basic_tests.md* for some basic test code blocks, mostly javascript (vm, eval, nodejs & browser examples) \
`code %h/test/misc_tests.md`   - open *misc_tests.md* for various benchmark tests and REPLs

In the above, %h is a hover-exec command variable giving the extension path.

- NB. If you are viewing this in a markdown preview, the one-liner commands are highlighted. They start in col 1, and start & end with a single backtick.

`js vscode.commands.executeCommand("markdown.showPreview", vscode.Uri.file('%e'))` //one-liner to show the preview for the current file.

Using *hover-exec* in the vscode editor on these files will allow live testing and comparison with the test outputs provided. Note that any changes made to these files will be reverted if *hover-exec* is updated, so save the file locally if you want to keep changes.

For more detail, [READMORE](https://github.com/rmzetti/hover-exec/blob/HEAD/READMORE.md).

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
    - [Cmd](#cmd)
  - [One-liners and quickmath](#one-liners-and-quickmath)
    - [One-liner examples:](#one-liner-examples)
        - [Default shell simple command execution:](#default-shell-simple-command-execution)
        - [exec notepad with file in current file's folder::](#exec-notepad-with-file-in-current-files-folder)
        - [exec notepad with temp file (%f):](#exec-notepad-with-temp-file-f)
        - [open another instance of vscode:](#open-another-instance-of-vscode)
        - [explore files, view folders:](#explore-files-view-folders)
        - [other examples:](#other-examples)
    - [Quickmath examples](#quickmath-examples)
  - [Configuration settings](#configuration-settings)
  - [Release Notes and Known Issues](#release-notes-and-known-issues)

---
## Features

*Hover-exec* facilitates execution from within the editor of fenced markdown code blocks in a variety of installed script languages. New script languages can be added with or without configuration. This extension is by no means intended as a replacement for the superb vscode notebooks. Instead it offers the opportunity, when working with markdown docs, to include 'live' calculations, results, code samples, demos, comparisons and useful links, using a range of possible scripts.

The *hover-exec* extension is activated when a markdown file is opened in the editor.

*Hover-exec* in action:

  ![](https://raw.githubusercontent.com/rmzetti/hover-exec/master/media/Hover-exec.gif)

In addition to executing scripts, *hover-exec* can execute a range of 'one-liners' and provides a quick calculation facility - see [One-liners and quickmath](#one-liners-and-quickmath).

---
## Basic hover-exec 

Hovering over fenced code block start or end lines which start with a triple backtick, or lines which start with a single backtick and include an end backtick, will trigger a hover message with an *exec* command in the bottom line. Clicking the command link on the bottom line of the hover message will execute the code in the code block, and produce output.

If the cursor is inside a fenced code block, the code can be quickly executed using the shortcut `Alt+/` or `Opt+/`.

Code blocks which are indented (ie. unfenced), fenced with '~', or not labelled, will not result in a hover message and are ignored by *hover-exec*.

There are three elements to a code block label that *hover-exec* utilises:
- *id* to indicate the script language being employed, used for syntax highlighting by *vscode*
- *cmdid* to indicate the command to use to execute the script (omitted if the same as *id*)
- *repl* or *restart* to indicate a REPL is to be used or restarted (see the READMORE)

Example code block labels - these are 'fake' (use quotes instead of backticks) to allow visibility in previews:

```
'''id : cmdid : repl  -- the general format - spaces can be omitted around the :
'''python    --a python code block, here id & cmdid are both python
'''js : eval   --a javascript code block which uses eval for execution
'''octave     --uses octave as both id & cmdid
'''python:octave  --python is id for syntax highlight, octave is cmdid for execution
'''output     --output blocks are produced by executing scripts
```

There is a comment in the READMORE about the code block label when also using *markdown preview enhanced*.

---
## Javascript scripts

Javascript code blocks can be executed using the `vm` module, also by using *vscode*'s built in `eval` - and also through [nodejs](#nodejs) or a *browser*.

### Examples using vm and eval

The code block label `js`  by itself defaults to executing javascript via the built-in `vm` module. Using `js : eval` will instead execute the code block using *vscode*'s built in *eval*.

```js     //click the *exec:* line at the bottom of the *hover* to execute the block
//'''js  //this comment is to show the command line in markdown previews
//       //the default for the `js` command is to execute using the `vm` module
console.log("Note the in-line random number result")
'test: '+Math.random()  =>>test: 0.5918216346770233
```
>      Test output:
>      Note the in-line random number result

Intermediate results can be viewed in line, as above, by appending `=>>` instead of using `console.log()` . When this is done the line effectively becomes the argument of a console.log (or the equivalent in other scripts), and should not be terminated with ;

Other results are produced in an `output` block. Hovering over the `output` id of an output code block provides options *output block to text* or *delete output block*. If the block has recently been executed, a third option *all output to text* will provide the full output as in the *temp...* output file generated.  Using the shortcut `Alt+/` or `Opt+/` with the cursor in the `output` block deletes the block.

---
A couple more examples using `js`, showing use of *vscode* api functions and some extra functions published by *hover-exec* (eg. `alert`).

```js  :eval
//'''js :eval  //appending :eval uses *vscode*'s eval instead of the vm
let abc="hello, world 3"
alert(abc) //alert produces vscode alerts - not available in nodejs scripts
let a='goodbye world'
vscode.window.showInformationMessage(a) //not available in node scripts
let b=3;
2*b*Math.random() // =>> 2.3470376208640706
eval('let b=3; 2*b*Math.random()') // =>> 2.757493399289601
console.log(a,Math.random())
'hello '+(2-1+Math.random()) // =>> hello 1.8468812061012565
process.cwd() // =>> c:\Users\rmZetti\GitHub\hover-exec
console.log(abc)
```
>      Test output: see also alert box bottom right
>      goodbye world 0.46809536348325254
>      hello, world 3


---
A regex tester using the *javascript* vm (try clicking *clear output* before *exec*):

```js
//'''js  //javascript regex tester
'abcdefg'.replace(/^.*(bc)/,'$1--') =>>bc--defg
```

A regex tester using *vscode*'s eval:

```js : eval
//'''js : eval // javascript regex tester using eval
'abcdefg'.replace(/^.*(bcde)/,'$1--') =>>bcde--fg
```

---
All the code blocks above can be executed using either `eval` or `vm`.
The difference is that `vm` scripts are executed within a more restricted *context* - see [READMORE](READMORE.md) .

In the command line (eg. above), using `js` for the code block id produces javascript syntax highlighting (it's a quick and dirty approach to provide basic syntax highlighting for a range of scripts), then adding `:eval` sets the actual exec command to `eval`.

Note that `vm` and `eval` both allow the internal *vscode* API to be used. Installation of `nodejs` is not required for `vm` or `eval` scripts to execute.

See [READMORE](READMORE.md) for more information and examples.

---
### Using nodejs

The `js:node` command executes a javascript code block in `nodejs` (assuming, of course, `nodejs` has been installed). 

```js  {cmd=node} : node
//'''js {cmd=node} : node  // :node changes the js command to use nodejs
//      {cmd=node} is to allow execution in markdown preview enhanced (mpe)
//                        mpe requires {..} to be placed immediately after the js command
console.log('  using node:\n  '+Math.random())
console.log('  Note: hover-exec on the output line, or alt+/ (opt+/) with\n',
    ' the cursor in the output block will delete the output block')
```
>      Test output:
>      using node:
>      0.43884249391182095
>      Note: hover-exec on the output line, or alt+/ (opt+/) with
>      the cursor in the output block will delete the output block

---

### Html and javascript

A simple html 'script' which will open in the default browser:

```html
<!-- '''html  //Hello world -->
<h1 align='center'>Hello world</h1>
<p>Html will be displayed in the browser
<p id='test'>Text here</p>
<script>
document.getElementById("test").innerHTML="<em>Text via javascript</em>"
</script>
```

A more complex html script, including a more substantial javascript component:

```html
<!-- '''html // tunnel *what am I going to do now* -->
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

Command lines to conveniently start a number of other scripts are included (see [Configuration settings](READMORE.md#configuration-settings) for the actual command lines used). Some examples:

- [python](#python)
- [julia](#julia)
- [octave](#octave)
- [scilab](#scilab)
- [lua](#lua)
- [gnuplot](#gnuplot)
- [powershell](#powershell)
- [bash & zsh](#bash-&-zsh)
- [cmd](#cmd)

Notes:
- The script language you wish to use (eg `julia`, `nodejs` ..) needs to have been installed in your system
- Some of the commands to run the scripts ***may need customising*** to suit your particular installation - see [READMORE: Configuration settings](READMORE.md#configuration-settings).
- Other script languages may be added. In basic usage the script command can be entered via '[config]' in the hover. To achieve in-line capability, use the *hover-exec* extension settings, or as an alternative, this can also done with `eval` - see the [READMORE](READMORE.md) for examples.
- For other script language examples see the [READMORE](READMORE.md)

---
### Python

Depending on your system setup you may need to use the *python3* command. But in either case, the command block id should be *python* to ensure vscode provides syntax highlighting.

```python
# '''python :python3 #<- append this to use 'python3' as start command
from random import random
45-2+random()       #  =>>43.6264875741003
'hello, world 3!'       #  =>>hello, world 3!
print('python ok')
```
>      Test output (also see inline output):
>      python ok

Note that the inline indicator `=>>` has been prefixed by a python comment character `#` (only spaces allowed after) so that, for example, *markdown preview enhanced* will execute the code. *hover-exec* will still update the in-line output, but *mpe*, of course, will not. If *mpe* is installed, try it by including '{cmd}' after the *'''python* command id, separated using spaces.

---
### Julia

If the *julia* extension is included, *vscode* will provide syntax highlighting. Note that when doing this test, you will need to ensure *julia* has the appropriate packages available (see the *using* line in the example script below). The following one-liner could be used to do this for the script below (if you're reading this in the preview, the one-liner is surrounded with single backticks and starts in col 1):

`julia using Pkg;Pkg.add("LinearAlgebra");`

**Note:** these may often take some time, sometimes about 5 minutes for me... there will be an *executing julia* message in the *vscode* status bar, and there will be *output* when they are complete.

```julia
# '''julia
using LinearAlgebra # this package is not needed if dot(a',a) is commented out
a=rand(Float64,3);
a   # =>>[0.8999280817338797, 0.05500849893486204, 0.8299019559590521]
a'*a # =>>1.5016337437529477
dot(a',a) # =>>1.5016337437529477
b=a;b[2]=42;  # demonstrates that arrays are shallow copied here
println(string("a=",a,"\n","b=",b))  # double quotes only for julia strings
```
>      Test output (also see inline output):
>      a=[0.8999280817338797, 42.0, 0.8299019559590521]
>      b=[0.8999280817338797, 42.0, 0.8299019559590521]

Julia can also be executed in *mpe* by appending '{cmd}' after the command id (separated with a space).

---

### Octave

Use `octave` or `python : octave` to run octave. Using 'python' as the command id provides syntax highlighting, adding :octave uses *octave* for execution.

```python :octave
 # '''python:octave {cmd=octave} -- {cmd..} is for mpe
 # using '''python:octave instead of just '''octave gives syntax highlighter
 # nb. need mat2str or num2str for numeric output
num2str(7.1+rand(1))  =>>7.8169
'hello world in-line'  =>>hello world in-line
pwd()  =>>c:\Users\rmzetti\GitHub\hover-exec
disp('hello world in output section!')
disp(rand(1))
```
>      Test output (also see inline output):
>      hello world in output section!
>      0.1295

---
### Scilab

Scilab generally won't have syntax highlighting - identifying the code block as *js* will provide some quick and dirty highlighting (not infallible, but generally helpful..)

```js :scilab 
//'''js :scilab //using js :scilab provides quick & dirty (js) syntax highlight
  //nb. scilab needs to use 'string()' for inline numeric output (uses mprintf)
rand("seed",getdate('s')); //set new random sequence
mprintf('%s\n','test '+string(rand())+' '+pwd());
string(rand())+' '+pwd() =>>0.9321708 c:\Users\rmzetti\GitHub\hover-exec
string(rand()) =>>0.3329656
//disp('disp puts quotes around strings',rand())
```
>      Test output (also see inline output):
>      test 0.3161717 c:\Users\rmzetti\GitHub\hover-exec

---
### Lua

Lua has a syntax highlighter available for *vscode*. Many installations however require running, say, *lua51*, or *lua54*, rather than updating and setting *lua* as the run-time (unlike, say, *julia*). So use 'lua : lua54' as the command id, etc., or check/adjust the *hover-exec* script config.

```lua  -- say hello & goodbye
--'''lua :lua54 -- 'lua' id specifies syntax highlight and default start command
--                  adding ':lua54' means use 'lua54' as start command
'hello ' .. 44-2+math.random() -- =>>hello 42.046598765538
"& goodbye " .. math.pi+math.random() =>>& goodbye 3.3082099849202
print("lua ok") -- this outputs in the output code block below
```
>      Test output (also see inline output):
>      lua ok

---
### Gnuplot

*Gnuplot* is a very useful stand-alone plotting facility. Assuming *gnuplot* has been installed,  it can be executed within *hover-exec*. In addition, other scripts can output *gnuplot* commands (along with data) in their output block and the data can be immediatedly plotted in a chained fashion (see the  [READMORE](READMORE.md)).

```gnuplot {cmd} # cmd is for markdown preview enhanced
# '''gnuplot //here gnuplot is being used stand-alone
#   tagging the data allows it to be used in another script (see next)
$charge << EOD
#tag1
"2-07-2021 22:32", 44,
"3-07-2021 13:34", 42,
"4-07-2021 14:22", 39,
"5-07-2021 15:10", 32,
"5-07-2021 23:57", 21,
"6-07-2021 18:10", 100,
"7-07-2021 17:02", 95,
"7-07-2021 22:46", 93,
"8-07-2021 16:38", 91,
"9-07-2021 16:08", 87,
"16-07-2021 23:30", 66,
#tag1
EOD
set datafile separator comma
timefmt = "%d-%m-%Y %H:%M"
set format x "%d-%m" time
set mouse mouseformat 3
plot $charge u (timecolumn(1,timefmt)):2 w lp pt 7 ps 2 ti "charge"
```
![[2021-08-31-20-28-22.png]] (this 'wiki' type link is enabled in the editor using *markdown memo*)

The above is a *png* file created (using the *paste image* extension) from a copy of the plot window.

If you don't have 'gnuplot' installed, here is the same plot in 'plotly', shown in the browser.
The data in the above script is used by utilising the '#inhere' tag '#tag1'

```html //plotly
<!-- '''html //test using plotly -->
 <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<div id="plot" style="width:80%;height:500px"></div>
<script>
let lm='lines+markers'
let a=[#inhere  `#tag1`] //hover here to see the data from the previous script
let x1=Array(a.length/2).fill(0).map((x,i) => a[i*2])
let y1=Array(a.length/2).fill(0).map((x,i) => a[i*2+1])
plot1 = document.getElementById('plot');
Plotly.plot( plot1, [{ x: x1, y: y1, mode: lm, name:'pascal'}]);
</script>
<a href="https://bit.ly/1Or9igj">plotly.js documentation</a>
```

---
### Bash & zsh

*Bash* and *zsh* scripts can be run for appropriate systems:

```zsh    # (macos) show current directory
# '''zsh # (macos) show current directory
pwd
```  
>      Test output:
>     /home/rmzetti/hover-exec


```bash # (macos, linux, wsl) show current directory
#'''bash # (macos, linux) show current directory
pwd
```
>      Test output:
>     /home/rmzetti/hover-exec

---
### Powershell

Powershell scripts can be run, usually in *windows*

```pwsh #  random number, show current directory
# '''pwsh # random number, show current directory
# $PSStyle.OutputRendering = 'PlainText'   # stops color codes appearing in output
Get-Random -Min 0.0 -Max 1.0 # =>>0.804137573020597
pwd
```
>      Test output (also see inline output):
>      Path
>     ----
>      C:\Users\rmzetti\GitHub\hover-exec

---
### Cmd

Cmd executes cmd.exe in Windows and runs a batch file with contents from the code block.

```cmd
@pwd
@echo "hello world 3"
```
>      Test output:
>      c:\Users\..\GitHub\hover-exec
>      "hello world 3"

Because cmd.exe is the default windows child-process, if the default is being used, one-liners can directly exec cmd commands:

`pwd & @echo "done"` //direct execution of cmd commands in one-liners
>      Test output:
>      c:\Users\...\GitHub\hover-exec
>      "done"

---
## One-liners and quickmath

*One-liners* starting with a single backtick *in column 1* and ending with a single backtick can also be executed with hover-click or the alt-/ or opt-/ shortcut. The pre-defined command variables %c current workspace folder path, %d current file path, %e current file path+name, %f temp file path+name, %g temp file path, %n temp file name can be used (the derived path will be seen in the hover). Comments can be added after the closing quote.

Another useful facility is *quickmath*. A math expression of the form `5-sqrt(2)=` (does not need to start in column 1) will be evaluated on hover (using *mathjs* `math.evaluate(..)`) and the result will be shown immediately  in the hover message. Clicking the hover result will copy it to the clipboard. Note that the expression is surrounded by single backticks, and there needs to be '=' before the last backtick (essentially to stop popups for other backtick quoted strings).

---
### One-liner examples:

All these example commands are surrounded with single backticks, eg  *\`pwd\`*.
They must start in col 1.

##### Default shell simple command execution:
(result depends on the default shell for vscode on your system)

`pwd`  zsh, bash, pwsh, cmd \
`ls`  zsh, bash, pwsh \
`dir` cmd

##### exec notepad with file in current file's folder::

`notepad "%d/READMORE.md"`  --windows \
`open -a textedit "%d/README.md"`  --mac \
`gedit "%d/READMORE.md"`  --linux/wsl \
`xedit "%d/README.md"`  --linux/wsl

##### exec notepad with temp file (%f):

`open -a textedit "%f"` --mac \
`notepad "%f"`  --windows \
`xedit "%f"`  --linux/wsl

##### open another instance of vscode:

`code -n %e`  -- %e is current file -- mac, windows, linux, wsl 

##### explore files, view folders:

`open -a finder ~`  mac 'home' \
`open -a finder "%c"`  mac to view current workspace folder \
`explorer ,`  windows view 'ThisPC' \
`explorer /select, "%E"` windows explorer - view current file's folder & select the file, needs %E not %e \
`nemo "%e"`  Linux mint view current folder & select file

##### other examples:

`devmgmt.msc` for windows show devices \
`system_profiler SPHardwareDataType` for mac show hardware info \
`html <script>location.href= 'https://whatamigoingtodonow.net/'</script>`  windows default browser with href \
`html <h1>Hello world!</h1>` windows default browser with some html \
`safari <script>location.href= 'https://whatamigoingtodonow.net/'</script>`  mac safari with href \
`safari <h1>Hello world!</h1>` mac safari with some html \
`firefox <script>location.href= 'https://whatamigoingtodonow.net/'</script>`  linux firefox with href \
`firefox <h1>Hello world!</h1>` linux firefox with some html \
`chrome <script>location.href= 'https://whatamigoingtodonow.net/'</script>`  wsl chrome with href 

There are many more one-liner examples in the READMORE.

### Quickmath examples

And finally, some *quickmath* expressions. As before these are surrounded with backticks. They do not have to start in col 1, but must have `=` just before the last backtick.

If viewing in preview, for example, the first expression is actually written ***\`254cm in inches=\`*** 

So `254cm in inches=` will show 100 inches in the hover message, using [*mathjs 'math.evaluate'*](https://mathjs.org/docs/reference/functions/evaluate.html).

More examples to try:  `[1,2,3,4]*5=`,  `cos(45deg)=`,  `sin(0.81)^2+cos(0.81)^2=`,  `cos(pi/2)=`,  `sin([10,45,90] deg)=`,  `range(0,4,0.5)=`,  `(2+2i)*(1+2i)=` , `3:6=`, `1:0.1:5=`, `7*7-7=` .

NB. You can copy the answer in the hover to the clipboard with a click.

---
## Configuration settings

For configuration settings see [READMORE](READMORE.md#configuration-settings)

---

## Release Notes and Known Issues

This is a beta version.

Note that in all the demos above, except *js:vm* and *js:eval* which allow definition of *global* variables and functions, the script starts from scratch when the code block is executed. In other words, assigned variables do not carry over into the next script execution. This kind of approach is best suited for small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages.

Scripts can also be run using their REPL version, if this is available - eg. for node, lua, octave, scilab, r, julia - see the [READMORE](READMORE.md#using-scripts-via-repls), or [misc_tests](test/misc_tests.md). For REPLs, successive script execution will recognise previously defined variables and functions.

There is also an *include* capability, known as `#inhere` (to distinguish from *includes* in scripts) - see the [READMORE](READMORE.md) for details and examples.

---

Initial beta release was 0.6.1
Published using: vsce package/publish


todo:

- [ ] check links are links to github, not to local files
- [ ] remove this list


