# Changelog

## 0.1.0 - 2026-10-09

### Added

- Initial stable release.
- Whole-document PostgreSQL formatting using an externally installed `pg_format`.
- Formatting of the current in-memory editor buffer, including unsaved and untitled documents.
- SQL language-mode formatter registration.
- VS Code indentation integration using `insertSpaces` and `tabSize`.
- Tab and space indentation support.
- Protection against stale document results.
- Handling for formatter process and stream failures.
- No-op handling when formatter output is unchanged.
- VS Code integration test suite covering spaces, tabs, unchanged input, and formatter failure.
- Workspace extension support for local and remote extension hosts.
- Support for VS Code formatting cancellation tokens, including requests cancelled before formatting starts.
- Formatter-process and stream cleanup on cancellation or failure.
- Lifecycle tests for cancellation, cleanup, stale and unchanged results, and overlapping requests.
- Integration test for VS Code cancelling formatting when the document changes.
