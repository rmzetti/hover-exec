# Hover exec

This is the README for VsCode extension *hover exec*.

## Features

Hover exec facilitates execution of markdown code blocks in a variety of installed scripts.

The extension is activated when a markdown file is opened.

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
- eval (javascript internal to the extension, with vscode api)

Other scripts can be added by providing an id and four strings for *Hover exec* in  `settings.json` (see below). Essentially if a program can be run with 'batch file' input, and outputs to the command line (if required), it will work in *hover-exec* with the appropriate string definitions.

The md files at 

Hover script exec in action:

![hover-exec.gif](./Hover-exec.gif)

## Requirements

The script languages to be used (eg. *python*, *gnuplot*, etc) should be installed, and on the path.. eg. on Windows the python repl should run if `python` is entered in a cmd/powershell window.

## Extension Settings

This extension contributes the following settings:

`"hover-exec.selectOnHover"`: select code on hover, default:false

To add further scripting languages, identified by `hover-exec.id`, four strings are required for each:

- [0] the javascript exec command to run the script from a temp file
        - the variable `%f` will provide the appropriate temp file name and path

- [1] a script command which will change working folder at execution start
        - the variable `%c` provides the path of the current folder

- [2] a string of the form `##=print('{{'+str($1)+'}}')`. The first `3 chars` will indicate where in-line output is required (usually begins with the scripting language comment signifier, and ends with =). This is followed by a command string, in the appropriate scripting language, to give output in the form `{{$1}}` to enable the extension to move the output to end of the line where it is required.

- [3] a string to provide the script file used in the form `name.ext` (the default is `temp.txt`) - this is optional. As an example, for Matlab (and Octave) `temp.m` is used.

In the strings, the following predefined strings can be embedded (quotes are included)
> %f "full_path/name.ext" of temporary file to be used for the script
> %p "full_path" for temporary file (ends with /)
> %n "name.ext" of temporary file
> %c "full_path" of folder containing the original script (ends with /)
> %r signifier for in-line result, 3 chars 'xx=', eg ##=, //= (starts comment)

The easiest way to add a new script language is to (1) open `settings/extensions/hover-exec`, (2) copy and paste an existing script setting, (3) change the id (`hover-exec.id`), and (4) change the strings as appropriate (see above).

All strings are quoted using double quotes (json standard) so internal quotes should be `'` (ie. single quote) or `\"` (ie. escaped double quote).

These are the strings for the currently included scripts:

```
"contributes": {
"configuration": {
"type":"object",
"title":"Hover Exec",
"properties": {
"hover-exec.octave":{
        "type":"array",
        "default":[
                "octave %f ",
                "cd %c;",
                "%%=disp(['{{' $1 '}}'])" ,
                "temp.m" ],
        "description": "octave"
},
"hover-exec.matlab":{
        "type":"array",
        "default":[
                "matlab -sd %p -batch temp",
                "path(path,%c);",
                "%%=disp([\"{{\"+($1)+\"}}\"])",
                "temp.m" ],
        "description": "matlab",
        "comment":"matlab has a long execution startup time"
},
"hover-exec.scilab":{
        "type":"array",
        "default":[
                "scilex -quit -nb -f %f ",
                "cd %c;",
                "//=mprintf('%s\\n','{{'+$1+'}}')" ,
                "temp.sci" ],
        "description": "scilab"
},
"hover-exec.python":{
        "type":"array",
        "default":[
                "python %f ",
                "import os\nos.chdir(%c);",
                "##=print('{{'+str($1)+'}}')" ,
                "temp.py" ],
        "description": "python",
        "comment":"a 'duplicate' entry also allows 'python3' to be used"
},
"hover-exec.julia":{
        "type":"array",
        "default":[
                "julia %f ",
                "cd(%c)",
                "##=println(string(\"{{\",$1,\"}}\"))" ,
                "temp.jl" ],
        "description": "julia"
},
"hover-exec.gnuplot":{
        "type":"array",
        "default":[
                "gnuplot -p -c %f ",
                "set loadpath %c",
                "" ,
                "temp.gp" ],
        "description": "gnuplot",
        "comment":"no intermediate results"
},
"hover-exec.pwsh":{
        "type":"array",
        "default":[
                "pwsh -f %f",
                "cd %c;",
                "##='{{'+($1)+'}}'" ,
                "temp.ps1" ],
        "description": "powershell"
},
"hover-exec.lua":{
        "type":"array",
        "default":[
                "lua54 %f ",
                "",
                "--=print('{{'..($1)..'}}')" ,
                "temp.lua" ],
        "description": "lua",
        "comment":"base lua does not include the 'current working directory' concept"
},
"hover-exec.js":{
        "type":"array",
        "default":[
                "node %f ",
                "process.chdir(%c)",
                "//=console.log('{{'+($1)+'}}')" ,
                "temp.js" ],
        "description": "javascript node"
},
"hover-exec.html":{
        "type":"array",
        "default":[
                "%f ", "", "",
                "temp.html" ],
        "description": "html",
        "comment":"no intermediate results, output is shown in the default browser
},
"hover-exec.eval":{
        "type":"array",
        "default":[
                "",	"", 
                "//='{{'+($1)+'}}'" ],
        "description": "eval",
        "comment":"eval is js run in the extension using eval - variables cannot be set" 
},
"hover-exec.selectOnHover":{
        "description": "select code on hover",
        "default": false,
        "type": "boolean"
},
"hover-exec.buddvs":{
        "type":"array",
        "default":[
                "buddvs %f ",
                "chdir(%c);",
                "//=write('{{'+$1+'}}')" ],
        "description": "budd script"
        "comment":"specialised local scripting language for testing"
}
}}}
````

## Known Issues

This is a beta version.

If the edit file is clicked randomly during script execution (usually seconds) output may be written in the wrong part of the file. Use ctrl-z to recover, then re-run the script.

Note that in all scripting languages included, the script starts from scratch when the code block is executed, the same as if the command file were executed by a REPL from the command prompt. Assigned variables do not carry over into the next script execution. This kind of approach is best suited for a range of useful small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages.

Matlab takes a substantial amount of time to run a codeblock (ie. the startup time for matlab to run a 'batch file' is nearly 10s on my Ryzen pc). The others are generally pretty fast (see the demo gif above).

## Release Notes

### 0.3.6

Initial beta release
Published using: vsce package/publish
