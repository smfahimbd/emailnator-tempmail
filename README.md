# Emailnator CLI Tool

A Node.js command-line tool for generating temporary emails and checking messages using Emailnator.

## Features

- Generate temporary email addresses with different domain types
- Fetch message list for an email
- View specific message content by message ID

## Installation

1. Clone or download the project.
2. Navigate to the project directory.
3. Install dependencies:

```bash
npm install
```

## Web Interface

Start the web server:

```bash
npm start
```

Then open your browser and navigate to `http://localhost:3000`

The web interface provides:
- Generate temporary emails with a click
- View message list for any email
- Read email content in HTML format
- Responsive design for mobile and desktop

## CLI Usage

For command-line usage, run:

```bash
npm run cli
```

Or directly with Node.js:

### Generate a new email

```bash
node index
```

This will generate a new temporary email address and display it.

**Customize Email Type:**

You can customize the email type by modifying the `ids` array in `email/generateEmail.js`:

```javascript
const data = { ids: [3] }; // Available options: [1, 2, 3, 8]
```

Available email types:
- `1`: Domain
- `2`: +Gmail
- `3`: .Gmail
- `8`: GoogleMail

Example to use multiple types:
```javascript
const data = { ids: [1, 3, 8] };
```

### Get message list for an email

```bash
node index "email@example.com"
```

Replace `email@example.com` with the actual email address. This will fetch and display the list of messages for that email.

### View a specific message

```bash
node index "email@example.com" "messageID"
```

Replace `email@example.com` with the email and `messageID` with the specific message ID from the message list. This will fetch and display the content of that message.

## Examples

1. **Generate Email:**

   ```bash
   node index
   ```

   Output:

   ```
   Generated email: andrei.as.anchesx@gmail.com
   ```

2. **Get Message List:**

   ```bash
   node index "email@example.com"
   ```

   Output:

   ```
   Fetching message list for: email@example.com
   Message list: {
     status: 'success',
     messages: [
       {
         id: 'gp1.xcwaZpSjzd5cOFdg_eMfS3QedKVtDSlLgavsXR14KEN8W1EntTy12oQ7YstYjw8V0ghsRV17lsLExWijugGXEPcuysZiT_2CAVSLJ3aDyHk',
         from: 'IDCrawl Support <no-reply@idcrawl.com>',
         subject: 'IDCrawl - Remove My Information',
         timestamp: 1790273070,
         time_ago: '9 mins ago'
       }
     ],
     message_count: 1,
     message_limit: 10,
     upgrade_available: true
   }
   ```

3. **View Message:**

   ```bash
   node index "email@example.com" "messageID"
   ```

   Output:

   ```
   Fetching message view for: email@example.com, ID: messageID
   Message view: {
     id: 'gp1.27AEiIw_azh6jyqwt5dKaN9gt-22lP2RwV5QePKD_my9OBOQRs_xefEoX1yR30ZW7Zc7Y2Tq93rFXA76fL2O2FH3QR5hjx_3zjY0_j07S1c',
     from: 'Coub <do-not-reply@coub.com>',
     subject: 'Confirm your coub.com signup',
     date: 1790259039,
     content: '<!doctype html>...',
     has_attachments: false
   }
   ```

## Dependencies

- axios

## Notes

- This tool interacts with emailnator.com API directly without CSRF token handling.
- May be subject to rate limits or server errors.
- Ensure you have Node.js installed (version 14 or higher recommended).
- The tool uses direct API calls with proper headers to mimic browser behavior.

## License

This project is for educational purposes only. Use responsibly.
