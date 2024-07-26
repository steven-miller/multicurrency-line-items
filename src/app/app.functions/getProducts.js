const axios = require('axios');

exports.main = async (context = {}) => {
  // const's are set by parameters that were passed in and from our secrets
  const PRIVATE_APP_TOKEN = process.env['PRIVATE_APP_ACCESS_TOKEN'];

  try {
    // Fetch associated shipments and assign to a const
    const { data } = await fetchProducts(query, PRIVATE_APP_TOKEN);

    // Send the response data
    console.log(data.data.CRM.product_collection);
    return data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const fetchProducts = (query, token) => {
  // Set our body for the axios call
  const body = {
    operationName: 'getAllProducts',
    query,
  };
  // return the axios post
  return axios.post(
    'https://api.hubapi.com/collector/graphql',
    JSON.stringify(body),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// GraphQL query to get all products
const query = `
query getAllProducts {
  CRM {
    product_collection(filter: {default_currency__null: false}) {
      items {
        name
        hs_sku
        hs_price_eur
        hs_price_usd
        hs_object_id
        default_currency
      }
    }
  }
}
`;
