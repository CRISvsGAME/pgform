# Pgform

## PostgreSQL Formatter for Visual Studio Code

![Pgform](images/icon.png)

Pgform is a lightweight Visual Studio Code extension for formatting PostgreSQL
SQL using [pgFormatter](https://github.com/darold/pgFormatter).

**0.1.0** is the first stable release, with formatting cancellation and
formatter-process cleanup. It provides whole-document formatting through VS Code,
using the current editor buffer and the document's indentation options.
Behaviour may change as the extension develops.

---

## 📦 Installation

Requirements:

- Visual Studio Code **1.101.0 or later**.
- An externally installed `pg_format` executable available on the extension host's
  `PATH`. Pgform does not bundle or download it.

Install pgFormatter using the instructions in the
[pgFormatter project](https://github.com/darold/pgFormatter), then verify your installation:

```bash
pg_format --version
```

Install Pgform from the
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=crisvsgame.pgform).

For WSL, Remote SSH, or development containers, install both Pgform and
`pg_format` in the remote environment where the workspace extension host runs.

---

## 🚀 Quick Start

1. Open a SQL document, or create an untitled document.
2. Set its language mode to **SQL** if it is not already selected.
3. Run **Format Document With...** and select **Pgform**.

For example, with four-space indentation:

```sql
select a,b from public.items where id=1;
```

Becomes:

```sql
SELECT
    a,
    b
FROM
    public.items
WHERE
    id = 1;

```

To use Pgform as the default SQL formatter and format on save, add this
to your VS Code settings:

```json
{
    "[sql]": {
        "editor.defaultFormatter": "crisvsgame.pgform",
        "editor.formatOnSave": true
    }
}
```

---

## 🔧 Features

- Whole-document formatting through VS Code's formatting provider.
- Current in-memory input, including unsaved changes and untitled documents.
- Eligibility based on SQL language mode, with no filename-extension requirement.
- Tabs or spaces and indentation width taken from VS Code's formatting options.
- No edits for unchanged formatter output.
- No edits for cancelled formatting requests.
- Formatter input cleanup and active-process termination requests on cancellation or failure.
- No edits after process or stream failure, unsuccessful exit, or a document-version change.
- Formatted edits applied by VS Code; Pgform does not write the source file directly.
- SQL contents passed to `pg_format` as data, never executed.
- No runtime npm dependencies.

---

## 🎛️ Formatting Behaviour

Configure indentation through VS Code:

```json
{
    "[sql]": {
        "editor.insertSpaces": true,
        "editor.tabSize": 4
    }
}
```

Pgform passes the buffer to `pg_format` through stdin and reads the formatted
result from stdout. It supplies `-s` for space indentation or `-T` for tabs,
and `-X` to ignore automatically discovered configuration files. Otherwise, it
uses the installed formatter's defaults. There are no Pgform-specific settings or
free-form argument options in this release.

---

## 🚧 Current Limitations

- Whole-document formatting only; selection/range formatting is not implemented.
- Pgform does not validate SQL syntax; malformed SQL may still produce
  successful formatter output.
- Pgform does not provide pgFormatter configuration-file integration. Its
  explicit `-X` flag disables automatic configuration discovery.
- Timeouts, automatic request supersession, and active-process cleanup on
  extension deactivation are not yet implemented. A stalled formatter can leave
  a request pending unless the request is cancelled.
- Failures are logged to the extension host console; there are no user-facing
  error notifications or executable-path settings yet.
- Development has been exercised in WSL Ubuntu. Windows, macOS, and other
  remote environments have not been validated.

---

## 📂 Project Structure

```text
src/
    extension.ts
    format-provider.ts
    format-request.ts
    test/
        extension.test.ts
test/
    lifecycle.test.cjs
images/
    icon.png
    icon.svg
.vscode/
    launch.json
    tasks.json
.vscode-test.mjs
.gitignore
LICENSE
CHANGELOG.md
README.md
package-lock.json
package.json
tsconfig.json
out/ # generated JavaScript and source maps
```

---

## 🧪 Testing

Install development dependencies and run the tests:

```bash
npm ci
npm test
npm run test:lifecycle
```

The lifecycle command compiles the extension and runs 20 tests with mocked
processes and VS Code objects. They cover cancellation, cleanup, late events,
stale and unchanged results, and overlapping requests. No running VS Code host
or installed `pg_format` is needed for this suite.

The integration command compiles the extension and runs tests in a downloaded
VS Code Extension Development Host. It requires `pg_format` on `PATH` and a graphical
environment capable of running VS Code.

The current configuration targets stable VS Code. Four integration tests cover
spaces, tabs, unchanged input, and formatter failure through VS Code's
formatting API. A fifth checks that VS Code cancels a pending formatting token
when the document changes during the normal Format Document action.

After building, run against the minimum supported VS Code version:

```bash
npm exec -- vscode-test --code-version 1.101.0
```

---

## 🛠️ Build

Build the extension:

```bash
npm run build
```

Watch for source changes:

```bash
npm run dev
```

Open the repository in VS Code and press **F5** to launch the configured
Extension Development Host.

---

## 📝 License

[MIT License](LICENSE)

---

## 🔗 Links

- Marketplace: https://marketplace.visualstudio.com/items?itemName=crisvsgame.pgform
- Source Code: https://github.com/CRISvsGAME/pgform
- Issues: https://github.com/CRISvsGAME/pgform/issues
- pgFormatter: https://github.com/darold/pgFormatter
