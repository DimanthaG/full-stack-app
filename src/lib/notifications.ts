// Email notification utility using Resend
export async function sendSecurityEmail(subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Resend API key not found');
    return;
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Security Alerts <alerts@resend.dev>',
        to: process.env.ADMIN_ALERT_EMAIL,
        subject,
        text,
      })
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// Slack notification utility
export async function notifySlack(message: string) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message }),
  });
}

// Combined notification for high-risk operations
export async function sendSecurityNotification(
  action: string,
  details: Record<string, unknown>
) {
  const timestamp = new Date().toISOString();
  const formattedDetails = JSON.stringify(details, null, 2);

  // Email notification
  const emailText = `
Security Alert: ${action}
Time: ${timestamp}
Details:
${formattedDetails}
`;

  await sendSecurityEmail(`Security Alert: ${action}`, emailText);

  // Slack notification
  const slackMessage = `
🚨 *Security Alert*
*Action:* ${action}
*Time:* ${timestamp}
*Details:*
\`\`\`
${formattedDetails}
\`\`\`
`;

  await notifySlack(slackMessage);
} 