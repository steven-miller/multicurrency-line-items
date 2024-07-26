**Note: this extension is in a rough draft state**

# Multicurrency line items sample

![Screenshot 2024-07-26 at 10 26 12](https://github.com/user-attachments/assets/24e3b774-9070-457a-ae06-9a825663598a)

Summary: a HubSpot UI extension that allows users to add line items in multiple currencies to one deal. Natively, line items are restricted to the currency of the deal. However, we can expose the default currency of each line item, add the line items in the portal default currency (e.g. USD), but still view and report on the line item currency (e.g. EUR)

In this scenario, I have three line items with this information stored on them:

```
[
  {
    name: 'German Consulting',
    hs_sku: 'germany',
    hs_price_eur: '400',
    hs_price_usd: '430',
    hs_object_id: 2514207643,
    default_currency: { label: 'EUR', value: 'hs_price_eur' }
  },
  {
    name: 'U.S. Consulting',
    hs_sku: 'usa',
    hs_price_eur: null,
    hs_price_usd: '500',
    hs_object_id: 2514207645,
    default_currency: { label: 'USD', value: 'hs_price_usd' }
  },
  {
    name: 'French Consulting',
    hs_sku: null,
    hs_price_eur: '400',
    hs_price_usd: '460',
    hs_object_id: 2514848429,
    default_currency: { label: 'EUR', value: 'hs_price_eur' }
  }
]
```
