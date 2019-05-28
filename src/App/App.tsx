import React from 'react';
import * as styles from './App.styles';
import { setState } from '../utils/react';
import { BounceLoader as Spinner } from 'react-spinners';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { getProp } from 'typed-get-prop';
import { flatten, uniq } from 'lodash';
import { HeaderLogo } from '../HeaderLogo/HeaderLogo';
import { ScreenSize } from '../ScreenSize/ScreenSize';

interface Props {
}

interface SearchResult {
  match: string | undefined;
  suggestions: string[];
}

interface State {
  lastSearchText: string;
  searching: boolean;
  searchText: string;
  searchResult?: SearchResult;
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

  private searchTextToPackageNameVariants = (text: string) => {
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

  private getRelatedWords = async (word: string) => {
    const words = word
      .replace(/[-_]/gm, ' ')
      .replace(/\s+/gm, '+');
    const url = `https://api.datamuse.com/words?ml=${words}`;
    const response = await fetch(url);
    const results = await response.json() as { word: string }[];
    return results.map(result => result.word);
  };

  private isPackageNameAvailable = async (packageName: string) => {
    const url = `https://api.npms.io/v2/search?q=${packageName}`;
    const response = await fetch(url);
    const apiResult: any = (await response.json());
    const isAvailable = !apiResult.results.some((result: any) => result.package.name === packageName);
    return isAvailable;
  }

  private handleSearchBoxChange = (event: React.ChangeEvent<FormControl>) => {
    this.setState({
      searchText: (event.target as any as HTMLInputElement).value
    });
  }

  private getAvailabilityOfPackages = async (packageNames: string[]) => Promise.all(
    packageNames.map(async packageName => ({
      packageName,
      isAvailable: await this.isPackageNameAvailable(packageName)
    }))
  );

  private getSuggestedPackageNames = async () => {
    const relatedWords = (await this.getRelatedWords(this.state.searchText));
    const relatedPackageNames = flatten(relatedWords.map(
      synonym => this.searchTextToPackageNameVariants(synonym)
    ));
    const relatedPackageAvailability = await this.getAvailabilityOfPackages(relatedPackageNames);
    const suggestions = relatedPackageAvailability
      .filter(pkg => pkg.isAvailable)
      .map(pkg => pkg.packageName);
    return suggestions;
  }

  private search = async (event: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    event.preventDefault();

    if (this.state.searching) {
      return;
    }

    const searchText = this.state.searchText;

    await setState(this, {
      searching: true,
      lastSearchText: searchText
    });

    try {
      const matchingPackageNames = this.searchTextToPackageNameVariants(searchText);
      const matchingPackageAvailability = await this.getAvailabilityOfPackages(matchingPackageNames);

      const firstAvailableMatchingPackage = matchingPackageAvailability.find(pkg => pkg.isAvailable);
      if (firstAvailableMatchingPackage) {
        await setState(this, {
          searching: false,
          searchResult: {
            match: firstAvailableMatchingPackage.packageName,
            suggestions: []
          }
        });
        return;
      }

      const suggestions = await this.getSuggestedPackageNames();

      await setState(this, {
        searching: false,
        searchResult: {
          match: '',
          suggestions
        },
      });

    } catch (err) {
      setState(this, {
        searching: false,
        searchResult: {
          match: '',
          suggestions: []
        }
      });
    }
  }

  renderAvailable(packageName: string) {
    return (
      <>
        <h3 className={styles.available}>
          Good news, {packageName} is available!
        </h3>
      </>
    );
  }

  renderUnavailable({ lastSearchText, suggestions }: { lastSearchText: string, suggestions: string[] }) {
    return (
      <>
        <h3 className={styles.unavailable}>
          Sorry, {lastSearchText} is unavailable.
        </h3>
        <p>
          Here are some related package names that are available.
        </p>
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
    const searchMatch = getProp(this.state, 'searchResult', 'match');
    const suggestions = getProp(this.state, 'searchResult', 'suggestions') || [];
    const lastSearchText = this.state.lastSearchText;
    const isNoMatch = !searchMatch && !!lastSearchText;
    console.log({
      isNoMatch,
      lastSearchText,
      searchMatch,
    });

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
            <ScreenSize>
              {({ size }) => (
                <InputGroup className={styles.searchGroup}>
                  <FormControl
                    autoFocus={true}
                    aria-label="Package name"
                    disabled={this.state.searching}
                    onChange={this.handleSearchBoxChange}
                    placeholder="Package name"
                    value={this.state.searchText}
                  />
                  {
                    (size.width >= styles.showSearchButtonAtScreenWidth) && (
                      <InputGroup.Append className={styles.searchButton}>
                        <Button
                          disabled={this.state.searching || !hasSearchText}
                          onClick={this.search}
                          variant="dark"
                        >Search</Button>
                      </InputGroup.Append>
                    )
                  }
                </InputGroup>
              )}
            </ScreenSize>
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
                  (!!searchMatch) && this.renderAvailable(searchMatch)
                }

                {
                  isNoMatch && (
                    this.renderUnavailable({
                      lastSearchText: this.state.lastSearchText,
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
