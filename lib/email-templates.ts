const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://eclat.pk";

const emailWrapper = (content: string) => `
  <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #2a1f18; background: #ffffff;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid #f0ebe3;">
      <h1 style="font-weight: 300; font-size: 24px; letter-spacing: 6px; text-transform: uppercase; margin: 0;">
        Éclat
      </h1>
    </div>

    <!-- Content -->
    ${content}

    <!-- Footer -->
    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f0ebe3; text-align: center;">
      <p style="font-size: 11px; color: #a89080; font-weight: 300; letter-spacing: 1px; margin: 0;">
        © ${new Date().getFullYear()} Éclat. All rights reserved.
      </p>
    </div>
  </div>
`;

export function welcomeEmailTemplate(name: string | null) {
  const firstName = name?.split(" ")[0] ?? "there";

  return emailWrapper(`
    <p style="font-size: 15px; line-height: 1.8; font-weight: 300; color: #6b5d52; margin-bottom: 16px;">
      Hello ${firstName},
    </p>
    <p style="font-size: 15px; line-height: 1.8; font-weight: 300; color: #6b5d52; margin-bottom: 24px;">
      Welcome to Éclat. Your account has been created and you're ready to explore our latest collections.
    </p>
    <div style="margin: 32px 0;">
      <a href="${BASE_URL}/products"
         style="display: inline-block; padding: 12px 32px; border: 1px solid #2a1f18; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #2a1f18; text-decoration: none;">
        Start Shopping
      </a>
    </div>
    <p style="font-size: 13px; line-height: 1.8; font-weight: 300; color: #a89080;">
      You can manage your orders and account details at any time by visiting your 
      <a href="${BASE_URL}/account" style="color: #2a1f18;">account page</a>.
    </p>
  `);
}

export function orderConfirmationEmailTemplate({
  orderId,
  name,
  items,
  totalAmount,
  address,
  phone,
}: {
  orderId: string;
  name: string | null;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  address: string;
  phone: string;
}) {
  const firstName = name?.split(" ")[0] ?? "there";
  const orderRef = orderId.slice(-8).toUpperCase();

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; font-size: 13px; font-weight: 300; color: #2a1f18; border-bottom: 1px solid #f0ebe3;">
          ${item.name}
        </td>
        <td style="padding: 10px 0; font-size: 13px; font-weight: 300; color: #6b5d52; text-align: center; border-bottom: 1px solid #f0ebe3;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 0; font-size: 13px; font-weight: 300; color: #2a1f18; text-align: right; border-bottom: 1px solid #f0ebe3;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join("");

  return emailWrapper(`
    <p style="font-size: 15px; line-height: 1.8; font-weight: 300; color: #6b5d52; margin-bottom: 8px;">
      Hello ${firstName},
    </p>
    <p style="font-size: 15px; line-height: 1.8; font-weight: 300; color: #6b5d52; margin-bottom: 24px;">
      Thank you for your order. We've received it and will be in touch to confirm delivery.
    </p>

    <!-- Order reference -->
    <div style="background: #f7f5f2; padding: 16px 20px; margin-bottom: 28px;">
      <p style="margin: 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #a89080; font-weight: 300;">
        Order Reference
      </p>
      <p style="margin: 4px 0 0; font-size: 18px; letter-spacing: 3px; color: #2a1f18; font-weight: 300;">
        #${orderRef}
      </p>
    </div>

    <!-- Items -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #a89080; font-weight: 300; text-align: left; padding-bottom: 8px; border-bottom: 1px solid #2a1f18;">Item</th>
          <th style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #a89080; font-weight: 300; text-align: center; padding-bottom: 8px; border-bottom: 1px solid #2a1f18;">Qty</th>
          <th style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #a89080; font-weight: 300; text-align: right; padding-bottom: 8px; border-bottom: 1px solid #2a1f18;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <!-- Total -->
    <div style="text-align: right; margin-bottom: 28px;">
      <p style="font-size: 13px; color: #a89080; font-weight: 300; margin: 0;">Total</p>
      <p style="font-size: 18px; color: #2a1f18; font-weight: 300; margin: 4px 0 0; letter-spacing: 1px;">
        ${formatPrice(totalAmount)}
      </p>
    </div>

    <!-- Delivery details -->
    <div style="background: #f7f5f2; padding: 16px 20px; margin-bottom: 28px;">
      <p style="margin: 0 0 8px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #a89080; font-weight: 300;">
        Delivery Details
      </p>
      <p style="margin: 0; font-size: 13px; color: #2a1f18; font-weight: 300; line-height: 1.6;">
        ${address}
      </p>
      <p style="margin: 4px 0 0; font-size: 13px; color: #6b5d52; font-weight: 300;">
        ${phone}
      </p>
    </div>

    <p style="font-size: 13px; color: #a89080; font-weight: 300; line-height: 1.7;">
      Payment method: Cash on Delivery. Our team will contact you on the number above to confirm your delivery.
    </p>

    <div style="margin: 28px 0;">
      <a href="${BASE_URL}/orders"
         style="display: inline-block; padding: 12px 32px; border: 1px solid #2a1f18; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #2a1f18; text-decoration: none;">
        View Order
      </a>
    </div>
  `);
}