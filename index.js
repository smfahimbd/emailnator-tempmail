const { generateEmail } = require('./email/generateEmail');
const { getMessageList } = require('./email/messageList');
const { getMessageView } = require('./email/messageView');

async function main() {
  const emailArg = process.argv[2];
  const messageIDArg = process.argv[3];

  try {
    if (emailArg && messageIDArg) {
      console.log(`Fetching message view for: ${emailArg}, ID: ${messageIDArg}`);
      const messageView = await getMessageView(emailArg, messageIDArg);
      console.log('Message view:', messageView);
    } else if (emailArg) {
      console.log(`Fetching message list for: ${emailArg}`);
      const messages = await getMessageList(emailArg);
      console.log('Message list:', messages);
    } else {
      const emailData = await generateEmail();
      console.log('Generated email:', emailData.email ? emailData.email[0] : 'No email generated');
    }
  } catch (error) {
    console.error('Error:', error.message || error);
  }
}

main();
