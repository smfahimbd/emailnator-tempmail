# Emailnator CLI Tool

A Node.js command-line tool for generating temporary emails and checking messages using Emailnator.

## Features

- Generate temporary email addresses
- Fetch message list for an email
- View specific message content by message ID

## Installation

1. Clone or download the project.
2. Navigate to the project directory.
3. Install dependencies:

```bash
npm install
```

## Usage

Run the tool using Node.js with the following commands:

### Generate a new email

```bash
node index.js
```

This will generate a new temporary email address and display it.

### Get message list for an email

```bash
node index.js "email@example.com"
```

Replace `email@example.com` with the actual email address. This will fetch and display the list of messages for that email.

### View a specific message

```bash
node index.js "email@example.com" "messageID"
```

Replace `email@example.com` with the email and `messageID` with the specific message ID from the message list. This will fetch and display the content of that message.

## Examples

1. **Generate Email:**

   ```bash
   node index.js
   ```

   Output:

   ```
   Generated email: c.hl.o.eabel.e.0.7@googlemail.com
   ```

2. **Get Message List:**

   ```bash
   node index.js "c.hl.o.eabel.e.0.7@googlemail.com"
   ```

   Output:

   ```
   Fetching message list for: c.hl.o.eabel.e.0.7@googlemail.com
   Message list: {
     messageData: [
       {
         messageID: 'ADSVPN',
         from: 'AI TOOLS',
         subject: 'Unleash the power of AI with our ultimate directory of online tools!',
         time: 'Just Now'
       },
   {
      messageID: 'MTlhMjJkZTJhMzY0ZDQxNw==',
      from: '"楽天銀行株式会社／テンプレートBANK_Mail" <tb_dmservice@templatebank.com>',
      subject: '【楽天銀行から審査優遇のご案内】期間限定金利半額！まもなく終了！＜テンプレートBANK_Mail＞',
      time: '8 hrs ago'
    }
     ]
   }
   ```

3. **View Message:**

   ```bash
   node index.js "c.hl.o.eabel.e.0.7@googlemail.com" "MTlhMjJkZTJhMzY0ZDQxNw"
   ```

   Output:

   ```
   Fetching message view for: c.hl.o.eabel.e.0.7@googlemail.com, ID: MTlhMjJkZTJhMzY0ZDQxNw
   Message view: { ...message content... }
   ```

## Dependencies

- axios
- tough-cookie
- axios-cookiejar-support

## Notes

- This tool interacts with emailnator.com and may be subject to rate limits or server errors.
- Ensure you have Node.js installed (version 14 or higher recommended).
- The tool uses spoofed headers for requests to mimic browser behavior.

## License

This project is for educational purposes only. Use responsibly.
