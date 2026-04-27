import * as assert from "node:assert/strict";
import * as vscode from "vscode";

suite("Pgform", () => {
    test("formats an untitled SQL document using spaces", async () => {
        const extension = vscode.extensions.getExtension("crisvsgame.pgform");

        assert.ok(extension);

        await extension.activate();

        const input = "select a,b from public.items where id=1;\n";
        const expected = "SELECT\n    a,\n    b\nFROM\n    public.items\nWHERE\n    id = 1;\n";

        const document = await vscode.workspace.openTextDocument({
            language: "sql",
            content: input,
        });

        const edits = await vscode.commands.executeCommand<vscode.TextEdit[] | undefined>(
            "vscode.executeFormatDocumentProvider",
            document.uri,
            {
                insertSpaces: true,
                tabSize: 4,
            },
        );

        assert.ok(edits);

        const workspaceEdit = new vscode.WorkspaceEdit();

        workspaceEdit.set(document.uri, edits);

        const applied = await vscode.workspace.applyEdit(workspaceEdit);

        assert.equal(applied, true);
        assert.equal(document.getText(), expected);
    });

    test("formats an untitled SQL document using tabs", async () => {
        const extension = vscode.extensions.getExtension("crisvsgame.pgform");

        assert.ok(extension);

        await extension.activate();

        const input = "select a,b from public.items where id=1;\n";
        const expected = "SELECT\n\ta,\n\tb\nFROM\n\tpublic.items\nWHERE\n\tid = 1;\n";

        const document = await vscode.workspace.openTextDocument({
            language: "sql",
            content: input,
        });

        const edits = await vscode.commands.executeCommand<vscode.TextEdit[] | undefined>(
            "vscode.executeFormatDocumentProvider",
            document.uri,
            {
                insertSpaces: false,
                tabSize: 8,
            },
        );

        assert.ok(edits);

        const workspaceEdit = new vscode.WorkspaceEdit();

        workspaceEdit.set(document.uri, edits);

        const applied = await vscode.workspace.applyEdit(workspaceEdit);

        assert.equal(applied, true);
        assert.equal(document.getText(), expected);
    });

    test("returns no edits for already formatted input", async () => {
        const extension = vscode.extensions.getExtension("crisvsgame.pgform");

        assert.ok(extension);

        await extension.activate();

        const input = "SELECT\n    a,\n    b\nFROM\n    public.items\nWHERE\n    id = 1;\n";

        const document = await vscode.workspace.openTextDocument({
            language: "sql",
            content: input,
        });

        const edits = await vscode.commands.executeCommand<vscode.TextEdit[] | undefined>(
            "vscode.executeFormatDocumentProvider",
            document.uri,
            {
                insertSpaces: true,
                tabSize: 4,
            },
        );

        assert.equal(edits, undefined);
        assert.equal(document.getText(), input);
    });

    test("returns no edits when formatting fails", async () => {
        const extension = vscode.extensions.getExtension("crisvsgame.pgform");

        assert.ok(extension);

        await extension.activate();

        const input = "select a,b from public.items where id=1;\n";

        const document = await vscode.workspace.openTextDocument({
            language: "sql",
            content: input,
        });

        const edits = await vscode.commands.executeCommand<vscode.TextEdit[] | undefined>(
            "vscode.executeFormatDocumentProvider",
            document.uri,
            {
                insertSpaces: true,
                tabSize: 1.5,
            },
        );

        assert.equal(edits, undefined);
        assert.equal(document.getText(), input);
    });

    test("cancels formatting token when the document changes", async () => {
        let receiveToken: (token: vscode.CancellationToken) => void;
        let receiveCancellation: () => void;
        let finishFormatting: (edits: vscode.TextEdit[]) => void = () => {};
        let cancellation: vscode.Disposable | undefined;
        let timeout: NodeJS.Timeout | undefined;

        const tokenReceived = new Promise<vscode.CancellationToken>((resolve) => {
            receiveToken = resolve;
        });

        const cancellationReceived = new Promise<void>((resolve) => {
            receiveCancellation = resolve;
        });

        const formatter = vscode.languages.registerDocumentFormattingEditProvider(
            { language: "plaintext" },
            {
                provideDocumentFormattingEdits(
                    _document: vscode.TextDocument,
                    _options: vscode.FormattingOptions,
                    token: vscode.CancellationToken,
                ): Promise<vscode.TextEdit[]> {
                    const result = new Promise<vscode.TextEdit[]>((resolve) => {
                        finishFormatting = resolve;
                    });

                    cancellation = token.onCancellationRequested(() => {
                        receiveCancellation();
                        finishFormatting([]);
                    });

                    receiveToken(token);

                    return result;
                },
            },
        );

        const timedOut = new Promise<never>((_resolve, reject) => {
            timeout = setTimeout(() => reject(new Error("Formatting cancellation timed out")), 5000);
        });

        try {
            const document = await vscode.workspace.openTextDocument({
                language: "plaintext",
                content: "input text",
            });

            await vscode.window.showTextDocument(document);

            const formatting = Promise.resolve(vscode.commands.executeCommand<void>("editor.action.formatDocument"));

            const token = await Promise.race([
                tokenReceived,
                timedOut,
                formatting.then(() => {
                    throw new Error("Formatting finished before the provider received a token");
                }),
            ]);

            assert.equal(token.isCancellationRequested, false);

            const workspaceEdit = new vscode.WorkspaceEdit();

            workspaceEdit.insert(document.uri, new vscode.Position(0, 0), "changed text");

            const applied = await vscode.workspace.applyEdit(workspaceEdit);

            assert.equal(applied, true);

            await Promise.race([cancellationReceived, timedOut]);

            assert.equal(token.isCancellationRequested, true);

            await Promise.race([formatting, timedOut]);
        } finally {
            clearTimeout(timeout);
            finishFormatting([]);
            cancellation?.dispose();
            formatter.dispose();
        }
    }).timeout(10000);
});
