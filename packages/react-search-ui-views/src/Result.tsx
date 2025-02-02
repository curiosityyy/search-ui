import React from "react";

import { appendClassName, getUrlSanitizer } from "./view-helpers";
import { SearchContextState, SearchResult } from "@elastic/search-ui";
import { BaseContainerProps } from "./types";

export type ResultContainerContext = Pick<
  SearchContextState,
  "trackClickThrough"
>;

export type ResultContainerProps = BaseContainerProps &
  ResultContainerContext & {
    view?: React.ComponentType<ResultViewProps>;
    clickThroughTags?: string[];
    titleField?: string;
    urlField?: string;
    thumbnailField?: string;
    result: SearchResult;
    shouldTrackClickThrough?: boolean;
  };

export type ResultViewProps = BaseContainerProps &
  Pick<
    ResultContainerProps,
    "result" | "titleField" | "urlField" | "thumbnailField"
  > & {
    key?: string;
    onClickLink: () => void;
  };

function isFieldValueWrapper(object) {
  return (
    object &&
    (Object.prototype.hasOwnProperty.call(object, "raw") ||
      Object.prototype.hasOwnProperty.call(object, "snippet"))
  );
}

function getFieldType(result, field, type) {
  if (result[field]) return result[field][type];
}

function getRaw(result, field) {
  return getFieldType(result, field, "raw");
}

function getSnippet(result, field) {
  return getFieldType(result, field, "snippet");
}

function htmlEscape(str) {
  if (!str) return "";

  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getEscapedField(result, field) {
  // Fallback to raw values here, because non-string fields
  // will not have a snippet fallback. Raw values MUST be html escaped.
  const safeField =
    getSnippet(result, field) || htmlEscape(getRaw(result, field));
  return Array.isArray(safeField) ? safeField.join(", ") : safeField;
}

function getEscapedFields(result) {
  return Object.keys(result).reduce((acc, field) => {
    // If we receive an arbitrary value from the response, we may not properly
    // handle it, so we should filter out arbitrary values here.
    //
    // I.e.,
    // Arbitrary value: "_metaField: '1939191'"
    // vs.
    // FieldValueWrapper: "_metaField: {raw: '1939191'}"
    if (!isFieldValueWrapper(result[field])) return acc;
    return { ...acc, [field]: getEscapedField(result, field) };
  }, {});
}

function Result({
  className,
  result,
  onClickLink,
  titleField,
  urlField,
  thumbnailField,
  ...rest
}: ResultViewProps) {
  const fields = getEscapedFields(result);
  const title = getEscapedField(result, titleField);
  const url = getUrlSanitizer(URL, location.href)(getRaw(result, urlField));
  const thumbnail = getUrlSanitizer(
    URL,
    location.href
  )(getRaw(result, thumbnailField));

  return (
    <li className={appendClassName("sui-result", className)} {...rest}>
      <div className="sui-result__header">
        {title && !url && (
          <span
            className="sui-result__title"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {title && url && (
          <a
            className="sui-result__title sui-result__title-link"
            dangerouslySetInnerHTML={{ __html: title }}
            href={url}
            onClick={onClickLink}
            target="_blank"
            rel="noopener noreferrer"
          />
        )}
      </div>

      <div className="sui-result__body">
        {thumbnail && (
          <div className="sui-result__image">
            <img src={thumbnail} alt="" />
          </div>
        )}
        <ul className="sui-result__details">
          {Object.entries(fields).map(
            ([fieldName, fieldValue]: [string, string]) => (
              <li key={fieldName}>
                <span className="sui-result__key">{fieldName}</span>{" "}
                <span
                  className="sui-result__value"
                  dangerouslySetInnerHTML={{ __html: fieldValue }}
                />
              </li>
            )
          )}
        </ul>
      </div>
    </li>
  );
}

export default Result;
