"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const jsSnippetsFile = require('../snippets/js-snippets.json');
const pythonSnippetsFile = require('../snippets/python-snippets.json');
const xmlSnippetsFile = require('../snippets/xml-snippets.json');
const convertSnippetArrayToString = (snippetArray) => snippetArray.join('\n');
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Version Notification
        const extensionID = 'jigar-patel.FlectraSnippets';
        const VscFlectraSnippets = vscode.extensions.getExtension(extensionID);
        const VscFlectraSnippetsVersion = VscFlectraSnippets.packageJSON.version;
        const previousVersion = context.globalState.get('FlectraSnippetsVersion');
        if (previousVersion === undefined) {
            console.log('VscFlectraSnippets first-time install');
            return;
        }
        if (previousVersion !== VscFlectraSnippetsVersion) {
            console.log(`VscFlectraSnippets upgraded from v${previousVersion} to v${VscFlectraSnippetsVersion}`);
            const actions = [{ title: "What's New" }, { title: 'Website' }];
            const result = yield vscode.window.showInformationMessage(`VscFlectraSnippets has been updated to v${VscFlectraSnippetsVersion} — check out what's new!`, ...actions);
            if (result != null) {
                if (result === actions[0]) {
                    yield vscode.env.openExternal(vscode.Uri.parse('https://github.com/Droggol/VscFlectraSnippets/blob/master/CHANGELOG.md'));
                }
                else if (result === actions[1]) {
                    yield vscode.env.openExternal(vscode.Uri.parse('https://www.droggol.com/flectra-tools'));
                }
            }
        }
        context.globalState.update('FlectraSnippetsVersion', VscFlectraSnippetsVersion);
        // Snippets Search
        const disposable = vscode.commands.registerCommand('extension.snippetSearch', () => __awaiter(this, void 0, void 0, function* () {
            const jsSnippets = Object.entries(jsSnippetsFile);
            const pythonSnippets = Object.entries(pythonSnippetsFile);
            const xmlSnippets = Object.entries(xmlSnippetsFile);
            const snippetsArray = jsSnippets.concat(pythonSnippets, xmlSnippets);
            const items = snippetsArray.map(([shortDescription, { prefix, body, description }], index) => {
                const value = typeof prefix === 'string' ? prefix : prefix[0];
                return {
                    id: index,
                    description: description || shortDescription,
                    label: value,
                    value,
                    body,
                };
            });
            const options = {
                matchOnDescription: true,
                matchOnDetail: true,
                placeHolder: 'Search Snippet',
            };
            const snippet = (yield vscode.window.showQuickPick(items, options)) || { body: '' };
            const activeTextEditor = vscode.window.activeTextEditor;
            const body = typeof snippet.body === 'string' ? snippet.body : convertSnippetArrayToString(snippet.body);
            activeTextEditor && activeTextEditor.insertSnippet(new vscode.SnippetString(body));
        }));
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
