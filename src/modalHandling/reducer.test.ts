import reducer, { initialState } from './reducer';
import * as actions from './actions';

describe('Error Handling reducer', () => {
    it('set error message', () => {
        const action = actions.setErrorMessage('header', ({
            code: 'code',
            message: 'message'
        }));
        expect(reducer(initialState, action)).toEqual({
            ...initialState,
            errorMessage: 'message',
            errorCode: 'code',
            errorHeader: 'header'
        });
    });

    it('close error message', () => {
        const action = actions.closeErrorMessage();
        expect(reducer({
            ...initialState,
            errorMessage: 'message',
            errorCode: 'code',
            errorHeader: 'header'
        }, action)).toEqual({
            ...initialState,
            errorMessage: '',
            errorCode: '',
            errorHeader: ''
        });
    });
});
