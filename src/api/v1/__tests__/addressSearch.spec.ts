import addressSearch from '../addressSearch';

describe('addressSearch', () => {
  it('should return a address', () => {
    const request = {
      postalCode: '1620062',
    };

    const expected = {
      statusCode: 200,
      body: {
        postalCode: '1620062',
        region: '東京',
        locality: '市谷加賀町',
      },
    };

    expect(addressSearch(request)).toStrictEqual(expected);
  });

  it('should return a NotAllowedPostalCode Error', () => {
    const request = {
      postalCode: '1000000',
    };

    const expected = {
      statusCode: 400,
      body: {
        code: 'NotAllowedPostalCode',
        message: 'not allowed to search by that postalCode',
      },
    };

    expect(addressSearch(request)).toStrictEqual(expected);
  });

  it('should return a validation error', () => {
    const request = {
      postalCode: '12345678',
    };

    const expected = {
      statusCode: 422,
      body: {
        message: `Unprocessable Entity`,
        validationErrors: [
          { key: 'postalCode', reason: 'must NOT have more than 7 characters' },
        ],
      },
    };

    expect(addressSearch(request)).toStrictEqual(expected);
  });
});
