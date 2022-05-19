import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import moment from "moment";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import {
  BooleanFacet,
  Layout,
  SingleLinksFacet,
  SingleSelectFacet
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new AppSearchAPIConnector({
  searchKey:
    process.env.REACT_APP_SEARCH_KEY || "PRIVATE_KEY",
  engineName: process.env.REACT_APP_SEARCH_ENGINE_NAME || "twitter-demo",
  endpointBase:
    process.env.REACT_APP_SEARCH_ENDPOINT_BASE || "http://localhost:3002"
});

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    result_fields: {
      url: { raw: {} },
      text: { raw: {} },
      like_count: { raw: {} },
      reply_count: { raw: {} },
      retweet_count: { raw: {} },
      index: { raw: {} },
      created_at: { raw: {} }
    },
    disjunctiveFacets: ["index"],
    facets: {
      index: { type: "value" },
      created_at: {
        type: "range",
        ranges: [
          {
            from: moment().subtract(5, "days").toISOString(),
            name: "Within the last 5 days"
          },
          {
            from: moment().subtract(5, "days").toISOString(),
            to: moment().subtract(10, "days").toISOString(),
            name: "5 - 10 days ago"
          },
          {
            to: moment().subtract(10, "days").toISOString(),
            name: "More than 10 days ago"
          }
        ]
      }
    }
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      result_fields: {
        text: {
          snippet: {
            size: 100,
            fallback: true
          }
        },
        url: {
          raw: {}
        }
      }
    },
    suggestions: {
      types: {
        documents: {
          fields: ["text"]
        }
      },
      size: 4
    }
  }
};

const SORT_OPTIONS = [
  {
    name: "Relevance",
    value: []
  },
  {
    name: "Date",
    value: [
      {
        field: "created_at",
        direction: "desc"
      }
    ]
  },
  {
    name: "Like",
    value: [
      {
        field: "like_count",
        direction: "desc"
      }
    ]
  },
  {
    name: "Retweet",
    value: [
      {
        field: "retweet_count",
        direction: "desc"
      }
    ]
  }
];

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched }) => ({
          wasSearched
        })}
      >
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={
                    <SearchBox
                      autocompleteMinimumCharacters={3}
                      autocompleteResults={{
                        linkTarget: "_blank",
                        sectionTitle: "",
                        titleField: "",
                        urlField: "url",
                        shouldTrackClickThrough: true,
                        clickThroughTags: ["test"]
                      }}
                      autocompleteSuggestions={true}
                      debounceLength={0}
                    />
                  }
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting label={"Sort by"} sortOptions={SORT_OPTIONS} />
                      )}
                      <Facet
                        field="created_at"
                        label="Date Created"
                        filterType="any"
                      />
                      <Facet field="index" label="Label" filterType="any" />
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField="text"
                      urlField="url"
                      shouldTrackClickThrough={true}
                    />
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
