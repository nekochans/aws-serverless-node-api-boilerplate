import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
const axiosMock = new MockAdapter(axios);

// axiosMock を作った後にimportする事でMockに置き換えられる
import { fetchAddressByPostalCode } from '../../repositories/implements/axios/address';
import addressSearch from '../addressSearch';

describe('addressSearch', () => {
  afterEach(() => {
    axiosMock.restore();
  });

  it('should return a address', async () => {
    const mockResponse = {
      message: null,
      results: [
        {
          address1: '東京都',
          address2: '新宿区',
          address3: '市谷加賀町',
          kana1: 'ﾄｳｷｮｳﾄ',
          kana2: 'ｼﾝｼﾞｭｸｸ',
          kana3: 'ｲﾁｶﾞﾔｶｶﾞﾁｮｳ',
          prefcode: '13',
          zipcode: '1620062',
        },
      ],
      status: 200,
    };

    axiosMock
      .onGet('https://zipcloud.ibsnet.co.jp/api/search')
      .reply(200, mockResponse);

    const request = {
      postalCode: '1620062',
    };

    const expected = {
      statusCode: 200,
      body: {
        postalCode: '1620062',
        region: '東京都',
        locality: '新宿区',
      },
    };

    const actual = await addressSearch(request, fetchAddressByPostalCode);

    expect(actual).toStrictEqual(expected);
  });

  it('should return a NotAllowedPostalCode Error', async () => {
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

    const actual = await addressSearch(request, fetchAddressByPostalCode);

    expect(actual).toStrictEqual(expected);
  });

  it('should return a validation error', async () => {
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

    const actual = await addressSearch(request, fetchAddressByPostalCode);

    expect(actual).toStrictEqual(expected);
  });
});
