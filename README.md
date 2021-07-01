# Hover exec

This is the README for VsCode extension *hover exec*.

## Features

Hover exec facilitates execution of code blocks in a variety of installed scripts.

The following scripts are supported 'out of the box':

- javascript
- html
- powershell
- python
- julia
- octave
- scilab
- gnuplot
- matlab
- lua

and other scripts can be added by providing three strings for *Hover exec* in  `settings.json`.

Hover script exec in action:

![hover exec](./Hover-exec.gif)

## Requirements

The script languages to be used (eg. *python*, *gnuplot*, etc) should be installed, and on the path.. eg. on Windows the python repl should run if `python` is entered in a cmd/powershell window.

## Extension Settings

This extension contributes the following settings:

`"hover-exec.selectOnHover"`: select code on hover, default:false

For each script language, `hover-exec.id`, (call it id-script) four strings are required:
- [0] the javascript exec command to run the script from a temp file
        - the javascript variable `temp` will provide the appropriate temp file name and path
- [1] a javascript string to produce a script command which will change working folder 
        - use the javascript variable `currentFolder` to get the path of the current folder
- [2] a regex result string (in the appropriate scripting language) to enable the output, `$1`, to be provided in the form `=<< $1>>` for in-line display of intermediate results
- [3] a string to provide the output file `name.ext` (the default is `temp.txt`) - this is optional

The easiest way to add a new script language is to open `settings/extensions/hover-exec`, copy and paste an existing one, change the id (hover-exec.id), and then change the strings (as described above) as appropriate. All strings are quoted using double quotes (json standard) so internal quotes should be `'` (ie. single quote) or `\"` (ie. escaped double quote). If `\` are needed, they have to be escaped (ie. `\\`) - for example, `\\n` is a new line.

Here are the strings for the included scripts:


```
"hover-exec.js":
[0] "'node '+temp"
[1] "'process.chdir(\"'+currentFolder+'\")\\n';"
[2] "console.log(\"$1=<<\"+($1)+\">>\")"
[3] "temp.js"
```
```
"hover-exec.html":
[0] "temp"
[1] "''"
[2] ""
[3] "temp.html"
```
```
"hover-exec.pwsh":
[0] "'pwsh -f '+temp"
[1] "'cd '+currentFolder+'\\n';"
[2] "\"$1=<<\"+($1)+\">>\""
[3] "temp.ps1"
```
```
"hover-exec.python":
[0] "'python '+temp"
[1] "'import os\\n'+'os.chdir(\"'+currentFolder.replace(/\\//g,\"\\\\\\\\\")+'\");\\n';"
[2] "print(\"$1=<<\"+str($1)+\">>\")"
[3] "temp.py"
```
Note: the horrifying regex replacement string to ensure any `\` in `currentFolder` are appropriately escaped.

```
"hover-exec.julia":
[0] "'julia '+temp",
[1] "'cd(\"'+currentFolder+'\")\\n'"
[2] "println(string(\"$1=<<\",$1,\">>\"))"
[3] "temp.jl"
```
```
"hover-exec.octave":
[0] "'octave '+temp"
[1] "'cd '+currentFolder+';\\n'"
[2] "disp([\"$1=<<\" $1 \">>\"])"
[3] "temp.m"
```
```
"hover-exec.scilab":
[0] "'scilex -quit -nb -f '+temp"
[1] "'cd '+currentFolder+';\\n'"
[2] "disp(\"$1=<<\"+string($1)+\">>\")"
[3] "temp.sci"
```
```
"hover-exec.gnuplot":
[0] "'gnuplot -p -c '+temp"
[1] "'set loadpath \"'+currentFolder+'\"\\n'"
[2] ""
[3] "temp.gp"
```
```
"hover-exec.matlab":
[0] "'matlab -sd '+tempd+' -batch \"temp\"'"
[1] "'path(path,\"'+currentFolder+'\");'"
[2] "disp([\"$1=<<\" $1 \">>\"])"
[3] "temp.m"
```
```
"hover-exec.lua":
[0] "'lua54 '+temp"
[1] "''"
[2] "print('$1=<<'..($1)..'>>')"
[3] "temp.lua"
```
Note: straight lua does not include the current working directory concept, but `LuaFileSystem` could be `require`d in [1] and then `lfs.currentdir()` utilised.

## Known Issues

This is a beta version.

## Release Notes

### 0.3.1

Initial beta release
