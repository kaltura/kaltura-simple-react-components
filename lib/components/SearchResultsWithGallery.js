import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import PlayersGallery from "./PlayersGallery";
import "./SearchResultsWithGallery.css";

// how long (ms) should we wait before we treat mouseener as an intentional hover vs. just passing by
const MOUSE_LEAVE_DELAY = 100;

/**
 * @component
 * @name SearchResultsWithGallery
 * @description Simple view for displaying search results with an integrated Kaltura Players gallery and interactive search sentences.
 * The search results data is fetched from a server based on the 'searchQuery' prop.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.searchQuery - The text to be searched in Kaltura using the AI search API.
 * @param {boolean} props.isSearching - If true, the component will start fetching new data. If false, it will not render the results yet.
 * @param {function} [props.setIsSearching] - Function to set isSearching state in parent component.
 * @param {string} [props.searchApiUrl="http://localhost/search_api_mock.json"] - The URL to use for making the search API call.
 * @param {string} [props.kalturaServiceUrl="https://cdnapi-ev.kaltura.com"] - The URL to access the Kaltura service on.
 * @param {(number|string)} props.partnerId - The Kaltura account id (KMC>Integration Settings>Partner ID).
 * @param {(number|string)} props.uiConfId - The Kaltura Player instance id (KMC>Studio).
 * @param {string} props.ks - The Kaltura Session to pass when rendering the Kaltura Video Players.
 * @param {string} [props.playerIdTemplate="kaltura_player"] - Naming convention to create player nodes: {playerIdTemplate}_{i} with i being an incrementing integer starting at 0.
 * @param {boolean} [props.startInAutoPlay=false] - If true, video players will start with autoPlay.
 * @param {boolean} [props.shouldPlayOnHover=true] - If true, the video players will play when the user hovers over them and pause when the user's mouse leaves the boundaries of the player.
 * @param {string} [props.preLoad="auto"] - If true, the video players will start loading the video when rendering, if false, upon first play. Note: if you're hiding the video thumbnail in CSS, this is recommended to be true.
 * @param {number} [props.startingVolume=1] - The starting volume of the video players (range: 0-1).
 *
 * @state {object|null} data - The data returned from the fetch results API call.
 * @state {boolean} isLoading - Indicates whether the component is currently fetching data.
 * @state {Error|null} error - An error object if the fetch results API call failed, otherwise null.
 * @state {number|null} highlightedIndex - The index of the currently highlighted sentence.
 * @state {boolean} isFetched - Indicates whether the data has been fetched.
 * @state {number|null} hoverTimerId - The ID of the timer set when hovering over a sentence.
 * @state {boolean} isHovering - Indicates whether the mouse is currently hovering over a sentence.
 *
 * @example
 * ```jsx
 * <SearchResultsWithGallery
 *   searchQuery="OpenAI"
 *   isSearching={true}
 *   setIsSearching={setIsSearching}
 *   partnerId={123456}
 *   uiConfId={789123}
 *   ks="kaltura_session"
 * />
 * ```
 *
 * @returns {JSX.Element} A rendered SearchResultsWithGallery component.
 *
 * @throws Will throw an error if the search API request fails.
 */
const SearchResultsWithGallery = (props) => {
  const videoListRef = useRef();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  const [hoverTimerId, setHoverTimerId] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  /**
   * Effect hook for fetching search results when 'isSearching' prop changes to true
   */
  useEffect(() => {
    if (props.isSearching) {
      setIsFetched(false);
      fetchResults();
    }
  }, [props.isSearching, props.searchQuery]);

  /**
   * Perform a search API call, fetch the search results, and process the response
   */
  const fetchResults = () => {
    setData(null);
    setIsLoading(true);
    fetch(
      props.searchApiUrl && props.searchApiUrl !== ""
        ? props.searchApiUrl
        : "http://localhost/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchquery: props.searchQuery }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        const thumbnailRefs = [];
        data.ref = data.ref.map((ref) => {
          thumbnailRefs.push(React.createRef());
          ref.entry_thumbnail = `${props.kalturaServiceUrl}/p/${props.partnerId}/thumbnail/entry_id/${ref.entry_id}/vid_sec/${ref.time}`;
          ref.uniqueGuiId = uuidv4();
          return ref;
        });
        setData(data);
        setIsLoading(false);
        setError(null);
        setIsFetched(true);
        props.setIsSearching(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
        props.setIsSearching(false);
      });
  };

  /**
   * when a specific sentence is hovered, or when the respective video correlated to this sentence is hovered, highlight the sentence
   */
  const highlightSentence = (index) => {
    setHighlightedIndex(index);
    if (data && data.ref && data.ref[index]) {
      videoListRef.current.playKalturaPlayerByUniqueId(
        data.ref[index].uniqueGuiId,
        data.ref[index].time
      );
    }
  };

  /**
   * when the mouse leaves the sentence or correlated video, remove the highlight from the sentence
   */
  const removeHighlight = () => {
    if (
      highlightedIndex !== null &&
      data &&
      data.ref &&
      data.ref[highlightedIndex]
    ) {
      videoListRef.current.pauseKalturaPlayerByUniqueId(
        data.ref[highlightedIndex].uniqueGuiId
      );
    }
    setHighlightedIndex(null);
  };

  /**
   * when a specific sentence was hovered on
   */
  const onMouseEnter = (index) => {
    let timerId = setTimeout(() => {
      setIsHovering(true);
      highlightSentence(index);
    }, MOUSE_LEAVE_DELAY);
    setHoverTimerId(timerId);
  };

  /**
   * when the mouse leaves the currently hovered sentence
   */
  const onMouseLeave = () => {
    clearTimeout(hoverTimerId);
    setHoverTimerId(null);
    setIsHovering(false);
    if (highlightedIndex !== null) {
      removeHighlight();
    }
  };

  /**
   * when a search is executed and we're waiting for response, present a loading message
   */
  if (isLoading) {
    return (
      <div className="react_kaltura_search_results_msg_loading react_kaltura_search_results_msg">
        Loading...
      </div>
    );
  }

  /**
   * when a search failed, show the error
   */
  if (error) {
    return (
      <div className="react_kaltura_search_results_msg_error react_kaltura_search_results_msg">
        Error: {error.message}
      </div>
    );
  }

  /**
   * when the component loads and there is no search data yet, show a message to encourage the user to start a search
   */
  if (!data) {
    return (
      <div className="react_kaltura_search_results_msg react_kaltura_search_results_msg_hint">
        Ask a question. For example: What are the key topics discussed across
        all videos?
      </div>
    );
  }

  /**
   * Render the search results view.
   */
  return (
    <div className="react_kaltura_search_results_container">
      <PlayersGallery
        ref={videoListRef}
        data={data}
        playerIdTemplate={`${props.playerIdTemplate}`}
        autoPlay={props.startInAutoPlay}
        kalturaServiceUrl={props.kalturaServiceUrl}
        partnerId={props.partnerId}
        uiConfId={props.uiConfId}
        preLoad={props.preLoad}
        startingVolume={props.startingVolume}
        ks={props.ks}
        shouldPlayOnHover={props.shouldPlayOnHover}
        onHover={highlightSentence}
      />
      <div className="react_kaltura_search_results_sentences_container">
        {(data?.ref || []).map(
          (refObj, index, array) => (
            <div
              key={index}
              className={
                index === highlightedIndex
                  ? "react_kaltura_search_results_sentence_highlighted"
                  : "react_kaltura_search_results_sentence"
              }
              onMouseEnter={() => onMouseEnter(index)}
              onMouseLeave={() => onMouseLeave()}
            >
              <span className="react_kaltura_search_results_sentence_clear">
                {refObj.sentence_from_model_answer
                  .split("\n")
                  .map((text, i) =>
                    i > 0 ? (
                      <React.Fragment key={i}>{text}</React.Fragment>
                    ) : (
                      text
                    )
                  )}
              </span>
              <span className="react_kaltura_search_results_sentence_expanded_content">
                {refObj.video_transcript_segment}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

SearchResultsWithGallery.propTypes = {
  searchQuery: PropTypes.string.isRequired, // what text should be searched in Kaltura using the AI search API?
  isSearching: PropTypes.bool.isRequired, // if true will start fetching new data, if false will not render the results yet
  setIsSearching: PropTypes.func, // Function to set isSearching state in parent component
  searchApiUrl: PropTypes.string, // the URL to use for making the search API call, defaults to: http://localhost/search_api_mock.json
  kalturaServiceUrl: PropTypes.string, // the URL to access the Kaltura service on, defaults to: https://cdnapi-ev.kaltura.com
  partnerId: PropTypes.number.isRequired, // or string, based on the actual data type
  uiConfId: PropTypes.number.isRequired, // or string, based on the actual data type
  ks: PropTypes.string.isRequired, // the Kaltura Session to pass when rendering the Kaltura Video Players
  playerIdTemplate: PropTypes.string, // PlayersGallery will use this naming conversion to create player nodes: {playerIdTemplate}_{i} i being incrementing integer starting 0
  startInAutoPlay: PropTypes.bool, // should video players start with autoPlay?
  shouldPlayOnHover: PropTypes.bool, // should the video players play when the user hover over them and pause when the user mouse leaves the boundaries of the player?
  preLoad: PropTypes.string, // should the video players start loading the video when rendering (true) or upon first play (false)? Note: if you're hiding the video thumbnail in CSS this is recommended to be true.
  startingVolume: PropTypes.number, // what should be the volume the video players will start with (0-1)
};

SearchResultsWithGallery.defaultProps = {
  playerIdTemplate: "kaltura_player",
  kalturaServiceUrl: "https://cdnapi-ev.kaltura.com",
  searchApiUrl: "http://localhost/search_api_mock.json",
  startInAutoPlay: false,
  shouldPlayOnHover: true,
  preLoad: "auto",
  startingVolume: 1,
};

export default SearchResultsWithGallery;
