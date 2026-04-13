import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

if (!smtpUser || !smtpPass) {
  console.warn(
    "SMTP credentials are missing. Email sending will fail until SMTP_USER and SMTP_PASS are set."
  );
}

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export async function sendContactEmail(payload: {
  name: string;
  email: string;
  phone?: string | null;
  houseName?: string | null;
  roadName?: string | null;
  address?: string | null;
  pincode?: string | null;
}) {
  const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  if (!to || !from) {
    throw new Error("Contact email configuration is missing");
  }

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6;">
      <h2 style="margin: 0 0 16px; color: #2b2112;">New Contact Request - Elite Jersey Land</h2>

      <table style="border-collapse: collapse; width: 100%; max-width: 700px;">
        <tr>
          <td style="padding: 8px; font-weight: 700; width: 180px;">Name</td>
          <td style="padding: 8px;">${payload.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 700;">Email</td>
          <td style="padding: 8px;">${payload.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 700;">Phone</td>
          <td style="padding: 8px;">${payload.phone || "-"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 700;">House Name</td>
          <td style="padding: 8px;">${payload.houseName || "-"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 700;">Road Name</td>
          <td style="padding: 8px;">${payload.roadName || "-"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 700;">Address</td>
          <td style="padding: 8px;">${payload.address || "-"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 700;">Pincode</td>
          <td style="padding: 8px;">${payload.pincode || "-"}</td>
        </tr>
      </table>
    </div>
  `;

  const text = `
New Contact Request - Elite Jersey Land

Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone || "-"}
House Name: ${payload.houseName || "-"}
Road Name: ${payload.roadName || "-"}
Address: ${payload.address || "-"}
Pincode: ${payload.pincode || "-"}
  `.trim();

  await mailer.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject: `New Contact Request from ${payload.name}`,
    text,
    html,
  });
}

type OrderMailItem = {
  name: string;
  image?: string | null;
  price: number;
  quantity: number;
  subtotal: number;
};

type OrderMailPayload = {
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  total: number;
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED";
  status: "ORDERED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: Date | string;
  items: OrderMailItem[];
};

function buildOrderItemsRows(items: OrderMailItem[]) {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border: 1px solid #eee; text-align: right;">₹${item.subtotal.toFixed(2)}</td>
      </tr>
    `
    )
    .join("");
}

function buildOrderItemsText(items: OrderMailItem[]) {
  return items
    .map(
      (item) =>
        `- ${item.name} | Qty: ${item.quantity} | Price: ₹${item.price.toFixed(
          2
        )} | Subtotal: ₹${item.subtotal.toFixed(2)}`
    )
    .join("\n");
}

export async function sendOrderConfirmationEmail(payload: OrderMailPayload) {
  const from = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  if (!from) {
    throw new Error("Order email configuration is missing");
  }

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6; max-width: 760px; margin: 0 auto;">
      <h2 style="margin: 0 0 16px; color: #2b2112;">Thank you for your order, ${payload.customerName}</h2>
      <p style="margin: 0 0 16px;">Your order has been placed successfully with Elite Jersey Land.</p>

      <div style="margin: 18px 0; padding: 16px; border: 1px solid #f1e2b5; border-radius: 12px; background: #fffdf7;">
        <p style="margin: 0 0 8px;"><strong>Order Number:</strong> ${payload.orderNumber}</p>
        <p style="margin: 0 0 8px;"><strong>Order Status:</strong> ${payload.status}</p>
        <p style="margin: 0 0 8px;"><strong>Payment Status:</strong> ${payload.paymentStatus}</p>
        <p style="margin: 0;"><strong>Placed On:</strong> ${new Date(
          payload.createdAt
        ).toLocaleString()}</p>
      </div>

      <h3 style="margin: 24px 0 12px; color: #2b2112;">Order Items</h3>

      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="padding: 10px; border: 1px solid #eee; text-align: left; background: #faf7ec;">Item</th>
            <th style="padding: 10px; border: 1px solid #eee; text-align: center; background: #faf7ec;">Qty</th>
            <th style="padding: 10px; border: 1px solid #eee; text-align: right; background: #faf7ec;">Price</th>
            <th style="padding: 10px; border: 1px solid #eee; text-align: right; background: #faf7ec;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${buildOrderItemsRows(payload.items)}
        </tbody>
      </table>

      <div style="margin: 20px 0; padding: 16px; border: 1px solid #f1e2b5; border-radius: 12px; background: #fffdf7;">
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${payload.customerName}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${payload.email}</p>
        <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${payload.phone}</p>
        <p style="margin: 0 0 8px;"><strong>Address:</strong> ${payload.address}</p>
        <p style="margin: 0; font-size: 18px;"><strong>Total:</strong> ₹${payload.total.toFixed(
          2
        )}</p>
      </div>

      <p style="margin-top: 18px;">We will notify you when your order moves to the next stage.</p>
      <p style="margin-top: 6px;">Thanks for shopping with Elite Jersey Land.</p>
    </div>
  `;

  const text = `
Thank you for your order, ${payload.customerName}

Your order has been placed successfully with Elite Jersey Land.

Order Number: ${payload.orderNumber}
Order Status: ${payload.status}
Payment Status: ${payload.paymentStatus}
Placed On: ${new Date(payload.createdAt).toLocaleString()}

Order Items:
${buildOrderItemsText(payload.items)}

Customer Name: ${payload.customerName}
Email: ${payload.email}
Phone: ${payload.phone}
Address: ${payload.address}

Total: ₹${payload.total.toFixed(2)}

Thanks for shopping with Elite Jersey Land.
  `.trim();

  await mailer.sendMail({
    from,
    to: payload.email,
    subject: `Order Confirmation - ${payload.orderNumber}`,
    text,
    html,
  });
}

export async function sendAdminOrderNotificationEmail(
  payload: OrderMailPayload
) {
  const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  if (!to || !from) {
    throw new Error("Admin order email configuration is missing");
  }

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6; max-width: 760px; margin: 0 auto;">
      <h2 style="margin: 0 0 16px; color: #2b2112;">New Order Received</h2>

      <div style="margin: 18px 0; padding: 16px; border: 1px solid #f1e2b5; border-radius: 12px; background: #fffdf7;">
        <p style="margin: 0 0 8px;"><strong>Order Number:</strong> ${payload.orderNumber}</p>
        <p style="margin: 0 0 8px;"><strong>Customer:</strong> ${payload.customerName}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${payload.email}</p>
        <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${payload.phone}</p>
        <p style="margin: 0;"><strong>Total:</strong> ₹${payload.total.toFixed(
          2
        )}</p>
      </div>

      <h3 style="margin: 24px 0 12px; color: #2b2112;">Order Items</h3>

      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="padding: 10px; border: 1px solid #eee; text-align: left; background: #faf7ec;">Item</th>
            <th style="padding: 10px; border: 1px solid #eee; text-align: center; background: #faf7ec;">Qty</th>
            <th style="padding: 10px; border: 1px solid #eee; text-align: right; background: #faf7ec;">Price</th>
            <th style="padding: 10px; border: 1px solid #eee; text-align: right; background: #faf7ec;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${buildOrderItemsRows(payload.items)}
        </tbody>
      </table>
    </div>
  `;

  const text = `
New Order Received

Order Number: ${payload.orderNumber}
Customer: ${payload.customerName}
Email: ${payload.email}
Phone: ${payload.phone}
Address: ${payload.address}
Total: ₹${payload.total.toFixed(2)}

Order Items:
${buildOrderItemsText(payload.items)}
  `.trim();

  await mailer.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject: `New Order Received - ${payload.orderNumber}`,
    text,
    html,
  });
}