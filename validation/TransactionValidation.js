import vine from "@vinejs/vine";

export const transactionSchema = vine.object({
  date: vine.string(),
  transaction_type: vine.enum(["INCOME", "EXPENSE"]),
  amount: vine.number(),
  client_id: vine.string(),
  transaction_medium: vine.enum(["Bank", "Cash", "Other"]).optional(),
});
