import React from "react";
import "../css/_navBar.scss"

import "aos/dist/aos.css"
import AOS from 'aos';

export default class Navigation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showTitle: {},
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.pageViewRatios !== prevProps.pageViewRatios) {
			let currPage = Object.entries(this.props.pageViewRatios).reduce((a, b) => a[1] > b[1] ? a : b)
			let showTitle = {}
			Object.keys(this.props.pageViewRatios).forEach(pageName => {
				showTitle[pageName] = false
			})
			showTitle[currPage[0]] = true
			this.setState({ showTitle })
		}
	}

	render() {
		const { pageViewRatios, tabsInfo } = this.props
		const { showTitle } = this.state

		return (
			<div className="navigation">
				{this.props.start &&
					<div className='nav'>
						<div className='left' />
						{showTitle.landing &&
							<div className="right">
								<div className="tabs"
									data-aos="fade-up"
									data-aos-duration="800"
								>
									{tabsInfo.map((tabInfo) => (
										<div className={`tab_container ${tabInfo.name === 'landing' ? 'hide' : ''}`}>
											<div className="tab"
												onClick={() => {
													this.props.scrollToRef(tabInfo.name)
												}}
											>
												<div className="tab_item_container">
													<div className="tab_item">
														<img className="tab_icon" src={tabInfo.icon} />
														<div className="tab_text_container">
															<div className="tab_text">{tabInfo.text}</div>
														</div>
													</div>
													<div className={`tab_item_underline ${showTitle[tabInfo.name] ? 'active' : ''}`} />
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						}
						{!showTitle.landing &&
							<div className="right out">
								<div className="tabs out"
									data-aos="fade-down"
									data-aos-duration="800"
								>
									{tabsInfo.map((tabInfo) => (
										<div className="tab_container">
											<div className="tab"
												onClick={() => {
													this.props.scrollToRef(tabInfo.name)
												}}
											>
												<div className="tab_item_container">
													<div className="tab_item">
														<img className="tab_icon" src={tabInfo.icon} />
														<div className="tab_text_container">
															<div className="tab_text">{tabInfo.text}</div>
														</div>
													</div>
												</div>
											</div>
											<div className={`tab_item_underline ${showTitle[tabInfo.name] ? 'active' : ''}`} />
										</div>
									))}
								</div>
							</div>
						}
					</div>
				}
			</div>
		)
	}
}