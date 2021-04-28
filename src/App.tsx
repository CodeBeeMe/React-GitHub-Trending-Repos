import React from 'react';
import './css/App.css';
import { GitHubTrendingList } from './components/repos-list';


function App() {
  return (
    <div className="App">
        <GitHubTrendingList/>
    </div>
  );
}

export default App;
