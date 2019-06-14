import { flatten } from 'lodash';
import { getRelatedWords } from './synonyms';
import { getPackageNameVariants, getPackageDetails } from './npm';

export const getSuggestedPackageNames = async (searchText: string) => {
  const relatedWords = await getRelatedWords(searchText);

  const relatedPackageNames = flatten(relatedWords.map(
    synonym => getPackageNameVariants(synonym)
  ));

  const relatedPackageDetails = await Promise.all(
    relatedPackageNames.map(
      packageName => getPackageDetails(packageName)
    )
  );

  const suggestedPackageNames = relatedPackageDetails
    .filter(pkg => pkg.isAvailable)
    .map(pkg => pkg.name);

  return suggestedPackageNames;
}
