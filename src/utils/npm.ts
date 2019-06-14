import { uniq } from 'lodash';

export const isPackageAvailable = async (packageName: string) => {
  const url = `https://api.npms.io/v2/search?q=${packageName}`;
  const response = await fetch(url);
  const apiResult = await response.json();
  const isAvailable = !apiResult.results.some((result: any) => result.package.name === packageName);
  return isAvailable;
}

export interface PackageDetails {
  name: string;
  url: string;
  isAvailable: boolean;
}

export const getPackageDetails = async (packageName: string): Promise<PackageDetails> => {
  const isAvailable = await isPackageAvailable(packageName);
  const result = {
    isAvailable,
    name: packageName,
    url: `https://www.npmjs.com/package/${packageName}`,
  }
  return result;
}

export const getAllPackageDetails = async (packageNames: string[]): Promise<PackageDetails[]> => {
  return Promise.all(
    packageNames.map(packageName => getPackageDetails(packageName))
  );
}

export const getPackageNameVariants = (text: string) => {
  const trimmedText = text.trim();
  if (!trimmedText) {
    return [];
  }

  const packageNames: string[] = uniq([
    trimmedText.replace(/\s+/gm, '-').toLowerCase(),
    trimmedText.replace(/\s+/gm, '').toLowerCase(),
  ]);

  return packageNames;
};
