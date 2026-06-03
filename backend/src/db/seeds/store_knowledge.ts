import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("store_knowledge").del();

  await knex("store_knowledge").insert([
    { key: "store_name", value: "ShopSpur" },
    {
      key: "return_policy",
      value:
        "Customers can return any unused item within 30 days of purchase. Items must be in original packaging. To initiate a return email support@shopspur.com with your order number.",
    },
    {
      key: "shipping_policy",
      value:
        "Standard shipping takes 5 to 7 business days and is free on orders over $50. Express 2 day shipping is available for $9.99. We ship across India and the US.",
    },
    {
      key: "support_hours",
      value: "Our support team is available Monday to Friday 9am to 6pm IST.",
    },
    { key: "support_email", value: "support@shopspur.com" },
    { key: "payment_methods", value: "We accept Visa, Mastercard, UPI, and PayPal." },
    {
      key: "order_tracking",
      value:
        "Once your order ships you will receive a tracking link via email within 24 hours.",
    },
  ]);
}
