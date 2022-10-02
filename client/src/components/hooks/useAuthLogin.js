/**
 * Create `useAuthLogin` hook, same as `useWelcomeBack`. This can be called inside in `useWelcomeBack` and `useLoginModal`.
 * This hook should receive a `onAuthCompleted` callback, which `useWelcomeBack` requires after successfully validating User credential.
 * 
 */

const useAuthLogin = ({ onAuthCompleted = undefined }) => {
	const onAuthCredentialSuccess = () => {
		// dispatch(onBindingAuthInfo({ publicKey, user: userDetails }, onCompleted: onAuthCompleted));
	}
}

export default useAuthLogin;