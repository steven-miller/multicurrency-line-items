// for HubSpot API calls
const hubspot = require('@hubspot/api-client');

// Entry function of this module, it creates line items
exports.main = async (context = {}) => {
  // Initialize HubSpot API client
  const hubspotClient = new hubspot.Client({
    accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN'],
  });

  const { hs_object_id, amount } = context.propertiesToSend;
  const { quantity, productId, price, price_usd } = context.parameters;

  console.log('deal id', hs_object_id);

  // Add line item to deal
  const lineItem = await addLineItem({
    productId,
    dealId: hs_object_id,
    quantity,
    total_cost_in_default_currency: price.value * quantity,
    hubspotClient,
  });

  await updateDeal({
    dealId: hs_object_id,
    amount,
    price_usd,
    quantity,
    hubspotClient,
  });

  return { lineItem };
};

// Function to create a line item and associate with deal and product
async function addLineItem({
  productId,
  dealId,
  quantity,
  total_cost_in_default_currency,
  hubspotClient,
}) {
  const request = {
    properties: {
      hs_product_id: productId,
      quantity,
      total_cost_in_default_currency,
    },
    associations: [
      {
        to: { id: dealId },
        types: [
          {
            associationCategory: 'HUBSPOT_DEFINED',
            associationTypeId: hubspot.AssociationTypes.lineItemToDeal,
          },
        ],
      },
    ],
  };

  await hubspotClient.crm.lineItems.basicApi.create(request);
}

async function updateDeal({
  dealId,
  amount,
  price_usd,
  quantity,
  hubspotClient,
}) {
  await hubspotClient.crm.deals.basicApi.update(dealId, {
    properties: {
      amount: Number(amount) + price_usd * quantity,
    },
  });
}
