import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Connector from './Connector';

const mapStoreToProps = ({ userAction }) => ({
	user: userAction.user,
});

export default withRouter(connect(mapStoreToProps)(Connector));
