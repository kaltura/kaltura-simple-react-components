import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SearchResultsWithGallery from "./SearchResultsWithGallery";
import "./EmbeddedKalturaSearchView.css";

/**
 * @component
 * @name EmbeddedKalturaSearchView
 * @description Embedded Kaltura search view with an input search query, and summarized search answer with interactive sentences and Kaltura Players.
 *
 * @prop {string} [props.kalturaServiceUrl="https://cdnapi-ev.kaltura.com"] - The URL to access the Kaltura service on.
 * @prop {string} [props.searchApiUrl="http://localhost/search_api_mock.json"] - The URL to use for making the search API call.
 * @prop {number} props.partnerId - The Kaltura account id (KMC>Integration Settings>Partner ID).
 * @prop {number} props.uiConfId - The Kaltura Player instance id (KMC>Studio).
 * @prop {string} props.ks - The Kaltura Session to pass when rendering the Kaltura Video Players.
 * @prop {string} [props.playerIdTemplate="kaltura_player"] - Naming convention to create player nodes: {playerIdTemplate}_{i} with i being an incrementing integer starting at 0.
 * @prop {boolean} [props.startInAutoPlay=false] - Should video players start with autoPlay?
 * @prop {boolean} [props.shouldPlayOnHover=true] - Should the video players play when the user hover over them?
 * @prop {string} [props.preLoad="auto"] - Should the video players start loading the video when rendering or upon first play?
 * @prop {number} [props.startingVolume=1] - The starting volume the video players (0-1).
 *
 * @state {string} searchQuery - The current search query.
 * @state {string} lastSearchQuery - The last search query that was sent.
 * @state {boolean} isSearching - Indicates whether the search is in progress.
 *
 * @example
 * ```jsx
 * <EmbeddedKalturaSearchView
 *  kalturaServiceUrl="https://cdnapi-ev.kaltura.com"
 *  searchApiUrl="http://localhost/search_api_mock.json"
 *  partnerId={123456}
 *  uiConfId={123456}
 *  ks="abcd1234"
 *  playerIdTemplate="kaltura_player"
 *  startInAutoPlay={false}
 *  shouldPlayOnHover={true}
 *  preLoad="auto"
 *  startingVolume={1}
 * />
 * ```
 *
 * @returns {JSX.Element} Returns a search input field and the `SearchResultsWithGallery` component,
 * along with some additional UI elements, all wrapped in a div element.
 *
 * @throws Will throw an error if the required props (`partnerId`, `uiConfId`, `ks`) are not provided.
 */
const EmbeddedKalturaSearchView = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (lastSearchQuery) {
      setIsSearching(true);
    }
  }, [lastSearchQuery]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim() !== "" && searchQuery !== lastSearchQuery) {
      setIsSearching(true);
      setLastSearchQuery(searchQuery);
    }
  };

  const {
    kalturaServiceUrl = "https://cdnapi-ev.kaltura.com",
    searchApiUrl = "http://localhost/search_api_mock.json",
    partnerId,
    uiConfId,
    ks,
    startInAutoPlay = false,
    shouldPlayOnHover = true,
    playerIdTemplate = "kaltura_player",
    preLoad = "auto",
    startingVolume = 1,
  } = props;

  /**
   * Render the embedded search view component.
   */
  return (
    <div className="react_kaltura_embedded_search">
      <div className="react_kaltura_embedded_search_prompt_container">
        <div className="react_kaltura_embedded_search_prompt_input_container">
          <input
            className="react_kaltura_embedded_search_prompt_input"
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className="react_kaltura_embedded_search_prompt_submit"
            onClick={handleSearchClick}
          >
            <div className="react_kaltura_embedded_search_prompt_submit_svg"></div>
          </button>
        </div>
      </div>
      <SearchResultsWithGallery
        setIsSearching={setIsSearching}
        searchQuery={lastSearchQuery}
        isSearching={isSearching}
        playerIdTemplate={`${playerIdTemplate}`}
        autoPlay={startInAutoPlay}
        kalturaServiceUrl={kalturaServiceUrl}
        searchApiUrl={searchApiUrl}
        partnerId={partnerId}
        uiConfId={uiConfId}
        preLoad={preLoad}
        startingVolume={startingVolume}
        ks={ks}
        shouldPlayOnHover={shouldPlayOnHover}
      />
      {lastSearchQuery && (
        <p>Hover the results to watch the respective video</p>
      )}
    </div>
  );
};

EmbeddedKalturaSearchView.propTypes = {
  kalturaServiceUrl: PropTypes.string, // the URL to access the Kaltura service on, defaults to: https://cdnapi-ev.kaltura.com
  searchApiUrl: PropTypes.string, // the URL to use for making the search API call, defaults to: http://localhost/search_api_mock.json
  partnerId: PropTypes.number.isRequired, // or string, based on the actual data type
  uiConfId: PropTypes.number.isRequired, // or string, based on the actual data type
  ks: PropTypes.string.isRequired, // the Kaltura Session to pass when rendering the Kaltura Video Players
  playerIdTemplate: PropTypes.string, // VideoList will use this naming conversion to create player nodes: {playerIdTemplate}_{i} i being incrementing integer starting 0
  startInAutoPlay: PropTypes.bool, // should video players start with autoPlay?
  shouldPlayOnHover: PropTypes.bool, // should the video players play when the user hover over them and pause when the user mouse leaves the boundaries of the player?
  preLoad: PropTypes.string, // should the video players start loading the video when rendering (true) or upon first play (false)? Note: if you're hiding the video thumbnail in CSS this is recommended to be true.
  startingVolume: PropTypes.number, // what should be the volume the video players will start with (0-1)
};

EmbeddedKalturaSearchView.defaultProps = {
  playerIdTemplate: "kaltura_player",
  kalturaServiceUrl: "https://cdnapi-ev.kaltura.com",
  searchApiUrl: "http://localhost:8001/search",
  startInAutoPlay: false,
  shouldPlayOnHover: true,
  preLoad: "auto",
  startingVolume: 1,
};

export default EmbeddedKalturaSearchView;
