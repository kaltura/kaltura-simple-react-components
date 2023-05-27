import React from "react";
import "./style.css";
import { EmbeddedKalturaSearchView } from "@kaltura/simple-react-components";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Powered Video Search</h1>
      </header>
      <EmbeddedKalturaSearchView
        playerIdTemplate="kaltura_player"
        kalturaServiceUrl={"https://cdnapi-ev.kaltura.com"}
        partnerId={4776232}
        uiConfId={52664812}
        startInAutoPlay={false}
        shouldPlayOnHover={true}
        preLoad="auto"
        startingVolume={1}
        ks="djJ8NDc3NjIzMnydgqsvGqcYLPcGUeI3vWZFFHcN9Cq0PYyfUzNOTOgbLtYiOVUZ8gp1W0rW1tnL7aKRyKpkEHEYx5I-wtjLMnfIU9SD0WXtiG5yJa4qTjP_soLHDFeBHJfm0XsLgzTo2lc="
      />
    </div>
  );
}

export default App;
