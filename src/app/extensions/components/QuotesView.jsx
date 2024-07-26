import React from 'react';
import { Button, Box, Divider } from '@hubspot/ui-extensions';
import { CrmAssociationTable } from '@hubspot/ui-extensions/crm';

export const QuotesView = ({ onNext }) => {
  return (
    <>
      <Box>
        <Button onClick={onNext} type="button">
          Add Service
        </Button>
      </Box>
      <Divider />
      <CrmAssociationTable
        objectTypeId="0-8"
        propertyColumns={[
          'name',
          'quantity',
          'total_cost_in_default_currency',
          'default_currency',
        ]}
        quickFilterProperties={['name', 'quantity']}
        pageSize={10}
        sort={[
          {
            direction: 0,
            columnName: 'hs_createdate',
          },
        ]}
        searchable={true}
        pagination={true}
      />
    </>
  );
};
