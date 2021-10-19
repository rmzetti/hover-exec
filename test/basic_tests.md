## Hover-exec basic tests

The following basic tests are carried out with the code block id `js` . This requires nothing other than `vscode` and the `hover-exec` extension to be installed, and will use `vscode`'s built in `vm` for exec.

### Hover
Opening a markdown file (eg. this one) in the vscode editor should activate the `hover-exec` extension. To check, hover over the start or end line of the following code block (in the editor, of course):

-------------------------
```js //click this line in the hover message to execute the code
alert('hello world')
```
-------------------------

The following hover message should appear:

>   hover-exec:js [`config`] [`ref`] [`delete block`]
>   open: [`last script`] [`last result`]
>   `js //click this line in the hover message to execute the code`

The message shows `hover-exec` followed by the code block id (`js`). The bottom line (with the comment) provides the main `exec` function.

### Exec
When the bottom line is clicked the script should execute, and, in accordance with the script,  an 'alert' box will appear (bottom right) with `(i) hello world` in it.

Other 'clickable' areas should provide information as follows:

Hover over [`last script`] to show the `path/name` of the code to be executed. Clicking that will open the file in the editor. The contents of the block will be in the file if the script has been executed. Similarly, `last result` will show any text output that was produced. There will be no content for the above case, but when the following script is executed, the `last result` command should show the same output seen in the editor:

```js //when executed 'hello world' should be visible in a following code block titled 'output' (if you execute again there will be no 'visible' change, because the new content is identical to the old.)
console.log('> ***hello world***')
```
```output
> ***hello world***
```

and the file accessed via `last result` will also show 'hello world'. Hovering  over the first or last line of the output block will show two options, `delete output` and `output to text`. The last option simply removes the code block triple backtick lines, leaving the contents as markdown text:

> ***hello world***

### Other information from the hover

Again, hovering over the main code block lines below

```js
console.log('the meaning of life: ', 7*7-7)
```
```output
the meaning of life:  42
```

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
console.log('Normally output is shown in an output block')
console.log('which is positioned after the script.')
console.log('For successive results it can be useful to display results')
console.log('next to the calculation which produced them')
'the meaning of life is '+(7*7-7) =>>the meaning of life is 42
42*7=>>294
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
>>i=1, i**2=1
>>i=2, i**2=4
>>i=3, i**2=9
>>i=4, i**2=16
```

Here, only the first result of the loop execution is made available in-line, the rest are left in the `output` block.

Also note that lines with `=>>` appended are not actually legal javascript. To produce legal javascript simply precede `=>>` with a comment marker, ie for javascript use `// =>>` This will still be updated on execution in the same way.

### Final comments

The above basic tests should all produce identical results to the  above after `hover-exec` has been installed in `vscode`.

Other 'test' files will look at a broader range of script languages, but the techniques above essentially apply to all.

