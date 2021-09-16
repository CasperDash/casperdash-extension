import { connect } from 'react-redux';

import SideBar from './SideBar';

const mapStateToProps = (state) => {
	return {
		user: state.user || null,
	};
};

export default connect(mapStateToProps)(SideBar);
