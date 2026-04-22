import * as vscode from "vscode";

export class PgformFormatProvider implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        _document: vscode.TextDocument,
        _options: vscode.FormattingOptions,
        _token: vscode.CancellationToken,
    ): Promise<vscode.TextEdit[]> {
        return Promise.resolve([]);
    }
}
