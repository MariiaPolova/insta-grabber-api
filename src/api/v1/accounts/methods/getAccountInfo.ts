import accountActions from '../../../../database/collections/accounts.js';

export const getAccountInfo = async (username: string) => {
    const document = await accountActions.getOne({key: 'username', value: username});
    return document;
}