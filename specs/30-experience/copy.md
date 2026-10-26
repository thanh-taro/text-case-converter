# Copy

Tone: short, plain, specific; say what happened and what to do. Placeholders in `{braces}`.

Every string has a text per supported language (RULE-15): **en-US** and **vi-VN**, with the same
placeholders in each. Vietnamese tone: polite and neutral, the way developer tools in Vietnamese
read; no "bạn" unless the sentence needs a subject.

## Case labels (result rows)

Case labels are technical names and stay the same in every language (RULE-15).

| ID                     | en-US         | vi-VN         | Notes |
| ---------------------- | ------------- | ------------- | ----- |
| **COPY-case.camel**    | camelCase     | camelCase     |       |
| **COPY-case.pascal**   | PascalCase    | PascalCase    |       |
| **COPY-case.snake**    | snake_case    | snake_case    |       |
| **COPY-case.kebab**    | kebab-case    | kebab-case    |       |
| **COPY-case.constant** | CONSTANT_CASE | CONSTANT_CASE |       |
| **COPY-case.dot**      | dot.case      | dot.case      |       |
| **COPY-case.path**     | path/case     | path/case     |       |
| **COPY-case.title**    | Title Case    | Title Case    |       |
| **COPY-case.sentence** | Sentence case | Sentence case |       |
| **COPY-case.upper**    | UPPERCASE     | UPPERCASE     |       |
| **COPY-case.lower**    | lowercase     | lowercase     |       |

## App

| ID                 | en-US               | vi-VN               | Notes                                       |
| ------------------ | ------------------- | ------------------- | ------------------------------------------- |
| **COPY-app.title** | Text Case Converter | Text Case Converter | Document title (browser tab when standalone) |

## Actions & labels

| ID                        | en-US                                 | vi-VN                                               | Notes                                                 |
| ------------------------- | ------------------------------------- | --------------------------------------------------- | ----------------------------------------------------- |
| **COPY-action.copy_row**  | Copy {case}                           | Sao chép {case}                                     | Accessible name / label of a result row's copy action |
| **COPY-action.clear**     | Clear                                 | Xóa                                                 | Empty the input                                       |
| **COPY-action.dismiss**   | Dismiss                               | Đóng                                                |                                                       |
| **COPY-label.input**      | Text to convert                       | Văn bản cần chuyển đổi                              | Accessible name of the input area                     |
| **COPY-label.results**    | Converted cases                       | Kết quả chuyển đổi                                  | Accessible name of the result grid                    |
| **COPY-label.privacy**    | Private — nothing leaves your browser | Riêng tư — không có dữ liệu nào rời khỏi trình duyệt | Status-bar privacy statement                          |
| **COPY-label.no_result**  | No result                             | Không có kết quả                                    | Accessible name of an empty result row's value        |
| **COPY-link.source**      | Source code                           | Mã nguồn                                            | Status-bar link to the public source (F-006.R4)       |
| **COPY-link.source_a11y** | Source code (opens in a new tab)      | Mã nguồn (mở trong thẻ mới)                         | Accessible name of the source link                    |

## Placeholders & status

| ID                           | en-US                                                                      | vi-VN                                                                                      | Notes                                                   |
| ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| **COPY-placeholder.input**   | Type or paste text to convert — a name, a phrase, or a list (one per line) | Nhập hoặc dán văn bản cần chuyển đổi — tên, cụm từ hoặc danh sách (mỗi dòng một mục) | Input empty state                                       |
| **COPY-result.empty**        | —                                                                          | —                                                                                          | Shown in a result row when the input is empty           |
| **COPY-status.copied**       | Copied {case}                                                              | Đã sao chép {case}                                                                         | Spoken announcement after a copy (aria-live)            |
| **COPY-status.copied_short** | Copied                                                                     | Đã sao chép                                                                                | Visible flash label on the copied row                   |
| **COPY-status.copy_failed**  | Couldn't copy — select the text and copy manually                          | Không sao chép được — hãy chọn văn bản và sao chép thủ công                                | Shown and announced when the clipboard write is refused |
| **COPY-status.lines**        | {n} lines                                                                  | {n} dòng                                                                                   | Shown when the input has more than one line             |
| **COPY-notice.large**        | Large input — results update after you stop typing                         | Văn bản dài — kết quả sẽ cập nhật khi ngừng gõ                                               | Shown once past the RULE-08 cap                         |

## Options & sorting (M-2)

| ID                       | en-US           | vi-VN            | Notes                                           |
| ------------------------ | --------------- | ---------------- | ----------------------------------------------- |
| **COPY-label.options**   | Options         | Tùy chọn         | Accessible name of the controls group           |
| **COPY-action.strip**    | Strip symbols   | Xóa ký tự đặc biệt | Toggle (RULE-11)                                |
| **COPY-action.accents**  | Remove accents  | Xóa dấu          | Toggle (RULE-12)                                |
| **COPY-label.sort**      | Sort            | Sắp xếp          | Label of the sort control (RULE-13)             |
| **COPY-sort.default**    | Default order   | Thứ tự mặc định  | Sort option                                     |
| **COPY-sort.recent**     | Recently copied | Đã sao chép gần đây | Sort option                                     |
| **COPY-sort.alpha**      | A–Z             | A–Z              | Sort option (alphabetical by case label)        |
| **COPY-action.pin**      | Pin {case}      | Ghim {case}      | Pin a case to the top (accessible name)         |
| **COPY-action.unpin**    | Unpin {case}    | Bỏ ghim {case}   | Unpin a case (accessible name)                  |
| **COPY-badge.last_used** | Last used       | Dùng gần nhất    | Badge on the most-recently-copied row (RULE-13) |
