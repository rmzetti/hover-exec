const vscode=acquireVsCodeApi();
async function load () {
  const div1=document.getElementById('m2');
  div1.innerText='updated text from main1.js';
  try {
    const scriptUri = vscode.asWebviewUri(
      "file:///C:/Users/ralph/VSWork/mem/media/file.txt");
      //vscode.joinPath(this._extensionUri,"media","main.js"));
    div1.innerText=scriptUri;
    // const fileUri=vscode.file("file:///C:/Users/ralph/VSWork/mem/media/file.txt");
    // const readData = await vscode.workspace.fs.readFile(fileUri);
    // const readStr = Buffer.from(readData).toString('utf8');
    // div1.innerText=readStr;
  }  
  catch (err) {
    div1.innerText=err;
  };
}
load();