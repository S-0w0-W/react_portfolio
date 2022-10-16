import React from "react";
import logo from './logo.svg';
import './App.css';
import Navigation from "./components/navBar"
import AOS from 'aos';
import homeLogo from "./assets/icons/icons8-home-48.png"
import aboutLogo from "./assets/icons/icons8-person-48.png"
import projectsLogo from "./assets/icons/icons8-work-48.png"
import contactLogo from "./assets/icons/icons8-phone-50.png"

// pages
import Landing from './pages/landing';
import About from './pages/about';
import Projects from './pages/projects';
import Contact from './pages/contact';

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      startAbout: false,
      pageRatios: {},
    }
    this.landingRef = React.createRef();
    this.aboutRef = React.createRef();
    this.projectsRef = React.createRef();
    this.contactRef = React.createRef();
    this.handleTab = this.handleTab.bind(this)

    this.handleTab = this.handleTab.bind(this)
    this.handleStartThree = this.handleStartThree.bind(this)

    this.navBarInfo = [
      {
        name: "landing",
        text: "Home",
        icon: homeLogo,
      },
      {
        name: "about",
        text: "About",
        icon: aboutLogo,
      },
      {
        name: "projects",
        text: "Projects",
        icon: projectsLogo,
      },
      {
        name: "contact",
        text: "contact",
        icon: contactLogo,
      },
    ]
  }

  componentDidMount(){
    AOS.init()
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

  handleStartThree(){
    this.setState({startAbout: true})
  }

  setPageRatio(pageName, ratio){
    let pageRatios = {...this.state.pageRatios}
    pageRatios[pageName] = ratio
    this.setState({pageRatios})
  }

  render(){
    const {startAbout} = this.state
    return(
      <div className="App">
        <Navigation
          scrollToRef = {this.handleTab}
          pageViewRatios = {this.state.pageRatios}
          tabsInfo = {this.navBarInfo}
        />
        <div ref={this.landingRef}>
          <Landing 
            startThree = {this.handleStartThree}
            trackpage = {(ratio)=>this.setPageRatio("landing", ratio)}
          />
        </div>
        <div ref={this.aboutRef}>
          <About 
            start={startAbout}
            trackpage = {(ratio)=>this.setPageRatio("about", ratio)}
          />
        </div>
        <div ref={this.projectsRef}>
          <Projects
            start={startAbout}
            trackpage = {(ratio)=>this.setPageRatio("projects", ratio)}
          />
        </div>
        <div ref={this.contactRef}>
          <Contact
            start={startAbout}
            trackpage = {(ratio)=>this.setPageRatio("contact", ratio)}
          />
        </div>
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
