import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

const HeadingModule = (props) => {
	return (
		<>
			<div className="zl_all_page_heading_section">
				<div className="zl_all_page_heading">
					<h2>{props.name}</h2>
				</div>
				<div className="zl_all_page_notify_logout_btn">
					<Button>Connect Casper</Button>
				</div>
			</div>
		</>
	);
};

export default connect(null, null)(HeadingModule);
