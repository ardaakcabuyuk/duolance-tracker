import React from "react";

class ChangingProgressProvider extends React.Component {
	static defaultProps = {
		interval: 10,
	};

	state = {
		valuesIndex: 0,
	};

	componentDidMount() {
		this.state.intervalId = setInterval(() => {
		this.setState({
			valuesIndex: (this.state.valuesIndex + 1) % this.props.values.length
		});
		}, this.props.interval);
		console.log('setting interval with id ' + this.state.intervalId)
	}

	render() {
		if (this.state.valuesIndex == this.props.values.length - 1) {
			console.log('clearing interval with id ' + this.state.intervalId);
			clearInterval(this.state.intervalId);
		}
		return this.props.children(this.props.values[this.state.valuesIndex]);
	}
}

export default ChangingProgressProvider;
