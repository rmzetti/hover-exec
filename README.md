# Hover-exec

This is the README for VS Code extension *hover-exec*.

- [Hover-exec](#hover-exec)
  - [Features](#features)
  - [Basic hover-exec](#basic-hover-exec)
    - [Scripts supported](#scripts-supported)
  - [Some examples](#some-examples)
    - [lua](#lua)
    - [python](#python)
    - [julia](#julia)
    - [matlab](#matlab)
    - [powershell](#powershell)
    - [gnuplot](#gnuplot)
    - [eval](#eval)
    - [node](#node)
    - [scilab](#scilab)
  - [One-liners](#one-liners)
    - [One-liner examples:](#one-liner-examples)
  - [Script configuration settings](#script-configuration-settings)
    - [Changing script configuration](#changing-script-configuration)
    - [Adding another script](#adding-another-script)
    - [Requirements for scripts](#requirements-for-scripts)
    - [Default script settings](#default-script-settings)
  - [Known Issues](#known-issues)
  - [Release Notes](#release-notes)

## Features

*Hover-exec* facilitates execution from within the editor of markdown code blocks in a variety of installed scripts.

The extension is activated when a markdown file is opened in the editor.

Hover script exec in action:

  ![](https://rmzetti.github.io/Hover-exec.gif)
  [also here](https://github.com/rmzetti/hover-exec/blob/master/Hover-exec.gif)
  [or here](https://raw.githubusercontent.com/rmzetti/hover-exec/master/Hover-exec.gif)

## Basic hover-exec 

Hovering over lines starting with ` ``` ` (or starting with a single backtick and including an end one) will trigger a hover message with an *exec* command as the bottom line, as above. Hovering over ` ``` ` at the end of a block will trigger the message for the start of the block. Clicking the command link on the bottom line (or using the shortcut `Alt+/` or `Opt+/` with the cursor anywhere in the block) will execute the code in the code block, and produce output.

```js {cmd=node}
// ```js   (this comment shows the codeblock command in markdown previews)
//          {cmd=node} is for markdown preview enhanced
console.log('  test using node:\n  '+Math.random())
console.log('  Note: hover-exec on ```output line, or alt+/ [opt+/] with\n',
                    ' the cursor in the output block will delete the output block')
```

The js command by default executes a javascript code block in `nodejs` (assuming that it is installed).

Javascript code blocks can also be executed in *vscode's* internal javascript by using `eval`. Note that using `js` for the codeblock id produces syntax highlighting (it's a quick and dirty approach to provide basic syntax highlighting for a range of scripts), then adding ` :eval` sets the actual exec command to `eval`. Note that `eval` allows the internal vscode API to be used. Variables `a,..,z` have been made available for use by the eval script without fear of overwriting an internal variable. Installation of `nodejs` is not required for `eval` scripts to execute.

```js :eval
// ```js {cmd=eval}
'test: '+Math.random() //= test: 0.010013586462137347 
```

Intermediate results can be viewed in line, as above, by appending a line with a predefined three character string. The string `=>>` can always be used, so long as it is used consistently throughout the script. For the predefined scripting languages, the preferred 3 char string (shown on hover) starts with a comment indicator and ends with `=` (eg. `//=` for javascript, `##=` for python etc.). This is useful because, as a comment, it is compatible with the scripting language, and therefore with extensions like *markdown preview enhanced* (although the output will not be updated on execution in *mpe*).

### Scripts supported

The following scripts are supported 'out of the box':

- javascript (via node)
- html
- powershell
- python
- julia
- octave
- scilab
- gnuplot
- matlab
- lua
- eval (javascript internal to the extension, with vscode api available)

The script language you are using (eg `julia`,`nodejs`) needs to have been installed, and ***some of the commands to run the scripts may need customising*** to suit your particular installation - see [Changing script configuration](#changing-script-configuration).

Other script languages may be added - see [Adding another script](#adding-another-script).

## Some examples

### lua

```lua --*say hello goodbye*
-- ```lua --*say hello goodbye*
'hello '..(44-2+math.random())=>>hello 42.172060906754
"goodbye "..math.pi+math.random()=>>goodbye 3.3930640737882
print("ok") -- this outputs in the output code block below
```
```output
ok
```

---
### python

```python {cmd}
 # ```python {cmd}  -- {cmd} allows execution in markdown preview enhanced
from random import random
45-2+random()  ##=43.72751755387742
'hello world!'      ##=hello world!
print('ok')
```

---
### julia

```julia
 # ```julia
using LinearAlgebra, Statistics, Compat
a=rand(Float64,3);
a      ##=[0.5019466087356721, 0.711618592089406, 0.4588246446719777]
b=a;b[2]=42;                                # arrays are shallow copied
println(string("a=",a,"\n","b=",b))  # double quotes only for julia strings
```

---
### matlab

```matlab      --the meaning of life is 7*7-7
% ```matlab  --matlab is slow to start (this takes about 8s on Asus with Ryzen 7 4700U)
7*7-7 %%=?
```

---
### powershell

```pwsh {cmd} // *random number, current dir, ..
 # ```pwsh {cmd} // random number, current dir, ..
Get-Random -Min 0.0 -Max 1.0 =>>0.906324071300367
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
 # ```gnuplot {cmd}
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

---
### eval

```js :eval
// ```js:eval -- eval is not available in mpe
let abc="abcde"
let a='hello variable world';
alert(a) //not available in node
a='goodbye'
vscode.window.showInformationMessage(a) //not available in node
eval('let a=3;2*a*Math.random()')=>> 5.478199624843029 
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>> hello 1.511977441208507 
process.cwd() =>> c:\Users\ralph\OneDrive\Documents\Notes 
console.log(abc)
```

---

```eval -- javascript regex tester
// ```eval -- javascript regex tester
'abcdefg'.replace(/^.*(bc)/,'$1--') //=bc--defg
```

---
### node

```js //run server at http://127.0.0.1:1337  ctrl click to open server>
var http = require('http');
http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World at last!\n');
}).listen(1337, "127.0.0.1");
```

---

```pwsh # kill server through powershell
 # ```pwsh # kill server through powershell
 # to kill server, exec once & look for pid to kill (line TCP 127.0.0.1:1337 on rhs)
 # then enter pid in kill statement below and exec again
kill 14452
netstat -ano | findstr :13
```

---
### scilab

```js :scilab {cmd=scilab} 
// ```js :scilab {cmd=scilab} 
// using js :scilab instead of just ```scilab provides quick & dirty syntax highlight
// {cmd=scilab} is for markdown preview enhanced
rand("seed",getdate('s'));
'def '+string(rand())+' abc'=>>def 0.4897686 abc
// nb. need to use 'string' for numeric output in scilab
disp('random: '+string(rand()))
```
---
## One-liners

*One-liners* starting and ending with a single backtick  ` ` ` will simply be executed on hover-click, and do not produce output. The pre-defined variables %c current folder, %f temp file full path+name, %p temp file path, %n temp file name can be used (%C etc provides paths with \ instead of /e). Comments can be added after the closing quote.

### One-liner examples:

exec notepad with file in current folder:
`notepad %cREADME.md`

exec notepad with temp file (%f):
`notepad %f`

exec notepad++:
`"C:/Program Files/Notepad++/notepad++" %cREADME.md`

explore 'This pc':
`explorer ,`

explore folder:
`explorer /select, %CREADME.md`

show printers:
`explorer ::{21ec2020-3aea-1069-a2dd-08002b30309d}\
                ::{2227a280-3aea-1069-a2de-08002b30309d}`

show devices:
`devmgmt.msc`

exec default browser with href, or showing html text (note that html is a built in script command, see previous section)

`html <script>location.href= 'https://whatamigoingtodonow.net/'</script>`

`html <h1>Hello world!</h1>`

## Script configuration settings

*Hover-exec* utilises the following settings for each scripting language. These settings are identified by `hover-exec.scripts.id`, where `id` identifies the script. Several strings can be provided for each script:

- `cmd` the **javascript** command to run the script from a temp file (required)
    -- *hover-exec* will place the script into the temp file and execute it using `cmd`
    -- the variable `%f` will provide the appropriate temp file name and path
    -- eg. for octave, `"cmd":"octave \"%f\" "`

- `start` an optional startup script command, eg. to change the working folder at execution start
    -- the variable `%c` provides the path of the current folder
    -- eg. for matlab, `"start":"cd '%c' "` 

- optional `inline` and `swap` strings to allow hover-exec to show results inline, ie. appended the corresponding statement in in the codeblock 
    -- `inline` is a `3 char string` will is used to indicate where in-line output is required (it begins with the scripting language comment signifier, and ends with `=`)
    -- `swap` is a command, in the scripting language concerned, to produce output in the form `{{$1}}` to enable the extension to use a *regex* to move the output to end of the line where it is required
    -- eg. for python, `"inline":"##="`, `"swap":"print('{{'+str($1)+'}}')"`

- an optional `tempf` string to provide the name of the script file used in the form `name.ext`. The files are placed in a directory in *vscode's* standard temporary storage area.
    -- The default is `temp.txt`.
    -- eg. for Matlab (and Octave) `"tempf":"temp.m"`

In the strings, the following predefined strings can be embedded:

  - %f `full_path/name.ext` of temporary file which will be used for the script  (`%F` to use `\` rather than `/` in the path)
  - %p `full_path/` for temporary files (%P to use `\` in path)
  - %n `name.ext` of temporary file
  - %c `full_path/` of the current folder (`%C` to use `\`)
  - %e `full_path/` of the vscode editor file (`%E` to use `\`)

All strings are quoted using double quotes (`json` standard) so internal quotes should be `'` (single quote) or `\"` (escaped double quote).

The [predefined default script settings](#default-script-settings) are listed near the end of this README.

### Changing script configuration

Because *hover-exec* can execute scripts in *vscode's* internal javascript, it can change its own configuration settings. For the `test` script entry, for example, the following codeblock script will show the current settings

```js :eval noinline
// ```js :eval noinline   (eval is not available in mpe)
// nb. 'noinline' because some settings may include ##= etc
console.log('Keys: '+Object.keys(config.get('scripts')))
let s='test';  // <-- can change 'test' to any of the keys
let a=config.get('scripts.'+s); //get settings
console.log("Config strings for script: "+s);
console.log(JSON.stringify(a).replace(/","/g,'",\n"'));
```
```output
Keys: octave,matlab,scilab,python,python3,streamlit,julia,gnuplot,pwsh,bash,zsh,lua54,lua,js,node,javascript,html,firefox,test,eval,go,buddvs
Config strings for script: test
{"cmd":"test_exec",
"start":"",
"inline":"",
"swap":"",
"tempf":"test.tst",
"nb":"no results returned"}
```

And the following codeblock script will change the `start` command (check the result using the previous codeblock script):

```js :eval noinline
let scripts=config.get('scripts'); //get settings
scripts.test.start='new_start';  //'test' can be any script Key, 'start' can be any string id
if(config.update('scripts',scripts,1)){console.log('ok!')}
```
```output
ok!
```

When this has been done once, all the script settings will appear in the `settings.json` file and can also be altered there.

### Adding another script

Other scripts can be added by copying, pasting and changing strings for *Hover exec* in  `settings.json`. But again it can be done using `eval` - the following codeblock script will add a new script configuration (and can delete it again by switching the comment line to the line above and re-executing):

```js :eval noinline
let scripts=config.get('scripts'); //get settings
let add={"newscript":{"exec":"test_exec","cmd":"","inline":"//=","swap":"{{$1}}","tempf":"test.new"}}
//let add={"newscript":undefined}; //use this instead of the previous line to delete the script added
let merge=Object.assign( {} ,scripts,add);     
if(config.update('scripts',merge,1)){console.log('ok!')}
```
```output
ok!
```

Check it here:

```js :eval noinline
console.log('Keys: '+Object.keys(config.get('scripts')))
let s='newscript';  // <-- change to the key just added above
let a=config.get('scripts.'+s);
if(a) {   console.log("Config strings for script: "+s);
           console.log(JSON.stringify(a).replace(/","/g,'",\n"'));
} else { console.log('No script key '+s); }
```
```output
Keys: buddvs,octave,matlab,scilab,python,python3,streamlit,julia,gnuplot,pwsh,bash,zsh,lua54,lua,js,node,javascript,html,firefox,test,eval,go
No script key newscript
```

### Requirements for scripts

Essentially if a program can be run with 'batch file' input, and outputs to the command line (if required), it will work in *hover-exec* with the appropriate string definitions.

The script languages to be used (eg. *python*, *gnuplot*, etc) should be installed, and on the path. and the `id` should match command, eg. on Windows the python repl should run if `python` is entered in a cmd/powershell window.

### Default script settings

The following are the default script configuration settings:
```
"hover-exec.scripts":{
  "description": "NB. Edit or add scripts using code blocks (see README)",
  "default":{
    "octave":{
        "cmd":"octave \"%f\"",
        "start":"",
        "inline":"%%=",
        "swap":"disp(['{{' $1 '}}'])",
        "tempf":"temp.m",
        "nb":"% in-line comments"
    },
    "matlab":{
        "cmd":"matlab -sd \"%p\" -batch temp",
        "start":"cd '%c'",
        "inline":"%%=",
        "swap":"disp([\"{{\"+($1)+\"}}\"])",
        "tempf":"temp.m",
        "nb":"% in-line comments"
    },
    "scilab":{
        "cmd":"scilex -quit -nb -f \"%f\" ",
        "start":"",
        "inline":"//=",
        "swap":"mprintf('%s\\n','{{'+$1+'}}')",
        "tempf":"temp.sci",
        "nb":"// for in-line comments"
    },
    "python":{
        "cmd":"python \"%f\"",
        "start":"",
        "inline":"##=",
        "swap":"print('{{'+str($1)+'}}')",
        "tempf":"temp.py",
        "nb":"# in-line comments",
        "prev_start":"import os\nos.chdir(\"%c\");"
    },
    "python3":{
        "cmd":"python3 \"%f\"",
        "start":"",
        "inline":"##=",
        "swap":"print('{{'+str($1)+'}}')",
        "tempf":"temp.py",
        "nb":"# in-line comments #",
        "prev_start":"import os\nos.chdir(\"%c\");"
    },
    "streamlit":{
        "cmd":"streamlit run \"%f\" ",
        "start":"",
        "inline":"",
        "swap":"",
        "tempf":"temp.py",
        "nb":"# for in-line comments, no in-line results"
    },
    "julia":{
        "cmd":"julia \"%f\"",
        "start":"",
        "inline":"##=",
        "swap":"println(string(\"{{\",$1,\"}}\"))",
        "tempf":"temp.jl",
        "nb":"in-line comments #, results ##=",
        "prev_start":"cd(\"%c\")"
    },
    "gnuplot":{
        "cmd":"gnuplot -p -c \"%f\"",
        "start":"",
        "inline":"",
        "swap":"",
        "tempf":"temp.gp",
        "nb":"no results returned",
        "prev_start":"set loadpath \"%c\""
    },
    "pwsh":{
        "cmd":"pwsh -f \"%f\"",
        "start":"",
        "inline":"##=",
        "swap":"'{{'+($1)+'}}'",
        "tempf":"temp.ps1",
        "nb":"# for in-line comments",
        "prev_cmd":"cd \"%c\"; "
    },
    "bash":{
        "cmd":"bash \"%f\"",
        "start":"",
        "inline":"##=",
        "swap":"'{{'+($1)+'}}'",
        "tempf":"temp.sh",
        "nb":"# for in-line comments",
        "prev_cmd":"cd \"%c\";"
    },
    "zsh":{
        "cmd":"zsh -f \"%f\"",
        "start":"",
        "inline":"##=",
        "swap":"'{{'+($1)+'}}'",
        "tempf":"temp.sh",
        "nb":"# for in-line comments",
        "prev_cmd":"cd \"%c\";"
    },
    "lua54":{
        "cmd":"lua54 \"%f\"",
        "start":"",
        "inline":"--=",
        "swap":"print('{{'..($1)..'}}')",
        "tempf":"temp.lua",
        "nb":"-- for in-line comments"
    },
    "lua":{
        "alt":"lua54"
    },
    "js":{
        "cmd":"node \"%f\"",
        "start":"",
        "inline":"//=",
        "swap":"console.log('{{'+($1)+'}}')",
        "tempf":"temp.js",
        "nb":"// for in-line comments",
        "prev_cmd":"process.chdir(\"%c\")"
    },
    "node":{
        "alt":"js",
        "nb":"will use strings as in js"
    },
    "javascript":{
        "alt":"js",
        "nb":"will use strings as in js"
      },
    "html":{
        "cmd":"\"%f\"",
        "start":"",
        "inline":"",
        "swap":"",
        "tempf":"temp.html",
        "nb":"no results returned"
    },
    "firefox":{
        "cmd":"firefox \"%f\"",
        "start":"",
        "inline":"",
        "swap":"",
        "tempf":"temp.html",
        "nb":"no results returned",
        "prev_cmd":""
    },				
    "test":{
        "cmd":"test_exec",
        "start":"",
        "inline":"",
        "swap":"",
        "tempf":"test.tst",
        "nb":"no results returned"
    },
    "eval":{
        "cmd":"",
        "start":"",
        "inline":"//=",
        "swap":"write('{{',($1),'}}')",
        "swapold":"'{{'+($1)+'}}'",
        "tempf":"temp.js",
        "nb":"// for in-line comments",
        "prev_cmd":""
    },
    "go":{
        "cmd":"go run \"%f\"",
        "start":"",
        "inline":"//=",
        "swap":"'{{'+($1)+'}}'",
        "tempf":"temp.go",
        "nb":"// for in-line comments"
    },
    "buddvs":{
      "cmd":"buddvs \"%f\" ",
      "start":"chdir(\"%c\");",
      "inline":"//=",
      "swap":"write('{{'+($1)+'}}')",
      "tempf":"temp.txt"
      "nb":"home-grown scripting language"
    }
}}
```

## Known Issues

This is a beta version.

Note that in all scripting languages included (except the 'home-grown' one buddvs), the script starts from scratch when the code block is executed, the same as if the command file were executed from scratch from the command prompt. In other words, assigned variables do not carry over into the next script execution. This kind of approach is best suited for small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages.

Matlab takes a substantial amount of time to run a codeblock (ie. the startup time for matlab to run a 'batch file' is nearly 10s on my Ryzen pc). However, other included scripts are generally fairly fast (see the demo gif above).

## Release Notes

Initial beta release was 0.4.1
Published using: vsce package/publish
