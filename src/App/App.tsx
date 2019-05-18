import React from 'react';
import logoUrl from './logo.png';
import * as styles from './App.styles';
import { setState } from '../utils/react';

interface Props {
}

interface SearchResult {
  packageName: string;
  isAvailable: boolean;
}

interface State {
  searching: boolean;
  searchText: string;
  searchResults?: SearchResult[];
}

class App extends React.Component<Props, State> {
  readonly state: State = {
    searching: false,
    searchText: ''
  };

  private getSynonyms = async (word: string) => {
    const words = word
      .replace(/[-_]/gm, ' ')
      .replace(/\s+/gm, '+');
    const url = `https://api.datamuse.com/words?ml=${words}`;
    const response = await fetch(url);
    const synonyms = await response.json() as { word: string }[];
    synonyms.splice(20, 1000);
    return synonyms;
  };

  private isPackageNameAvailable = async (packageName: string) => {
    const url = `https://api.npms.io/v2/search?q=${packageName}`;
    const response = await fetch(url);
    const apiResult: any = (await response.json());
    const isAvailable = !apiResult.results.some((result: any) => result.package.name === packageName);
    return isAvailable;
  }

  private handleSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchText: event.target.value
    });
  }

  private search = async (event: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    event.preventDefault();

    if (this.state.searching) {
      return;
    }

    await setState(this, {
      searching: true
    });

    try {
      const synonyms = (await this.getSynonyms(this.state.searchText))
        .map(synonym => synonym.word);

      const packageNames = [this.state.searchText].concat(synonyms);

      const searchResults = await Promise.all(packageNames.map(async packageName => ({
        packageName,
        isAvailable: await this.isPackageNameAvailable(packageName)
      })));

      await setState(this, {
        searching: false,
        searchResults,
      });

    } catch (err) {
      setState(this, {
        searching: false,
        searchResults: undefined
      });
    }
  }

  render() {
    return (
      <div className={styles.app}>
        <header>
          <img
            alt="NPM Name Finder"
            className={styles.logo}
            src={logoUrl}
          />
          <p>
            Quickly find
            the <span className={styles.perfectText}>perfect</span> <span className={styles.availableText}>available</span> name
            for your new NPM package.
          </p>
        </header>

        <section className={styles.search}>
          <form onSubmit={this.search}>
            <input
              className={styles.searchBox}
              id="searchBox"
              onChange={this.handleSearchBoxChange}
              placeholder="Package name"
              type="text"
              value={this.state.searchText}
            />
            <button
              className={styles.searchButton}
              disabled={this.state.searching}
              onClick={this.search}
            >Search</button>
          </form>
        </section>

        <section className={styles.results}>
          <ul>
            {
              this.state.searchResults ?
                this.state.searchResults.map(searchResult => (
                  <li
                    className={
                      searchResult.isAvailable ?
                        styles.available :
                        styles.unavailable
                    }
                    key={searchResult.packageName}
                  >
                    {searchResult.packageName}
                  </li>
                )) : null
            }
          </ul>
        </section>
      </div>
    );
  }
}

export default App;
