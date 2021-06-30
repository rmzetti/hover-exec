function sidebar () {
  const vscode=acquireVsCodeApi();
  // const button=document.getElementById('m1');
  // button.innerText='Hello from media/main.js';
  // console.log("hello!"); //to the developer tools window
  const div1=document.getElementById('a1');
  // fetch('file.txt')
  // .then(response => response.text())
  // .then(text => console.log(text))
  div1.innerText='initial text';
  fetch('file://C:/Users/ralph/VSWork/aim/media/file.txt')
  .then(response => response.text())
  .then(text => div1.innerText=text);
}
sidebar();