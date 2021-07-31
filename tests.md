## Check

```pwsh
pwd=>>C:\Users\ralph\OneDrive\Documents\GitHub\hover-exec
echo "hello tests"
Write-Host "hi"
```
```output
hello tests
hi
```

![](Hover-exec.gif)


# Hover exec

This is the editor version of README for VS Code extension *hover exec* for viewing & executing examples in the vscode editor.

## Features

*Hover-exec* facilitates execution (from within the editor) of markdown code blocks in a variety of installed scripts.

The extension is activated when a markdown file is opened in the editor.

Hover script exec in action:

![](https://github.com/rmzetti/hover-exec/blob/master/Hover-exec.gif)

### Basic hover-exec 
Hovering over lines starting ``` will trigger a hover message with an *exec* command as the bottom line. Clicking the *exec* command will execute the code in the code block, and produce output if directed:

```js
'test using node: '+Math.random()=>>test using node: 0.4007943
```

The js command by default executes a javascript code block in nodejs (assuming that is installed).

Javascript code blocks can also be executed in vscode's internal javascript through an `eval` - note that using `js` for the codeblock produces the syntax highlighting, but setting `{cmd=eval}` resets the exec command to `eval`. Note that `eval` does not allow general variables to be defined, but the vscode API can be used, and variables `a,..,z` have been made available for use.

```js {cmd=eval}
'test: '+Math.random()=>>test: 0.5142428
``` 

Intermediate results can be viewed in line, as above, by appending a line with a predefined three character string. The string `=>>` can always be used, so long as it is used consistently throughout the script. For the predefined scripting languages, the preferred 3 char string (shown on hover) starts with a comment indicator and ends with `=` (eg. `##=` for python). This is preferred because, as a comment, it is compatible with the scripting language, and therefore with extensions like *markdown preview enhanced*.

Note that in the above, the script is an `eval` script (`cmd=eval`), and executed internally by *hover-exec*. Starting the line with `js` allows vscode to provide javascript syntax highlighting.

### Some examples(see [tests.md](tests.md)) to execute)

```lua --*say hello goodbye*
print("hello") -- this outputs in the output code block below
'hello '..(44-2+math.random())=>>hello 42.828019207949
"goodbye "..math.pi+math.random()=>>goodbye 3.2172013694041
```
```output
hello
```

```python
from random import random
45-2+random()                  =>>43.00423890354297
'hello world!'                      =>>hello world!
```

```julia
using LinearAlgebra, Statistics, Compat
a=rand(Float64,3);
a                               ##=[0.36814812612868586, 0.6866911978473123, 0.05644257070215741]
nb=a;nb[2]=42;        # arrays are shallow copied
a                               ##=[0.36814812612868586, 42.0, 0.05644257070215741]
nb                            ##=[0.36814812612868586, 42.0, 0.05644257070215741]
```

```matlab  --matlab is slow to start (this takes nearly 10s on Asus with Ryzen 7 4700U)
7*7-7 %%=42
```

```pwsh {cmd} //*random & dir list*
Get-Random -Min 0.0 -Max 1.0 =>>0.124692752084086
"current dir: "+(pwd)   =>>current dir: C:\Users\xxx\.vscode\extensions\rmzetti.hover-exec
Get-Variable c*
```
```output
Name                           Value
----                           -----
ConfirmPreference              High
```

```gnuplot 
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
set xdata time;
set timefmt "%d-%m-%Y %H%M"
set format x "%d"
set mouse mouseformat 3
plot "$charge" using 1:3 w lp title "charge"
```

![](https://github.com/rmzetti/rmzetti.hover-exec/raw/master/gnuplotExample.png)


```js {cmd=eval}
//can't use variables in main, but can use inside another eval as below
eval('let a=3;2*a*Math.random()')=>>5.8765482353295715
vscode.window.showInformationMessage("Hello World") //vscode api call produces popup message
'hello '+(2-1+Math.random())=>>hello 1.8956467731272915
```

```eval javascript regex tester
'abcdefg'.replace(/^.*(bc)/,'$1--') //=bc--defg
```

```js //run server at http://127.0.0.1:1337  ctrl click to open server>
var http = require('http');
http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World at last!\n');
}).listen(1337, "127.0.0.1");
```

```pwsh # kill server through powershell
# to kill server, exec once & look for pid to kill (line TCP 127.0.0.1:1337 on rhs)
# then enter pid in kill statement below and exec again
kill 14452
netstat -ano | findstr :13
```

```js {cmd=scilab} 
//using the above instead of just ```scilab provides quick & dirty syntax highlight
//need to use 'string' for numeric output
rand("seed",getdate('s'));
'def '+string(rand())+' abc'=>>def 0.4897686 abc
disp('random: '+string(rand()))
```

### One-liners

*One-liners* starting and ending with ` ``` ` will simply be executed on click, and do not produce output. The pre-defined variables (%c current folder, %f temp file full path+name, %p temp file path, %n temp file name) can be used, and notes/comments can be added after the closing quotes, for example:

exec notepad++:

```"C:/Program Files/Notepad++/notepad++" %ctest.md```

exec notepad with file in current folder:

```notepad %ctest.md```

exec notepad with temp file:

```notepad %f```

explore 'This pc':

```explorer ,```

explore folder:

```explorer /select, "C:\Users\xxx\Documents\Notes"```

show printers:

```explorer ::{21ec2020-3aea-1069-a2dd-08002b30309d}\::{2227a280-3aea-1069-a2de-08002b30309d}```

show devices:

```devmgmt.msc```

exec default browser with href, or showing html text (note html is a built in script command, see above)

```html <script>location.href='https://whatamigoingtodonow.net/'</script>```

```html <h1>Hello world!</h1>```

exec notepad with some text:

```notepad
This is some text
and this
```

### Scripts supported after hover-exec installation

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

## Adding more scripts

Other scripts can be added by providing an id & four strings for *Hover exec* in  `settings.json` (see below). 
Essentially if a program can be run with 'batch file' input, and outputs to the command line (if required), it will work in *hover-exec* with the appropriate string definitions.

## Requirements

The script languages to be used (eg. *python*, *gnuplot*, etc) should be installed, and on the path.. eg. on Windows the python repl should run if `python` is entered in a cmd/powershell window.

## Extension Settings

This extension contributes the following settings to build in scripting languages. Settings are identified by `hover-exec.id`, 1-4 strings need to be provided for each:

[0] the *exec* javascript command to run the script from a temp file (required)
--- the variable `%f` will provide the appropriate temp file name and path
        eg. "octave \"%f\" "

[1] an optional *startup* script command, eg. to change the working folder at execution start
--- the variable `%c` provides the path of the current folder

[2] an optional *swap* string of the form `##=print('{{'+str($1)+'}}')`.
--- The first `3 chars` will indicate where in-line output is required (usually begins with the scripting language comment signifier, and ends with `=`).
--- This is followed by a command string, in the appropriate scripting language, to give output in the form `{{$1}}` to enable the extension to move the output to end of the line where it is required.

[3] an optional *filename* string to provide the script file used in the form `name.ext`
--- The default is `temp.txt`.
--- As an example, for Matlab (and Octave) `temp.m` is used.

In the strings, the following predefined strings can be embedded
- %f `full_path/name.ext` of temporary file which will be used for the script
- %p `full_path` for temporary file (ends with /)
- %n `name.ext` of temporary file
- %c `full_path` of the current folder (ends with `/`)
- %e `full_path` of the current vscode editor file

The easiest way to add a new script language is to

  (1) open `settings/extensions/hover-exec`, 
  (2) copy and paste an existing script language setting, 
  (3) change the id (`hover-exec.id`), and 
  (4) change the strings as appropriate (see above).

All strings are quoted using double quotes (json standard) so internal quotes should be `'` (ie. single quote) or `\"` (ie. escaped double quote).

The strings for the currently included scripts can be viewed and altered/updated using `hover-exec.eval` itself:

```js {cmd=eval} //show (and change) a hover exec config
/* vars a..z available for eval */a='hello'=>>hello
/* the full array of strings      */b=config.get('js');
/* exec js command               */b[0]=>>node "%f"
/* startup script command    */b[1]=>>;
/* swap string & {{output}}    */b[2]=>>//=console.log('{{'+($1)+'}}')
/* command temp file name */b[3]=>>temp.js
// uncomment the next to change the config - & first set b[ 0..3? ] to the value desired
//    b[ ]='...'; if(config.update('js',[ b[0],b[1],b[2],b[3] ],true)){'ok'}
// execute again to see the changes above - nb. the changes persist!
```

Note that `eval` evaluates line-by-line using vscode's internal javascript. The vscode api is available, as above for example, but currently most variables do not persist across lines. Variables `a,..,z` have been made available for use in `eval` codeblocks.

```pwsh {cmd}
'Today is: ' + (Get-Date)      ##=Today is: 07/31/2021 11:22:54
"Today is: $(Get-Date)"       ##=Today is: 07/31/2021 11:22:54
#nb double quotes needed above
'Today is: {0}' -f (Get-Date) ##=Today is: 31/07/2021 11:22:54
#nb the following can't be done in-line
Write-Host "Today is: " -nonewline
Write-Host (Get-Date)
```

```js
console.log(eval('a="abcd";a+"ef"'))
console.log(eval('a+"efgh"'))
```
```output
abcdef
```

```eval
temp1='hello'
progress1(temp1)
tempd=>>c:\Users\ralph\AppData\Roaming\Code\User\globalStorage\rmzetti.hover-exec/
```
```output
hello
```

## Various tests

### Basic hover-exec 

```js
s='abcd efg hik'
s.indexOf('```')=>>-1
s.slice(0,s.length+1+s.indexOf('```'))=>>abcd efg hik
process.cwd()=>>c:\Users\ralph\OneDrive\Documents\Notes
let a=5;console.log('a= '+a+Math.random())
//console log needed for codeblog output
//but not for in-line output (built in) 
let b=10; //inline output statements must stand on their own
'b= '+(b+Math.random())=>>b= 10.847474967705287
```

```js {cmd=eval} //show (and change) a hover exec config
//this cmd evaluates using 'eval' line-by-line
//advantage - the vscode api is available
//disadvantage - can't use variables across lines 
config.get('eval')=>>,,//='{{'+($1)+'}}',temp.js
config.get('eval')[0]=>>;
config.get('eval')[1]=>>;
config.get('eval')[2]=>>//='{{'+($1)+'}}'
config.get('eval')[3]=>>temp.js
//if(config.update('js',['node \"%f\"','',"//=console.log('{{'+($1)+'}}')",'temp.js'],true)){'ok'}
```

```js {cmd=eval}
process.cwd()=>>c:\Users\ralph\OneDrive\Documents\Notes
'test: '+Math.random()=>>test: 0.23750048829218362
let a=5;a+Math.random()   //don't use console.log for output
'ok'
```
```output
5.989298062747938
ok
```

```eval //open hover-exec readme
vscode.window.showTextDocument(vscode.Uri.file(vscode.extensions.getExtension('rmzetti.hover-exec')?.extensionPath+'/README.md'))
```

Hovering over lines starting ``` will trigger a hover message with an exec command as the bottom line, as above.

Intermediate results can be viewed in line by appending a line with a predefined three character string. The string =>> can always be used, so long as it is used consistently throughout the script. For the predefined scripting language, the preferred 3 char string (shown on hover) starts with a comment indicator and ends with =. This is preferred because it is compatible with the *markdown preview enhanced* extension.

Note that in the above the script is an *eval* script (*{cmd=eval}*), and executed internally by *hover-exec*. Starting the line with *```js* allows vscode to provide javascript syntax highlighting.

The following is the same script but will be executed by *node*

```js
'test using node: '+Math.random()=>>test using node: 0.9812778830813451
```

### One-liners

*One-liners* starting and ending with ``` will simply be executed on click, and do not produce output back into the editor. The pre-defined variables (%c current folder, %f temp file full path+name, %p temp file path, %n temp file) name can be used, and notes/comments can be added aafter the closing quotes:

### One-liners & non built-in command examples

```notepad aa_test.md```      //exec notepad
```notepad %f```                   //exec notepad with temp file (in temp files location)
```notepad {ext=py} %f```     //exec notepad but change extension of temp to `py`
```notepad %f.out.txt```        //exec notepad with temp output file (temp.txt.out.txt)
```"C:/Program Files/Notepad++/notepad++" %e```
                                            //exec notepad++ could define a shortcut key?
```explorer ,```                       //explore 'This pc' (without `,` opens to quick access)
```explorer /select,"%c"```     //exec *doesn't* open current folder because %c uses / instead of \
```explorer /select,"C:\Users\ralph\OneDrive\Documents\Notes\aa_test.md"```  //explore current folder
```explorer ::{21ec2020-3aea-1069-a2dd-08002b30309d}\::{2227a280-3aea-1069-a2de-08002b30309d}```
                                            //printers
```devmgmt.msc```               //devices
```"C:\Program Files\Google\Chrome\Application\chrome.exe" %caa.html```
                                            //chrome with html file - can use %c etc in one-liners
```html <script>location.href='https://whatamigoingtodonow.net/'</script>```
                                            //browser with url
```html //href as above but not a *one-liner
<script>location.href='https://whatamigoingtodonow.net/'</script>
```
```html <script>location.href="%caa.html"</script>```
                                            //browser with html file - can use %c etc in one-liners
```html //same but not a *one-liner* - can't use %c & need / instead of  \ for separators
<script>location.href='C:/Users/ralph/OneDrive/Documents/Notes/aa.html'</script>
```
```html <h1>Hello %c</h1>``` 
```output
"c:\Users\ralph\AppData\Roaming\Code\User\globalStorage\rmzetti.hover-exec/temp.html"  error!
```
                                            //exec default browser with html text
```streamlit run heatmap_time_series.py```
                                            //exec with spaces and filename
```js console.log('7*7-7='+(7*7-7))```
                                            //quick output

### Some examples for built-in scripts
(In these examples, random numbers & time used so updated output is easy to spot)

```lua --*say hello goodbye*
print("hello & goodbye")
math.randomseed(os.time())
'hello '..(44-2+math.random())=>>hello 42.54644886479
"goodbye "..math.pi+math.random()=>>goodbye 3.9184092262139
```

```lua //10 million individual random numbers
local t = os.clock();
local t1=0;
local matrix=require "matrix"
math.randomseed(os.time())
for ii=1,1000000 do
t1=t1+math.random();
end
t1--=500123.19070595
print(os.clock()-t) --append this output as codeblock
```

```js //test
a=46;b=-2;
'hello '+(a+b+Math.random()) =>>hello 44.366016801071126
"hello "+(a+b+Math.random()) =>>hello 44.20334115126575
console.log('done')
```

```pwsh {cmd} //*random number, show dir, get variables list filtered*
Get-Random -Min 0.0 -Max 1.0 =>>0.428952099489491
"current dir: "+(pwd)   =>>current dir: C:\Users\ralph\OneDrive\Documents\Notes
Get-Variable a*
```

```gnuplot 
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

```js {cmd=buddvs}
chdir=>>c:\Users\ralph\OneDrive\Documents\Notes
a=61.5+random*10;
a=>>70.85987725
b=4;c=a+b
'c: '+c=>>c: 74.85987725
```

```eval
//can't use variables in main, but can use inside another eval as below
eval('let a=3;2*a*Math.random()')=>>3.158787510303331
vscode.window.showInformationMessage("Hello World")
'hello '+(2-1+Math.random())=>>hello 1.943978974741652
process.cwd()=>>c:\Users\ralph\OneDrive\Documents\Notes
```

```eval
vscode.window.showInformationMessage("Hello World "+process.cwd())
```

```js //run server at http://127.0.0.1:1337  ctrl click to open server>
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World at last!\n');
}).listen(1337, "127.0.0.1");
```

```pwsh
# to kill server, exec once & look for pid to kill (line TCP 127.0.0.1:1337 on rhs)
# then enter pid in kill statement below and exec again
kill 4428
netstat -ano | findstr :13
```
```output
TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1316
  TCP    192.168.1.60:139       0.0.0.0:0              LISTENING       4
  TCP    [::]:135               [::]:0                 LISTENING       1316
  UDP    192.168.1.60:137       *:*                                    4
  UDP    192.168.1.60:138       *:*                                    4
```

```eval //javascript regex tester
'abcdefg'.replace(/^.*(bc)/,'$1Baa') //=bcBaadefg
```

```js {cmd=eval} //internal, time & date
//nb setting variables not allowed except within another eval()
(44-Math.random())=>>43.37547377041829
//show information message via vscode api
vscode.window.showInformationMessage('Hello whole World')
new Date().toISOString().slice(0,10)=>>2021-07-27
new Date().toLocaleDateString()=>>27/07/2021
new Date().toString()=>>Tue Jul 27 2021 14:34:07 GMT+1200 (New Zealand Standard Time)
new Date().toLocaleString()=>>27/07/2021, 14:34:07
```

```js {cmd=eval}
// show hover exec config - can't define variables when using eval 
config.get('python')=>>python "%f",,##=print('{{'+str($1)+'}}'),temp.pz
config.get('python')[0]=>>python "%f"
config.get('python')[1]=>>;
config.get('python')[2]=>>##=print('{{'+str($1)+'}}')
config.get('python')[3]=>>temp.pz
if(config.update('python',['python \"%f\"','',"##=print('{{'+str($1)+'}}')",'temp.pz'],true)){'ok'}
```
```output
ok
```

```eval
if(config.update('python',undefined)){'ok'}
```
```output
ok
```



```js {cmd=scilab} 
//using the above instead of just ```scilab provides quick & dirty syntax highlight
//need to use 'string' for numeric output
rand("seed",getdate('s'));
'def '+string(rand())+' abc'=>>def 0.1718688 abc
disp('random: '+string(rand()))
```

```js //through nodejs
a=44
'answer='+(a-Math.random())=>>answer=43.26201149090436
new Date().toISOString().slice(0, 10)=>>2021-07-23
new Date().toLocaleDateString()=>>23/07/2021
```

========================================
## Hover-exec examples

```js {cmd=octave}
# octave labelled js to get a quick and dirty syntax highlighter
# nb. need to use mat2str or num2str for numeric output
num2str(7.1+rand(1))      %%=7.1322
'hello world in-line'           %%=hello world in-line
pwd()                                %%=c:\Users\ralph\OneDrive\Documents\Notes
disp('hello world in output section!')
```

```scilab
//need to use 'string()' for numeric output
pwd()                                 //=c:\Users\ralph\OneDrive\Documents\Notes
rand("seed",getdate('s'));  //nb. seed generator for new random sequence
string(rand())+', '+string(rand())   //=0.9992235, 0.918327
```

```python
import os
from random import random
os. getcwd()              =>>c:\Users\ralph\OneDrive\Documents\Notes
45-2+random()         =>>43.74970765878662
'hello world!'             =>>hello world!
```

```julia
using LinearAlgebra, Statistics, Compat
pwd() ##=c:\Users\ralph\OneDrive\Documents\Notes
a=rand(Float64,3);
a         ##=[0.5663853115707729, 0.33609133284120163, 0.6351037578820791]
b=a;b[2]=42;        # nb. arrays are shallow copied
a         ##=[0.5663853115707729, 42.0, 0.6351037578820791]
b         ##=[0.5663853115707729, 42.0, 0.6351037578820791]
```

```matlab
pwd   %%=C:\Users\ralph\OneDrive\Documents\Notes
7*7-7 %%=43
% Speedtest
```

```js
console.log('ok')
```

```gnuplot
set xdata time
set timefmt "%d-%m-%Y %H%M"
set format x "%d"
plot "plotdata.txt" using 1:3 w lp 
# nb 3 columns of data but 1 2 make the xdata 
```

```html --tunnel
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

```html -- psychedelic
<html>
<head> 
<title>JS1k, 1k demo submission [763]</title> 
<!-- meta charset='utf-8' / --> 
</head>
<!-- body style='margin:0;width:100%;background:#000815;overflow:hidden' --> 
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

```html -- breathing galaxies
<!DOCTYPE html> 
<html xmlns="http://www.w3.org/1999/xhtml" lang="en"> 
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

```pwsh
pwd ##=C:\Users\ralph\OneDrive\Documents\Notes
```

```lua
math.randomseed(os.time())
44-2+math.random() --=42.346287531705
math.pi+math.random() --=3.4850406031956
```

```js //test
a=1;b=2;
a+b+Math.random() =>>3.51111098605452
```

```js //random string generation see https://gist.github.com/6174/6062387
a=Math.random().toString(36).substring(2, 15) //+ Math.random().toString(36).substring(2, 15);
a=>>8e6zgqp2wxv
a=[...Array(60)].map(_=>(Math.random()*36|0).toString(36)).join``
a=>>e0diywu1u0b1va9o3s3glzzpe98wd2t1xdtsv2ihl4lnqyk0cvuw0uh1w6j7
a=[...Array(30)].map(_=>((Math.random()*26+10)|0).toString(36)).join``
a=>>olzofdavmruwoksgbedeooealpzbng
Math.random(36).toString(36).substring(2,3)=>>x
```

```js //string jumbler
function swapStr(str,n){
    var arr = [...str];
    for (let k = 0; k<n; k++) {
    i=Math.random()*str.length|0;
    j=Math.random()*str.length|0;
    [arr[i],arr[j]]=[arr[j],arr[i]]
    }
    return arr.join('');
} //potusmorth
swapStr('portsmouth',100)=>>oprhutotsm
```

```js //generate random string
function randch(n){
  return ''+Math.random().toString(36).substring(2,2+n)
}
randch(26)=>>ikebghm7io
```

```eval //javascript regex tester
"xys {cmd='js'} th".replace(/.*cmd=(.*?)[\s\,\}].*/,'$1').replace(/["']/g,'') //=js
Math.random()*100                   //=56.29101541236861
```

```js //can't do this in eval - no variables allowed
var myRe = new RegExp('d(b+)d', 'g');
var myArray = myRe.exec('xxdbbbdwerwr');
myArray =>>dbbbd,bbb
if(myArray!==null){
  myArray.index=>>2
  myArray.input=>>xxdbbbdwerwr
  myArray.input[myRe.lastIndex]=>>w
}
myRe.source=>>d(b+)d
myRe.lastIndex=>>7
```

```js //look for one or more chars followed by a space 
var re = /\w+\s/g;
var str = 'fee fi fo fum';
var myArray = str.match(re);
myArray=>>fee ,fi ,fo 
```

```js {cmd=buddvs}
pi+random                =>>4.110154849
' folder> '+chdir()     =>> folder> c:\Users\ralph\OneDrive\Documents\Notes
```





