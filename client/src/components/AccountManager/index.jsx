import React, { useState } from 'react';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Link } from 'react-router-dom';
const AccountManager = () => {
	const inputField = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	const [value, setValue] = useState('');

	return (
		<section className="cd_securebackup_page">
			<HeadingModule name={'Account Manager'} />
			<div className="cd_add_token_content cd_add_token_row row">
				<div className="cd_currency_column_sub_row_full">
					<div className="cd_add_token_column col">
						<div className="cd_add_token_inner_content cd_add_litecoin_currency active">
							<div className="cd_add_token_price">
								<div className="cd_add_token_left_price">
									<h3>Account 1</h3>
									<p>dac9b9520fbb9...e575407</p>
								</div>
								<div className="cd_add_token_right_price">
									<p></p>
								</div>
							</div>
						</div>
					</div>
					<div className="cd_add_token_column col">
						<div className={`cd_add_token_inner_content cd_add_litecoin_currency active`}>
							<div className="cd_add_token_price">
								<div className="cd_add_token_left_price">
									<h3>Account 2</h3>
									<p>dac9b9520fbb9...e575407</p>
								</div>
								<div className="cd_add_token_right_price">
									<p></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="cd_SecureBackup_heading">
				<h3>recovery words</h3>
			</div>
			<div className="cd_securebackup_row row">
				{inputField.map((inputValue, i) => (
					<div className="cd_securebackup_col_3 col-lg-3 col-md-6" key={inputValue}>
						<div className="cd_securebackup_input_content position-relative">
							<p className="cd_securebackup_input_text">{inputValue}</p>
							<input
								type="text"
								className="cd_securebackup_input"
								name={`input${inputValue}`}
								placeholder="_____"
								defaultValue={value ? value : ''}
							/>
						</div>
					</div>
				))}
			</div>
			{/* <div className="cd_securebackup_btn">
				{value === '' ? (
					<Link
						to={'#'}
						onClick={() => {
							setValue('Lorem');
						}}
						className="mx-auto"
					>
						Show
					</Link>
				) : (
					<Link
						to={'#'}
						onClick={() => {
							setValue('');
						}}
						className="mx-auto"
					>
						Hide
					</Link>
				)}
			</div> */}
		</section>
	);
};

export default AccountManager;
