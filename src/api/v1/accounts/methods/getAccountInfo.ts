import accountActions from '../../../../database/collections/accounts';

export const getAccountInfo = async (username) => {
    const document = await accountActions.getOne(username);
    return document;
}