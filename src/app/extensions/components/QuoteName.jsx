import { LoadingSpinner, Text, hubspot } from '@hubspot/ui-extensions';
import { Button, ButtonRow, NumberInput, Select } from '@hubspot/ui-extensions';
import React, { useCallback, useEffect, useState } from 'react';

hubspot.extend(({ context }) => <QuoteName context={context} />);

const CURRENCY_TO_SYMBOL = {
  EUR: '€',
  USD: '$',
};

const productItems = (response) => response.data.CRM.product_collection.items;

const getProductOptions = (response) => {
  const products = productItems(response);

  return products.map((product) => ({
    label: product.name,
    value: product.hs_object_id,
  }));
};

const productPriceMap = (response) => {
  const products = productItems(response);

  return products.reduce((productPrices, product) => {
    productPrices[product.hs_object_id] = {
      currency: product.default_currency.label,
      value: product[product.default_currency.value],
    };
    return productPrices;
  }, {});
};

export const QuoteName = ({ onNext }) => {
  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [productId, setProductId] = useState();
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pricesInCurrency, setPricesInCurrency] = useState({});

  const getProducts = useCallback(
    async () => await hubspot.serverless('getProducts')
  );

  useEffect(() => {
    setLoading(true);
    getProducts().then((resp) => {
      console.log('all the graphql resp:', resp);
      setProducts(productItems(resp));
      setProductOptions(getProductOptions(resp));
      setPricesInCurrency(productPriceMap(resp));
      console.log('product price map', productPriceMap(resp));
      setLoading(false);
      console.log(
        products.find((product) => product.hs_object_id === productId)
          .hs_price_usd
      );
    });
  }, []);

  return (
    <>
      {loading === false && (
        <>
          <Select
            options={productOptions}
            label="Select a consulting package"
            name="sku"
            onChange={(value) => {
              console.log(value);
              setProductId(value);
            }}
          />
          <NumberInput
            name="quantity"
            label="Consulting hours purchased"
            value={quantity}
            onChange={(value) => {
              setQuantity(value);
            }}
          />
          <Text>
            Cost per hour:{' '}
            {CURRENCY_TO_SYMBOL[pricesInCurrency[productId]?.currency]}
            {pricesInCurrency[productId]?.value}
          </Text>
          {productId && (
            <Text>
              Total cost:{' '}
              {CURRENCY_TO_SYMBOL[pricesInCurrency[productId]?.currency]}
              {pricesInCurrency[productId]?.value * quantity}
            </Text>
          )}
          <ButtonRow>
            <Button
              onClick={() =>
                onNext({
                  quantity,
                  productId,
                  price: pricesInCurrency[productId],
                  price_usd: products.find(
                    (product) => product.hs_object_id === productId
                  ).hs_price_usd,
                })
              }
              variant="primary"
              type="button"
            >
              Add service
            </Button>
          </ButtonRow>
        </>
      )}
      {loading === true && <LoadingSpinner />}
    </>
  );
};
