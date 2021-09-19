# Hover exec

This is the READMORE for VS Code extension *hover exec*. If tldr, check [the README](README.md) instead.

- [Hover exec](#hover-exec)
  - [Tester](#tester)
  - [Features](#features)
  - [Basic hover-exec](#basic-hover-exec)
    - [with nodejs](#with-nodejs)
    - [with vscode's eval](#with-vscodes-eval)
    - [Scripts with default command lines](#scripts-with-default-command-lines)
    - [Using eval](#using-eval)
    - [Using eval for configuration settings](#using-eval-for-configuration-settings)
      - [Check settings](#check-settings)
      - [Add new script language](#add-new-script-language)
      - [Show other vscode config settings](#show-other-vscode-config-settings)
    - [Using node or eval for general calculation](#using-node-or-eval-for-general-calculation)
  - [Quick scripts](#quick-scripts)
  - [One-liners](#one-liners)
    - [One-liners & non built-in command examples](#one-liners--non-built-in-command-examples)
    - [Windows - control panel](#windows---control-panel)
    - [html & javascript](#html--javascript)
    - [audio one-liners](#audio-one-liners)
    - [One-liners for microsoft management console mmc](#one-liners-for-microsoft-management-console-mmc)
  - [Links](#links)
  - [Some examples for built-in scripts](#some-examples-for-built-in-scripts)
      - [Lua](#lua)
      - [Powershell](#powershell)
      - [Gnuplot](#gnuplot)
      - [Buddvs](#buddvs)
      - [Javascript using eval](#javascript-using-eval)
      - [Javascript using node](#javascript-using-node)
      - [More eval and node examples](#more-eval-and-node-examples)
  - [More Hover-exec examples](#more-hover-exec-examples)
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

## Tester


`notepad %caa.html`                   //exec notepad with current file using shortcut
`notepad {temp=temp.py} %f`     //exec notepad with temp file `temp.py`
`notepad %f.out.txt`        //& with temp output file (temp.txt.out.txt)
`js console.log(7*7-7)` //make room
`eval progress1(''+(7*7-7),4000)`  //calculator output via message
`"C:/Program Files/Notepad++/notepad++" %e`  //exec notepad++ with current editor file
`html <script>location.href='https://whatamigoingtodonow.net/'</script>` //browser with url
`html <script>location.href="/%caa.html"</script>` //browser with html file - %c etc in one-liners only
`html <h1 align='center' >Hello %c</h1><br><h1 align='center' >Hello /%c</h1>`    //default browser text

```js :eval
// ```js :eval`
console.log('current directory: '+process.cwd())
eval('let a=5;a+Math.random()')=>> 5.487612665312444
```
```python {cmd matplotlib}
// ```python  {cmd matplotlib}`
import numpy as np
import matplotlib.pyplot as plt
randnums= np.random.randint(1,101,150)
plt.plot(randnums)
plt.show()
```
```newscript
this is a test of newscript
```
```notepad %f
Use %f to open this codeblock in notepad
```
```>"C:\Program Files\Notepad++\notepad++" %f.py
this is now in the temp.py file
```
```matlab
pwd   =>>C:\Users\ralph\AppData\Roaming\Code\User\globalStorage\rmzetti.hover-exec
7*7-7 =>>42
% Speedtest
```
```orpr
```

## Features

*Hover-exec* facilitates execution from within the editor of markdown code blocks in a variety of installed script languages. New script languages can be added or used without configuration. 

The extension is activated when a markdown file is opened in the editor.

Hover script exec in action:

  ![](https://rmzetti.github.io/Hover-exec.gif)
  [also here](https://github.com/rmzetti/hover-exec/blob/master/Hover-exec.gif)
  [or here](https://raw.githubusercontent.com/rmzetti/hover-exec/master/Hover-exec.gif)

## Basic hover-exec 

Hovering over lines starting with ` ``` ` (or starting with a single backtick and including an end one) will trigger a hover message with an *exec* command in the bottom line, as above. Hovering over ` ``` ` at the end of a block will trigger the message for the start of the block. Clicking the command link on the bottom line (or using the shortcut `Alt+/` or `Opt+/` with the cursor anywhere in the block) will execute the code in the code block, and produce output.

---
### with nodejs

The js command by default executes a javascript code block in `nodejs` (assuming that is installed).

```js //will execute if node is installed
// ```js   this comment shows the command in markdown previews`
console.log('  test using node:\n  '+Math.random())
console.log('  Note: hover-exec on ```output line`, or alt+/ (opt+/) with\n',
    ' the cursor in the output block will delete the output block')
```
```output
  test using node:
  0.5661140404337932
  Note: hover-exec on ```output line`, or alt+/ (opt+/) with
  the cursor in the output block will delete the output block
```

Notes:
- ` ```node` or ` ```javascript` can also be used
- Include `{cmd=node}` in the command line to allow execution also in *markdown preview enhanced* (in-line output will not be available)

---
Another example:

Note that either of these codeblocks can be executed in either *hover-exec* or *markdown preview enhanced* (if you're viewing this also in *mpe*, you can try it both ways)

```js {cmd=node}
//```js {cmd=node}`
console.log(process.cwd())
console.log('test using node: '+Math.random())
let a=5;console.log(a+Math.random())
```

### with vscode's eval

Javascript code blocks can also be executed in *vscode's* internal javascript by using `eval`. Note that using `js` for the codeblock id produces syntax highlighting (it's a quick and dirty approach to provide basic syntax highlighting for a range of scripts), then adding ` :eval` sets the actual exec command to `eval`. Note that `eval` allows the internal vscode API to be used. Variables `a,..,z` have been made available for use by the eval script without fear of overwriting an internal variable. Installation of `nodejs` is not required for `eval` scripts to execute.

```js :eval
// ```js {cmd=eval}
'test: '+Math.random() //= test: 0.39936728047794534 
```
Intermediate results can be viewed in line by appending a line with a three character `=>>` . To be compatible with the *markdown preview enhanced* extension (*mpe*) put a 2 character comment character before the `=>>', eg. for javascript use `// =>>', for python '## =>>'.  *mpe* will not update the inline comment. 

---
### Scripts with default command lines

Command lines to start a number of scripts are included:

- javascript (via node)
- eval (built in javascript, with vscode api available)
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

The script language you are using (eg `julia`,`nodejs`) needs to have been installed, and ***some of the commands to run the scripts may need customising*** to suit your particular installation - see [Changing script configuration](#changing-script-configuration).

Other script languages may be added - see [Adding another script](#adding-another-script).




---
### Using eval
The `eval` command allows the use of vscode's internal javascript and the vscode api. This command is not available in *markdown preview enhanced*.

Again, using ` ```js :eval` rather than ` ```eval` provides syntax highlighting. The space befor the `:` will also produce syntax highlighting in *mpe* (although, as noted, `eval` can't be execute in *mpe*)

```js :eval
// ```js :eval`
let s='abcd efg hik'
s.indexOf('ef') // =>> 5
s.slice(0,s.indexOf('fg')) // =>> abcd e
//console log writes to output codeblock
console.log('current directory: '+process.cwd())
let a=5;console.log('a= '+a+Math.random())
//alert('hello') //this can be used in eval, but not js (node)
let b=10; //inline output statements must stand on their own
'b= '+(b+Math.random()) // =>> b= 10.327066158992954
```
```output
current directory: c:\Users\ralph\OneDrive\Documents\Notes
a= 50.3214014190202372
```

---
### Using eval for configuration settings

*hover-exec* has the ability to view and alter its own config settings via the *eval* script (*node* can't access the vscode api)

#### Check settings

For a given codeblock, in the hover message for the command line there is a `config` link, If this is clicked, a new (executable) codeblock will be produced. In that codeblock will be the current setting for the codeblock script. For `python`:

```python
 # this is python 'code' example for config check
```
```js :eval noInline
//to get this block, click the 'config' link at the top of the python hover
//this script can change a config setting, or add/undefine a new one
let s={"python":"python \"%f.py\""};
//let s={"python":undefined}; //will undefine python
let scripts=config.get('scripts');
let merge=Object.assign({},scripts,s)
if(config.update('scripts',merge,1)){}
```

The first line shows the python config. So the start command is `python %f.py`. A basic check is if command line python should run when this command is run in a terminal (minus the `%f.py`).

#### Add new script language

If there is a need to add a new scripting language, say `newlang`, first write a fenced codeblock labelled newlang:

```newlang
//a newlang comment line
```

Then hover over the command line and click config. In this case, we get the following: 

```js :eval noInline
//this script can change a config setting, or add/undefine a new one
let s={"newlang":"put_start_command_here %f.txt"};
//let s={"newlang":undefined}; //will undefine newlang
let scripts=config.get('scripts');
let merge=Object.assign({},scripts,s)
if(config.update('scripts',merge,1)){}
```

The first line provides the `newlang` setting command. Replace `put_start_command_here` with the `newlang` start command, and change the `txt` extension at the end if necessary. If backslashes are used in a path, they should be doubled (ie. escaped) `\\`. Similarly if `"` is used it should be entered as `\"`

Once the script has been set up, execute using the hover in the usual way, then delete the block. Check it as in the previous section or open *hover-exec* settings and view the JSON settings file. All settings can also be changed using that file.

---
#### Show other vscode config settings
Other configuration settings can also be viewed
```js :eval noinline
// ```js:eval {noinline}  --eval is not available in mpe`
let c=vscode.workspace.getConfiguration('');
console.log("editor font size= "+c.get("editor.fontSize"))
//c.update("editor.fontSize",12,1) //to change it
```
```output
editor font size= 12
```

### Using node or eval for general calculation

```js {cmd=node}
// ```js {cmd=node}`
process.cwd()                  =>>c:\Users\ralph\OneDrive\Documents\Notes
'test: '+Math.random()   =>>test: 0.2614999096087096
let a=5;console.log(a+Math.random())
```
---
## Quick scripts

These examples do not use any predefined configs,  just a command and %f to indicate the codeblock temp file is to be used (the default %f ext is `.txt` ... this can be changed by appending the desired ext as in the first example - many programs will need a specific ext to run)

```lua51.exe %f.lua
print("hello & goodbye")
math.randomseed(os.time())
```

```notepad %f   //this is a comment
print("hello & goodbye")
math.randomseed(os.time())
```

```"C:\Program Files\Notepad++\notepad++" %f
Check this out
```


---
## One-liners

*One-liners* starting and ending with single backticks will simply be executed on click, and usually do not produce output back into the editor. Pre-defined variables (`%c` current folder, `%e` current file pathname, `%f` temp file pathname, `%p` temp files path, `%n` temp file name) can be used in the line, and notes/comments can be added after the closing quotes:

### One-liners & non built-in command examples
NB. Note only *single* backticks for one-liners

`notepad aa_test.md`       //exec notepad
`notepad %caa.html`      //exec notepad with file from current folder
`notepad %f.py`     //exec notepad with temp file `temp.py`
`notepad %f.out.txt`        //& with temp output file (temp.txt.out.txt)
`"C:/Program Files/Notepad++/notepad++" %e`  //exec notepad++ with %e editor file
`explorer`                         //explore
`explorer /select,"%f"`     //explore temp folder

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
`eval progress1(''+(7*7-7),4000)`  //quick calculator output via message

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
## Links

1. 'Today we handle all link click handlers and if the link starts with http://command, then we execute the command (provided its a link we generated - by looking at a white list).'  [quote from here](https://github.com/microsoft/vscode/issues/98100)
2. Results of last execution: file:///C:/Users/ralph/VSWork/zetti.temp.txt
3. Markdown memo [[aadiary]] [[aa_reference]]
4. Doesn't work: C:\Users\ralph\.vscode-insiders\extensions\svsool.markdown-memo-0.3.8\help
5. [works but error message](C:\Users\ralph\AppData\Roaming\Code\User\globalStorage\rmzetti.hover-exec\temp.js)
6. [now works](file:///C:\Users\ralph\AppData\Roaming\Code\User\globalStorage\rmzetti.hover-exec\temp.txt.out.txt)
7. [test ok](heat%20map%20time%20series.md)
8. [[heat map time series]]
9. [test ok](file:///C:\Users\ralph\OneDrive\Documents\Notes\heat%20map%20time%20series.md)
  
---
## Some examples for built-in scripts
In these examples, random numbers & time are used so updated output is easier to spot

#### Lua
```lua {cmd=lua54} --*say hello goodbye*
-- ```lua  {cmd=lua54} --*say hello goodbye*`
print("hello & goodbye")
math.randomseed(os.time())
--maybe hover-exec could execute commented lines with in-line
"hello "..math.pi+math.random() =>>hello 3.4996308621715
print('hello '..(44-2+math.random()))
"goodbye"..math.pi+math.random() =>>goodbye4.0981838339863
print("goodbye "..math.pi+math.random())
```

---
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

---
#### Powershell
Powershell can be used in *mpe*

```pwsh {cmd}
 # ```pwsh {cmd}`
Get-Random -Min 0.0 -Max 1.0 =>>0.583402059778293
"current dir: "+(pwd) =>>current dir: C:\Users\ralph\OneDrive\Documents\Notes
```

---
#### Gnuplot
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
#### Buddvs
Using buddvs (a personal scripting language). Also works in *mpe*.

```js:buddvs {cmd=buddvs}
// ```js:buddvs {cmd=buddvs}  --the {..} is for mpe
chdir=>>c:\Users\ralph\OneDrive\Documents\Notes
a=61.5+random*10;
a=>>64.33917299
b=4;c=a+b
'c: '+c=>>c: 68.33917299
```

---
#### Javascript using eval
Eval uses vscode's built in javascript. It is ***not*** available in *mpe*.

```js :eval
// ```js:eval -- eval is not available in mpe
let abc="abcde"
let a='hello variable world';
alert(a) //nb. alert is not available in node
a='goodbye'
vscode.window.showInformationMessage(a) //not available in node
eval('let a=3;2*a*Math.random()')=>> 1.2891315802905625 
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>> hello 1.957582914214939 
process.cwd() =>> c:\Users\ralph\OneDrive\Documents\Notes 
console.log(abc)
```

---
#### Javascript using node
Run a server on localhost ([click here after running it](http://127.0.0.1:1337))
Also works in *markdown preview enhanced*, (ie. *mpe*)

```js {cmd=node}
// ```js {cmd=node} -- works in mpe
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
#### More eval and node examples
Various time and date functions using `eval`

```js :eval //internal, time & date
// ```js:eval  --vscode internal time & date  - not in *mpe*
(44-Math.random())=>> 43.40829133167448 
//show information message via vscode api, needs cmd eval, not js
progress1('Hello whole World',4000)
new Date().toISOString().slice(0,10)=>> 2021-09-08 
new Date().toLocaleDateString()=>> 08/09/2021 
new Date().toString()=>> Wed Sep 08 2021 17:57:03 GMT+1200 (New Zealand Standard Time) 
new Date().toLocaleString()=>> 08/09/2021, 17:57:03 
```

---
Time and date using node ` ```js`

```eval
new Date().getTime()=>> 1631332562267
```

```js {cmd=node} //through nodejs
//```js {cmd=node} //through nodejs
a=44
// in-line results are calculated but not output in mpe
'answer='+(a-Math.random()) =>>answer=43.042707710450664
console.log(new Date().toISOString().slice(0, 10))
console.log(new Date().toLocaleDateString())
```
```output
2021-09-08
08/09/2021
```

---
## More Hover-exec examples
(In these examples, random numbers & time are used so updated output is easier to spot)

### Octave
Use ` ```octave` or ` ```python:octave` to run octave.

```python:octave {cmd="octave-cli"}
 # ```python:octave {cmd=octave} -- {cmd..} is for mpe}
 # ```python gets syntax highlighter
 # nb. need mat2str or num2str for numeric output
num2str(7.1+rand(1))  =>>7.4225
'hello world in-line'  =>>hello world in-line
pwd()  =>>c:\Users\ralph\OneDrive\Documents\Notes
disp('hello world in output section!')
```

---
### Scilab
Use ` ```scilab` to run scilab, or ` ```js :scilab` for some quick and dirty syntax highlighting

```js :scilab
// ```js:scilab {cmd=scilab}
// need to use 'string()' for numeric output
pwd()   =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
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
os.getcwd() =>>c:\Users\ralph\OneDrive\Documents\Notes
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
// ```python {cmd matplotlib=true}`
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
pwd()  # =>>c:\Users\ralph\OneDrive\Documents\Notes
a=rand(Float64,3);
a         # =>>[0.008669275390885911, 0.6887025891465031, 0.0825857184524883]
b=a;b[2]=42;        # nb. arrays are shallow copied
a         # =>>[0.008669275390885911, 42.0, 0.0825857184524883]
b         # =>>[0.008669275390885911, 42.0, 0.0825857184524883]
println(string("a=",a))
```
```output
a=[0.008669275390885911, 42.0, 0.0825857184524883]
```

---
### Matlab
And `matlab` can be used to run *matlab*, although it's a slow starter... The args list for `mpe` here is not right currently.

```matlab {cmd args=["-sd", "$input_file", "-batch temp"]}
% ```matlab {cmd args=["-sd", "$input_file"]}`
pwd   =>>C:\Users\ralph\OneDrive\Documents\Notes
7*7-7 =>>42
% Speedtest
```

---
### Gnuplot
Use `gnuplot` to run *gnuplot* - note that a file in the current folder is used here

```gnuplot {cmd}
 # ```gnuplot {cmd}`
set xdata time
set timefmt "%d-%m-%Y %H%M"
set format x "%d"
plot "plotdata.txt" using 1:3 w lp 
 # nb 3 columns of data but 1 2 make the xdata 
```
![[2021-09-12-22-49-00.png]]

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
//var root = doyle(p, q);
root={a:[1.203073257697729,0.06467009356882296],
b:[1.0292303580593238,0.19576340274878198],
r:0.09666227205856094};
//root.a=[Math.random()*0.25+1.1,Math.random()*0.1+0.01];
//root.b=[1.0292303580593238,0.19576340274878198];
//root.r=0.09666227205856094;
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
![[2021-09-12-23-09-14.png]]

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

```js {cmd=node} //works in mpe
// ```js {cmd=node} //works in mpe`
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
```js {cmd=node} //string jumbler, works in mpe
// ```js {cmd=node} //string jumbler, works in mpe`
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
```js {cmd=node} //generate random string
// ```js {cmd=node} //generate random string`
function randch(n){
  return ''+Math.random().toString(36).substring(2,2+n)
}
randch(36) =>>daevdymyo6p
console.log(randch(36))
```

---
### Regular expression test and usage

Internal vscode javascript using ```js {cmd=eval}`

---

```js :eval //javascript regex tester
// ```js :eval //javascript regex tester, use node in mpe instead`
// if not using md preview enhanced, use = >> instead of // = (less faint)
"xys {cmd='js'} th".replace(/.*cmd=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'') =>> js 
Math.random()*100   =>> 22.886167168051653 
```

---

javascript using *nodejs* ```js {cmd=node}`

```js {cmd=node} //javascript regex tester
// ```js {cmd=node} //javascript regex tester`
'abcdefg'.replace(/^.*(bc)/,'$1Baa') =>>bcBaadefg
Math.random()*100   =>>85.43353472028699
console.log(Math.random()*100) //this for *mpe*
```
```output
41.65356728170715
```

---
another regex example

```js {cmd=node}
// ```js {cmd=node}`
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
and again ```js {cmd=node}`

```js  {cmd=node} //find one+ chars followed by a space 
// ```js  {cmd=node} //find one+ chars followed by a space`
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

```js {cmd=node}
// ```js {cmd=node}`
let d=1000 //dosage ug
let u=1.5*d/(d+1.5)+(1-1.5/(d+1.5))*0.009*d
' uptake='+u  =>> uptake=10.484273589615576
console.log(u)
```
```output
10.484273589615576
```

### Chaining execution codeblocks

Here a javascript codeblock produces output in the form of an `output:gnuplot` codeblock. This block is labelled as an `output` and so will be replaced if the javascript is executed again. Because it is also labelled with `:gnuplot' it can be directly executed in the usual ways to produce the plot.

```js {cmd=node}
// ```js {cmd=node}`
//to execute this, need the following 3 libraries in a subfolder called 'lib'
let s=process.cwd().replace(/\\/,'/'); //current folder using / not \
_=require(s+"/lib/lodash.js")
math=require(s+"/lib/math.min.js")
moment=require(s+"/lib/moment.min.js")

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
console.log('$speed << EOD')
for (ii=0;ii<x.length;ii++) {
console.log(x[ii],tim[ii])
}
console.log('EOD')
console.log('set logscale x')
console.log('plot "$speed" w lp title "speed"')
```
```output :gnuplot noinline
$speed << EOD
1 0.40816326530612246
2 2.3529411764705883
4 4.2105263157894735
9 8.571428571428571
18 10.588235294117649
38 29.23076923076923
78 40
162 40.50000000000001
336 44.8
695 44.83870967741935
1438 44.246153846153845
2976 46.86614173228347
6158 51.74789915966387
12743 53.767932489451475
26367 42.87317073170732
54556 39.39061371841156
112884 42.35797373358349
233572 40.69198606271777
483293 39.99114604882085
1000000 38.677238445175014
EOD
set logscale x
plot "$speed" w lp title "speed"
```

