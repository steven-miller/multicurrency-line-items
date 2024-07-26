import React, { useState } from 'react';
import { hubspot } from '@hubspot/ui-extensions';
import { LoadingSpinner, Flex, StepIndicator } from '@hubspot/ui-extensions';
import { TripDetails } from './components/TripDetails.jsx';
import { BusOptions } from './components/BusOptions.jsx';
import { QuotesView } from './components/QuotesView.jsx';
import { QuoteName } from './components/QuoteName.jsx';

const Steps = {
  QuotesView: 0,
  QuoteName: 1,
};

// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ actions }) => (
  <ShuttleBusQuotes refreshObjectProperties={actions.refreshObjectProperties} />
));

const ShuttleBusQuotes = ({ refreshObjectProperties }) => {
  const [step, setStep] = useState(Steps.QuotesView);
  const [loading, setLoading] = useState(false);

  const generateQuote = ({ ...parameters }) => {
    // Execute serverless function to generate a quote
    return hubspot.serverless('createQuote', {
      propertiesToSend: ['hs_object_id', 'amount'],
      parameters,
    });
  };

  const handleQuoteName = ({ quantity, productId, price, price_usd }) => {
    setLoading(true);
    // Generate a quote and render initial view
    generateQuote({ quantity, productId, price, price_usd }).then(() => {
      refreshObjectProperties();
      setLoading(false);
      setStep(Steps.QuotesView);
    });
  };

  return (
    <>
      {loading == false && (
        <Flex direction="column" gap="xs">
          {/* Render a step indicator  */}
          {step === Steps.QuotesView && (
            <QuotesView onNext={() => setStep(Steps.QuoteName)} />
          )}
          {step === Steps.QuoteName && <QuoteName onNext={handleQuoteName} />}
        </Flex>
      )}
      {/* If loading, show a spinner */}
      {loading === true && <LoadingSpinner />}
    </>
  );
};
