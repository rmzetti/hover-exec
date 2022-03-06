## Hover-exec basic tests

- [Hover-exec basic tests](#hover-exec-basic-tests)
  - [Hover](#hover)
  - [Exec](#exec)
  - [Other information from the hover](#other-information-from-the-hover)
  - [Execution via the keyboard, and in-line output](#execution-via-the-keyboard-and-in-line-output)
  - [Final comments](#final-comments)

The following basic tests are carried out with the code block id `js` . This requires nothing other than `vscode` and the `hover-exec` extension to be installed, and will use `vscode`'s built in `vm` for exec.

### Hover
Opening a markdown file (eg. this one) in the vscode editor will activate the `hover-exec` extension. To check, after opening the editor, hover over the start line `js ...` or end line of the code block. The following hover message will appear:

>     hover-exec: js [config] [show %f,%p..] [delete block]
>     [clear output] [open last script] [open last result]
>     js =>> //this is a code block with id 'js'

The message shows `hover-exec` followed by the code block id (`js`). The bottom line (with the comment) provides the main `exec` function.

```js   //this is a code block with id 'js'
alert('hello world')
console.log('goodbye world')
```

>     test output:
>     goodbye world

### Exec
When the bottom line of the hover message is clicked the script will execute, and, in accordance with the script,  an 'alert' box will appear (bottom right of the vscode window) with `(i) hello world` in it.

Other 'clickable' areas will provide information as follows:

Hover over [`open last script`] to show the `path/name` of the code to be executed. Clicking will open the file in the editor. The contents of the block will be in the file if the script has been executed. Similarly, `open last result` will show any text output that was produced. When the following script is executed, the `open last result` command should show the same output seen in the editor:

```js //when executed the output will be visible in a following code block titled 'output'.
// The 'random' function call is included so changes to the output are noticeable
console.log('  *hello world* '+(3+Math.random()))
```

>     test output:
>     *hello world* 3.723468830179753

The file accessed via `open last result` in the hover message will also show 'hello world'.

Hovering  over the first or last line of the *output* block will show two options, `delete output` and `output to text`. The last option simply removes the code block triple backtick lines, leaving the contents as markdown text.

Also, a brief note (see later) that `hover-exec` *quickmath* is enabled - just type a math expression inside single backticks and end with '=', eg. `7*7-7=`. Hovering over the expression will show the answer '42' (using *mathjs evaluate*). Clicking the answer will copy it to the clipboard.

### Other information from the hover

When hovering over the main code block start or end lines below:

```js
console.log('the meaning of life: ', 7*7-7)
```

The right hand `[delete block]` option will delete the code block (`ctrl-z` to restore)

The `[show %f,%p..]` option will provide some further information on possible shortcuts that can be used in command lines (not in the code itself)

```js
//info is shown above the editor, individual lines can be copied to sclipboard with a click
```

>     test output:
>     %f.ext temp file 'path/name.ext': c:\Users\...\globalStorage\rmzetti.hover-exec\temp.ext
>     %p     temp folder 'path/': c:\Users\...\globalStorage\rmzetti.hover-exec\
>     %c     this folder 'path/': c:\Users\...\hover-exec\
>     %e     this file 'path/': c:\Users\...\basic_tests.md
>     %n.ext temp file 'name.ext': temp.js.ext

And finally the `[config]` option will show the configuration entry for the command above the editor

```python
# click config in the hover to show the command configuration above the editor
# edit the command and press enter to change the command to suit
# escape to ignore, & enter without edit to view all config settings in settings.json
```

>     test output:
>     python "%f.py"

### Execution via the keyboard, and in-line output

Code blocks can be executed by using the keyboard shortcut `Alt+/` or `Opt+/` when the cursor is inside the code block. If the `Alt+/` or `Opt+/` is used when the cursor is inside an `output` code block, the output block is deleted.

Output can be positioned in-line (within the code block) if this is appropriate:

```js //show calculation results in-line
let a='the meaning of life';
console.log('Normally output is shown in an output block');
console.log('which is positioned after the script.');
a+' is '+(7*7-7+Math.random()) =>>the meaning of life is 42.13299063970367
console.log('For successive results it can be useful to display results');
console.log('next to the calculation which produced them');
```

>     test output:
>     Normally output is shown in an output block
>     which is positioned after the script.
>     For successive results it can be useful to display results
>     next to the calculation which produced them

Inline results are produced by using `=>>` at the end of a script line (as above). Note that in-line results do not need `console.log`, this is provided by the config section called `swappers`, which in effect 'swap' the output from the `output` block to the appropriate line in the original script.

Note that no checking is performed for in-line output. For example, it is not particularly useful to have in-line results produced inside a loop:

```js //in-line results in a loop (not recommended!)
'this is ok...'=>>this is ok...
for (let i=0;i<5;i++){
    'i='+i+', i**2='+(i**2) =>>i=0, i**2=0
}
'but this ends up in the wrong place'=>>i=1, i**2=1
```

>     test output:
>     =>>i=2, i**2=4
>     =>>i=3, i**2=9
>     =>>i=4, i**2=16
>     =>>but this ends up in the wrong place

Note that only the first result of the loop execution will made available in-line, the rest are left in the `output` block. If there are further in-line results requested, they will not appear in the right place. So: `do not request in-line results for statements in a loop!`

Also note that lines with `=>>` appended are not actually legal javascript. To produce legal javascript simply precede `=>>` with a comment marker, ie for javascript use `// =>>` This will still be updated on execution in the same way.

### Final comments

The above basic tests should all produce identical results to those shown after `hover-exec` has been installed in `vscode`.

Other 'test' files will look at a broader range of script languages, but the techniques above essentially apply to all.

