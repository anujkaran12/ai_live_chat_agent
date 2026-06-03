import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("store_knowledge").del();

  await knex("store_knowledge").insert([
    {
      key: "store_profile",
      value:
        "ShopSpur is a fictional online lifestyle store that sells everyday fashion, accessories, home essentials, and small gift items. The support agent can answer policy and shopping questions, but cannot access real customer accounts or live order systems.",
    },
    {
      key: "return_policy",
      value:
        "Most unused items can be returned within 30 days of delivery. Items must be unused, unwashed, undamaged, and returned with original tags or packaging. Final-sale items, gift cards, personal care items, and customized products cannot be returned unless they arrive damaged or incorrect.",
    },
    {
      key: "exchange_policy",
      value:
        "Exchanges are available for size or color issues within 30 days of delivery, subject to stock availability. If the requested replacement is unavailable, the customer can choose a refund or store credit.",
    },
    {
      key: "refund_policy",
      value:
        "Refunds are issued to the original payment method after the return is inspected. Inspection usually takes 2 to 3 business days after the warehouse receives the item. Bank or card refunds may take another 5 to 7 business days to appear.",
    },
    {
      key: "return_process",
      value:
        "To start a return or exchange, customers should email support@shopspur.com with their order number, the item name, the reason for return, and photos if the item is damaged or incorrect. Support will reply with the next steps and return instructions.",
    },
    {
      key: "shipping_policy",
      value:
        "ShopSpur ships across India and the United States. Standard shipping usually takes 5 to 7 business days after dispatch and is free on orders over $50 or Rs. 3,999. Express shipping usually takes 2 to 3 business days and costs $9.99 or Rs. 499 where available.",
    },
    {
      key: "dispatch_timeline",
      value:
        "Orders are usually packed and dispatched within 1 to 2 business days. Orders placed after 5pm local warehouse time, on weekends, or on public holidays begin processing on the next business day.",
    },
    {
      key: "order_tracking",
      value:
        "Once an order ships, the customer receives a tracking link by email within 24 hours. If tracking has not updated for more than 48 hours after dispatch, the customer should contact support@shopspur.com with their order number.",
    },
    {
      key: "order_changes",
      value:
        "Customers can request an address change or cancellation before the order is dispatched. Once an order has shipped, ShopSpur cannot cancel it or change the delivery address. The customer may still request a return after delivery if the item is eligible.",
    },
    {
      key: "damaged_or_wrong_item",
      value:
        "If an item arrives damaged, defective, missing, or incorrect, the customer should contact support within 7 days of delivery with the order number and clear photos of the package and item. ShopSpur will review and offer a replacement, refund, or store credit depending on the case.",
    },
    {
      key: "payment_methods",
      value:
        "ShopSpur accepts Visa, Mastercard, UPI, PayPal, and major wallet payments where supported. Cash on delivery is not currently available.",
    },
    {
      key: "promo_codes",
      value:
        "Only one promo code can be used per order. Promo codes cannot be applied after an order has been placed. Some codes may exclude sale items, gift cards, or limited-edition products.",
    },
    {
      key: "support_hours",
      value:
        "Human support is available Monday to Friday, 9am to 6pm IST, excluding public holidays. Emails are usually answered within one business day.",
    },
    { key: "support_email", value: "support@shopspur.com" },
    {
      key: "agent_limitations",
      value:
        "The AI support agent cannot look up live order status, payment status, delivery exceptions, account details, or private customer information. For those requests, ask the customer for their order number and direct them to support@shopspur.com.",
    },
  ]);
}
