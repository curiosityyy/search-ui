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
    process.env.REACT_APP_SEARCH_KEY || "private-doppuqbeaj4ynqi14k5symq1",
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
      like_count: {
        type: "range",
        ranges: [
          { from: 0, to: 100, name: "0 - 100" },
          { from: 101, to: 500, name: "101 - 500" },
          { from: 501, to: 1000, name: "501 - 1000" },
          { from: 1001, to: 5000, name: "1001 - 5000" },
          { from: 5001, to: 10000, name: "5001 - 10000" },
          { from: 10001, name: "10001+" }
        ]
      },
      reply_count: {
        type: "range",
        ranges: [
          { from: 0, to: 100, name: "0 - 100" },
          { from: 101, to: 500, name: "101 - 500" },
          { from: 501, to: 1000, name: "501 - 1000" },
          { from: 1001, to: 5000, name: "1001 - 5000" },
          { from: 5001, to: 10000, name: "5001 - 10000" },
          { from: 10001, name: "10001+" }
        ]
      },
      retweet_count: {
        type: "range",
        ranges: [
          { from: 0, to: 100, name: "0 - 100" },
          { from: 101, to: 500, name: "101 - 500" },
          { from: 501, to: 1000, name: "501 - 1000" },
          { from: 1001, to: 5000, name: "1001 - 5000" },
          { from: 5001, to: 10000, name: "5001 - 10000" },
          { from: 10001, name: "10001+" }
        ]
      },
      created_at: {
        type: "range",
        ranges: [
          {
            from: moment().subtract(5, "days").toISOString(),
            name: "Within the last 5 days"
          },
          {
            from: moment().subtract(30, "days").toISOString(),
            to: moment().subtract(5, "days").toISOString(),
            name: "5 - 10 days ago"
          },
          {
            from: moment().subtract(2, "months").toISOString(),
            to: moment().subtract(1, "months").toISOString(),
            name: "1 - 2 months ago"
          },
          {
            from: moment().subtract(3, "months").toISOString(),
            to: moment().subtract(2, "months").toISOString(),
            name: "2 - 3 months ago"
          },
          {
            from: moment().subtract(4, "months").toISOString(),
            to: moment().subtract(3, "months").toISOString(),
            name: "3 - 4 months ago"
          },
          {
            from: moment().subtract(5, "months").toISOString(),
            to: moment().subtract(4, "months").toISOString(),
            name: "4 - 5 months ago"
          },
          {
            from: moment().subtract(6, "months").toISOString(),
            to: moment().subtract(5, "months").toISOString(),
            name: "5 - 6 months ago"
          },
          {
            from: moment().subtract(7, "months").toISOString(),
            to: moment().subtract(6, "months").toISOString(),
            name: "6 - 7 months ago"
          },
          {
            from: moment().subtract(8, "months").toISOString(),
            to: moment().subtract(7, "months").toISOString(),
            name: "7 - 8 months ago"
          },
          {
            from: moment().subtract(9, "months").toISOString(),
            to: moment().subtract(8, "months").toISOString(),
            name: "8 - 9 months ago"
          },
          {
            from: moment().subtract(10, "months").toISOString(),
            to: moment().subtract(9, "months").toISOString(),
            name: "9 - 10 months ago"
          },
          {
            from: moment().subtract(11, "months").toISOString(),
            to: moment().subtract(10, "months").toISOString(),
            name: "10 - 11 months ago"
          },
          {
            from: moment().subtract(12, "months").toISOString(),
            to: moment().subtract(11, "months").toISOString(),
            name: "11 - 12 months ago"
          },
          {
            to: moment().subtract(12, "months").toISOString(),
            name: "12 months ago"
          },
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
          fields: ["text", "like_count", "reply_count", "retweet_count", "index"]
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
    name: "Latest",
    value: [
      {
        field: "created_at",
        direction: "desc"
      }
    ]
  },
  {
    name: "Newest",
    value: [
      {
        field: "created_at",
        direction: "asc"
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
  },
  {
    name: "Reply",
    value: [
      {
        field: "reply_count",
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
                        sectionTitle: "Results",
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
                      <Facet field="like_count" label="Like" filterType="any" />
                      <Facet field="retweet_count" label="Retweet" filterType="any" />
                      <Facet field="reply_count" label="Reply" filterType="any" />
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
