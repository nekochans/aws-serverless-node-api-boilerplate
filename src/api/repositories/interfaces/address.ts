import { Address } from '../../domain/types/address';

export type FetchAddressByPostalCode = (postalCode: string) => Promise<Address>;
