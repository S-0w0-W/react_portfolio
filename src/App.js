import React from "react";
import logo from './logo.svg';
import './App.css';
import Navigation from "./components/navBar"

// pages
import Landing from './pages/landing';
import About from './pages/about';
import Projects from './pages/projects';
import Contact from './pages/contact';

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleTab = this.handleTab.bind(this)
    this.landingRef = React.createRef();
    this.aboutRef = React.createRef();
    this.projectsRef = React.createRef();
    this.contactRef = React.createRef();
  }

  handleTab(tab){
    switch (tab) {
      case 'landing':
        this.landingRef.current.scrollIntoView()
        break
      case 'about':
        this.aboutRef.current.scrollIntoView()
        break
      case 'projects':
        this.projectsRef.current.scrollIntoView()
        break
      case 'contact':
        this.contactRef.current.scrollIntoView()
        break
    }
  }

  render(){
    return(
      <div className="App">
        <Navigation
          scrollToRef = {this.handleTab}
        />
        <div ref={this.landingRef}><Landing/></div>
        <div ref={this.aboutRef}><About/></div>
        <div ref={this.projectsRef}><Projects/></div>
        <div ref={this.contactRef}><Contact/></div>
      </div>
    )
  }
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
