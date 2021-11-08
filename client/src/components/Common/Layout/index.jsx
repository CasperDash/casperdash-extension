import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Connector from './Connector';

const mapStoreToProps = ({ user }) => ({
	user: user,
});

export default withRouter(connect(mapStoreToProps)(Connector));
