import Stripe from "stripe";
import { NonNullableKey, removeNull } from "./common";

const keysToRemove: Array<keyof Stripe.Price> = [
  "id",
  "unit_amount_decimal",
  "type",
  "livemode",
  "object",
  "created",
];

export function sanitizePrice(
  rawData: Stripe.Price,
  newProductId: string
): any {
  // TODO
  const data = removeNull(rawData);

  keysToRemove.forEach((key) => {
    delete data[key];
  });

  for (const tier of data["tiers"] || []) {
    delete (tier as any)["flat_amount_decimal"];
    delete (tier as any)["unit_amount_decimal"];
    if (tier.up_to === undefined) {
      (tier as any).up_to = "inf";
    }
  }

  if (data["currency_options"]) {
    delete data["currency_options"][data.currency];
    for (const currencyCode in data["currency_options"]) {
      const currencyOption = data["currency_options"][currencyCode];
      if ("unit_amount_decimal" in currencyOption) {
        delete (currencyOption as any)["unit_amount_decimal"];
      }
    }
  }

  if (data['custom_unit_amount']) {
    (data['custom_unit_amount'] as any)['enabled'] = true;
  }

  data["product"] = newProductId;

  return data;
}
