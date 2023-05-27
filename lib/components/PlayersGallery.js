import React, {
  useEffect,
  useState,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
import Player from "./Player";
import "./PlayersGallery.css";

// how long (ms) should we wait before we treat mouseener as an intentional hover vs. just passing by
const MOUSE_LEAVE_DELAY = 100;

/**
 * A gallery of Kaltura Players utilizing simple divs and the Player component. You can use CSS to style and order the gallery.
 * @component
 * @param {Object} props - Component props
 * @param {Object} ref - React ref for forwarding
 */
const PlayersGallery = forwardRef(
  (
    {
      data,
      playerIdTemplate,
      partnerId,
      uiConfId,
      kalturaServiceUrl,
      ks,
      preLoad,
      startingVolume,
      shouldPlayOnHover,
      onHover,
    },
    ref
  ) => {
    const [hoverVideoId, setHoverVideoId] = useState(null);
    const [playerRefs, setPlayerRefs] = useState({});
    const [containerRefs, setContainerRefs] = useState({});
    const [playingUniqueGuiId, setPlayingUniqueGuiId] = useState(null);
    const [mouseLeaveTimeout, setMouseLeaveTimeout] = useState(null);

    /**
     * Generates player and container refs and cleanup for the mouse leave timeout.
     */
    useEffect(() => {
      const playerRefs = data.ref.reduce((acc, ref) => {
        acc[ref.uniqueGuiId] = React.createRef();
        return acc;
      }, {});
      const containerRefs = data.ref.reduce((acc, ref) => {
        acc[ref.uniqueGuiId] = React.createRef();
        return acc;
      }, {});
      setPlayerRefs(playerRefs);
      setContainerRefs(containerRefs);
      return () => {
        if (mouseLeaveTimeout) clearTimeout(mouseLeaveTimeout);
      };
    }, [data.ref]);

    /**
     * Play a Kaltura player by its unique ID.
     * @param {string} uniqueGuiId - The unique ID of the Kaltura player
     * @param {?number} seekTime - The time to seek to in the player
     */
    const playKalturaPlayerByUniqueId = (uniqueGuiId, seekTime = null) => {
      if (playerRefs[uniqueGuiId] && playerRefs[uniqueGuiId].current) {
        playerRefs[uniqueGuiId].current.playKalturaPlayer(seekTime);
        setPlayingUniqueGuiId(uniqueGuiId);
        if (containerRefs[uniqueGuiId] && containerRefs[uniqueGuiId].current) {
          containerRefs[uniqueGuiId].current.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    };

    /**
     * Pause a Kaltura player by its unique ID.
     * @param {string} uniqueGuiId - The unique ID of the Kaltura player
     */
    const pauseKalturaPlayerByUniqueId = (uniqueGuiId) => {
      if (playerRefs[uniqueGuiId] && playerRefs[uniqueGuiId].current) {
        playerRefs[uniqueGuiId].current.pauseKalturaPlayer();
        if (playingUniqueGuiId === uniqueGuiId) {
          setPlayingUniqueGuiId(null);
        }
      }
    };

    /**
     * Makes the play and pause functions accessible to parent components.
     */
    useImperativeHandle(ref, () => ({
      playKalturaPlayerByUniqueId,
      pauseKalturaPlayerByUniqueId,
    }));

    /**
     * Handle mouse enter event when the user hovers over one of the players.
     * We use a timeout of MOUSE_LEAVE_DELAY duration to prevent just passing over from triggering a play.
     * @param {Event} event - The mouse enter event
     */
    const handleMouseEnter = useCallback(
      (event) => {
        const uniqueGuiId = event.currentTarget.dataset.uniqueguiid;
        const index = data.ref.findIndex(
          (ref) => ref.uniqueGuiId === uniqueGuiId
        );
        if (mouseLeaveTimeout) clearTimeout(mouseLeaveTimeout);
        setMouseLeaveTimeout(
          setTimeout(() => {
            if (shouldPlayOnHover) {
              playKalturaPlayerByUniqueId(uniqueGuiId);
            }
            setHoverVideoId(index);
            onHover(index); // call the parent's hover event handler
          }, MOUSE_LEAVE_DELAY)
        );
      },
      [data.ref, mouseLeaveTimeout, shouldPlayOnHover]
    );

    /**
     * Handle mouse leave event when the user moves away from the currently hovered player.
     * We use a timeout of MOUSE_LEAVE_DELAY duration to prevent an accidental mouse move from causing a pause.
     * @param {Event} event - The mouse leave event
     */
    const handleMouseLeave = useCallback(
      (event) => {
        const uniqueGuiId = event.currentTarget.dataset.uniqueguiid;
        if (mouseLeaveTimeout) clearTimeout(mouseLeaveTimeout);
        setMouseLeaveTimeout(
          setTimeout(() => {
            if (shouldPlayOnHover) {
              pauseKalturaPlayerByUniqueId(uniqueGuiId);
            }
            setHoverVideoId(null);
          }, MOUSE_LEAVE_DELAY)
        );
      },
      [mouseLeaveTimeout, shouldPlayOnHover]
    );

    /**
     * Render the Players Gallery.
     */
    return (
      <div className="react_kaltura_players_gallery">
        {data.ref
          .filter((ref) => ref.entry_id !== null && ref.entry_id !== "")
          .map((ref, index) => (
            <div
              className={`react_kaltura_players_gallery_item_container ${
                playingUniqueGuiId === ref.uniqueGuiId ? "highlight" : ""
              }`}
              ref={containerRefs[ref.uniqueGuiId]}
              key={ref.uniqueGuiId}
              data-uniqueguiid={ref.uniqueGuiId}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              data-index={index}
            >
              <Player
                className="react_kaltura_players_gallery_item_player"
                key={ref.uniqueGuiId}
                uniqueGuiId={ref.uniqueGuiId}
                ref={playerRefs[ref.uniqueGuiId]}
                playerId={`${playerIdTemplate}_${ref.uniqueGuiId}`}
                index={index}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                entryId={ref.entry_id}
                posterImg={ref.entry_thumbnail}
                autoPlay={false}
                kalturaServiceUrl={kalturaServiceUrl}
                partnerId={partnerId}
                uiConfId={uiConfId}
                startTime={ref.time}
                preLoad={preLoad}
                startingVolume={startingVolume}
                ks={ks}
                hideLoadingSpinner={false}
                hideBigPlayButton={true}
                width="100%"
                height="100%"
              />
              <p className="react_kaltura_players_gallery_item_title">
                {ref.segment_title}
              </p>
            </div>
          ))}
      </div>
    );
  }
);

PlayersGallery.propTypes = {
  data: PropTypes.shape({
    // an object that includes the details of all kaltura entries to show in the gallery and related search data
    model_answer: PropTypes.string.isRequired, // the search query result as returned from the search AI model aka the answer
    entry_id: PropTypes.string.isRequired, // the Kaltura Entry ID of the best reference video that correlates to the entire AI model's answer
    time: PropTypes.number.isRequired, //integer, seconds, indicates the start time in the video entry, where the segment that best correlates to the AI model's answer can be found
    score: PropTypes.number.isRequired, // float, between 0 to 1, indicates the confidence score for how relevant the answer really was. 0 is very confident, 1 is not confident at all.
    ref: PropTypes.arrayOf(
      // array of video segments that can be used as inline references for each line in the model_answer
      PropTypes.shape({
        video_transcript_segment: PropTypes.string.isRequired, // the segment from the video transcript that best correlates to the sentence in the model_answer
        sentence_from_model_answer: PropTypes.string.isRequired, // the sentence from the model answer that this segment correlates to
        entry_id: PropTypes.string.isRequired, // the Kaltura Entry ID of the best reference video that correlates to this particular sentence from the AI model's answer
        segment_title: PropTypes.string.isRequired, // a title corresponding to this video segment, to show the primary topic discussed
        time: PropTypes.number.isRequired, // integer, seconds, indicates the start time in the video entry, where the segment that best correlates to this particular sentence from the AI model's answer can be found
        score: PropTypes.number.isRequired, // float, between 0 to 1, indicates the confidence score for how relevant this particular video segment really was to this particular sentence from the model_answer. 0 is very confident, 1 is not confident at all.
      })
    ).isRequired,
  }).isRequired,
  playerIdTemplate: PropTypes.string, // PlayersGallery will use this naming conversion to create player nodes: {playerIdTemplate}_{i} i being incrementing integer starting 0
  kalturaServiceUrl: PropTypes.string, // the URL to access the Kaltura service on, defaults to: https://cdnapi-ev.kaltura.com
  partnerId: PropTypes.number.isRequired, // the Kaltura account id (KMC>Integration Settings>Partner ID)
  uiConfId: PropTypes.number.isRequired, // the Kaltura Player instance id (KMC>Studio)
  ks: PropTypes.string.isRequired, // the Kaltura Session to pass when rendering the Kaltura Video Players
  preLoad: PropTypes.string, // should the video players start loading the video when rendering (true) or upon first play (false)? Note: if you're hiding the video thumbnail in CSS this is recommended to be true.
  startingVolume: PropTypes.number, // what should be the volume the video players will start with (0-1)
  shouldPlayOnHover: PropTypes.bool, // should the video players play when the user hover over them and pause when the user mouse leaves the boundaries of the player?
  onHover: PropTypes.func, // an optional function that the parent can call in order to handle the event of hovering a specific gallery item (if index is not null) or when the mouse leaved the item and hover ends (if index is null)
};

PlayersGallery.defaultProps = {
  playerIdTemplate: "kaltura_player",
  kalturaServiceUrl: "https://cdnapi-ev.kaltura.com",
  preLoad: "auto",
  startingVolume: 1,
  shouldPlayOnHover: false,
};

export default React.memo(PlayersGallery);
