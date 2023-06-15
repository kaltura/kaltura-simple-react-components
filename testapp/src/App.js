import { EmbeddedKalturaSearchView } from "@kaltura/simple-react-components";
import React, { useEffect, useState } from "react";
import "./style.css";
import config from './config.json'; // adjust path to where you've created your config.json file

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Powered Video Search</h1>
      </header>
      <EmbeddedKalturaSearchView
        playerIdTemplate={config.playerIdTemplate}
        kalturaServiceUrl={config.kalturaServiceUrl}
        searchApiUrl={config.searchApiUrl}
        searchApiBearerToken={config.searchApiBearerToken}
        partnerId={config.partnerId}
        uiConfId={config.uiConfId}
        startInAutoPlay={config.startInAutoPlay}
        shouldPlayOnHover={config.shouldPlayOnHover}
        preLoad={config.preLoad}
        startingVolume={config.startingVolume}
        ks={config.ks}
      />
    </div>
  );
}

export default App;
