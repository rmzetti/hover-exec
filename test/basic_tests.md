## Hover-exec basic tests

This provides basic tests for the VSCode extension *hover-exec*. The test files are best viewed in the editor. Type or copy one of the following in any instance of the editor - hover to see the path/name, then click the path/name to open the file in the editor. If the cursor is in the command, using the shortcut alt+/ or opt+/ will open the file.

`edit %h/README.md`            //%h is a hover-exec command line variable giving the extension path \
`edit %h/READMORE.md`       //extended README \
`edit %h/test/basic_tests.md` //basic tests \
`edit %h/test/misc_tests.md`  //benchmark tests and REPLs \

NB. Each of the above commands (highlighted in preview) must be surrounded by single backticks. The 'edit' one-liners need not start in col 1.

Using *hover-exec* in the vscode editor on these files will allow live testing and comparison with the test outputs provided. Note that any changes made to these files will be reverted if *hover-exec* is updated, so save the file locally if you want to keep changes.

## Contents
- [Hover-exec basic tests](#hover-exec-basic-tests)
- [Contents](#contents)
- [Hover](#hover)
- [Exec](#exec)
- [Other information from the hover](#other-information-from-the-hover)
- [Execution via the keyboard, and in-line output](#execution-via-the-keyboard-and-in-line-output)
- [Final comments](#final-comments)

The following basic tests are carried out with the code block id `js` . This requires nothing other than *vscode* and the *hover-exec* extension to be installed, and all tests here will use *vscode*'s built in `vm` for exec.

## Hover
Opening a markdown file (eg. this one) in the vscode editor will activate the *hover-exec* extension. To check, after opening the editor, hover over the start line `js ...` or over the end line of the code block. The following hover message will appear:

>      Test output (in the hover):
>      hover-exec: js [config] [show %f, %g ..] [delete block]
>      [clear output] [open last script] [open last result]
>      js =>> //this is a code block with id 'js'

The message shows `hover-exec` followed by the code block id (`js`). The bottom line (with the comment) provides the main `exec` function.

```js   //this is a code block with id 'js'
// '''js   //this is a code block with id 'js'
alert('hello world')
console.log('goodbye world')
```
>      Test output (plus alert box bottom right):
>      goodbye world

## Exec
When the bottom line of the hover message is clicked the script will execute, and, in accordance with the script,  an 'alert' box will appear (bottom right of the vscode window) with `(i) hello world` in it.

Other 'clickable' areas will provide information as follows:

Hover over [`open last script`] to show the `path/name` of the code to be executed. Clicking will open the file in the editor. The contents of the block will be in the file if the script has been executed. Similarly, `open last result` will show any text output that was produced. When the following script is executed, the `open last result` command should show the same output seen in the editor:

```js //when executed the output will be visible in a following code block titled 'output'.
// '''js //when executed the output will be visible in a following code block titled 'output'.
console.log('  *hello world* '+(3+Math.random()))
```
>      Test output:
>      *hello world* 3.723468830179753

The file accessed via `open last result` in the hover message will also show 'hello world'.

Hovering  over the first or last line of the *output* block will show three options: `output block to text`, `all output to text`, and `delete output block`. The first option simply removes the code block triple backtick lines, leaving the contents as markdown text. The second provides the output from the temporary output file generated, including any in-line results. Note that this should be done before another *exec*, otherwise the newer output will be obtained (which may be from a completely different block). The last option deletes the block. 

Also, a brief note (see later) that `hover-exec` *quickmath* is enabled - just type a math expression inside single backticks and end with '=', eg. `7*7-7=`. Hovering over the expression will show the answer '42' (using *mathjs evaluate*). Clicking the answer will copy it to the clipboard.

## Other information from the hover

When hovering over the main code block start or end lines below:

```js
// '''js
console.log('the meaning of life: ', 7*7-7)
```
>      Test output (shown in the hover):
>      hover-exec: js [config] [show %f, %g ..] [delete block]
>      [clear output] [open last script] [open last result]
>      js =>> //this is a code block with id 'js'

The top right hand `[delete block]` option will delete the code block (`ctrl-z` or `cmd-z` to restore). If there is an output block, that will be deleted on the first click.

The `[command line vars %f..]` shows command line variables  that can be used (but not in the code itself, except for 'href=' or 'src=' paths):

>      Test output (top of the editor pane) from clicking [command variables..]:
>      %c     workspace folder 'path/': c:\Users\...\
>      %d     this file 'path/': c:\Users\...\basic_tests.md
>      %e     this file 'path/name': c:\Users\...\basic_tests.md
>      %f.ext temp file 'path/name.ext': c:\Users\...\globalStorage\rmzetti.hover-exec\temp.ext
>      %g     temp folder 'path/': c:\Users\...\globalStorage\rmzetti.hover-exec\
>      %n.ext temp file 'name.ext': temp.js.ext
>      %h     h-e extension folder 'path/': c:/Users/.../.vscode/extensions/rmzetti.hover-exec-0.7.1

And finally the `[config]` option will show the configuration entry for the command above the editor, for example:

```python
# '''python
# click config in the hover to show the command configuration above the editor
# you can edit the command and press enter to change the command to suit, or
# escape to ignore, or enter without edit to view all config settings in settings.json
```
>      Test output (top of the editor pane) from clicking [config]:
>      python "%f.py"

## Execution via the keyboard, and in-line output

Code blocks can be executed by using the keyboard shortcut `Alt+/` or `Opt+/` when the cursor is inside the code block.

If the `Alt+/` or `Opt+/` shortcut is used when the cursor is inside an `output` code block, the output block is deleted.

Output can be positioned in-line (within the code block) if this is appropriate:

```js //show calculation results in-line
// '''js //show calculation results in-line
let a='the meaning of life';
console.log('Normally output is shown in an output block');
console.log('which is positioned after the script.');
a+' is '+(7*7-7+Math.random()) =>>the meaning of life is 42.13299063970367
console.log('For successive results it can be useful to display results');
console.log('next to the calculation which produced them');
```
>      Test output (also see in-line above):
>      Normally output is shown in an output block
>      which is positioned after the script.
>      For successive results it can be useful to display results
>      next to the calculation which produced them

Inline results are produced by using `=>>` at the end of a script line (as above).

Note that in-line results do not need `console.log`, this is provided by the config section called `swappers`, which in effect 'swap' the output from the `output` block to the appropriate line in the original script.

Also note that no checking is performed for in-line output. For example, it is not particularly useful to have in-line results produced inside a loop:

```js
// '''js  //in-line results in a loop (not recommended!) 
'this is ok...'=>>this is ok...
for (let i=0;i<5;i++){
    'i='+i+', i**2='+(i**2) =>>i=0, i**2=0
}
'but this ends up in the wrong place'=>>i=1, i**2=1
```
>      Test output (also see in-line above):
>      =>>i=2, i**2=4
>      =>>i=3, i**2=9
>      =>>i=4, i**2=16
>      =>>but this ends up in the wrong place

Note that only the first result of the loop execution will made available in-line, the rest are left in the `output` block. If there are further in-line results requested, they will not appear in the right place - avoid in-line results for statements in a loop.

Also note that lines with `=>>` appended are not actually legal javascript. To produce legal javascript simply precede `=>>` with a comment marker, ie for javascript use `// =>>` This will still be updated on execution in the same way.

In line results can be made available for all script engines.

## Final comments

The above basic tests should all produce identical results to those shown after `hover-exec` has been installed in `vscode`.


