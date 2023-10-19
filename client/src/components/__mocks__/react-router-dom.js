const mockUsedNavigate = jest.fn();
export const useNavigate = () => mockUsedNavigate;
export const useLocation = jest.fn();

export const useOutletContext = jest.fn();

export const useSearchParams = jest.fn();