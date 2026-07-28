import { queueEmail } from "./emailQueue.js";
import {
  appointmentBookedPatientEmail,
  appointmentBookedDoctorEmail,
  appointmentCancelledPatientEmail,
  appointmentCancelledDoctorEmail,
  welcomeEmail,
  paymentSuccessfulPatientEmail,
  paymentSuccessfulDoctorEmail,
} from "./emailTemplates.js";

const FROM = process.env.EMAIL_FROM;

export const sendBookingEmails = (appointment) => {
  const { userData, docData } = appointment;

  if (userData?.email) {
    queueEmail({
      from: FROM,
      to: userData.email,
      ...appointmentBookedPatientEmail(appointment),
    });
  }

  if (docData?.email) {
    queueEmail({
      from: FROM,
      to: docData.email,
      ...appointmentBookedDoctorEmail(appointment),
    });
  }
};

export const sendCancellationEmails = (appointment, cancelledBy) => {
  const { userData, docData } = appointment;

  if (userData?.email) {
    queueEmail({
      from: FROM,
      to: userData.email,
      ...appointmentCancelledPatientEmail(appointment, cancelledBy),
    });
  }

  if (docData?.email) {
    queueEmail({
      from: FROM,
      to: docData.email,
      ...appointmentCancelledDoctorEmail(appointment, cancelledBy),
    });
  }
};

export const sendWelcomeEmail = (user) => {
  if (user?.email) {
    queueEmail({
      from: FROM,
      to: user.email,
      ...welcomeEmail(user),
    });
  }
};

export const sendPaymentEmails = (appointment) => {
  const { userData, docData } = appointment;

  if (userData?.email) {
    queueEmail({
      from: FROM,
      to: userData.email,
      ...paymentSuccessfulPatientEmail(appointment),
    });
  }

  if (docData?.email) {
    queueEmail({
      from: FROM,
      to: docData.email,
      ...paymentSuccessfulDoctorEmail(appointment),
    });
  }
};
