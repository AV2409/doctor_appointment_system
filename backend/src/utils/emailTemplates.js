const formatSlot = (slotDate, slotTime) => {
  const [day, month, year] = slotDate.split("_");
  return `${day}/${month}/${year} at ${slotTime}`;
};

export const appointmentBookedPatientEmail = (appointment) => {
  const { userData, docData, slotDate, slotTime } = appointment;
  return {
    subject: "Your appointment is confirmed — MediSync",
    html: `
      <h2>Appointment Confirmed</h2>
      <p>Hi ${userData.name},</p>
      <p>Your appointment with <strong>Dr. ${docData.name}</strong> (${docData.speciality}) has been booked.</p>
      <p><strong>When:</strong> ${formatSlot(slotDate, slotTime)}</p>
      <p><strong>Fee:</strong> ${process.env.CURRENCY} ${appointment.amount}</p>
      <p>You can view or cancel this appointment anytime from your MediSync account.</p>
    `,
  };
};

export const appointmentBookedDoctorEmail = (appointment) => {
  const { userData, docData, slotDate, slotTime } = appointment;
  return {
    subject: "New appointment booked — MediSync",
    html: `
      <h2>New Appointment</h2>
      <p>Hi Dr. ${docData.name},</p>
      <p><strong>${userData.name}</strong> has booked an appointment with you.</p>
      <p><strong>When:</strong> ${formatSlot(slotDate, slotTime)}</p>
      <p><strong>Patient contact:</strong> ${userData.email}${userData.phone ? ` · ${userData.phone}` : ""}</p>
    `,
  };
};

export const appointmentCancelledPatientEmail = (appointment, cancelledBy) => {
  const { userData, docData, slotDate, slotTime } = appointment;
  const reason =
    cancelledBy === "DOCTOR"
      ? "by the doctor"
      : cancelledBy === "ADMIN"
        ? "by the clinic"
        : "by you";

  return {
    subject: "Appointment cancelled — MediSync",
    html: `
      <h2>Appointment Cancelled</h2>
      <p>Hi ${userData.name},</p>
      <p>Your appointment with <strong>Dr. ${docData.name}</strong> on ${formatSlot(slotDate, slotTime)} has been cancelled ${reason}.</p>
      <p>If this was unexpected, please contact support or book a new appointment from your MediSync account.</p>
    `,
  };
};

export const appointmentCancelledDoctorEmail = (appointment, cancelledBy) => {
  const { userData, docData, slotDate, slotTime } = appointment;
  const reason =
    cancelledBy === "PATIENT"
      ? "by the patient"
      : cancelledBy === "ADMIN"
        ? "by the clinic"
        : "by you";

  return {
    subject: "Appointment cancelled — MediSync",
    html: `
      <h2>Appointment Cancelled</h2>
      <p>Hi Dr. ${docData.name},</p>
      <p>The appointment with <strong>${userData.name}</strong> on ${formatSlot(slotDate, slotTime)} has been cancelled ${reason}.</p>
      <p>This slot has been released back into your availability.</p>
    `,
  };
};

export const welcomeEmail = (user) => {
  return {
    subject: "Welcome to MediSync — Your healthcare platform",
    html: `
      <h2>Welcome to MediSync</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for joining MediSync! We're excited to have you on our platform.</p>
      <p>You can now browse doctors, book appointments, and manage your healthcare all in one place.</p>
      <p>Get started by exploring our directory of healthcare professionals and booking your first appointment.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Happy to have you with us!</p>
    `,
  };
};


export const paymentSuccessfulPatientEmail = (appointment) => {
  const { userData, docData, slotDate, slotTime, amount } = appointment;
  return {
    subject: "Payment received — MediSync",
    html: `
      <h2>Payment Received</h2>
      <p>Hi ${userData.name},</p>
      <p>We have successfully received your payment for the following appointment:</p>
      <p><strong>Doctor:</strong> Dr. ${docData.name} (${docData.speciality})</p>
      <p><strong>When:</strong> ${formatSlot(slotDate, slotTime)}</p>
      <p><strong>Amount paid:</strong> ${process.env.CURRENCY} ${amount}</p>
      <p>Your appointment is confirmed and fully paid. See you at the clinic!</p>
      <p>You can view your appointments anytime from your MediSync account.</p>
    `,
  };
};

export const paymentSuccessfulDoctorEmail = (appointment) => {
  const { userData, docData, slotDate, slotTime, amount } = appointment;
  return {
    subject: "Appointment payment received — MediSync",
    html: `
      <h2>Payment Confirmed</h2>
      <p>Hi Dr. ${docData.name},</p>
      <p>The following appointment has been paid in full:</p>
      <p><strong>Patient:</strong> ${userData.name}</p>
      <p><strong>When:</strong> ${formatSlot(slotDate, slotTime)}</p>
      <p><strong>Amount paid:</strong> ${process.env.CURRENCY} ${amount}</p>
      <p>This appointment is confirmed and payment has been received successfully.</p>
    `,
  };
};
