export const redisWrapper = {
    invalidate: jest.fn().mockImplementation(async (userId: string) => {
        return;
    }),
    wasInvalidated: jest.fn().mockReturnValue(false)
};