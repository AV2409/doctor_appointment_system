import resend from "./resend.js";

const RETRY_DELAYS = [2000, 4000, 8000, 16000, 32000];
const MAX_RETRIES = 5;

async function sendWithRetry(payload, attempt = 0) {
  try {
    console.log("Sending email to", payload.to);
    const response = await resend.emails.send(payload);
    console.log("Email sent successfully");
    return response;
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      const delay = RETRY_DELAYS[attempt];
      console.log(
        `Email send failed, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
      );

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(sendWithRetry(payload, attempt + 1));
        }, delay);
      });
    } else {
      console.error(`Email send failed after ${MAX_RETRIES} retries:`, error);
      return null;
    }
  }
}

function queueEmail(payload) {
  sendWithRetry(payload).catch(() => {});
}

export { sendWithRetry, queueEmail };
