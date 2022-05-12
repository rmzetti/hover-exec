# Hover-exec readmore

This is the readmore for VS Code extension *hover-exec*.

Once the extension is installed, the readme, the readmore and the test files are best viewed in the editor.

Type or copy one of the following in any instance of the editor - then hover to see the path, or exec by clicking the bottom line of the hover message to open the file as a new tab in the editor.

`edit %h/README` //opens the readme in the vscode editor \
`edit %h/test/readmore` //the readme but with more detail \
`edit %h/test/misc_tests` //benchmark and plotting comparative tests

Notes:
1. If you're viewing in preview, the one-liner commands above are surrounded by a single backtick.
2. In the above, %h is a hover-exec command line variable giving the extension path, see `edit %e#what settings`
3. Using *hover-exec* in the vscode editor on these files allows live testing, and comparison with the 'test outputs' provided.
4. Any changes made to these files will be reverted if *hover-exec* is updated, so save the file locally if you want to keep changes.

## Contents
- [Hover-exec readmore](#hover-exec-readmore)
  - [Contents](#contents)
  - [Features](#features)
    - [Compatibility with Markdown Preview Enhanced (*mpe*)](#compatibility-with-markdown-preview-enhanced-mpe)
  - [Basic hover-exec](#basic-hover-exec)
    - [Hover](#hover)
      - [Other information from the hover](#other-information-from-the-hover)
    - [Exec](#exec)
    - [Output](#output)
    - [In-line output](#in-line-output)
    - [Code block labels and commands](#code-block-labels-and-commands)
  - [Javascript scripts](#javascript-scripts)
    - [Examples using vm and eval](#examples-using-vm-and-eval)
    - [Available functions in *vm* and *eval*](#available-functions-in-vm-and-eval)
    - [Using a custom vm context](#using-a-custom-vm-context)
    - [Quick specification of vm context](#quick-specification-of-vm-context)
    - [Using require & globals with vm and eval](#using-require--globals-with-vm-and-eval)
    - [Using nodejs](#using-nodejs)
    - [Html and javascript](#html-and-javascript)
    - [More javascript examples](#more-javascript-examples)
      - [Using vscode functions](#using-vscode-functions)
      - [Time and date](#time-and-date)
      - [Localhost server](#localhost-server)
      - [Random strings](#random-strings)
      - [Regular expression testing](#regular-expression-testing)
      - [Javascript input box (Vitamin b12, dosage vs uptake)](#javascript-input-box-vitamin-b12-dosage-vs-uptake)
  - [Other scripts](#other-scripts)
    - [Scripts with command execution strings included](#scripts-with-command-execution-strings-included)
    - [Python](#python)
    - [Julia](#julia)
    - [Octave](#octave)
    - [Scilab](#scilab)
    - [Lua](#lua)
    - [Matlab](#matlab)
    - [Go](#go)
    - [Gnuplot](#gnuplot)
    - [Bash & zsh](#bash--zsh)
    - [Powershell](#powershell)
    - [Cmd](#cmd)
  - [Chaining execution code blocks](#chaining-execution-code-blocks)
  - [Including tagged sections](#including-tagged-sections)
  - [Using scripts via REPLs](#using-scripts-via-repls)
    - [Python REPL](#python-repl)
    - [Julia REPL](#julia-repl)
    - [Lua REPL](#lua-repl)
    - [Node REPL](#node-repl)
    - [Scilab REPL](#scilab-repl)
    - [Octave REPL](#octave-repl)
    - [R (rterm) REPL](#r-rterm-repl)
    - [Check for active REPLs](#check-for-active-repls)
  - [One-liners and quickmath](#one-liners-and-quickmath)
    - [Default shell simple command execution:](#default-shell-simple-command-execution)
    - [exec notepad with file in current file's folder:](#exec-notepad-with-file-in-current-files-folder)
    - [exec notepad with temp file (%f):](#exec-notepad-with-temp-file-f)
    - [open another instance of vscode:](#open-another-instance-of-vscode)
    - [explore files, view folders:](#explore-files-view-folders)
    - [other examples:](#other-examples)
    - [bash html & javascript](#bash-html--javascript)
    - [audio one-liners](#audio-one-liners)
    - [Windows one-liners](#windows-one-liners)
    - [Quickmath examples](#quickmath-examples)
  - [Configuration settings](#configuration-settings)
    - [What settings are there?](#what-settings-are-there)
    - [Viewing script settings using scripts](#viewing-script-settings-using-scripts)
    - [Viewing a particular script setting](#viewing-a-particular-script-setting)
    - [Add new script language](#add-new-script-language)
    - ['Zero configuration' commands](#zero-configuration-commands)
    - [Other vscode config settings](#other-vscode-config-settings)
    - [In-line output using *swappers*](#in-line-output-using-swappers)
  - [Release Notes and Known Issues](#release-notes-and-known-issues)

---

## Features

*Hover-exec* facilitates execution from within the editor of fenced markdown code blocks in a variety of installed script languages. New script languages can be added with or without configuration. This extension is by no means intended as a replacement for the superb vscode notebooks. Instead it offers the opportunity, when working with markdown docs, to include 'live' calculations, results, code samples, demos, comparisons and useful links, using a range of possible scripts.

The *hover-exec* extension is activated when a markdown file is opened in the editor.

*Hover-exec* in action:

  ![](https://raw.githubusercontent.com/rmzetti/hover-exec/master/media/Hover-exec.gif)

In addition to executing scripts, *hover-exec* can execute a range of 'one-liners' and provides a quick calculation facility - see [One-liners and quickmath](#one-liners-and-quickmath).

### Compatibility with Markdown Preview Enhanced (*mpe*)

There is also an intention to maintain a certain compatability with the excellent *markdown preview enhanced* extension. The idea is to support the usual *mpe* {curly brackets} in the command line. There are a number of elements of *hover-exec* (eg. in-line results, built-in javascript execution rather than `node` only, and the different approach to temporary storage of generated script files) which make full compatability difficult at this stage, but many scripts can still be executed in both extensions.

---

## Basic hover-exec 

Hovering over a labelled fenced code block start or end line which starts with a triple backtick, or a line which starts with a single backtick and includes an end backtick, will trigger a hover message with an  *exec* command in the bottom line. Clicking the command link on the bottom line of the hover message will execute the code in the code block, and produce output.

### Hover
Opening a markdown file (eg. this one) in the vscode editor will activate the *hover-exec* extension.
After opening in the editor, hover over the start line ```js ...`, or over the end line, of this (empty) code block:

```js //this is a code block with id 'js'
// '''js   //this is an empty code block with id 'js'
```

The following hover message will appear:
>      hover-exec: //this is a code block with id 'js'
>      [config] [command line vars %f etc] [delete block]
>      [clear output] [open last script] [open last result]
>      exec: js =>>

The message shows 'hover-exec:' followed by any comments that were in the command line.
The bottom line shows the command that will be executed.
Code blocks which are indented (ie. unfenced), fenced with '~', or not labelled, will not result in a hover message and are ignored by *hover-exec*.

#### Other information from the hover

Other 'clickable' areas in the main hover will provide information as follows:

*[ config ]*
    - will show the shell command that will be executed in an input box at the top of the editor
    - 'enter' on the input box will open settings.json to show start shell commands for all scripts
    - editing the command in the input box will change the script start command
    - escape will ignore any entries & close the input box
*[ command line vars %f etc ]*
    - gives a list of possible variables that can be used in command lines and script start shell commands
    - clicking an item on the list will copy the definition to the clipboard
*[ delete block ]*
    - deletes the current code block (if there is a following *output* block that is deleted first)
    - ctrl-z or cmd-z will undo the deletion
*[ clear output ]*
    - will clear all output, both in-line and in a following *output* block
    - the hover stays in place so you can immediately execute the command to see new output
*[ open last script ]*
    - hovering over this option will show the `path/name` of the code to be executed
    - Clicking will open the file in the editor
    - The contents of the block will be in the file if the script has been executed.
*[ open last result ]*
    - hovering over this option will show the `path/name` of the file with the text ouptut
    - clicking will open the file in the editor

### Exec
Putting some javascript code into the code block, and clicking the *exec* (bottom line of the hover) gives the output below:

```js //this is a code block with id 'js'
// '''js   //this is a code block with id 'js'
//        when executed the output will be visible in a new code block titled 'output'.
let world=3;
console.log('hello world '+world);
alert('goodbye world');
```
```output
hello world 3
```

If the cursor is inside a fenced code block, the code can be quickly executed using the shortcut `Alt+/` or `Opt+/`.

### Output
Hovering  over the first or last line of the *output* block will show three options:

>      `output block to text`
>      `all output to text`
>      `delete output block`.

The first option of the output hover simply removes the code block triple backtick lines, leaving the contents as markdown text.
The second provides the output from the temporary output file generated, including any in-line results. Note that this should be done before another *exec*, otherwise the newer output will be obtained (which may be from a completely different block).
The bottom line option deletes the output block.

If the cursor is inside an output block, the usual shortcut `Alt+/` or `Opt+/`, will execute the last option and delete the output block.

### In-line output
Output can be positioned in-line (within the code block) if this is appropriate:

```js //show calculation results in-line
// '''js //show calculation results in-line
let a='the meaning of life';
console.log('Normally output is shown in an output block');
a+' is '+(7*7-7+Math.random()) =>>the meaning of life is 42.29066347387005
console.log('but results can be shown next to the calculation which produced them');
```
>      Test output (also see in-line above):
>      Normally output is shown in an output block
>      but results can be shown next to the calculation which produced them

Inline results are produced by using `=>>` at the end of a script line (as above).

Notes
- in-line results do not need `console.log`, this is provided by the config section called `swappers`, which in effect 'swap' the output from the `output` block to the appropriate line in the original script
- in-line output should not be utilised inside loops or functions
- lines with `=>>` appended are not legal javascript, although the line is 'legalised' during processing
- to produce legal javascript precede `=>>` with a comment marker, ie for javascript use `// =>>` .. the in-line result will still be updated
- in-line output can be made available for all script engines using the `swappers` config.

### Code block labels and commands
There are three elements to a code block label that *hover-exec* utilises:
- *id* to indicate the script language being employed, used for syntax highlighting by *vscode*
- *cmdid* to indicate the command to use to execute the script (omitted if the same as *id*)
- *repl* or *restart* to indicate a REPL is to be used or restarted (see the readmore)

Example code block labels - these use quotes instead of backticks to allow visibility in previews:

    '''id : cmdid : repl  -- the general format - spaces can be omitted around the :
    '''python    --a python code block, here id & cmdid are both python
    '''js : eval   --a javascript code block which uses eval for execution
    '''octave     --uses octave as both id & cmdid
    '''python:octave  --python is id for syntax highlight, octave is cmdid for execution
    '''output     --output blocks are produced by executing scripts

If *markdown preview enhanced* is used, it will require {cmd..} in the command block label. It also seems to require the {..} as the first item after the code block id. For compatibility *hover-exec* allows the following structure:

    '''js {cmd=node} : eval

This indicates a javascript code block, executed by *node* in *mpe* and *eval* in *hover-exec*.

---
## Javascript scripts

Javascript code blocks can be executed using the `vm` module, also by using  *vscode*'s built in `eval` - and also through [nodejs](#nodejs), or a browser. The default, for command blocks with id `js`, is to use the `vm` module. `hover-exec` provides, by default, a reasonably substantial `vm` context.

### Examples using vm and eval

The code block label `js` by itself defaults to executing javascript via the built-in `vm` module. Appending `:eval` will instead execute the code block using  *eval*.

```js {cmd=javascript}  //click the **exec:** line at the bottom of the *hover* to execute the block
//'''js {cmd=javascript}  //this comment is to show the command line in markdown previews
//                        //the default for the `js` command is to execute using the `vm` module
//   {cmd=..} is only for execution by markdown preview enhanced, it is not used in hover-exec
console.log("Note the in-line random number result ")
'test: '+Math.random() =>>test: 0.9885335440728578
aa = function (fruit){alert('I like ' + fruit);} //no 'let' creates global
bb = function (animal){alert('he likes ' + animal);}
```
>      Test output:
>      Note the in-line random number result

```js
//'''js //execute the previous *vm* block first
//uses the globals defined in the previous code block
bb('dogs'); // alert messages appear bottom right
aa('pears');
```
>      Test output is in a message box, bottom right of screen

Intermediate results can be viewed in line, as above, by appending `=>>` instead of using `console.log()` (see the `swapper` configurations). If it is wished to be strictly correct, and/or compatible with the *markdown preview enhanced* extension (*mpe*), put a comment marker before the `=>>`, eg. for javascript use `// =>>`, for python `# =>>`. Note, though, that *mpe* will not produce the results in-line.

Other results are produced in an `output` block. Hovering over the `output` id of an output code block provides options  *output block to text* or  *delete output block*. If the block has recently been executed, a third option  *all output to text* will provide the full output as in the  *temp...* output file generated. Using the shortcut `Alt+/` or `Opt+/` with the cursor in the `output` block deletes the block.

---
A couple more examples using `js`, showing use of  *vscode* api functions and some extra functions published by *hover-exec* (eg. `alert`).

```js
//'''js //using javascript vm, various examples
let abc="hello, world 3"
alert(abc) //not available in nodejs scripts
let a='goodbye world'
vscode.window.showInformationMessage(a) //not available in node scripts
let b=3;
2*b*Math.random() =>>
eval('let b=3; 2*b*Math.random()')=>>
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>>
process.cwd() =>>
console.log(abc)
```
 >     Test output (note inline results above, and alerts appear in a message box bottom right):
 >     goodbye world 0.7280946459838489
 >     hello, world 3

Note that  *[clear output]* in the main hover can be used to clear all the previous output before execution, including the in-line output. The hover will remain active so that exec is easy. There is also a *hover-exec* extension setting to make  *clear output* the default, at the expense of a little jerkiness.

---
A useful example is a regex tester using the *javascript* vm (try clicking *clear output* before *exec*)::

```js
//'''js  //javascript regex tester
'abcdefg'.replace(/^.*(bc)/,'$1--') =>>bc--defg
```

---
All the code blocks above can be executed using `eval` instead of `vm`, eg.

```js :eval
//'''js :eval // javascript regex tester using eval
'abcdefg'.replace(/^.*(bcde)/,'$1--') =>>
```

The difference is that `vm` scripts are executed within a more restricted  *context* (see next section).

In the command line (eg. above), using `js` for the code block id produces javascript syntax highlighting (it's a quick and dirty approach to provide basic syntax highlighting for a range of scripts), then adding ` :eval` sets the actual exec command to be *vscode*'s `eval`.

- Note that `vm` and `eval` both allow the internal  *vscode* API to be used. Installation of `nodejs` is not required for `vm` or `eval` scripts to execute.

---
### Available functions in *vm* and *eval*

The following functions are included in `vmContext` by default (and are also available to `eval`):

- abort(): abort current script
- alert(string): provide an alert box (bottom right)
- config: access to *hover-exec* configuration
- delay(usec): delay for specified number of usec
- execShell(string): exec shell command
- global: define and access global functions and variables (globals persist over separate script execs)
- globalThis: as for global
- input(string): provide an input box (top of screen)
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
- \_ : access to `lodash` objects (no need to `require('lodash')`)

---

### Using a custom vm context
The context for *vm* can be restricted, enlarged or set back to the default. The *vmContext* object can be directly specified by using *eval*. Examples:

```js:eval
// '''js:eval
for (let x in vmContext){
  write(''+x);
}
```
>      Test output:
>      global
>      globalThis
>      config
>      vscode
>      console
>      util
>      process
>      performance
>      abort
>      alert
>      delay
>      execShell
>      input
>      progress
>      status
>      readFile
>      writeFile
>      write
>      require
>      _
>      math
>      moment
>      __main
>      aa
>      bb

With this context, for example, the following works in `vm`:

```js
//'''js //can use lodash
_.range(0,5)=>>0,1,2,3,4
```

The following four examples show how to reduce the *vm* context, and re-enable the default context.

First reduce the context using `eval`:

```js:eval
//'''js:eval
vmContext={write}
for (let x in vmContext){
  console.log('reduced context:')
  console.log('  {'+x+'}');
}
```
>      Test output:
>      reduced context:
>       {write}

In this reduced context, lodash is not available to `vm` scripts:

```js
//'''js //can't use lodash in reduced context
console.log(_.range(0, 5));
```
>      Test output:
>      error ReferenceError: _ is not defined

To get the default back, set `vmContext` to `undefined`:

```js:eval
//'''js:eval
vmContext=undefined
```

Now `lodash`, part of the default `vmContext`, works again

```js
//'''js //can now use lodash (etc) again in vm
_.range(0,5)=>>0,1,2,3,4
```

In this way, the context used for vm_scripts can be customised to be restricted or permissive as necessary.

### Quick specification of vm context

By default the `js` command utilises a default context which is progressively expanded by 'naked' function declarations and variable assignments (eg. `a=43;` rather than `let a=43;` or `var a=43;`). So successive code blocks can build on previously executed ones.

Any `js:vm` code block can utilise the following options:

Set the *vmContext* to the minimum

```js:vmin
//'''js:vmin    //set 'vmContext' to minimum
//This will set the vmContext to a minimum (ie. just
//including 'write' which enables 'console.log' for output)
console.log('hello')
console.log(_.range(0, 5));
```
>      Test output:
>      error ReferenceError: _ is not defined

Restore the *vmContext* to the default.

```js:vmdf
//'''js:vmdf     //set 'vmContext' to default
//On execution, the vmContext returns to the default
console.log('hello')
console.log(_.range(0, 5));
```
>      Test output:
>      hello
>      [ 0, 1, 2, 3, 4 ]

Apart from resetting `vmContext`, these are normal `js:vm` code blocks.

---

### Using require & globals with vm and eval

Moment, lodash (\_) and mathjs (math) are available by default in both `vm` and `eval`.

When using `vm`, function and variable definitions persist across `vm` scripts during the session. A function or variable can be also set as global (eg. `global.a=a;` see examples below) in either `vm` or `eval`, and is then available during the session in both. A global can be removed using, eg. `delete global.a;`

'Naked' assignments (ie. no `let` or `var`) will be available to subsequently executed `js/vm` code blocks. Global assignments are available to subsequent `js/vm` code blocks, and also to subsequently executed `eval` code blocks.

```js
//'''js //using lodash, mathjs and process in vm
function xrange(){
   let x1=_.range(0,6.1,6/10);
   let x=math.round(math.exp(math.multiply(x1,math.log(10))));
   return x
}
xrange()=>>1,4,16,63,251,1000,3981,15849,63096,251189,1000000
let cd=process.cwd().replace(/\\/g,'/'); //current directory using '/'
cd =>>c:/Users/../GitHub/hover-exec
console.log(xrange())
```
>      Test output (also inline):
>      [
>             1,       4,    16,
>            63,     251,  1000,
>          3981,   15849, 63096,
>        251189, 1000000
>      ]


```js
//'''js //declare a global function (not needed if just using vm scripts)
f=global.f=function(m){return 'the meaning of life is '+m;};
f(44-2)=>>the meaning of life is 42
```
>      Test output inline.


```js:eval
//'''js:eval //use the global function (can be used in both *eval* & *vm*)
f(42)=>> the meaning of life is 42
```
>      Test output inline.

```js
//'''js //naked function definition (no 'let')
test = function () {
  console.log('test works');
};
```
>      Test output - none.

There is no output, but the function `test` is now available to vm:

```js
//'''js //function available to subsequent code blocks
test();
```
>      Test output:
>      test works

For `eval`, neither 'naked' nor 'var' function defs are available to subsequent `eval` code blocks. 
Instead, the 'global' prefix needs to be used in the function def, as was done above.

```js:eval
//'''js //naked function definition (no 'let')
global.test = function () {
  console.log('test works');
};
```
>      Test output - none.

There is no output, but the function `test` is now available to vm:

```js:eval
//'''js //function available to subsequent code blocks
test();
```
>      Test output:
>      test works

---
### Using nodejs

The `js:node` command executes a javascript code block in `nodejs` (assuming, of course, `nodejs` has been installed).

```js : node
//'''js:node //blanks allowed around the : in the command line
console.log('  test using node:\n  ' + Math.random());
console.log(
  '  Note: hover-exec on the output line, or alt+/ (opt+/) with\n',
  ' the cursor in the output block will delete the output block'
);
```
>      Test output:
>        test using node:
>        0.11440220953136393
>        Note: hover-exec on the output line, or alt+/ (opt+/) with
>        the cursor in the output block will delete the output block


Note:
- to allow execution also in *markdown preview enhanced*, include `{cmd=node}` in the command line
  -- eg. `js {command=node} : node`
- *mpe* requires the { .. } to be placed immediately after the id, separated by space(s)
- in-line output is not available in *mpe*.

```js {cmd=node} :node
//'''js {cmd=node} :node
console.log(process.cwd());
console.log('test using node: ' + Math.random());
let a = 5;
console.log(a + Math.random());
```
>      Test output:
>      c:\Users\rmzetti\GitHub\hover-exec
>      test using node: 0.6890891280183384
>      5.083428662334198

```js :node
//'''js :node
process.cwd()  =>>c:\Users\...\GitHub\hover-exec
'test: '+Math.random() =>>test: 0.5575077736488605
let a=5;
a+Math.random() =>>5.639220383136484
```
>      Test output inline.

---

### Html and javascript

Html and In-browser javascript can be used..

The following three examples are from the [js1k demos](https://js1k.com/). This will also work in *mpe*...

```html  // hello world 
<!--'''html // Hello world -->
<h1 align="center">Hello world</h1>
<p>Html will be displayed in the browser</p>
<p id="test">Text here</p>
<script>
  document.getElementById('test').innerHTML = '<em>Text via javascript</em>';
</script>
```

```html  // what am I going to do now
<!-- '''html // tunnel *what am I going to do now*  -->
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
setInterval('o.fillStyle=0;o.fillRect(r,s,p,q);g=+new Date;y-=.0625;if(y<0){y+=.1875;w++}for(d=0,h=31;h--;){l=h*.1875+y,z=200-200/(3+y)*l,m=z/2;o.strokeStyle=C(m,m,m);for(A=i(l+g/1700)*70,B=j(l+g/1100)*70,c=[],a=0;a<120;a+=4){t=a/4,f=t*x+b.PI+i(g/3700),e=u/l;c[a]=A+j(f)*e;c[a+1]=B+i(f)*e;c[a+2]=A+j(f+x)*e;c[a+3]=B+i(f+x)*e;f=(w+h)%len;e=z/4;o.fillStyle=C(+(v[f]?v[f][t-3]:0)?b.max(150+~~(105*i(g/100)),e):m/4,t%16==0&&(h+w)%12?255:e,e);if(d){o.beginPath();o.moveTo(c[a],c[a+1]);o[lt] (c[a+2],c[a+3]);o[lt] (d[a+2],d[a+3]);o[lt] (d[a],d[a+1]);o.fill();o.stroke()}}d=c}',50);
</script></body>
```

```html  // psychedelic
<!-- '''html  // psychedelic -->
<html>
  <head> </head>
  <body>
    <canvas id="canv" display="block"></canvas>
    <script>
      var c = document.getElementById('canv'),
        fst,
        $ = c.getContext('2d');
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      window.addEventListener(
        'resize',
        function () {
          c.width = window.innerWidth;
          c.height = window.innerHeight;
        },
        false
      );
      function mob(a, b, c) {
        var pa = a[0] * a[0] + a[1] * a[1],
          pb = b[0] * b[0] + b[1] * b[1],
          pc = c[0] * c[0] + c[1] * c[1];
        var y =
            ((a[0] - b[0]) * (pb - pc) - (b[0] - c[0]) * (pa - pb)) /
            (2 * (b[1] - a[1]) * (b[0] - c[0]) -
              2 * (a[0] - b[0]) * (c[1] - b[1])),
          x = (pa - pb + 2 * (b[1] - a[1]) * y) / (2 * (a[0] - b[0])),
          r = Math.sqrt((x - a[0]) * (x - a[0]) + (y - a[1]) * (y - a[1]));
        return [x, y, r];
      }
      function arcs(x, y, r) {
        var c = mob_arc(x, y, r);
        if (c[2] > 10) return;
        $.beginPath();
        $.arc(c[0], c[1], c[2] / 1.65, 0, Math.PI * 2, false);
        $.fill();
        $.closePath();
      }
      function mob_pt(x, y) {
        var denom = (x + 1) * (x + 1) + y * y;
        return [(x * x - 1 + y * y) / denom, (2 * y) / denom];
      }
      function mob_arc(x, y, r) {
        var a = mob_pt(x - r, y),
          b = mob_pt(x + r, y),
          c = mob_pt(x, y + r);
        return mob(a, b, c);
      }
      function cmul(w, z) {
        return [w[0] * z[0] - w[1] * z[1], w[0] * z[1] + w[1] * z[0]];
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
        for (
          var q = st, mod_q = modulus(q);
          mod_q < max_d;
          q = cmul(q, delta), mod_q *= md
        ) {
          $.fillStyle = cols[colidx];
          arcs(q[0], q[1], mod_q * r);
          colidx = (colidx + 1) % cols.length;
        }
        colidx = ((opts ? opts.i : 0) + cols.length - 1) % cols.length;
        for (
          var q = cmul(st, rd), mod_q = modulus(q);
          mod_q > min_d;
          q = cmul(q, rd), mod_q *= mrd
        ) {
          $.fillStyle = cols[colidx];
          arcs(q[0], q[1], mod_q * r);
          colidx = (colidx + cols.length - 1) % cols.length;
        }
      }
      var p = 9,
        q = 36;
      root = {
        a: [1.203073257697729, 0.06467009356882296],
        b: [1.0292303580593238, 0.19576340274878198],
        r: 0.09666227205856094,
      };
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
            i: i % 3.5,
            min_d: 1e-3,
            max_d: 1e3,
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
    </script>
  </body>
</html>
```

```html  // breathing galaxies
<!-- '''html  // breathing galaxies -->
<html>
  <head>
    <title>JS1k: Breathing Galaxies (1020 bytes)</title>
    <script type="text/javascript">
      window.onload = function () {
        C = Math.cos; // cache Math objects
        S = Math.sin;
        PP = Math.PI;
        SW = screen.availWidth * 1.1;
        SH = screen.availHeight;
        U = 0;
        w = window;
        j = document;
        d = j.getElementById('c');
        c = d.getContext('2d');
        W = d.width = SW;
        H = d.height = SH;
        c.fillRect(0, 0, W, H); // resize <canvas> and draw black rect (default)
        c.globalCompositeOperation = 'lighter'; // switch to additive color application
        c.lineWidth = 0.2;
        c.lineCap = 'round';
        var bool = 0,
          t = 0; // theta
        d.onmousemove = function (e) {
          if (window.T) {
            if (D == 9) {
              D = Math.random() * 15;
              f(1);
            }
            clearTimeout(T);
          }
          X = e.pageX; // grab mouse pixel coords
          Y = e.pageY;
          a = 0; // previous coord.x
          b = 0; // previous coord.y
          (A = X), // original coord.x
            (B = Y); // original coord.y
          R = (((e.pageX / W) * 999) >> 0) / 999;
          r = (((e.pageY / H) * 999) >> 0) / 999;
          U = ((e.pageX / H) * 360) >> 0;
          D = 9;
          g = (360 * PP) / 180;
          T = setInterval(
            (f = function (e) {
              // start looping spectrum
              c.save();
              c.globalCompositeOperation = 'source-over'; // switch to additive color application
              if (e != 1) {
                c.fillStyle = 'rgba(0,0,0,0.02)';
                c.fillRect(0, 0, W, H); // resize <canvas> and draw black rect (default)
              }
              c.restore();
              i = 255;
              while (i--) {
                //25
                c.beginPath();
                if (D > 450 || bool) {
                  // decrease diameter
                  if (!bool) {
                    // has hit maximum
                    bool = 1;
                  }
                  if (D < 0.1) {
                    // has hit minimum
                    bool = 0;
                  }
                  t -= g; // decrease theta
                  D -= 0.1; // decrease size
                }
                if (!bool) {
                  t += g; // increase theta
                  D += 0.1; // increase size
                }
                q = (R / r - 1) * t;
                // create hypotrochoid from current mouse position, and setup variables (see: http://en.wikipedia.org/wiki/Hypotrochoid)
                x =
                  (R - r) * C(t) +
                  D * C(q) +
                  (A + (X - A) * (i / 25)) +
                  (r - R); // center on xy coords
                y = (R - r) * S(t) - D * S(q) + (B + (Y - B) * (i / 25));
                if (a) {
                  // draw once two points are set
                  c.moveTo(a, b);
                  c.lineTo(x, y);
                }
                c.strokeStyle = 'hsla(' + (U % 360) + ',100%,50%,0.75)'; // draw rainbow hypotrochoid
                c.stroke();
                a = x; // set previous coord.x
                b = y; // set previous coord.y
              }
              U -= 0.5; // increment hue
              A = X; // set original coord.x
              B = Y; // set original coord.y
            }),
            16
          );
        };
        j.onkeydown = function (e) {
          a = b = 0;
          R += 0.05;
        };
        //d.onmousemove({pageX:300, pageY:290})
        setInterval(
          'd.onmousemove({pageX:Math.random()*SW, pageY:Math.random()*SH})',
          Math.random() * 1000
        );
      };
    </script>
    <style>
      body {
        margin: 0;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <canvas id="c"></canvas>
  </body>
</html>
```

---
### More javascript examples

#### Using vscode functions

The *vm* and *eval* commands use vscode's built in capabilities. *vm* and *eval* are not available in *mpe*.

```js
//'''js :vm   // or just 'js'
let abc="abcde"
let a='hello variable world';
alert(a) //nb. alert is not available in node
a='goodbye'
vscode.window.showInformationMessage(a) //not available in node
eval('let a=3;2*a*Math.random()')=>>2.0640811299649973
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>>hello 1.1809207030007176
process.cwd() =>>c:\Users\,,\GitHub\hover-exec
console.log(abc)
```
>      Test output (also inline, and in message boxes bottom right of window):
>      goodbye 0.5267435608368682
>      abcde


---
#### Time and date

Various time and date functions using `vm`

```js
//'''js      //time & date using internal javascript via vm - not in *mpe*
(44-Math.random())=>>43.00094653105661
//show information message via vscode api
progress('Hello whole World',4000)
new Date().toISOString().slice(0,10)=>>2022-01-29
new Date().toLocaleDateString()=>>30/01/2022
new Date().toString()=>>Sun Jan 30 2022 10:29:40 GMT+1300 (New Zealand Daylight Time)
new Date().toLocaleString()=>>30/01/2022, 10:29:40 am
new Date().getTime()=>>1643491780855
```
>      Test output: all inline (and a progress message bottom right)

---
Time and date using node

```js {cmd=node} :node
//'''js {cmd=node} :node  //through nodejs in both mpe and hover-exec
a=44
// in-line results are calculated but not output in mpe
'answer='+(a-Math.random()) =>>answer=43.021172705218675
new Date().getTime()=>>1650276828942
console.log(new Date().toISOString().slice(0, 10))
console.log(new Date().toLocaleDateString())
```
>      Test output:
>      2022-04-18
>      18/04/2022

---
#### Localhost server

Run a server on localhost ([click here after running it](http://127.0.0.1:1337))
Also works in *markdown preview enhanced*, (ie. *mpe*)

```js {cmd=node}
//'''js {cmd=node} -- works in mpe using node
var http = require('http');
http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World at last!\n');
  })
  .listen(1337, '127.0.0.1');
```

Note. If there is an EACCESS error in windows, use 'net stop winnat' and then 'net start winnat' in an admin terminal.

To kill the server, for windows use `pwsh` (see the comments below), also in *mpe*, for macos use zsh below

```pwsh
 # '''pwsh {cmd} --works in mpe
 # to kill server, exec once & look for pid to kill (line TCP 127.0.0.1:1337, pid on rhs)
 # then enter pid in kill statement below and exec again
kill 1400
netstat -ano | findstr :13
```

```zsh
 # '''zsh - server usually killed on 'cancel'
 # to check, exec once & look for pid to kill (line TCP 127.0.0.1:1337)
 # then replace pid in kill statement below with the one found and exec again
kill 49845
netstat -vanp tcp | grep -e 1337 -e pid
```

---
#### Random strings

```js
//'''js {cmd=node} :node //alternative using node, also works in mpe
//random string generation see https://gist.github.com/6174/6062387
a=Math.random().toString(36).substring(2, 15)
a =>>rbd7mswsp5k
a=[...Array(60)].map(_=>(Math.random()*36|0).toString(36)).join``
a =>>nclnhj9nilkyqdsqzyutueamthwutbcoj17iazc33j785hjuosec4063775l
a=[...Array(30)].map(_=>((Math.random()*26+10)|0).toString(36)).join``
a =>>hxnxshjsjblbtyqlovrbrrvnjmffrr
console.log(a)
Math.random(36).toString(36).substring(2,3) =>>9
```
>      Test output:
>      hxnxshjsjblbtyqlovrbrrvnjmffrr

---
```js {cmd=node} :node //string jumbler, works in mpe
//'''js {cmd=node} :node //string jumbler, works in mpe
function swapStr(str, n) {
  var arr = [...str];
  for (let k = 0; k < n; k++) {
    i = (Math.random() * str.length) | 0;
    j = (Math.random() * str.length) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}
console.log(swapStr('portsmouth', 100));
```
>      Test output:
>      mhtoprsout

---
```js {cmd=node} :node //generate random string
//'''js {cmd=node} :node //generate random string
function randch(n){
  return ''+Math.random().toString(36).substring(2,2+n)
}
randch(36) // =>>alxgrlb8lu8
console.log(randch(36))
```
>      Test output:
>      wozwmx10b3

---

#### Regular expression testing

Here are several other examples of regex testing - the output is in-line.
To see that the output is being regenerated click *[clear output]* in the hover before executing

```js {cmd=node}
//'''js {cmd} //javascript regex tester (use node for mpe)
// if not using md preview enhanced, use = >> instead of // = (less faint)
let s="xys {cmd='js'} th".replace(/.*cmd=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'');
s+' this output not from mpe.' // =>>js this output not from mpe.
console.log(s); //this needed for mpe
```
>      Test output:
>      js

---
```js {cmd=node} :eval // for mpe the {..} needs to be before the : 
//'''js {cmd=node} :eval //javascript regex tester
'abcdefg'.replace(/^.*(bc)/,'$1Baa')  // =>> bcBaadefg
console.log('abcdefg'.replace(/^.*(bc)/,'$1Baa'))  //this for *mpe*
```
>      Test output:
>      bcBaadefg


---
another regex example

```js {cmd=node} : node // for mpe the {..} needs to be before the : 
//'''js :node // if the space is not included before the : the code block disappears in mpe
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
console.log('myRe is '+myRe)
```
>      Test output:
>      myRe is /d(b+)d/g


---
#### Javascript input box (Vitamin b12, dosage vs uptake)

This uses `await input('text')` to get input for a js script. It works in *js* (*vm*), or *eval*, not *nodejs

```js
//'''js   //getting input for js:vm or js:eval
let d=await input('dosage ug?')/1 // /1 converts to number, also note 'await'
let u=1.5*d/(d+1.5)+(1-1.5/(d+1.5))*0.009*d
' uptake='+u  =>> uptake=10.484273589615576
console.log('for',d,'ug uptake is',u,'ug')
```
>      Test output:
>      for 1000 ug uptake is 10.484273589615576 ug

---
## Other scripts

### Scripts with command execution strings included

Command lines to conveniently start a number of scripts are included (see [Configuration settings](#configuration-settings) for the actual command lines used):

- [javascript via vm and eval](#Examples-using-vm-and-eval)
- [javascript using nodejs](#Using-nodejs)
- [html via the default browser](#Html-and-javascript)
- [python](#python)
- [julia](#julia)
- [octave](#octave)
- [scilab](#scilab)
- [lua](#lua)
- [matlab](#matlab)
- [go](#go)
- [pascal](#pascal)
- [gnuplot](#gnuplot)
- [powershell](#powershell)
- [bash & zsh](#bash-&-zsh)

Notes:

- The script language you wish to use (eg `julia`, `nodejs` ..) needs to have been installed
- Some of the commands to run the scripts ***may need customising*** to suit your particular installation - see [Configuration settings](#configuration-settings).
- Other script languages may be added. In basic usage the script command can be entered via '[config]' in the hover. To achieve in-line capability, use the *hover-exec* extension settings, or as an alternative, this can also done with `eval` - see the [Add new script language](#add-new-script-language) section for examples.

---
### Python

Use `python` to run python. `python3` can be used if that is the python start command

```python {cmd}
# '''python :python3 # use this instead to use 'python3' as start command
from random import random
45-2+random()       #  =>>43.60797447261393
'hello, world 3!'       #  =>>hello, world 3!
print('python ok')
```
>      Test output (plus inline output):
>      python ok


Note that the inline indicator `=>>` has been prefixed by a python comment character `#` (only spaces allowed between) so that *markdown preview enhanced* can execute the code. *hover-exec* will still update the in-line output, but *mpe*, of course, will not.

---
This one-liner can be used to install python packages via pip (change cmdId to `pwsh`,`bash`,`zsh` as appropriate):

`pwsh python -m pip install --upgrade pip` // this example will upgrade pip
`pwsh python -m pip install numpy`            // this example will install numpy 
`pwsh python -m pip install pyformulas`     // this example will install pyformulas 

---
In the following example, `{cmd matplotlib=true}` will allow execution in *markdown preview enhanced* & plot graphs inline. In *hover-exec* they are plotted in a separate window (and can be 'pasted' in using the `paste image` vscode extension). If you also use  *markdown memo* the image link can be changed to the wiki form `[[...]]` and viewed on hover.

```python {cmd matplotlib=true}
# '''python {cmd matplotlib=true}
import numpy as np
import matplotlib.pyplot as plt
randnums= np.random.randint(1,101,500)
plt.plot(randnums)
plt.show()
```
>      Test output is the plot.

Image from running the above code block & pasting via  *Markdown kit* or  *Markdown memo*:

![[matplotlib_example.png]]

---

```python  //show live plot (for about 4 sec)
# '''python :python3 # use this instead to use 'python3' as start command
# '''python {cmd}    # include {cmd} for mpe
import pyformulas as pf
import matplotlib.pyplot as plt
import numpy as np
import time
fig = plt.figure()
fig.suptitle('To close, click cancel in hover, then close plot if necessary', fontsize=14)
canvas = np.zeros((480,640))
screen = pf.screen(canvas, 'Sinusoid')
start = time.time()
now = time.time() - start
while now<4:
    x = np.linspace(now-2, now, 100)
    y = np.sin(2*np.pi*x) + np.sin(3*np.pi*x)
    plt.xlim(now-2,now+1)
    plt.ylim(-3,3)
    plt.plot(x, y, c='black')
    # If we haven't already shown or saved the plot, then we need to draw the figure first...
    fig.canvas.draw()
    image = np.frombuffer(fig.canvas.tostring_rgb(), dtype=np.uint8)
    image = image.reshape(fig.canvas.get_width_height()[::-1] + (3,))
    screen.update(image)
    now = time.time() - start
```
>      Test output is the plot.

---
### Julia

If the *julia* extension is included, *vscode* will provide syntax highlighting. Note that when doing this test, you will need to ensure *julia* has the appropriate packages available (see the *using* line in the example script below). The following one-liners could be used to do this for the script below (if you're reading this in the preview, the one-liners are surrounded with single backticks and start in col 1):

`julia using Pkg;Pkg.add("LinearAlgebra");`

**Note:** these may often take some time, sometimes about 5 minutes for me... there will be an *executing julia* message in the *vscode* status bar, and there will be *output* when they are complete.

```julia
# '''julia  // use '''julia {cmd} to execute in *mpe* 
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

Use `octave` or `python : octave` to run octave. Using 'python' as the command id provides syntax highlighting, adding :octave uses octave. The {...} is for *markdown preview enhanced*

```python :octave
 # '''python : octave {cmd=octave} -- {cmd..} is for mpe
 #   python gives a syntax highlighter, :octave executes in octave
 #   nb. in octave, need mat2str or num2str for numeric output
num2str(7.1+rand(1))  =>>7.2741
'hello world in-line'  =>>hello world in-line
pwd()  =>>c:\Users\...\GitHub\hover-exec
disp('hello world in output section!')
disp(rand(1))
```
>      Test output (also see in-line):
>      hello world in output section!
>      0.9263

---
### Scilab

Use `scilab` to run scilab, or `js :scilab` for some quick and dirty syntax highlighting

```js :scilab
// '''js :scilab //using js :scilab provides quick & dirty (js) syntax highlight
//  nb. scilab needs to use 'string()' for inline numeric output (uses mprintf)
rand("seed",getdate('s')); //set new random sequence
mprintf('%s\n','test '+string(rand())+' '+pwd());
string(rand())+' '+pwd() =>>0.7225487 c:\Users\rmzetti\GitHub\hover-exec
string(rand()) =>>0.4548922
disp('disp puts quotes around strings',rand())
```
>      Test output (also see in-line):
>      test 0.3995462 c:\Users\rmzetti\GitHub\hover-exec
>        "disp puts quotes around strings"
>         0.4512196

---
### Lua

Lua has a syntax highlighter available for *vscode*.

Many installations require running, say, *lua51*, or *lua54*, rather than setting *lua* as the run-time (unlike, say, *julia*).
If this is the case use 'lua : lua54' as the command id, etc. ... or check/adjust using [config] in the hover (top left).

```lua -- say hello & goodbye
-- '''lua  -- 'lua' id specifies syntax highlight and default start command
--   add :lua54 to use 'lua54' as theactual command
'hello ' .. 44-2+math.random() =>>hello 42.44251179337
"& goodbye " .. math.pi+math.random() =>>& goodbye 3.2245941852191
print("lua ok") -- this outputs in the output code block below
```
>      Test output (also see in-line):
>      lua ok

---
### Matlab

And `matlab` can be used to run  *matlab*, although it's a slow starter...

```matlab
% '''matlab  --matlab is slow to start (takes about 5s on Asus with Ryzen 7 4700U)
x = 1:0.1:10;
y = x.^2;
plot(x,y)
uiwait(helpdlg('Ok!')); % this line needed otherwise the plot disappears
% more waiting after plot dismissed before the following answer appears
7*7-7 =>>42
disp("matlab ok!")
```
>      Test output (need to close the plot to see this, after a delay.. ):
>      matlab ok!

---
### Go

Using go as a 'scripting language'.
Note that the go.mod and go.sum files provided in the 'test' directory need to be in the following folder: \
`echo %g` //hover here (in the editor) to view the actual path for your system

```go
// '''go
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
>      Test output:
>      emp: [0 0 0 0 0]
>      set: [0 0 0 0 42]
>      get: 42
>      len: 5
>      dcl: [1 2 3 4 5]
>      2d:  [[0 1 2] [1 2 3]]

---
### Gnuplot

 *Gnuplot* is a very useful stand-alone plotting facility. Assuming  *gnuplot* has been installed, it can be executed within *hover-exec*. In addition, other scripts can output  *gnuplot* commands (along with data) in their output block and the data can be immediatedly plotted in a chained fashion (see the next section).

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
The data in the above script is used by utilising the tag '#tag1'

```html //plotly
<!-- '''html //test using plotly -->
 <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<div id="plot" style="width:80%;height:500px"></div>
<script>
let lm='lines+markers'
let a=[`include  #tag1`] //hover here to see the data from the previous script
let x1=Array(a.length/2).fill(0).map((x,i) => a[i*2])
let y1=Array(a.length/2).fill(0).map((x,i) => a[i*2+1])
plot1 = document.getElementById('plot');
Plotly.plot( plot1, [{ x: x1, y: y1, mode: lm, name:'pascal'}]);
</script>
<a href="https://bit.ly/1Or9igj">plotly.js documentation</a>
```

---
### Bash & zsh

Use `zsh` to run zsh, or `zsh {cmd}` to also run in *mpe*

```zsh # (macos) show current directory
# '''zsh # (macos) show current directory
pwd
```
>      Test output:
>      /Users/rmzetti/Github/hover-exec

Use `bash` to run bash, or `bash {cmd}` to also run in *mpe*

```bash # (macos, linux, wsl) show current directory
# '''bash # (macos, linux) show current directory
pwd
ls -l
```
>      Test output:
>      /Users/rmzetti/Github/hover-exec
>      total 22
>      drwxr-xr-x ... etc.

Can also use bash commands direct, since for macos/linux/wsl bash is the default shell for child-process
`ls -al "%g"` //list temp directory files (in the hover command, %e, %f etc are expanded - see the hover message)

Hover-exec can also use `zsh` as the default by setting `scripts.os="mac (zsh)"` rather than the child-process default `bash` which is used if `scripts.os="mac (auto)"` (if changed, *vscode* may need a restart)

---
### Powershell

Use `pwsh` to run powershell, or `pwsh {cmd}` to also run in *mpe*

```pwsh # (windows) random number, show current directory
pwd
```
>      Test output:
>      Path
>      ----
>      C:\Users\rmzetti\GitHub\hover-exec

Can also get in-line results:

```pwsh
# '''pwsh {cmd}
Get-Random -Min 0.0 -Max 1.0  =>>0.166621897447213
"current dir: "+(pwd)  =>>current dir: C:\Users\rmzetti\GitHub\hover-exec
```
>      Test output is in-line.

Note that pwsh can be set as the default windows shell by setting `scripts.os="win (pwsh)"` in settings.json. Then powershell commands can be issued direct, eg.
`[System.Environment]::OSVersion.Version` //only works if `scripts.os="win (pwsh)"`

Instead if the shell is the default (cmd), ie. `scripts.os="win (auto)"`, use
`pwsh [System.Environment]::OSVersion.Version`
`ver` //better for the default shell (cmd)
>      Test output: both previous commands indicate (different format)
>      Microsoft Windows [Version 10.0.22581.100]
which would be great, except that I'm actually running Windows 11.. c'est la Microsoft.

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
## Chaining execution code blocks

Here a javascript code block produces output in the form of an `output:gnuplot` labelled code block. This block has *id* `output` and so will be replaced if the javascript is executed again. Because it also has *cmdid* `gnuplot` it can be directly executed in the usual ways to produce the plot.

```js  //takes from 1-10 sec to run - the output is a gnuplot code block
// '''js //example to show chaining output to gnuplot
function xrange() {
  let x1 = _.range(0, 6.1, 6 / 19);
  let x = math.round(math.exp(math.multiply(x1, math.log(10))));
  return x;
}
let x = xrange();
let j = 0,
  n = 0,
  ii = 0;
let tim = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
for (ii = 0; ii < x.length; ii++) {
  await status('loop ' + ii); //status bar rhs
  n = x[ii];
  let rr = _.range(0, n),
    m = 1,
    i = 0,
    t1 = 0;
  for (i = 0; i < rr.length; i++) {
    rr[i] = math.random();
  }
  let rr1 = rr,
    rr2 = rr;
  if (n < 100) {
    m = 10000;
  } else if (n < 5000) {
    m = 1000;
  } else if (n < 20000) {
    m = 500;
  } else {
    m = 100;
  }
  m =m/5; //adjust m to adjust time taken
  t1 = moment.now();
  for (i = 0; i < m; i++) {
    rr = math.add(math.dotMultiply(rr1, rr2), rr1);
  }
  t1 = (moment.now() - t1) / n / m / 1000; //msec->sec
  tim[j++] = 2 / t1 / 1e6;
}
status('');
console.log('output :gnuplot'); //the backticks are not required, they will be inserted
console.log('#tag_speed'); //inserting an id tag allows other scripts to use the data
console.log('$speed << EOD');
for (ii = 0; ii < x.length; ii++) {
  console.log(x[ii], tim[ii]);
}
console.log('EOD');
console.log('#tag_speed'); //same id tag at end of data
console.log('set logscale x');
console.log('plot "$speed" w lp title "speed"');
```
```output :gnuplot
#tag_speed
$speed << EOD
1 0.21052631578947367
2 0.5714285714285715
4 1.142857142857143
9 2.7692307692307696
18 5.142857142857142
38 10.133333333333335
78 14.857142857142858
162 21.6
336 19.2
695 21.384615384615387
1438 23.008
2976 25.878260869565214
6158 27.36888888888889
12743 27.702173913043477
26367 25.72390243902439
54556 20.0205504587156
112884 26.10034682080925
233572 23.012019704433502
483293 24.595063613231556
1000000 22.222222222222225
EOD
#tag_speed
set logscale x
plot "$speed" w lp title "speed"
```
>      Test output is the plot.

---
## Including tagged sections

The following line in a code block

  `include #tag_speed` // hover to view the data (which is in the above code block)

will include a group of lines elsewhere in the file surrounded with the '#tag_speed' tag (lines need not be in a code block).

To see what will be included, hover over the tag reference in the `include` line. Note that:

1. The actual tags must either stand alone in a line, or end the line (eg. tags can have comment markers in front of them)
2. To include lines from another file use the format
>      `include file_path/name #tag`
>      (nb. file_path can include %c current folder, or %g temp files folder command variables)
>      If the tag is empty (ie. just #) the whole file is used - recursive is not supported

Here is an example:

```gnuplot
# '''gnuplot
$speed <<EOD
  `include %d/misc_tests.md #p1`     // hover to view the data in misc_test.md
EOD
set logscale x
plot "$speed" w lp title "speed"
```
>      Test output is the plot.

Or use 'plotly' for the same example data:

```html //plotly
<!-- '''html //test using plotly -->
 <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<div id="plot" style="width:70%;height:400px"></div>
<script>
let lm='lines+markers'
let a=[ `include  %d/misc_tests.md#p1` ]   //note *include* is inside the array designator square brackets
let x=Array(a.length/2).fill(0).map((x,i) => Math.log10(a[i*2]))
let y1=Array(a.length/2).fill(0).map((x,i) => a[i*2+1])
plot1 = document.getElementById('plot');
Plotly.plot( plot1, [{ x: x, y: y1, mode: lm, name:'pascal' },]);
</script>
<a href="https://bit.ly/1Or9igj">plotly.js documentation</a>
```
>      Test output is the plot.

---
## Using scripts via REPLs

Scripts can also be run using their REPL version, if this is available - eg. for node, lua, octave, scilab, r, julia. For REPLs, successive script execution will recognise previously defined variables and functions.

To indicate the REPL is to be used, two colons must follow the code block id, which then has the form:

      '''id1 :id2 :restart //comments

where 'id1' defines the syntax highlighting to be used, 'id2' if present defines the script to be used, the second colon indicates the REPL is to be used, and 'restart' if present indicates the REPL is to be restarted (all previously declared script variables and functions deleted).

The currently 'active' REPL can be directly killed with the one-liner:

`js:eval repl.kill()` //kills active REPL (but normally use :restart)

Each of the script REPL examples below shows a 'restart' script followed by a REPL continuation script which shows that the script variables defined in the 'restart' script are still available.

---
### Python REPL

The first script uses 'restart' to ensure previous script variables are removed. 

```python ::restart
# '''python ::restart  # the two colons indicate the REPL is to be used, 'restart' resets the REPL
# '''python : python3: restart # alternative to use 'python3' as start command
from time import time
t=time()
b=0
for c in range(600):
  for a in range(10000):
    b+=1
  b+=1
time()-t
print("b="+str(b))   # using print avoids quote marks
```
>      Test output:
>      0.3948814868927002
>      b= 6000600

The second script can use script variables defined in the first script (and any other python REPL scripts). Multiple executions (use the keyboard shortcut Alt+/ or Opt+/ with the cursor inside the script to make it easy) will update the variables.

```python::
# python::repl   # the two colons indicate the REPL is to be used, 'repl' can be omitted.
# python :python3:  # use this instead to use 'python3' as start command
from time import time
b=>>6000600
b=b+1 # b is successively updated with each run
time()-t
"b",b          # note 'print' not necessary when using repl
print("b="+str(b)) # but using print gives better control
```
>      Test output - after a few runs
>      17.39616107940674
>      ('b', 6000605)
>      b=6000605

---
### Julia REPL

The first script uses 'restart' to ensure previous script variables are removed. 

```julia ::restart
# '''julia ::restart
using LinearAlgebra; _
x=rand(Float64); _   # _ suppresses output in the Julia REPL
a=rand(Float64,3); _
# string("a=",a,"\nx=",x)  # using 'print' instead avoids quotes in the output
print(string("a'*a=",dot(a,a),"\nx=",x))
```
>      Test output:
>      a'*a=1.6390404679429986
>      x=0.364102954954058

The second script can use script variables defined in the first script (and any other julia REPL scripts). There is no need to repeat 'using LinearAlgebra' if previously used (as in the restart script above)

```julia ::
# '''julia ::  # the two colons indicate the REPL is to be used
a=a.+1;_           # _ suppresses output in the Julia REPL
x=x+1;_
print(dot(a,a),'\n',x) # NB no need to repeat 'using LinearAlgebra' to use 'dot()` because REPL
```
>      Test output - after a few runs
>      136.07768737792787
>      6.364102954954058

---
### Lua REPL

The first script uses 'restart' to ensure previous lua script variables are removed.

```lua::restart
-- '''lua::restart       -- two colons indicate REPL is to be used
--    or for example,  '''lua:lua54:restart to use lua54
m=1e7; n=0.01; tt = os.clock()
-- lua REPL does not give output for assignment statements
tt=>>0.977
for ii=1,m do
  n=n*ii; n=n+1; n=n/ii
end
tt1=os.clock()-tt
tt1=>>0.414
tt1
```
>      Test output (also in-line):
>      0.414

The second script can use script variables defined in the first script (and any other lua REPL scripts run since a 'restart').

```lua::
-- '''lua::  -- two colons indicate REPL is to be used
--    or for example '''lua:lua54:  to use lua54
tt1=tt1+1
tt1 =>>1.414
os.clock()-tt =>>7.577
```
>      Test output after a couple of runs is in-line

---
### Node REPL

The first script uses 'restart' to ensure previous node script variables are removed. 

```js:node:restart
// '''js:node:restart    //two colons for REPL, the id 'js' is just for syntax highlight
let a=0,b=0,c=0       //define and initialise a,b,c
[a,b,c] =>>0,0,0
'hello: '+[a,b,c]
```
>      Test output:
>      'hello: 0,0,0'

The second script can use node script variables defined in the first script (and any other node REPL scripts run since a 'restart').

```js:node:
// '''js:node:restart  //two colons for REPL, js just for syntax highlight
                    //repl vars updated if this block is repeated
a+=1;b+=10;c+=100;_      // _ suppresses output
[a,b,c] =>>4,40,400
'goodbye: '+[a,b,c]
```
>      Test output - after a few runs
>      'goodbye: 4,40,400'

---
### Scilab REPL

The first script uses 'restart' to ensure previous scilab variables are removed. 

```js:scilab:restart
// '''js:scilab:restart    //two colons for REPL, js just for syntax highlight
tic();a=1.1;m=1000000; //1e6
for x=1:1:m
  a=a*x;a=a+1.1;a=a/x;
end
t=toc(); //scilab REPL produces no output if statement ends with ;
mprintf('Time: %.2f sec',t)
```
>      Test output:
>      Time: 1.26 sec

The second script can use scilab variables defined in the first script (and any other scilab REPL scripts run since a 'restart').

```js:scilab:
// '''js:scilab:    //two colons for REPL, js just for syntax highlight
mprintf('a equals %.f',a)
mprintf('t equals %.2f',t)
a=a+1; // the ; suppresses output in the scilab REPL
```
>      Test output - after a few runs
>      a equals 22
>      t equals 1.26

---
### Octave REPL

The first script uses 'restart' to ensure previous octave variables are removed. 

```python:octave:restart
# '''python:octave:restart    # two colons for REPL, python just for syntax highlight
a=1.0; t=time; nrpt=0;
m=1000000; #1e6
for i=1:m
  a=a*i; a=a+1.1; a=a/i;
endfor
t=time-t; # the ; suppresses output in the octave REPL
disp(strcat('time= ',num2str(t),' sec'))
disp(strcat('speed= ',num2str(m/t/1e6),' million iterations per sec'))
```
>      Test output:
>      time=1.6665 sec
>      speed=0.60006 million iterations per sec

```python:octave:
# '''python:octave:    # two colons for REPL, python just for syntax highlight
nrpt+=1
disp(strcat('time= ',num2str(t),' sec'))
disp(strcat('speed= ',num2str(m/t/1e6),' million iterations per sec'))
```
>      Test output - after a few runs
>      nrpt = 3
>      time=1.6665 sec
>      speed=0.60006 million iterations per sec

---
### R (rterm) REPL

The first script uses 'restart' to ensure previous rterm variables are removed. 

```python:rterm:restart
# '''python :rterm :restart    # two colons for REPL, python just for syntax highlight
a <- 7*7-7
a=>> 42 
print(noquote(paste('the meaning of life is',a)))
```
>      Test output:
>      the meaning of life is 42

The second script can use rterm variables defined in any other rterm REPL scripts run since a 'restart'.

```python:rterm:
print(noquote(paste('the meaning of life is',a)))
```
>      Test output:
>      the meaning of life is 42


Here is a slightly more complex rterm REPL script

```rterm::restart
# '''rterm::restart    # two colons for REPL, no syntax highlight
require(tcltk)
x <- 1:10              # data for plots
y1 <- x*x
y2  <- 2*y1
```
>      No output, check plots by executing the next code block

Plot the data set up above (this is a windows example)

```python:rterm: #plotting the above data
# '''python:rterm:    //two colons for REPL, python just for syntax highlight
windows()
# Stair steps plot
plot(x, y1, type = "S")
# Lines & points plot
windows()
plot(x,y1,type="b",pch=19,col="red",xlab= "x",ylab="y")
lines(x, y2,pch=18,col="blue",type="b",lty=2)
msgBox<-tkmessageBox(title="R plots",message="Close plots FIRST, then this message box!")
```
>      No output, just the plots..

NB. Use this if the plots remain:
`js:eval repl.kill()` //kills active repl and all associated script variables

---
### Check for active REPLs

The following *eval* script can be used to check for active REPLs

```js:eval
// '''js:eval
//chRepl is a *hover-exec* internal variable containing the active REPLs
chRepl.length=>> 1
let i=chRepl.findIndex((el)=>el[1]===repl)
i=>> 0
chRepl[i][0]=>> rterm
```
>      Test output - see in-line output

---
## One-liners and quickmath

 *One-liners* starting with a single backtick  in column 1 and ending with a single backtick can also be executed with *hover-click*. The pre-defined variables %c current workspace folder, %d current file path only, %e current file full path+name, %f temp file full path+name, %g temp file path, %n temp file name can be used (the derived path will be seen in the hover). Comments can be added after the closing quote.

Another useful facility is  *quickmath*. A math expression of the form `5-sqrt(2)=` (does not need to start in column 1) will be evaluated on hover (using  *mathjs* `math.evaluate(..)`) and the result will be shown immediately in the hover message. Clicking the hover result will copy it to the clipboard. Note that the expression is surrounded by single backticks, and there needs to be '=' before the last backtick (essentially to stop popups for other backtick quoted strings).

### Default shell simple command execution:
(result depends on the default shell for vscode on your system)

`pwd` zsh, bash, pwsh, cmd \
`ls` zsh,bash, pwsh \
`dir` cmd

### exec notepad with file in current file's folder:

`notepad "%d/README.md"` --windows \
`open -a textedit "%d/README.md"` --mac \
`gedit "%d/README.md"` --linux, wsl \
`xedit "%d/README.md"` --linux, wsl

### exec notepad with temp file (%f):

`open -a textedit "%f"` --mac \
`notepad "%f"` --windows \
`xedit "%f"` --linux, wsl

### open another instance of vscode:

`code -n %c`
`code -n %f` --windows, linux, wsl \
`open -na "visual studio code"` --mac

### explore files, view folders:

`open -a finder ~` mac 'home' \
`open -a finder "%c"` mac to view current workspace folder in finder \
`explorer ,` windows view 'ThisPC' \
`explorer /select, "%E"` windows explorer - view current file's folder & select the file, needs %E not %e \
`nemo "%d/README.md"` Linux mint view current file's folder & select file

### other examples:

`devmgmt.msc` for windows show devices \
`system_profiler SPHardwareDataType` for mac show hardware info \
`html <script>location.href= 'https://whatamigoingtodonow.net/'</script>` windows default browser with href \
`html <h1>Hello world!</h1>` windows default browser with some html \
`safari <script>location.href= 'https://whatamigoingtodonow.net/'</script>` mac safari with href \
`safari <h1>Hello world!</h1>` mac safari with some html \
`firefox <script>location.href= 'https://whatamigoingtodonow.net/'</script>` linux firefox with href \
`firefox <h1>Hello world!</h1>` linux firefox with some html \
`chrome <script>location.href= 'https://whatamigoingtodonow.net/'</script>` wsl chrome with href

### bash html & javascript

`"C:\Program Files\Google\Chrome\Application\chrome.exe" %d/hover-exec.gif` //chrome with media or html file - can use %d etc in one-liners \
`html <script>location.href='https://whatamigoingtodonow.net/'</script>` //browser with url \
`html <h1 align='center' >this: %d</h1><br><h3 align='center' >or this: /%d</h3>` \
`js console.log(7*7-7)` \
`js progress(''+(7*7-7),4000)` //quick calculator output via 4sec message

---
### audio one-liners

`html <h2>French nuclear test<br>Recorded in New Zealand 1996</h2>Played much faster than real time<br><audio id="a2" controls autoplay src="%d/media/fnt2b.mp3"/>` \
`"c:\Program Files (x86)\Windows Media Player\wmplayer.exe" "%d/media\fnt2b.mp3"` \
`pwsh start wmplayer "%d/media/fnt2b.mp3"`

---
### Windows one-liners

`start ms-settings:` \
`start ms-settings:windowsupdate` \
`start ms-settings:network` \
`start ms-settings:personalization-start` \
`start ms-settings:yourinfo` \
`start ms-settings:powersleep` \
`start ms-settings:privacy-activityhistory`

`control /name Microsoft.DevicesAndPrinters` \
`control mouse` \
`control /name Microsoft.ProgramsAndFeatures`

`pwsh explorer --% shell:::{ED7BA470-8E54-465E-825C-99712043E01C}` //godmode \
`pwsh iex "& { $(irm https://aka.ms/install-powershell.ps1) } -UseMSI"` //update powershell \
`pwsh (get-host).version` //show powershell version \
>      Test output:
>      Major  Minor  Build  Revision
>      -----  -----  -----  --------
>      7      2      2      -1

`devmgmt.msc` //devices \
`mmc diskmgmt.msc` //disk management \
`mmc azman.msc` Manage Authorization Stores \
`mmc certlm.msc` Loads the list of certificates of the local computer. \
`mmc certmgr.msc` Loads the list of certificates of the user \
`mmc comexp.msc` Component Services, Event Viewer, and Services. \
`mmc compmgmt.msc` Computer Management Includes Various System Tools \
`mmc devmgmt.msc` Opens Device Manager to manage hardware and devices. \
`mmc diskmgmt.msc` Disk Management \
`mmc eventvwr.msc` Opens the Event Viewer \
`mmc fsmgmt.msc` Loads the list of shared folders, sessions, and open files \
`mmc gpedit.msc` Loads the Group Policy Editor to manage system policies \
`mmc lusrmgr.msc` Manage local users and user groups. \
`mmc perfmon.msc` Loads the Windows Performance Monitor \
`mmc printmanagement.msc` Manage printers. \
`mmc rsop.msc` List policies, full results only available through command line tool gpresult \
`gpresult` The command line tool referred to above - this just loads help info \
`mmc secpol.msc` Local Security Policies \
`mmc services.msc` Loads the services manager \
`mmc taskschd.msc` Task Scheduler \
`mmc tpm.msc` Trusted Platform Module Management \
`mmc wf.msc` Starts Windows Firewall with Advanced Security \
`mmc wmimgmt.msc` Configure and Control the Windows Management Instrumentation Service.

---
### Quickmath examples
And finally, some *quickmath* expressions. As before these are surrounded with backticks. They do not have to start in col 1, but must have `=` just before the last backtick.
When viewing in preview, the backticks are not visible. You will, of course , need to be in the  editor for quickmath to work. 

So `254cm in inches=` will show 100 inches in the hover message, using [*mathjs 'math.evaluate'*](https://mathjs.org/docs/reference/functions/evaluate.html).
More examples:  `[1,2,3,4]*5=`,  `cos(45deg)=`,  `sin(0.81)^2+cos(0.81)^2=`,  `cos(pi/2)=`,  `sin([10,45,90] deg)=`,  `range(0,4,0.5)=`,  `(2+2i)*(1+2i)=` , `3:6=`, `1:0.1:5=`, `7*7-7=` .

NB. You can copy the answer in the hover to the clipboard with a click.

---
## Configuration settings

### What settings are there?

There are three main categories of configuration settings, *scripts*, *swappers* and *repls*.

- *scripts* provide the start-up commands for the *vscode* default shell to run script files in each of the script languages.
- *swappers* enable in-line results byproviding a script command to output a result, labelled '$1', in the form '=>> $1'
- *repls* enable a script language REPL to be utilised by *hover-exec* - there is an array of strings for each script language.

All configuration settings can be viewed in *vscode*'s configurations view for *hover-exec.

Several *hover-exec* command line variables are used. These can be viewed via the hover for an code block: clicking *[command variables]* will produce a list:

On windows the list looks like this
- %c       workspace folder 'path': c:/Users/ ... 
- %d       current file 'path': c:/Users/...
- %e       current file 'path/name': c:/Users/.../readmore.md
- %f.ext  temp file 'path/name.ext': c:/Users/.../AppData/Roaming/Code/User/globalStorage/rmzetti.hover-exec/temp.ext
- %g       temp folder 'path': c:/Users/.../AppData/Roaming/Code/User/globalStorage/rmzetti.hover-exec
- %h       hover-exec extension folder 'path': c:/Users/.../.vscode/extensions/rmzetti.hover-exec-0.7.1
- %n.ext temp file 'name.ext': temp.js.ext, where ext is an extension (default is .txt)

So
- `%f` provides the temporary file path & name
- in addition, the notation `%f.py`, for example, indicates that extension `.py` should be used - default is `.txt` .

Generally (currently) these are not available for use within scripts, but only in command lines.
An exception is that they may be used in 'href' and 'src' strings.

### Viewing script settings using scripts

The following one-liner will provide an unsorted config list for 'scripts','repls' or 'swappers' depending on the parameter.
`js console.log(config.get('scripts'))` //use 'scripts','repls','swappers' as the parameter
>      Test output:
>      {
>        os: 'win (auto)',
>        octave: 'octave "%f.m"',
>        matlab: 'matlab -nodesktop -sd "%g.m/" -batch temp',
>        rterm: 'rterm -q --no-echo -f "%f.r" ',
>        r: 'r "%f.r" ',
>        scilab: 'scilex -quit -nb -f "%f.sci" ',
>        scilab_win: 'scilex -quit -nb -f "%f.sci" ',
>        scilab_mac: 'scilab-cli -quit -nb -f "%f.sci" ',
>      etc ...

The following js script will produce a sorted list of included script startup commands:

```js //show scripts config settings, sorted
// '''js //show scripts config settings, sorted
sort = (o) =>
  Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {});
console.log(sort(config.get('scripts')));
```
>      Test output:
>      {
>      bash: 'bash "%f.sh"',
>      buddvs: 'buddvs "%f.txt" ',
>      chrome: 'google-chrome-stable "%f.html"',
>      eval: 'eval',
>      firefox: 'firefox "%f.html"',
>      gnuplot: 'gnuplot -p -c "%f.gp"',
>      go: 'go run "%f.go"',
>      html: '"%f.html"',
>      html_lnx: 'firefox "%f.html"',
>      html_mac: 'open "%f.html"',
>      html_win: '"%f.html"',
>      html_wsl: 'firefox "%f.html"',
>      javascript: 'node "%f.js"',
>      js: 'vm',
>      julia: 'julia "%f.jl"',
>      julia_mac: '/Applications/Julia-1.6.app/Contents/Resources/julia/bin/julia "%f.jl"',
>      lua: 'lua "%f.lua"',
>      lua54: 'lua54 "%f.lua"',
>      matlab: 'matlab -nodesktop -sd "%g.m/" -batch temp',
>      node: 'node "%f.js"',
>      octave: 'octave "%f.m"',
>      os: 'win (auto)'
>      pascal: 'fpc "%f.pas" -v0 && "gtemp" ',
>      pwsh: 'set "NO_COLOR=1" & pwsh -f "%f.ps1" ',
>      python: 'python "%f.py"',
>      python3: 'python3 "%f.py"',
>      r: 'r "%f.r" ',
>      rterm: 'rterm -q --no-echo -f "%f.r" ',
>      safari: 'open -a safari "%f.html"',
>      scilab: 'scilex -quit -nb -f "%f.sci" ',
>      scilab_lnx: 'scilab-cli -quit -nb -f "%f.sci" ',
>      scilab_mac: 'scilab-cli -quit -nb -f "%f.sci" ',
>      streamlit: 'streamlit run "%f.py" ',
>      test: 'test -c "%f.tst"',
>      ts: 'ts-node "%f.ts"',
>      typescript: 'ts-node "%f.ts"',
>      vm: 'vm',
>      zsh: 'zsh -f "%f.sh"'
>      }

Any of these configuration settingscan be changed to suit the system or setup in use by using *vscode* settings under the *hover-exec* extension


### Viewing a particular script setting

For any code block, the hover message includes *[config]*. Clicking this will produce an input box at the top of the editor where the config setting can be viewed and changed to suit your system. Changes made are saved in the normal configuration *settings.json* file. Here is an example code block:

```python
# '''python
# this is python 'code' example for config check
```

To view the *script* setting, click *[config]* in the hover (top left):

>      Test output (appears in an input box at the top of the editor):
>      python "%f.py"

If necessary this can be changed using the input box, eg. to *python3 "%f.py"*
After the change, hover-clicking a python script will utilise the python3 command instead.

You can also use a script to change, add or undefine a config setting:

### Add new script language

If there is a need to add a new scripting language, say `newlang`, this can be done using the settings configuration for *hover-exec*, and following the obvious patterns.

It can also be done using `vm` or `eval` since the  *vscode* configuration settings can be accessed with the scripts. First write a fenced code block labelled newlang.

```newlang
-- '''newlang
-- a newlang comment line
print(3-2)
```

Then hover over `newlang` and click *[config]*, In the input box at the top of the editor, enter the desired script startup command, using "%f.ext", with quotes and the correct .ext, as the script file to execute.

If the startup command is correct (eg. would work in a terminal window with an actual command file) the code block will execute as a new script.

The following one-liner can also be used to check the config for a script (try, for example, substituting 'python' for 'newlang')

`js console.log('config:',config.get('scripts.newlang'))`
>      Test output:
>      config: undefined

---

###  'Zero configuration' commands

There is, in fact, no actual requirement to include a script startup command in the configuration file for the script to be used - they just make the code block command simpler. Essentially, if the command works in the terminal, and returns output to the terminal, then it will work as a *hover-exec* command.

For example, on windows, *hover-exec* will run the following script as a `cmd.exe` `.bat` file, because `.bat` files autostart `cmd.exe` :

```%f.bat   //demo cmd execution (windows) without script setup
:: %f.bat   //demo cmd execution (windows) without script setup
:: two colons is a non-printing cmd.exe comment
@echo off
cd
echo Congratulations! Your batch file was executed successfully.
```
>      Test output:
>      c:\Users\rmzetti\GitHub\hover-exec
>      Congratulations! Your batch file was executed successfully.

On macos

```open -a textedit "%f.txt"
'''open -a textedit "%f.txt"
This text can be viewed in the text editor
and saved as required -
Note: changes will not be reflected back into this code block.
```

On linux/wsl

```xedit %f.txt
'''xedit %f.txt
This text can be viewed in the text editor
and saved as required -
Note: changes will not be reflected back into this code block.
```

---

### Other vscode config settings

Other  *vscode* configuration settings can also be accessed, eg through the following one-liner:

`js console.log('editor font size=',vscode.workspace.getConfiguration('').get('editor.fontSize'))`
>      Test output:
>      editor font size= 13

```js
// '''js //full code block implementation
let c = vscode.workspace.getConfiguration('');
console.log('editor font size= ' + c.get('editor.fontSize'));
//c.update("editor.fontSize",12,1)  //uncomment this to change the editor font size
```
>      Test output:
>      editor font size= 13

---

### In-line output using *swappers*

The strings in the *hover-exec* config called `swappers` enable *hover-exec* to move the output of a line so that it appears  *in-line *, within the code block itself.

As an example, the  *swapper* for javascript (`vm`, `eval` & `node`) is `console.log('=>>'+($1))` which takes `$1` (produced via a regex) and prints it starting with the string `=>>`.

The  *swapper* for  *julia* is `println(string(\"=>>\",$1))`, where the double quotes required by  *julia* have to be escaped `\"` because they will be part of a  *json* string in the settings.json file.

Try `edit %h/test/misc_tests#view.*swappers` for more info and examples.

## Release Notes and Known Issues

This is a beta version.

Note that in all the demos above, except  *js:vm* and  *js:eval* which allow definition of  *global* variables and functions, the script starts from scratch when the code block is executed. In other words, assigned variables do not carry over into the next script execution. This kind of approach is best suited for small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages.

Scripts can also be run using their REPL version, if this is available - eg. for node, lua, octave, scilab, r, julia - see above [using scripts via REPL](#using-scripts-via-repl), or `edit %e#using.*repls`. For REPLs, successive script execution will recognise previously defined variables and functions.

There is also an  *include* capability, known as *include* (to distinguish from  *includes* in scripts) - see [Including tagged sections using include](#including-tagged-sections-using-include) for details and examples.

Matlab takes a substantial amount of time to run from code block exec (eg. the startup time for matlab to run a 'batch file' is about 5s on a recent Ryzen laptop). Although this is a Matlab startup issue, it undermines the use of `matlab` within *hover-exec*. Also I haven't been able to get a Matlab based REPL working (unlike, for example, Octave, which is fairly straightforward.)

The startup times for other included scripts are generally fairly minimal (see the demo gif above).

---

Initial beta release was 0.6.1
Published using: vsce package/publish

