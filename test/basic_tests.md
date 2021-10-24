## Hover-exec basic tests

The following basic tests are carried out with the code block id `js` . This requires nothing other than `vscode` and the `hover-exec` extension to be installed, and will use `vscode`'s built in `vm` for exec.

### Hover
Opening a markdown file (eg. this one) in the vscode editor will activate the `hover-exec` extension. To check, after opening the editor, hover over the start line `js ...` or end line of the code block. The following hover message will appear:

      >   hover-exec: js [`config`] [`ref`] [`delete block`]
      >   open: [`last script`] [`last result`]
      >   `js //this is a code block with id 'js'`

The message shows `hover-exec` followed by the code block id (`js`). The bottom line (with the comment) provides the main `exec` function.

```js   //this is a code block with id 'js'
alert('hello world')
```

### Exec
When the bottom line of the hover message is clicked the script will execute, and, in accordance with the script,  an 'alert' box will appear (bottom right of the vscode window) with `(i) hello world` in it.

Other 'clickable' areas will provide information as follows:

Hover over [`last script`] to show the `path/name` of the code to be executed. Clicking that will open the file in the editor. The contents of the block will be in the file if the script has been executed. Similarly, `last result` will show any text output that was produced. There will be no content for the above case, but when the following script is executed, the `last result` command should show the same output seen in the editor:

```js //when executed 'hello world' will be visible in a following code block titled 'output'.
// The 'random' function call is included so changes to the output are noticeable
console.log('    > hello world '+(3+Math.random()))
```
```output
    > hello world 3.232059103649493
```

The file accessed via `last result` in the hover message will also show 'hello world'. Hovering  over the first or last line of the output block will show two options, `delete output` and `output to text`. The last option simply removes the code block triple backtick lines, leaving the contents as markdown text:

> ***hello world***

### Other information from the hover

When hovering over the main code block start or end lines below:

```js
console.log('the meaning of life: ', 7*7-7)
```
```output
the meaning of life:  42
```

A brief note (see later) that `hover-exec` *quickmath* is enabled also - just type a math expression inside single backticks and end with `=`, eg. `7*7-7=`. Hovering over the expression will show the answer (using *mathjs evaluate*). Clicking the answer will copy it to the clipboard.

The right hand `[delete block]` option will delete the code block (`ctrl-z` if it's an accident!)

The `[ref]` option will provide some further information on possible shortcuts that can be used in command lines (none of these are useful for `js`):

```js
//show the [ref] output
```
```output
*hover-exec:* predefined strings:
 - %f `full_path/name.ext` of temp file
 - %p `full_path/` for temporary files
 - %c `full_path/` of the current folder
 - %e `full_path/` of the editor file
 - %n `name.ext` of temporary file
 - The default ext is specified by appending .ext, eg. %f.py
 - In windows, if needed, /%f etc produces /c:/linux/web/style/path/
Currently:
% f = c:\Users\ralph\AppData\Roaming\Code\User\globalStorage\rmzetti.hover-exec\temp.txt
% p = c:\Users\ralph\AppData\Roaming\Code\User\globalStorage\rmzetti.hover-exec\
% c = c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec\
% e = c:\Users\ralph\OneDrive\Documents\GitHub\hover-exec\test\basic_tests.md
% n = temp.txt
```

And finally the `[config]` option will show the configuration entry for the command:

```js
//show the [config] output
```
```js :vm noInline
//this script can change, add or undefine a config setting
let s={"js":"vm"};
//s={"js":undefined}; //uncomment this to undefine js
let scripts=config.get('scripts');
let merge=Object.assign({},scripts,s);
if(await config.update('scripts',merge,1)){}
console.log('new config:',config.get('scripts.js'))
```

Note that the `[config]` output is in the form of another executable `js` code block. All of the entries that have been predefined can be viewed in this way, or by simply viewing the configuration entries in `vscode` settings for `hover-exec` (in the `settings.json` file). The script above offers the opportunity to change the setting (not recommended for the `js`  command above, at least not right now...)

### Execution via the keyboard, and in-line output

The `hover-exec` extension offers two further facilities. The first is that code blocks can be executed by using the keyboard shortcut `Alt+/` or `Opt+/` when the cursor is inside the code block. If the `Alt+/` or `Opt+/` is used when the cursor is inside an `output` code block, the output block is deleted.

The second is that output can be positioned in-line (within the code block) if this is appropriate:

```js //show calculation results in-line
let a='the meaning of life';
console.log('Normally output is shown in an output block');
console.log('which is positioned after the script.');
a+' is '+(7*7-7+Math.random()) =>>the meaning of life is 42.675063474666565
console.log('For successive results it can be useful to display results');
console.log('next to the calculation which produced them');
```
```output
Normally output is shown in an output block
which is positioned after the script.
For successive results it can be useful to display results
next to the calculation which produced them
```

Inline results are produced by using `=>>` at the end of a script line (as above). Note that in-line results do not need `console.log`, this is provided by the config section called `swappers`, which in effect 'swap' the output from the `output` block to the appropriate line in the original script.

Note that no checking is performed for in-line output. For example, it is not particularly useful to have in-line results produced inside a loop:

```js //in-line results in a loop (not recommended)
for (let i=0;i<5;i++){
    'i='+i+', i**2='+(i**2) =>>i=0, i**2=0
}
```
```output
=>>i=1, i**2=1
=>>i=2, i**2=4
=>>i=3, i**2=9
=>>i=4, i**2=16
```

Note that only the first result of the loop execution will made available in-line, the rest are left in the `output` block. If there are further in-line results requested, they will not appear in the right place. So: `do not request in-line results for statements in a loop!`

Also note that lines with `=>>` appended are not actually legal javascript. To produce legal javascript simply precede `=>>` with a comment marker, ie for javascript use `// =>>` This will still be updated on execution in the same way.

### Final comments

The above basic tests should all produce identical results to those shown after `hover-exec` has been installed in `vscode`.

Other 'test' files will look at a broader range of script languages, but the techniques above essentially apply to all.

