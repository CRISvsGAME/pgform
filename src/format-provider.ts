import * as vscode from "vscode";
import { PgformFormatRequest } from "./format-request";

export class PgformFormatProvider implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken,
    ): Promise<vscode.TextEdit[]> {
        const formatRequest = new PgformFormatRequest(document, options, token);

        return formatRequest.run();
    }
}
