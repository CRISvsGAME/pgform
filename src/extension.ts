import * as vscode from "vscode";
import { PgformFormatProvider } from "./format-provider";

export function activate(context: vscode.ExtensionContext): void {
    console.log("Pgform Extension Activated");

    const formatProvider = vscode.languages.registerDocumentFormattingEditProvider(
        { language: "sql" },
        new PgformFormatProvider(),
    );

    context.subscriptions.push(formatProvider);
}

export function deactivate(): void {}
