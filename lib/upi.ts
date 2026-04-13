// elite-jersey-land/lib/upi.ts

export const UPI_CONFIG = {
  vpa: "your-upi-id@paytm", // ⬅️ এখানে তোমার UPI ID দাও
  payeeName: "Elite Jersey Land",
};

export function generateUpiLink(params: {
  amount: number;
  note: string;
  txnId: string;
}): string {
  const { vpa, payeeName } = UPI_CONFIG;

  const searchParams = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: params.amount.toString(),
    cu: "INR",
    tn: params.note,
    tr: params.txnId,
  });

  return `upi://pay?${searchParams.toString()}`;
}