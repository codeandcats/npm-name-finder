import React from 'react';
import * as styles from './App.styles';
import { setState } from '../utils/react';
import { BounceLoader as Spinner } from 'react-spinners';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { getProp } from 'typed-get-prop';
import { flatten, uniq } from 'lodash';
import { HeaderLogo } from '../HeaderLogo/HeaderLogo';
import { PackageDetails, getPackageNameVariants, getPackageDetails, getAllPackageDetails } from '../utils/npm';
import { getSuggestedPackageNames } from '../utils/suggestions';

interface Props {
}

interface SearchResult {
  matches: PackageDetails[];
  suggestions: string[];
}

interface State {
  lastSearchText: string;
  searching: boolean;
  searchText: string;
  searchResult?: SearchResult;
}

interface RenderUnavailableOptions {
  searchText: string;
  packageDetails: Pick<PackageDetails, 'name' | 'url'>;
  suggestions: string[];
}

class App extends React.Component<Props, State> {
  readonly state: State = {
    lastSearchText: '',
    searching: false,
    searchText: '',
  };

  // readonly state: State = {
  //   lastSearchText: 'package',
  //   searching: false,
  //   searchText: 'package',
  //   searchResult: {
  //     match: '',
  //     suggestions: [
  //       'bailout',
  //       'wrapping',
  //       'software',
  //       'bundling',
  //       'consignment',
  //       'entirety',
  //       'truckload',
  //     ]
  //   }
  // }

  // readonly state: State = {
  //   lastSearchText: 'foo bar',
  //   searching: false,
  //   searchText: 'foo bar',
  //   searchResult: {
  //     match: 'foo-bar',
  //     suggestions: [
  //     ]
  //   }
  // }

  private handleSearchBoxChange = (event: React.ChangeEvent<FormControl>) => {
    this.setState({
      searchText: (event.target as any as HTMLInputElement).value
    });
  }

  private search = async (event: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    event.preventDefault();

    if (this.state.searching) {
      return;
    }

    const { searchText } = this.state;

    await setState(this, {
      searching: true,
      lastSearchText: searchText
    });

    try {
      const packageNameVariants = getPackageNameVariants(searchText);
      const packageNameVariantDetails = await getAllPackageDetails(packageNameVariants);

      if (packageNameVariantDetails.some(pkg => pkg.isAvailable)) {
        await setState(this, {
          searching: false,
          searchResult: {
            matches: packageNameVariantDetails,
            suggestions: []
          }
        });
        return;
      }

      const suggestions = await getSuggestedPackageNames(searchText);

      await setState(this, {
        searching: false,
        searchResult: {
          matches: packageNameVariantDetails,
          suggestions
        },
      });

    } catch (err) {
      setState(this, {
        searching: false,
        searchResult: {
          matches: [],
          suggestions: []
        }
      });
    }
  }

  renderAvailable = (packageName: string) => {
    return (
      <>
        <h3 className={styles.available}>
          Good news, <span className={styles.packageName}>{packageName}</span> is available!
        </h3>
      </>
    );
  }

  renderUnavailable = ({ searchText, packageDetails, suggestions }: RenderUnavailableOptions) => {
    return (
      <>
        <h3 className={styles.unavailable}>
          Sorry, <a href={packageDetails.url} target="_blank">{searchText}</a> is unavailable.
        </h3>
        {
          suggestions.length ? (
            <p>
              Here are some related package names that are available.
            </p>
          ) : null
        }
        {this.renderSuggestions(suggestions)}
      </>
    )
  }

  renderSuggestions(suggestions: string[]) {
    return (
      suggestions.length ?
        <section className={styles.suggestions}>
          <ul>
            {
              suggestions.map(packageName => (
                <li key={packageName}>
                  {packageName}
                </li>
              ))
            }
          </ul>
        </section>
        : null
    );
  }

  render() {
    const hasSearchText = !!`${this.state.searchText}`.trim();
    const matchingPackages = getProp(this.state, 'searchResult', 'matches') || [];
    const availableMatchingPackage = matchingPackages.find(pkg => pkg.isAvailable);
    const availableMatchingPackageName = getProp(availableMatchingPackage, 'name');

    const suggestions = getProp(this.state, 'searchResult', 'suggestions') || [];
    const lastSearchText = this.state.lastSearchText;
    const isNoMatch = !availableMatchingPackageName && !!lastSearchText;

    return (
      <div className={styles.app}>
        <header>
          <HeaderLogo />

          <p className={styles.subtitle}>
            Quickly find
            the <span className={styles.perfectText}>perfect</span> okayest, <span className={styles.availableText}>available</span> name
            for your new NPM package.
          </p>
        </header>

        <section className={styles.search}>
          <form onSubmit={this.search} className={styles.searchForm}>
            <InputGroup className={styles.searchGroup}>
              <FormControl
                autoFocus={true}
                aria-label="Package name"
                disabled={this.state.searching}
                onChange={this.handleSearchBoxChange}
                placeholder="Package name"
                value={this.state.searchText}
              />
              <InputGroup.Append className={styles.searchButton}>
                <Button
                  disabled={this.state.searching || !hasSearchText}
                  onClick={this.search}
                  variant="dark"
                >Search</Button>
              </InputGroup.Append>
            </InputGroup>
          </form>
        </section>

        {
          this.state.searching ?
            <div className={styles.spinnerContainer}>
              <Spinner color="#c22" size={80} />
            </div> :
            (
              <section className={styles.results}>
                {
                  (!!availableMatchingPackageName) && this.renderAvailable(availableMatchingPackageName)
                }

                {
                  isNoMatch && (
                    this.renderUnavailable({
                      searchText: this.state.lastSearchText,
                      packageDetails: matchingPackages[0],
                      suggestions
                    })
                  )
                }
              </section>
            )
        }

        <footer className={styles.footer}>
          Copyright {(new Date()).getFullYear()} <a href="https://github.com/codeandcats">codeandcats</a>.
        </footer>
      </div>
    );
  }
}

export default App;
