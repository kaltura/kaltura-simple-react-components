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
        searchApiUrl="http://localhost:8001/search"
        partnerId={4776232}
        uiConfId={52664812}
        startInAutoPlay={false}
        shouldPlayOnHover={true}
        preLoad="auto"
        startingVolume={1}
        ks="djJ8NDc3NjIzMnxWcgFy4N0TZxQJyKTcuEK5PqwVzCV2PRzx5QA38oZpdhwB7BmkCSWdkFCRuFi5TeS-FbygEfu6F83Zu19l2so1xrzP84SP6_mUj_PMtRygivaozvlFslmgpIXClcMH7ZVXCZWp0Se4c1W0MI7oAt-BdKg9AGICL_2ngoLb5H7yaQ=="
      />
    </div>
  );
}

export default App;
