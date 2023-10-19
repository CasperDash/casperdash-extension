import { createSearchParams, useNavigate } from "react-router-dom";

export const useNavigateSearch = () => {
    const navigate = useNavigate();
    return (pathname, params) =>
      navigate({ pathname, search: `?${createSearchParams(params)}` });
};