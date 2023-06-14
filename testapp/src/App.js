import { EmbeddedKalturaSearchView } from "@kaltura/simple-react-components";
import React from "react";
import "./style.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Powered Video Search</h1>
      </header>
      <EmbeddedKalturaSearchView
        playerIdTemplate="kaltura_player"
        kalturaServiceUrl={"https://cdnapi-ev.kaltura.com"}
        searchApiUrl={"xxx"}
        searchApiBearerToken={"xxx"}
        partnerId={000000}
        uiConfId={000000}
        startInAutoPlay={false}
        shouldPlayOnHover={true}
        preLoad="auto"
        startingVolume={1}
        ks="xxx"
      />
    </div>
  );
}

export default App;
