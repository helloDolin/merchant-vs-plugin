// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function getSpacer() {
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.options.insertSpaces) {
		return ' '.repeat(<number>editor.options.tabSize);
	}
	return '\t';
}

function insertSnippet(before: string, after: string, space: string) {
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.selection.start !== editor.selection.end) {
		var selection = editor.selection;
		var child = editor.document.getText(selection).trimLeft().replace(/\$/g, '\\$');
		var line = editor.document.lineAt(selection.start);
		child = child.replace(new RegExp("\n\\s{" + line.firstNonWhitespaceCharacterIndex + "}", "gm"), "\n" + space);
		var replaceText = before + child + after;
		if (child.substr(-1) === ",") {
			replaceText += ",";
		}
		editor.insertSnippet(new vscode.SnippetString(replaceText), selection);
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "merchant-vs-plugin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('hello merchant-vs-plugin', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('hello merchant-vs-plugin!');
	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(vscode.commands.registerCommand('merchant.wrapInContainer', () =>
		insertSnippet("${1:Container}(\n" + getSpacer() + "child: $2", "\n)", getSpacer())
	));
	context.subscriptions.push(vscode.commands.registerCommand('merchant.wrapInStack', () =>
		insertSnippet("${1:Stack}(\n" + getSpacer() + "children: [\n" + getSpacer().repeat(2), "$2\n" + getSpacer() + "]\n)", getSpacer().repeat(2))
	));
}

// this method is called when your extension is deactivated
export function deactivate() { }
