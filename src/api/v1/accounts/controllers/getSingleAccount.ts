import accountActions from '../../../../database/collections/accounts';

export const getAccount = async (req, res) => {
    const { params } = req;
    const { username } = params;
    const document = await accountActions.getOne({ key: 'username', value: username });
    res.send({
        ...document,
        created_at: document?.created_at.toDate(),
        start_fetch_date: document?.start_fetch_date?.toDate(),
        end_fetch_date: document?.end_fetch_date?.toDate()
        });
}