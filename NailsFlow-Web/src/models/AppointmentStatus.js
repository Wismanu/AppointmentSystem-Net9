// This file mirrors the AppointmentStatus enum from the backend
export const AppointmentStatus = {
  Requested: "Requested",
  PendingAdvancePayment: "PendingAdvancePayment",
  AdvancePaymentConfirmed: "AdvancePaymentConfirmed",
  Assigned: "Assigned",
  Rescheduled: "Rescheduled",
  InProgress: "InProgress",
  CompletedPendingPayment: "CompletedPendingPayment",
  CompletedAndConfirmed: "CompletedAndConfirmed",
  Cancelled: "Cancelled"
};

export default AppointmentStatus;