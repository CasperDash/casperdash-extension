import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useMutateSwapSettings = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        ...options,
        mutationFn: async (newSettings) => {
            queryClient.setQueryData(['swapSettings'], (oldSettings = {}) => ({
                ...oldSettings,
                ...newSettings,
            }));

            return newSettings;
        },
        networkMode: 'offlineFirst',
    });
}