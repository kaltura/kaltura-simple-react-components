import React from "react";

export interface PlayerProps {
  kalturaServiceUrl?: string; // the URL to access the Kaltura service on, defaults to: https://cdnapi-ev.kaltura.com
  partnerId: number; // the Kaltura account id (KMC>Integration Settings>Partner ID)
  uiConfId: number; // the Kaltura Player instance id (KMC>Studio)
  ks: string; // the Kaltura Session to pass when rendering the Kaltura Video Players
  entryId: string; // the id of the KalturaEntry to load
  playerId: string; // the id of the Kaltura Player instance that will be created (the id of the div that will be passed to KalturaPlayer.setup)
  autoPlay?: boolean; // should the video start playing immediately?
  preLoad?: string; // should the video start loading immediately?
  startingVolume?: number; // initial volume for the video player
  hideLoadingSpinner?: boolean; // should the loading spinner be hidden?
  hideBigPlayButton?: boolean; // should the big play button be hidden?
  onError?: ((event: ErrorEvent) => void) | null; // function to call when there's an error
  onMouseEnter?:
    | ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
    | null; // function to call when mouse enters the player
  onMouseLeave?:
    | ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
    | null; // function to call when mouse leaves the player
  startTime?: number; // starting time for the video
  posterImg?: string; // URL of the image to show before the video starts
  width?: string; // width of the player
  height?: string; // height of the player
  index?: number; // index of the player (integer, used to ease management of players within a sequence gallery)
  isPlaying?: boolean; // should the player be playing? alternative way is to use playKalturaPlayer/pauseKalturaPlayer hooks
  seekTo?: number; // integer, seek the player to this time (changes currentTime), alternative way is to use playKalturaPlayer hook
}
export const Player: React.FC<PlayerProps>;

type RefObject = {
  video_transcript_segment: string; // the segment from the video transcript that best correlates to the sentence in the model_answer
  sentence_from_model_answer: string; // the sentence from the model answer that this segment correlates to
  entry_id: string; // the Kaltura Entry ID of the best reference video that correlates to this particular sentence from the AI model's answer
  segment_title: string; // a title corresponding to this video segment, to show the primary topic discussed
  time: number; // integer, seconds, indicates the start time in the video entry, where the segment that best correlates to this particular sentence from the AI model's answer can be found
  score: number; // float, between 0 to 1, indicates the confidence score for how relevant this particular video segment really was to this particular sentence from the model_answer. 0 is very confident, 1 is not confident at all.
};
export interface PlayersGalleryProps {
  data: {
    model_answer: string; // the search query result as returned from the search AI model aka the answer
    entry_id: string; // the Kaltura Entry ID of the best reference video that correlates to the entire AI model's answer
    time: number; // integer, seconds, indicates the start time in the video entry, where the segment that best correlates to the AI model's answer can be found
    score: number; // float, between 0 to 1, indicates the confidence score for how relevant the answer really was. 0 is very confident, 1 is not confident at all.
    ref: RefObject[]; // array of video segments that can be used as inline references for each line in the model_answer
  };
  playerIdTemplate?: string; // PlayersGallery will use this naming conversion to create player nodes: {playerIdTemplate}_{i} i being incrementing integer starting 0
  kalturaServiceUrl?: string; // the URL to access the Kaltura service on, defaults to: https://cdnapi-ev.kaltura.com
  partnerId: number; // the Kaltura account id (KMC>Integration Settings>Partner ID)
  uiConfId: number; // the Kaltura Player instance id (KMC>Studio)
  ks: string; // the Kaltura Session to pass when rendering the Kaltura Video Players
  preLoad?: string; // should the video players start loading the video when rendering (true) or upon first play (false)? Note: if you're hiding the video thumbnail in CSS this is recommended to be true.
  startingVolume?: number; // what should be the volume the video players will start with (0-1)
  shouldPlayOnHover?: boolean; // should the video players play when the user hover over them and pause when the user mouse leaves the boundaries of the player?
  onHover?: (index: number | null) => void; // an optional function that the parent can call in order to handle the event of hovering a specific gallery item (if index is not null) or when the mouse leaved the item and hover ends (if index is null)
}
export const PlayersGallery: React.FC<PlayersGalleryProps>;

export interface SearchResultsWithGalleryProps {
  searchQuery: string; // what text should be searched in Kaltura using the AI search API?
  searchApiBearerToken?: string; // the bearer token for using the AI search API, defaults to: ''
  isSearching: boolean; // if true will start fetching new data, if false will not render the results yet
  setIsSearching?: (searching: boolean) => void; // function to set isSearching state in parent component
  kalturaServiceUrl?: string; // the URL to access the Kaltura service on, defaults to: https://cdnapi-ev.kaltura.com
  searchApiUrl?: string; // the URL to use for making the search API call, defaults to: http://localhost/search_api_mock.json
  partnerId: number; // the Kaltura account id (KMC>Integration Settings>Partner ID)
  uiConfId: number; // the Kaltura Player instance id (KMC>Studio)
  ks: string; // the Kaltura Session to pass when rendering the Kaltura Video Players
  playerIdTemplate?: string; // PlayersGallery will use this naming conversion to create player nodes: {playerIdTemplate}_{i} i being incrementing integer starting 0
  startInAutoPlay?: boolean; // should video players start with autoPlay?
  shouldPlayOnHover?: boolean; // should the video players play when the user hover over them and pause when the user mouse leaves the boundaries of the player?
  preLoad?: string; // should the video players start loading the video when rendering (true) or upon first play (false)? Note: if you're hiding the video thumbnail in CSS this is recommended to be true.
  startingVolume?: number; // what should be the volume the video players will start with (0-1)
}
export const SearchResultsWithGallery: React.FC<SearchResultsWithGalleryProps>;

export interface EmbeddedKalturaSearchViewProps {
  kalturaServiceUrl?: string; // the URL to access the Kaltura service on, defaults to: https://cdnapi-ev.kaltura.com
  searchApiUrl?: string; // the URL to use for making the search API call, defaults to: http://localhost/search_api_mock.json
  searchApiBearerToken?: string; // the bearer token for using the AI search API, defaults to: ''
  partnerId: number; // the Kaltura account id (KMC>Integration Settings>Partner ID)
  uiConfId: number; // the Kaltura Player instance id (KMC>Studio)
  ks: string; // the Kaltura Session to pass when rendering the Kaltura Video Players
  playerIdTemplate?: string; // PlayersGallery will use this naming conversion to create player nodes: {playerIdTemplate}_{i} i being incrementing integer starting 0
  startInAutoPlay?: boolean; // should video players start with autoPlay?
  shouldPlayOnHover?: boolean; // should the video players play when the user hover over them and pause when the user mouse leaves the boundaries of the player?
  preLoad?: string; // should the video players start loading the video when rendering (true) or upon first play (false)? Note: if you're hiding the video thumbnail in CSS this is recommended to be true.
  startingVolume?: number; // what should be the volume the video players will start with (0-1)
}
export const EmbeddedKalturaSearchView: React.FC<EmbeddedKalturaSearchViewProps>;
