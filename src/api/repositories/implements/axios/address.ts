import axios from 'axios';
import { Address } from '../../../domain/types/address';
import { FetchAddressByPostalCode } from '../../interfaces/address';
import {
  FetchAddressByPostalCodeError,
  FetchAddressByPostalCodeErrorMessage,
} from '../../errors/fetchAddressByPostalCodeError';

// Mockに置き換えられるように export する
export const httpClient = axios.create({ timeout: 5000 });

// http://zipcloud.ibsnet.co.jp/doc/api の結果
type ExternalAddressSearchApiSuccessResponse = {
  message: string | null;
  results:
    | {
        address1: string;
        address2: string;
        address3: string;
        kana1: string;
        kana2: string;
        kana3: string;
        prefcode: string;
        zipcode: string;
      }[]
    | null;
  status: number;
};

export const fetchAddressByPostalCode: FetchAddressByPostalCode = async (
  postalCode: string,
): Promise<Address> => {
  try {
    const params = {
      zipcode: postalCode,
    };

    const apiResponse =
      await httpClient.get<ExternalAddressSearchApiSuccessResponse>(
        'https://zipcloud.ibsnet.co.jp/api/search',
        { params },
      );

    if (apiResponse.data.message !== null || !apiResponse.data.results) {
      return Promise.reject(
        new FetchAddressByPostalCodeError(
          FetchAddressByPostalCodeErrorMessage.addressNotFoundError,
        ),
      );
    }

    return {
      postalCode: postalCode,
      region: apiResponse.data.results[0].address1,
      locality: apiResponse.data.results[0].address2,
    };
  } catch (error) {
    return Promise.reject(
      new FetchAddressByPostalCodeError(
        FetchAddressByPostalCodeErrorMessage.unexpectedError,
        error,
      ),
    );
  }
};
