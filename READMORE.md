Hover exec

This is the READMORE for VS Code extension *hover exec*. Tldr? ..check [the README](README.md) instead. The two files use the same structure and basic content, this one just goes into more detail.

## Contents

- [Contents](#contents)
- [Features](#features)
  - [Compatibility with Markdown Preview Enhanced (*mpe*)](#compatibility-with-markdown-preview-enhanced-mpe)
- [Basic hover-exec](#basic-hover-exec)
- [Javascript scripts](#javascript-scripts)
  - [Examples using vm and eval](#examples-using-vm-and-eval)
  - [Functions available in vm and eval](#functions-available-in-vm-and-eval)
  - [Using a custom vm context](#using-a-custom-vm-context)
  - [Quick specification of vm context](#quick-specification-of-vm-context)
  - [using require & globals with vm and eval](#using-require--globals-with-vm-and-eval)
  - [Using nodejs](#using-nodejs)
  - [Html and javascript](#html-and-javascript)
- [Other scripts](#other-scripts)
  - [Scripts with command execution strings included](#scripts-with-command-execution-strings-included)
  - [Lua](#lua)
  - [Octave](#octave)
  - [Scilab](#scilab)
  - [Python](#python)
  - [Julia](#julia)
  - [Matlab](#matlab)
  - [Gnuplot](#gnuplot)
  - [Bash & zsh](#bash--zsh)
  - [Powershell](#powershell)
  - [Go](#go)
  - [Scripts without pre-defined config](#scripts-without-pre-defined-config)
- [Using scripts via REPL](#using-scripts-via-repl)
  - [Using the python repl](#using-the-python-repl)
  - [Lua repl](#lua-repl)
  - [Node repl](#node-repl)
  - [Julia repl](#julia-repl)
  - [Scilab repl](#scilab-repl)
  - [Octave repl](#octave-repl)
  - [R (rterm) repl](#r-rterm-repl)
  - [Check active REPLs](#check-active-repls)
- [More javascript using vm, eval & node](#more-javascript-using-vm-eval--node)
  - [Using vscode functions](#using-vscode-functions)
  - [Time and date](#time-and-date)
  - [Localhost server](#localhost-server)
  - [Random strings](#random-strings)
  - [Regular expression testing](#regular-expression-testing)
  - [Javascript input box (Vitamin b12, dosage vs uptake)](#javascript-input-box-vitamin-b12-dosage-vs-uptake)
  - [Chaining execution codeblocks](#chaining-execution-codeblocks)
- [One-liners](#one-liners)
  - [One-liner examples](#one-liner-examples)
- [Quickmath](#quickmath)
  - [Quickmath examples](#quickmath-examples)
  - [Windows - control panel](#windows---control-panel)
  - [html & javascript](#html--javascript)
  - [audio one-liners](#audio-one-liners)
  - [One-liners for microsoft management console mmc](#one-liners-for-microsoft-management-console-mmc)
- [Including tagged sections using #inhere](#including-tagged-sections-using-inhere)
- [Configuration settings](#configuration-settings)
  - [Using vm for configuration settings](#using-vm-for-configuration-settings)
    - [Check settings](#check-settings)
    - [Add new script language](#add-new-script-language)
    - [Other vscode config settings](#other-vscode-config-settings)
- [temp](#temp)
- [Notes and Known Issues](#notes-and-known-issues)
- [Release Notes](#release-notes)

---

## Features

*Hover-exec* facilitates execution from within the editor of markdown code blocks in a variety of installed script languages. New script languages can be added with or without configuration. This extension is by no means intended as a replacement for the superb vscode notebooks. Instead it simply offers the opportunity, when working with markdown docs, to include 'live' calculations, results, code samples, comparisons and useful links, using a range of possible scripts.

The *hover-exec* extension is activated when a markdown file is opened in the editor.

Hover script exec in action:

![](https://raw.githubusercontent.com/rmzetti/hover-exec/master/Hover-exec.gif)
![](Hover-exec.gif)

### Compatibility with Markdown Preview Enhanced (*mpe*)

There is also an intention to maintain a certain compatability with the excellent *markdown preview enhanced* extension. The idea is to support the usual *mpe* {curly brackets} in the command line. There are a number of elements of *hover-exec* (eg. in-line results, built in javascript execution rather than `node` only, and the different approach to temporary storage of generated script files) which make full compatability difficult at this stage, but many scripts can still be executed in both extensions.

---

## Basic hover-exec

Hovering over fenced code block start or end lines which start with a triple backtick, or lines which start with a single backtick and include an end backtick, will trigger a hover message with an *exec* command in the bottom line. Clicking the command link on the bottom line of the hover message will execute the code in the code block, and produce output.

If the cursor is inside a fenced code block, the code can be quickly executed using the shortcut `Alt+/` or `Opt+/`.

Code blocks which are indented (ie. unfenced) or fenced with '~' will not result in a hover message and cannot be executed.

---

## Javascript scripts

Javascript code blocks can be executed using the `vm` module, also by using *vscode*'s built in `eval` - and also through [nodejs](#nodejs), or a browser. The default, for command blocks with id `js`, is to use the `vm` module. `hover-exec` provides, by default, a reasonably substantial `vm` context.

### Examples using vm and eval

```js
//js  //this comment is to show the command line in markdown previews
//    //the default for the `js` command is to execute using the `vm` module
console.log("Notice the in-line random number results ")
'test: '+Math.random() =>> 
aa = function (fruit){alert('I like ' + fruit);} //no 'let' creates global
bb = function (animal){alert('he likes ' + animal);}
```


```js
//js //execute the previous *vm* block first
      //uses the globals defined in the previous code block
bb('dogs'); // alert messages appear bottom right
aa('pears'); 
```

Intermediate results can be viewed in line, as above, by appending `=>>` instead of using `console.log()` (see the `swapper` configurations). If it is wished to be strictly correct, and/or compatible with the *markdown preview enhanced* extension (*mpe*), put a comment marker before the `=>>`, eg. for javascript use `// =>>`, for python `# =>>`.  Note, though,  that *mpe* will not produce the results in-line.

Other results are produced in an `output` block. Hovering over `output` provides options *output to text* or *delete*. Using the shortcut `Alt+/` or `Opt+/` with the cursor in the `output` block deletes the block.

---

A couple more examples using `vm`, showing use of *vscode* api functions and some extra functions published by `hover-exec` (eg. `alert`). See the next section for other available functions.

```js
//js //using javascript vm, various examples
let abc="hello, world 3"
let a='hello variable world';
alert(a) //not available in node scripts
a='goodbye world'
vscode.window.showInformationMessage(a) //not available in node scripts
eval('let a=3;2*a*Math.random()')=>> 
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>> 
process.cwd() =>> 
console.log(abc)
```

Note that *[clear output]* in the hover can be used to clear the previous output before execution. There is also a *hover-exec* extension setting to make *clear output* the default, at the expense of a little jerkiness.

---

```js
//js //javascript regex tester using vm
'abcdefg'.replace(/^.*(bc)/,'$1--') =>>bc--defg
```

---

All the above codeblocks can be executed using `eval` instead of `vm`, eg.

```js
//js :eval //javascript regex tester using eval
'abcdefg'.replace(/^.*(bcde)/,'$1--') =>> bcde--fg
```

The difference is that `vm` scripts are executed within a more restricted *context* (see next section).

In the command line (eg. above), using `js` for the codeblock id produces javascript syntax highlighting (it's a quick and dirty approach to provide basic syntax highlighting for a range of scripts), then adding ` :node` sets the actual exec command to `node` (reflected in the hover display).

Note for *mpe* compatibility, `{cmd=node}` *mpe* must now go before `:node`, eg.

```js
//js {cmd=node} :node //this is mpe compatible
console.log('hello')
```

rather than

```js:node
//js:node {cmd=node}
console.log('hello')
```

(Both work in *hover-exec*, view the above in *mpe* to see the difference)

Note that `vm` and `eval` allow the internal *vscode* API to be used. Installation of `nodejs` is not required for `vm` or `eval` scripts to execute.

---

### Functions available in vm and eval

The following functions are included in `vmContext` by default (and are also available to `eval`):

- abort(): abort current script
- alert(string): provide an alert box (bottom right)
- config: access to *hover-exec* configuration
- delay(usec): delay for specified number of usec
- execShell(string): exec shell command
- global: define and access global functions and variables (globals persist over separate script execs)
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

---

### Using a custom vm context

The context for `vm` can be restricted, enlarged or set back to the default. The `vmContext` object can be directly specified by using `eval`. Examples:

```js:eval
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

```js
//js //can use lodash
_.range(0,5)=>>0,1,2,3,4
```

Now reduce the context using `eval`:

```js:eval
vmContext={write}
for (let x in vmContext){
  console.log('reduced context:')
  console.log('  {'+x+'}');
}
```

```output
reduced context:
  {write}
```

Now lodash is not available to `vm` scripts:

```js
//js //can't use lodash in reduced context
console.log(_.range(0,5))
```

To get the default back, set `vmContext` to `undefined`:

```js:eval
vmContext=undefined
```

Now `lodash`, part of the default `vmContext` works again

```js
//js //can now use lodash (etc) again in vm
_.range(0,5)=>>0,1,2,3,4
```

In this way, the context used for vm_scripts can be customised to be restricted or permissive as necessary.

### Quick specification of vm context

By default the `js` command utilises a default context which is progressively expanded by 'naked' function declarations and variable assignments (eg. `a=43;` rather than `let a=43;` or `var a=43;`). So successive codeblocks can build on previously executed ones.

Any `js/vm` codeblock can utilise the following options:

```js:vmdf
//js:vmdf     //set 'vmContext' to default
//On execution, the vmContext returns to its default
```

and

```js:vmin
//js:vmin    //set 'vmContext' to minimum
//This will set the vmContext to a minimum (ie. just
//including 'write' which enables 'console.log' for output)
console.log('hello')
```

```output
hello
```

Apart from resetting `vmContext`, these are normal `js` codeblocks.

---

### using require & globals with vm and eval

Moment, lodash (_) and mathjs (math) are available by default in both `vm` and `eval`.

A function or variable can be set as global (eg. `global.a=a;` see examples below) in either `vm` or `eval` and is then available during the session in both. A global can be deleted (undefined) using, eg. `delete global.a;`

'Naked' assignments (ie. no `let` or `var`) will be available to subsequently executed `js/vm` codeblocks. Global assignments are available to subsequent `js/vm` codeblocks, and also to subsequently executed 'eval' codeblocks.

```js
//js //using lodash, mathjs and process in vm
function xrange(){
   let x1=_.range(0,6.1,6/10);
   let x=math.round(math.exp(math.multiply(x1,math.log(10))));
   return x
}
xrange()=>>1,4,16,63,251,1000,3981,15849,63096,251189,1000000
let cd=process.cwd().replace(/\\/g,'/'); //current directory using '/'
cd =>>c:/Users/ralph/OneDrive/Documents/GitHub/hover-exec
console.log(xrange())
```

```js
//js //declare a global function (not needed if just using vm scripts)
f=global.f=function(m){return 'the meaning of life is '+m;};
f(44-2)=>>the meaning of life is 42
```

```js:eval
//js:eval //use the global function (can be used in both *eval* & *vm*)
f(42)=>> the meaning of life is 42
```

```js
//js //naked function definition (no 'let')
test = function () {
  console.log('test works')
}
```

There is no output, but the function `test` is now available to vm:

```js
//js //function available to subsequent codeblocks
test()
```

For `eval`, neither 'naked' nor 'var' function defs are available to subsequent `eval` code blocks. Instead, the 'global' prefix needs to be used in the function def, as above.

---

### Using nodejs

The `js:node` command executes a javascript code block in `nodejs` (assuming that is installed).

```js
//js :node  //as before, this line shows the command in markdown previews
console.log('test using node:\n'+Math.random())
console.log('  NB: Clicking "delete output" in the "output" line hover message, or typing\n',
    ' alt+/ or opt+/ with the cursor in the output block will delete the output block')
```

Note:

- to allow execution also in *markdown preview enhanced*, include `{cmd=node}` in the command line
  -- eg. `js {command=node} :node`.
- note that in-line output is not available in *mpe*.

```js
//js {cmd=node} :node
console.log(process.cwd())
console.log('test using node: '+Math.random())
let a=5;console.log(a+Math.random())
```

```output
c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
test using node: 0.061870762003424895
5.51768642904618
```

```js
//js {cmd=node} :node
process.cwd()  =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
'test: '+Math.random() =>>test: 0.9757668605192464
let a=5;
a+Math.random() =>>5.393505303729933
```

---
### Html and javascript

In browser javascript can be used
The following three examples are from the [js1k demos](https://js1k.com/). Can probably get this to work in *mpe*...

```html
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

```html
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

```html
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
## Other scripts

### Scripts with command execution strings included

Command lines to conveniently start a number of scripts are included (see [Configuration settings](#configuration-settings) near the end of this `READMORE` for the actual command lines used):

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
- scilab/scilabcli
- gnuplot
- matlab
- lua
- go
- pascal

Notes:

- The script language you wish to use (eg `julia`,`nodejs`) needs to have been installed
- Some of the commands to run the scripts ***may need customising*** to suit your particular installation.. see [Changing script configuration](#changing-script-configuration)
- Other script languages may be added - see [Adding another script](#adding-another-script)
- Scripts may be used with adding a config script in settings - see [Scripts without pre-defined configs](###Scripts-without-pre-defined-configs)

---

### Lua

```lua
--lua {cmd=lua} -- 
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
4999856.6063078
0.447
```

---

### Octave

Use `octave` or `python:octave` to run octave. Using 'python' as the command id provides syntax highlighting, adding :octave uses octave. The {...} is for *markdown preview enhanced*

```python:octave
 # python:octave {cmd=octave} -- {cmd..} is for mpe
 # python gets syntax highlighter
 # nb. need mat2str or num2str for numeric output
num2str(7.1+rand(1))  =>>7.4887
'hello world in-line'  =>>hello world in-line
pwd()  =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
disp('hello world in output section!')
```

---

### Scilab

Use `scilab` to run scilab, or `js :scilab` for some quick and dirty syntax highlighting

```js
//js {cmd=scilab} :scilab -- {cmd..} is for mpe
//need to use 'string()' for numeric output
mprintf('%s\n',pwd())
rand("seed",getdate('s')); //set new random sequence
string(rand())+', '+string(rand())   =>>0.4039561, 0.7682755
mprintf('%s',string(rand()))
```

---

### Python

Use `python` to run python. `python3` can be used if that is the python repl start command

```python
 #python {cmd}  # {cmd} is for markdown preview enhanced
import os
from random import random
 # the in-line results are effectively commented out for mpe
os.getcwd() =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
45-2+random() =>>43.585254107063164
print('hello world '+str(3*random()+1))
```

---

This one-liner can be used to install packages:
`pwsh python -m pip install pyformulas`

---

In the following example, `{matplotlib=true}` will plot graphs inline in *markdown preview enhanced*. In *hover-exec* they are plotted in a separate window (and can be 'pasted' in using the `paste image` vscode extension) If you also use *markdown memo* the image link can be changed to the wiki form `[[...]]` and viewed on hover.

```python
  #python {cmd matplotlib=true}
import numpy as np
import matplotlib.pyplot as plt
randnums= np.random.randint(1,101,500)
plt.plot(randnums)
plt.show()
```

Image from running the above codeblock and pasting via *Markdown kit* or *Markdown memo*:
![[READMORE_matplotlib example.png]]

---

```python
 # python {cmd} -- {cmd} is for mpe
import pyformulas as pf
import matplotlib.pyplot as plt
import numpy as np
import time
fig = plt.figure()
fig.suptitle('To close, first click cancel in hover message, then close plot', fontsize=14)
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
 # cancel, then close plot
```

---

### Julia

Julia also works in *mpe*

```julia
 # julia {cmd}  # works in mpe
using LinearAlgebra, Statistics, Compat
pwd()  # =>>c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
a=rand(Float64,3);
a         # =>>[0.8196932575678177, 0.7535603007997054, 0.22130882779150296]
b=a;b[2]=42;        # nb. arrays are shallow copied
a         # =>>[0.8196932575678177, 42.0, 0.22130882779150296]
b         # =>>[0.8196932575678177, 42.0, 0.22130882779150296]
println(string("a=",a))
```

---

### Matlab

And `matlab` can be used to run *matlab*, although it's a slow starter...

```matlab
%matlab  --matlab is slow to start (takes about 5s on Asus with Ryzen 7 4700U)
x = 1:0.1:10;
y = x.^2;
plot(x,y)
uiwait(helpdlg('Ok!')); % this line needed otherwise the plot disappears
% more waiting after plot dismissed before the following answer appears
7*7-7 =>>42
disp("matlab ok!")
```

---

### Gnuplot

Gnuplot is a very useful stand-alone plotting facility. It is particularly useful for *hover-exec* because scripting languages can output gnuplot commands along with data in the output block and it can be immediatedly plotted.

Use `gnuplot` to run *gnuplot* - note that data bracketed by #tag_speed is used 'in here' (see later in this file, and the backtick quotes are required when the tag is referred to).

```gnuplot
 #gnuplot {cmd} //also works in *mpe*
 #tag_charge
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
  #tag_charge
plot "$charge" using 1:3 w lp title "charge"
```

---

```gnuplot
#inhere `#tag_charge`  # hover over line to view what is included
plot "$charge" using 1:3 w lp title "repeat charge"
```

---

### Bash & zsh

Use `zsh` to run zsh

---

```bash
 # zsh {cmd} //{..} is just for mpe
pwd
```

```bash
 # bash {cmd}
pwd
ls -l
```

---

### Powershell

Use `pwsh` to run powershell, or `pwsh {cmd}` to also run in *mpe*

```pwsh
 # ```pwsh {cmd}`
pwd
```

---

```pwsh
 #pwsh {cmd}
Get-Random -Min 0.0 -Max 1.0 =>>0.145960853968729
"current dir: "+(pwd) =>>current dir: C:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
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

---

### Scripts without pre-defined config

A range of operating system commands can be executed in one-liners try the following (execute from the line with `alt+/` or `opt+/`.
The result can be immediately removed with just a down arrow then `alt+/` or `opt+/' ...

`help`
`dir` //windows, show hover-exec folder contents
`ls`  //macos, linux, wsl show hover-exec folder contents
`findstr /?`  //windows, show findstr help
`man grep` //macos, linux,wsl show grep help

The following windows example does not use any predefined configs, just an operating system command with %f standing for the temp file name. The default %f ext is `.txt`, but this can be changed by appending the desired ext as in this `lua` example - most programs will need a specific ext to run. Note that the temp files are saved in the standard vscode temp files location. They can be opened in vscode by clicking on [last script] or [last result] in the hover display.

```echo
--echo 'hello' && lua.exe %f.lua && echo 'goodbye' //windows
math.randomseed(arg[1]*1000)
print("cmd.exe's random as seed: "..math.random(100))
math.randomseed(os.time())
print("os.time() as seed: "..math.random(100))
```

---

Here are a couple of very simple examples for sending the contents of a codeblock to other applications. These examples do not use any predefined configs. The other apps here are not scripts and will **not** send changed text back to the codeblock - changed content will need to be saved in the file system in the normal way.

```notepad
This is a test
```

```
This is another test
```

---

## Using scripts via REPL

Scripts can also be run using their REPL version, if this is available - eg. for node, lua, octave, scilab, r, julia. For REPLs, successive script execution will recognise previously defined variables and functions.

To indicate the REPL is to be used, two colons must follow the codeblock id, which then has the form:

-- '''id1 :id2 :restart   //comments

where 'id1' defines the syntax highlighting to be used, 'id2' if present defines the script to be used, the second colon indicates the REPL is to be used, and 'restart' if present indicates the REPL is to be restarted.

Each of the script REPL examples below shows a 'restart' script followed by a REPL continuation script (which demonstrates the script variables defined in the 'restart' script are still available.)

---

### Using the python repl

`js:eval repl.kill()` //kills active repl (but use :restart)

```python::restart
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
0.42444634437561035
```

```python::
from time import time
b=>>6000605
b=b+1
time()
b # this now produces output because the repl is being used
```


---

### Lua repl

```lua:lua54:
m=1e7
n=0.01
tt = os.clock()
tt=>>0.435
for ii=1,m do
  n=n*ii
  n=n+1
  n=n/ii
end
tt1=os.clock()-tt
tt1=>>0.411
'ok'
```

```lua:lua54:
os.clock()-tt
```

---

### Node repl

```js:node:restart
let a=0,b=0,c=0,d=0,e=0;
'ok'
```

```js:node:
a+=1 =>>2
b+=10 =>>20
c+=100 =>>200
```

---

### Julia repl

```julia::restart
x=rand(Float64);_
a=rand(Float64,3);print(string("a=",a,"\nx=",x))
```

```julia::
a=a.+1;_
x=x+1;_
print(a,'\n',x)
```

---

### Scilab repl

```js:scilab:restart
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

```output
Time: 1.27 sec
```

```js:scilab:
mprintf('a equals %.f',a)
mprintf('t equals %.2f',t)
a=a+1;
```

```output
a equals 18
t equals 1.27
```

---

### Octave repl

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
time=1.6456 sec
speed=0.60769 million iterations per sec
```

```python:octave:
disp('I repeat...')
disp(strcat('time= ',num2str(t),' sec'))
disp(strcat('speed= ',num2str(m/t/1e6),' million iterations per sec'))
```

```output
I repeat...
time=1.6456 sec
speed=0.60769 million iterations per sec
```

---

### R (rterm) repl

```rterm::restart
a=7*7-7
a=>> 42 
print(noquote(paste('the meaning of life is',a)))
```

```rterm::
print(noquote(paste('.. that was',a)))
```

```rterm::restart
require(tcltk)
x <- 1:10
y1 <- x*x
y2  <- 2*y1
```

```rterm::
windows()
# Stair steps plot
plot(x, y1, type = "S")
# Lines & points plot
windows()
plot(x,y1,type="b",pch=19,col="red",xlab= "x",ylab="y")
lines(x, y2,pch=18,col="blue",type="b",lty=2)
msgBox<-tkmessageBox(title="Plot",message="Close plots first!")
```

NB. Use this if the plots remain:
`js:eval repl.kill()` //kills active repl

---

### Check active REPLs

```js:eval
chRepl.length=>> 1
let i=chRepl.findIndex((el)=>el[1]===repl)
i=>> 0
chRepl[i][0]=>> python
```

---

## More javascript using vm, eval & node

### Using vscode functions

The `vm` and `eval` commands use vscode's built in capabilities. `vm` and `eval` are not available in *mpe*.

```js
//js :vm //or just 'js'
let abc="abcde"
let a='hello variable world';
alert(a) //nb. alert is not available in node
a='goodbye'
vscode.window.showInformationMessage(a) //not available in node
eval('let a=3;2*a*Math.random()')=>> 0.7643622808992236
console.log(a,Math.random())
'hello '+(2-1+Math.random())=>> hello 1.5621808078990533
process.cwd() =>> c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
console.log(abc)
```

---

### Time and date

Various time and date functions using `vm`

```js
//js      //time & date using internal javascript via vm - not in *mpe*
(44-Math.random())=>>43.00094653105661
//show information message via vscode api
progress('Hello whole World',4000)
new Date().toISOString().slice(0,10)=>>2022-01-29
new Date().toLocaleDateString()=>>30/01/2022
new Date().toString()=>>Sun Jan 30 2022 10:29:40 GMT+1300 (New Zealand Daylight Time)
new Date().toLocaleString()=>>30/01/2022, 10:29:40 am
new Date().getTime()=>>1643491780855
```

---

Time and date using node

```js
//js {cmd=node} :node  //through nodejs
a=44
// in-line results are calculated but not output in mpe
'answer='+(a-Math.random()) =>>answer=43.568404765635506
new Date().getTime()=>>1643491788317
console.log(new Date().toISOString().slice(0, 10))
console.log(new Date().toLocaleDateString())
```

---

### Localhost server

Run a server on localhost ([click here after running it](http://127.0.0.1:1337))
Also works in *markdown preview enhanced*, (ie. *mpe*)

```js
//js :node {cmd=node} -- works in mpe
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World at last!\n');
}).listen(1337, "127.0.0.1");
```

Note. If there is an EACCESS error in windows, use 'net stop winnat' and then 'net start winnat' in an admin terminal.

To kill the server, for windows use `pwsh` (see the comments below), also in *mpe*, for macos use zsh below

```pwsh
 # pwsh {cmd} --works in mpe
 # to kill server, exec once & look for pid to kill (line TCP 127.0.0.1:1337 on rhs)
 # then enter pid in kill statement below and exec again
kill 13904
netstat -ano | findstr :13
```

```zsh
 # zsh server usually killed on 'cancel'
 # to check, exec once & look for pid to kill (line TCP 127.0.0.1:1337)
 # then enter pid in kill statement below and exec again
kill 49845
netstat -an
```

---

### Random strings

```js
//js {cmd=node} :node //works in mpe
//random string generation see https://gist.github.com/6174/6062387
a=Math.random().toString(36).substring(2, 15)
a =>>cw6zdk9nxhj
a=[...Array(60)].map(_=>(Math.random()*36|0).toString(36)).join``
a =>>t64ddmf5dg1j19gwny8vvl3jf0ltaqx26ju8i9fbmrunw6dwexaikbq4oprr
a=[...Array(30)].map(_=>((Math.random()*26+10)|0).toString(36)).join``
a =>>xxfvaexpixyzlgwnxmfjxcxhsiglrf
console.log(a)
Math.random(36).toString(36).substring(2,3) =>>0
```
```output
xxfvaexpixyzlgwnxmfjxcxhsiglrf
```

---

```js
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
umtthposro
```

---

```js
//js {cmd=node} :node //generate random string
function randch(n){
  return ''+Math.random().toString(36).substring(2,2+n)
}
randch(36) =>>daevdymyo6p
console.log(randch(36))
```

---

### Regular expression testing

```js
//js //javascript regex tester (use node for mpe)
// if not using md preview enhanced, use = >> instead of // = (less faint)
"xys {cmd='js'} th".replace(/.*cmd=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'') =>>js
Math.random()*100   =>>35.903442020008434
```

---

```js
```output
error SyntaxError: missing ) after argument list
```

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

### Javascript input box (Vitamin b12, dosage vs uptake)

```js
//js   //using 'vm' for getting input
let d=await input('dosage ug?')/1 // /1 converts to number, also note 'await'
let u=1.5*d/(d+1.5)+(1-1.5/(d+1.5))*0.009*d
' uptake='+u  =>> uptake=4.476834080717488
console.log('for',d,'ug uptake is',u,'ug')
```
```output
for 333 ug uptake is 4.476834080717488 ug
```

---

---

### Chaining execution codeblocks

Here a javascript codeblock produces output in the form of an `output:gnuplot` codeblock. This block is labelled as an `output` and so will be replaced if the javascript is executed again. Because it is also labelled with `:gnuplot' it can be directly executed in the usual ways to produce the plot.

```js
// js
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
console.log('```output :gnuplot noinline')
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

```output
#tag_speed
$speed << EOD
1 0.27027027027027023
2 0.7692307692307694
4 1.4545454545454546
9 2.8125
18 5.142857142857143
38 9.047619047619047
78 13.684210526315791
162 16.2
336 21.000000000000004
695 22.419354838709676
1438 23.966666666666665
2976 25.435897435897434
6158 27.247787610619476
12743 28.44419642857143
26367 24.413888888888888
54556 19.802540834845736
112884 21.48125594671741
233572 19.40772746157042
483293 21.686919452546555
1000000 20.565552699228792
EOD
#tag_speed
set logscale x
plot "$speed" w lp title "speed"
```

---

## One-liners

*One-liners* starting and ending with single backticks will simply be executed on click, and usually do not produce output back into the editor. Pre-defined variables (`%c` current folder, `%e` current file pathname, `%f` temp file pathname, `%p` temp files path, `%n` temp file name) can be used in the line (and the default `.txt` extension can be changed by appending, for example, `.ext` to the variable). Notes/comments can be added after the closing quote:

---

### One-liner examples

NB. *Single* backticks for one-liners, but must start in *column 1*.

`explorer /select,"%f"`     //explore temp folder
`notepad README.md`       //exec notepad
`notepad %f.py`     //exec notepad with temp file `temp.py`
`notepad %f.py.out.txt`        //& with temp output file (temp.txt.out.txt)
`"C:/Program Files/Notepad++/notepad++" %f.py`  //exec notepad++

---

## Quickmath

Another useful *hover-exec* facility is *quickmath*. A math expression of the form `5-sqrt(2)=` anywhere will be evaluated on hover and the result will be shown immediately  in the hover message. Clicking the hover result will copy it to the clipboard. Note that the expression is surrounded by single backticks (backticks are the norm for *hover-exec*), and there needs to be `=` before the last backtick (essentially to stop popups for other backtick quoted strings).

### Quickmath examples

Example *quickmath* expressions (hover for results): `254cm in inches=`,  `[1,2,3,4]*5=`,  `cos(45deg)=`,  `sin(0.81)^2+cos(0.81)^2=`,  `cos(pi/2)=`,  `sin([10,45,90] deg)=`,  `range(0,4,0.5)=`,  `(2+2i)*(1+2i)=` , `3:6=`, `1:0.1:5=`.

More information can be fount at [*mathjs 'math.evaluate'*](https://mathjs.org/docs/reference/functions/evaluate.html).

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

`"C:\Program Files\Google\Chrome\Application\chrome.exe" %chover-exec.gif` //chrome with media or html file - can use %c etc in one-liners
`html <script>location.href='https://whatamigoingtodonow.net/'</script>` //browser with url
`html <h1 align='center' >this: %c</h1><br><h3 align='center' >or this: /%c</h3>`
`js console.log(7*7-7)`
`vm progress(''+(7*7-7),4000)`  //quick calculator output via 4sec message

---

### audio one-liners

`html <h2>French nuclear test<br>Recorded in New Zealand 1996</h2>Played much faster than real time<br><audio id="a2" controls autoplay src="media/fnt2b.mp3"/>`
`"c:\Program Files (x86)\Windows Media Player\wmplayer.exe" "%cmedia\fnt2b.mp3"`
`pwsh start wmplayer "%cmedia/fnt2b.mp3"`

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

## Including tagged sections using #inhere

The following line in a code block
#inhere `#tag_speed` // hover to view the data

```js
/* #inhere %ctest/misc_tests.md `#p1` // hover to view the data
*/
console.log('ok')
```

```output
ok
```

will include a group of lines surrounded with the #tag_speed tag. To see what will be included, hover over the tag in the `inhere` line. Note that:

1. Tags must either stand alone in a line, or end the line (ie. tags can have comment markers in front of them)
2. Within the `#inhere` line, the tag must be quoted with backticks as above (*hover-exec* uses back-ticks to indicate potential hovers)
3. To include lines in another file use the format
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
  pwsh: 'set "NO_COLOR=1" & pwsh -f "%f.ps1" ',
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

```%f.bat
@echo off
dir *.json
echo Congratulations! Your batch file was executed successfully.
```

There is also a set of strings called `swappers` which enable moving the output of a line so that it appears *in-line*, within the codeblock itself and can be accessed in the *hover-exec* configuration.

As an example, the *swapper* for javascript (`vm`, `eval` & `node`) is `console.log('=>>'+($1))` which takes the line `($1)` and prints it starting with the string `=>>`.

The *swapper* for *julia* is `println(string(\"=>>\",$1))`, where the double quotes required by *julia* have to be escaped `\"` because they are part of a *json* string

---

### Using vm for configuration settings

*hover-exec* has the ability to view and alter its own config settings via *vm* or *eval* script (*node* can't access the vscode api)

#### Check settings

For a given codeblock, in the hover message for the command line there is a `config` link, If this is clicked, a new (executable) codeblock will be produced. In that codeblock will be the current setting for the codeblock script. For `python`:

```python
 # this is python 'code' example for config check
 # the following codeblock is produced by clicking *config* in the python hover
```

```js
//this script can change, add or undefine a config setting
let s={"python":"python \"%f.py\""}; //{"id":"start command"}
//s={"python":undefined}; //uncomment this to undefine python
let scripts=config.get('scripts');
let merge=Object.assign({},scripts,s);
if(await config.update('scripts',merge,1)){}
console.log('new config:',config.get('scripts.python'))
```

The first line shows the python config. So the start command is `python %f.py`. A basic check is if command line python should run when this command is run in a terminal (minus the `%f.py`).

#### Add new script language

If there is a need to add a new scripting language, say `newlang`, this can be done using the settings configuration for *hover-exec*, and following the obvious patterns.

It can also be done using `vm` or `eval` since the *vscode* configuration settings can be accessed with the scripts.

First write a fenced codeblock labelled newlang with the appropriate command - if this is done correctly the code block should execute in the new script

```newlang
-- a newlang comment line
print(3-2)
```

Second, hover over the new id and click '[config]' in the hover message, this will produce:

```js
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

```js
//js :vm noinline  --eval is not available in mpe
let c=vscode.workspace.getConfiguration('');
console.log("editor font size= "+c.get("editor.fontSize"))
//c.update("editor.fontSize",12,1) //to change it
```

```output
editor font size= 12
```

---

## temp

```js
sort=o=>Object.keys(o).sort().reduce((r, k)=>(r[k]=o[k],r),{});
console.log(sort(config.get('scripts')));
```

```js
console.log(process.env.VSCODE_WSL_EXT_LOCATION);
```
```output
undefined
```

```js
let k=Object.keys(config.get('scripts')).sort();
for (let a in k) {
  if (k[a]==='test'){
  console.log(k[a]);
  console.log(config.get('scripts.'+k[a]))
  }
}
```

```output
test
test -c "%f.tst"
```

---

## Notes and Known Issues

This is a beta version.

Note that in all scripting languages included, except *js:vm* and *js:eval* which allow definition of *global* variables and functions, the script starts from scratch when the code block is executed. In other words, assigned variables do not carry over into the next script execution. This kind of approach is best suited for small scripts to demonstrate or highlight language features, provide quick reference, or show comparisons between scripting languages.

Scripts can also be run using their REPL version, if this is available - eg. for node, lua, octave, scilab, r, julia - see [Using scripts via REPL](#using-scripts-via-repl) above. In this mode, successive script execution will recognise previously defined variables and functions.

There is also an *include* capability, known as `#inhere` (to distinguish from *includes* in scripts) - see [inhere](#inhere---including-tagged-sections).

Matlab takes a substantial amount of time to run a codeblock (ie. the startup time for matlab to run a 'batch file' is about 5s on a Ryzen laptop). Although this is a Matlab startup issue, it undermines the use of `matlab` within `hover-exec`. Also I haven't been able to get a MATLAB based REPL working (unlike, for example, Octave, which is fairly strightforward.

The startup times for other included scripts are generally fairly minimal (see the demo gif above).

---

## Release Notes

Initial beta release was 0.6.1
Published using: vsce package/publish
