import { connect } from 'react-redux';

import Header from "./Header";

const mapStateToProps = state => {
    return {
        user: state.userAction.user || null,
    }
}

export default connect(mapStateToProps)(Header);
