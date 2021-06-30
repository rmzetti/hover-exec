# Hover exec

This is the README for *hover exec*.

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

"exec.selectOnHover": select code on hover, default:false

For each script language, exec.id, three strings are required, with a fourth optional:
- [0] the exec command
- [1] a change directory command to change working folder to 'currentFolder' 
- [2] a regex result string to enable output, $1, to be provided in the form `=<< $1>>` for in-line display of intermediate results
- [3] optional to provide an output file name and extension (the default is `temp.txt`)

Note that additional script languages can be added just by adding a new section to `settings.json`

"exec.js":
[0] "'node '+temp"
[1]	"'process.chdir(\"'+currentFolder+'\")\\n';"
[2]	"console.log(\"$1=<<\"+($1)+\">>\")"

"exec.html":
[0]	"temp"
[1] "''"
[2] ""
[3]	"temp.html"

"exec.pwsh":
[0] "'pwsh -f '+temp"
[1]	"'cd '+currentFolder+'\\n';"
[2]	"\"$1=<<\"+($1)+\">>\""

"exec.python":
[0] "'python '+temp"
[1]	"'import os\\n'+'os.chdir(\"'+currentFolder.replace(/\\//g,\"\\\\\\\\\")+'\");\\n';"
[2]	"print(\"$1=<<\"+str($1)+\">>\")"

"exec.julia":
[0]	"'julia '+temp",
[1]	"'cd(\"'+currentFolder+'\")\\n'"
[2]	"println(string(\"$1=<<\",$1,\">>\"))"

"exec.octave":
[0]	"'octave '+temp"
[1]	"'cd '+currentFolder+';\\n'"
[2]	"disp([\"$1=<<\" $1 \">>\"])"

"exec.scilab":
[0] "'scilex -quit -nb -f '+temp"
[1]	"'cd '+currentFolder+';\\n'"
[2]	"disp(\"$1=<<\"+string($1)+\">>\")"

"exec.gnuplot":
[0]	"'gnuplot -p -c '+temp"
[1]	"'set loadpath \"'+currentFolder+'\"\\n'"
[2]	""

"exec.matlab":
[0] "'matlab -sd '+tempd+' -batch \"temp\"'"
[1]	"'path(path,\"'+currentFolder+'\");'"
[2]	"disp([\"$1=<<\" $1 \">>\"])"
[3]	"temp.m"

"exec.lua":
[0]	"'lua54 '+temp"
[1]	"''"
[2]	"print('$1=<<'..($1)..'>>')"

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
