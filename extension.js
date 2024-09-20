const vscode = require('vscode');
const axios = require('axios');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.completeCode', function () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            const prompt = document.getText(selection);

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Fetching AI code completion...",
                cancellable: false
            }, async (progress, token) => {
                try {
                    const response = await axios.post('http://localhost:8000/complete', {
                        prompt: prompt
                    });

                    const completion = response.data.completion;

                    editor.edit(editBuilder => {
                        editBuilder.insert(selection.end, completion);
                    });
                } catch (error) {
                    vscode.window.showErrorMessage('Error fetching code completion: ' + error.message);
                }
            });
        } else {
            vscode.window.showInformationMessage('Please open a file to use this extension.');
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
