import { connect } from 'react-redux';

import Header from './Header';

const mapStateToProps = (state) => {
	return {
		user: state.user || null,
	};
};

export default connect(mapStateToProps)(Header);
