import React from 'react';
import { useSelector } from 'react-redux';
import { Button, FormControl } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import { getPublicAddress } from '../../../selectors/user';

export const SendReceiveSection = ({ handleToggle }) => {
	const publicAddress = useSelector(getPublicAddress);
	return (
		<div className="zl_send_recive_content">
			<div className="zl_send_recive_content_row">
				<div className="zl_send_recive_content_column">
					<div className="zl_send_recive_inner_content">
						<h3 className="zl_send_recive_heading">
							<svg
								width="15"
								height="15"
								viewBox="0 0 6 6"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z"
									fill="#53B9EA"
								/>
							</svg>
							Send
						</h3>
						<div className="zl_send_qr_address">
							<FormControl placeholder="Insert address" />
							<QRCode
								value="test"
								bgColor={'#3D476A'}
								fgColor={'#CAD3F2'}
								size={32}
								className="zl_dark_theme_qrcode"
							/>
							<QRCode
								value="EYdNhC7hGgHuL2sF20p2dLv"
								bgColor={'#EFF0F2'}
								fgColor={'#3D476A'}
								size={32}
								className="zl_light_theme_qrcode"
							/>
						</div>
						<div className="zl_send_currency_input_content">
							<FormControl type="number" className="zl_send_currency_input" defaultValue="500" />
							<div className="zl_send_currency_input_btns">
								<Button>1/4</Button>
								<Button>Half</Button>
								<Button>All</Button>
							</div>
						</div>
						<div className="zl_send_currency_text_type">
							<h3 className="zl_send_currency_text">$825.42</h3>
							<h3 className="zl_send_currency_type">USD</h3>
						</div>
						<div className="zl_send_currency_btn_text">
							<Button className="zl_send_currency_btn" onClick={handleToggle}>
								Back
							</Button>
							<Button className="zl_send_currency_btn">Send</Button>
							<div className="zl_send_currency_text">
								<p>
									Network Fee<span>$0.16</span>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="zl_send_recive_content_column">
					<div className="zl_send_recive_inner_content">
						<h3 className="zl_send_recive_heading zl_recive_heading">
							<svg
								width="15"
								height="15"
								viewBox="0 0 6 6"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z"
									fill="#53B9EA"
								/>
							</svg>
							Receive
						</h3>
						<div className="zl_recive_address_content">
							<p className="zl_recive_address_heading">Address</p>
							<div className="zl_recive_copy_address_content">
								<Button onClick={() => navigator.clipboard.writeText('EYdNhC7hGgHuL2sF20p2dLv')}>
									<svg
										width="20"
										height="20"
										viewBox="0 0 20 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M1.48116 0H12.5365C13.3244 0 13.9653 0.641 13.9653 1.42887V4.78252H12.661V1.42887C12.661 1.36022 12.6051 1.30435 12.5365 1.30435H1.48116C1.4125 1.30435 1.35663 1.36022 1.35663 1.42887V12.4842C1.35663 12.5529 1.4125 12.6087 1.48116 12.6087H4.73024V13.9131H1.48116C0.693287 13.9131 0.0522861 13.2721 0.0522861 12.4842V1.42887C0.0523291 0.641 0.693287 0 1.48116 0Z"
											fill="#CAD3F2"
										/>
										<path
											d="M7.46358 6.08691H18.5188C19.3068 6.08691 19.9478 6.72791 19.9478 7.51583V18.5711C19.9477 19.3591 19.3068 20.0001 18.5188 20.0001H7.46354C6.67562 20.0001 6.03463 19.3591 6.03463 18.5712V7.51583C6.03458 6.72791 6.67567 6.08691 7.46358 6.08691ZM7.46349 18.6957H18.5188C18.5875 18.6957 18.6434 18.6398 18.6434 18.5712V7.51583C18.6434 7.44713 18.5875 7.39126 18.5188 7.39126H7.46354C7.39484 7.39126 7.33897 7.44713 7.33897 7.51583V18.5712H7.33893C7.33893 18.6398 7.39484 18.6957 7.46349 18.6957Z"
											fill="#CAD3F2"
										/>
									</svg>
								</Button>
								<p>{publicAddress ? publicAddress : 'Please connect with Casper Sign'}</p>
							</div>
							{publicAddress && (
								<div className="zl_recive_address_qr_code">
									<QRCode
										value={publicAddress}
										bgColor={'transparent'}
										fgColor={'#CAD3F2'}
										size={166}
										className="zl_dark_theme_qrcode"
									/>
									<QRCode
										value={publicAddress}
										bgColor={'transparent'}
										fgColor={'#3D476A'}
										size={166}
										className="zl_light_theme_qrcode"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
