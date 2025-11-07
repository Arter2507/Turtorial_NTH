# Feedback → Google Sheets (Apps Script)

This repository includes a frontend component `src/components/FeedbackButton.tsx` which posts feedback as JSON to a backend endpoint. Google Sheets itself doesn't accept direct POST from a browser — you need a small Google Apps Script Web App to accept the POST and append rows to the spreadsheet.

Follow these steps to set it up:

1. Open the spreadsheet you provided in Google Sheets.
2. In the menu, choose Extensions → Apps Script.
3. Replace the default `Code.gs` content with the following script.

```js
// Paste into Apps Script editor for the spreadsheet
// NOTE: The frontend sends form-urlencoded data to avoid a CORS preflight (Apps Script
// doesn't respond to OPTIONS for JSON requests). Read values from e.parameter.
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Read submitted fields from e.parameter (form-urlencoded)
    const title = (e.parameter && e.parameter.title) || '';
    const content = (e.parameter && e.parameter.content) || '';
    const ts = (e.parameter && e.parameter.timestamp) || new Date().toISOString();

    // Next index (for column A) - if header row exists, getLastRow() returns 1
    const nextIndex = Math.max(1, sheet.getLastRow());

    // Append: [index, title, content, receivedAt]
    sheet.appendRow([nextIndex, title, content, ts]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Đã lưu góp ý' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Deploy the script as a Web App:
   - Click "Deploy" → "New deployment".
   - Choose "Web app".
   - Set "Execute as" to "Me".
   - Set "Who has access" to "Anyone" (or "Anyone with link") so the front-end can POST anonymously.
   - Click Deploy and copy the `Web app` URL.

5. In `src/components/FeedbackButton.tsx`, set the `FEEDBACK_ENDPOINT` constant to the Web App URL you copied (or set `VITE_FEEDBACK_ENDPOINT` in your `.env`).

6. The frontend will POST form-urlencoded data (title, content, timestamp) which the Apps Script reads from `e.parameter` and appends to the sheet.

Notes and security:
- Allowing "Anyone" to post to your script means anyone with the URL can append rows. If you want more control, add a simple secret token field and check it server-side.
- The Apps Script code provided appends the index into column A using `getLastRow()` which works if the sheet has a header row in row 1 and you only append via this script.
