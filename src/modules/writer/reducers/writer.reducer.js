import BigNumber from "bignumber.js";
import { getApolloClient } from "../../../index";
import gql from "graphql-tag";
import { waitForTransactionReceipt } from "../../../store/contracts.reducer";
import { triggerMetamaskPopupWithinElectron } from "../../../utils/electron";
import { registerMutation } from "../../registration/containers/RegisterContainer";

// Constants
export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
export const WRITER_KEY_ADD_TRANSACTION = Object.freeze({
    INITIALIZED: "WRITER_KEY_ADD_TRANSACTION.INITIALIZED",
    SUBMITTED: "WRITER_KEY_ADD_TRANSACTION.SUBMITTED",
    RESULT: "WRITER_KEY_ADD_TRANSACTION.RESULT",
    ERROR: "WRITER_KEY_ADD_TRANSACTION.ERROR",
    RESET: "WRITER_KEY_ADD_TRANSACTION.RESET"
});

const localKeySignatureQuery = gql(`
    query signature($nameId: ID!, $nonce: String!) {
        writerKeySignature(nameId: $nameId, nonce: $nonce) {
            v, r, s
        }
    }
`);

// Actions
export const writerTransactionReset = () => ({
    type: WRITER_KEY_ADD_TRANSACTION.RESET
});
export const addWriterKey = localPublicAddress => {
    return (dispatch, getState) => {
        const { contracts, app } = getState();
        if (!app.aoName || !app.aoName.nameId) {
            dispatch({
                type: WRITER_KEY_ADD_TRANSACTION.ERROR,
                payload: new Error(`AO name registration is required`)
            });
            return null;
        }
        dispatch({
            type: WRITER_KEY_ADD_TRANSACTION.INITIALIZED
        });
        const nameId = app.aoName.nameId;
        // 1. Ensure key is not already registered
        contracts.namePublicKey.keyToNameId(localPublicAddress, function(
            err,
            result
        ) {
            if (err) {
                dispatch({
                    type: WRITER_KEY_ADD_TRANSACTION.ERROR,
                    payload: err
                });
            } else if (result !== EMPTY_ADDRESS) {
                dispatch({
                    type: WRITER_KEY_ADD_TRANSACTION.ERROR,
                    payload: new Error(`Writer key has been taken`)
                });
                console.error(`Writer key owner: ${result}`);
            } else {
                // 2. Pull nonce
                contracts.nameFactory.nonces(nameId, function(err, result) {
                    const nonce = new BigNumber(result);
                    // 3. Get nonce signature
                    getApolloClient()
                        .query({
                            query: localKeySignatureQuery,
                            variables: {
                                nameId,
                                nonce: `${nonce.plus(1).toNumber()}`
                            }
                        })
                        .then(({ data }) => {
                            if (!data || !data.writerKeySignature) {
                                dispatch({
                                    type: WRITER_KEY_ADD_TRANSACTION.ERROR,
                                    payload: new Error(
                                        `failed to generate writer key signature`
                                    )
                                });
                            } else {
                                // 4. Finally, submit key
                                triggerMetamaskPopupWithinElectron(getState);
                                contracts.namePublicKey.addSetWriterKey(
                                    nameId,
                                    localPublicAddress,
                                    nonce.plus(1).toNumber(),
                                    data.writerKeySignature.v,
                                    data.writerKeySignature.r,
                                    data.writerKeySignature.s,
                                    { from: app.ethAddress },
                                    (err, transactionHash) => {
                                        if (err) {
                                            dispatch({
                                                type:
                                                    WRITER_KEY_ADD_TRANSACTION.ERROR,
                                                payload: err
                                            });
                                        } else {
                                            dispatch({
                                                type:
                                                    WRITER_KEY_ADD_TRANSACTION.SUBMITTED,
                                                payload: transactionHash
                                            });
                                            waitForTransactionReceipt(
                                                transactionHash
                                            )
                                                .then(() => {
                                                    dispatch({
                                                        type:
                                                            WRITER_KEY_ADD_TRANSACTION.RESULT,
                                                        payload: true
                                                    });
                                                    // Ping core to update the taodb writer key
                                                    getApolloClient()
                                                        .mutate({
                                                            mutation: registerMutation,
                                                            variables: {
                                                                ethAddress:
                                                                    app.ethAddress,
                                                                networkId:
                                                                    app.ethNetworkId,
                                                                aoNameId: nameId
                                                            }
                                                        })
                                                        .catch(error => {
                                                            console.error(
                                                                `Error hitting register after writer key mismatch update`,
                                                                error
                                                            );
                                                        });
                                                })
                                                .catch(err => {
                                                    dispatch({
                                                        type:
                                                            WRITER_KEY_ADD_TRANSACTION.ERROR,
                                                        payload: err
                                                    });
                                                });
                                        }
                                    }
                                );
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            dispatch({
                                type: WRITER_KEY_ADD_TRANSACTION.ERROR,
                                payload: new Error(
                                    `Network request error, unable to generate local key signature.`
                                )
                            });
                        });
                });
            }
        });
    };
};

export const checkWriterKey = localPublicAddress => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const { contracts, app } = getState();
            if (!app.aoName || !app.aoName.nameId) {
                reject(new Error(`AO name registration is required`));
            }
            const nameId = app.aoName.nameId;
            // 1. Ensure key is not already registered
            contracts.namePublicKey.keyToNameId(localPublicAddress, function(
                err,
                result
            ) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result === nameId);
                    if (result === nameId) {
                        dispatch({
                            type: WRITER_KEY_ADD_TRANSACTION.RESULT,
                            payload: true
                        });
                    }
                }
            });
        });
    };
};

// State
const initialState = {
    addTransaction: {
        initialized: false,
        transactionHash: null,
        result: null,
        error: null
    }
};

// Reducer
export default function writerReducer(state = initialState, action) {
    switch (action.type) {
        case WRITER_KEY_ADD_TRANSACTION.ERROR:
            return {
                ...state,
                addTransaction: {
                    ...state.addTransaction,
                    error: action.payload
                }
            };
        case WRITER_KEY_ADD_TRANSACTION.INITIALIZED:
            return {
                ...state,
                addTransaction: {
                    ...state.addTransaction,
                    initialized: true,
                    error: null
                }
            };
        case WRITER_KEY_ADD_TRANSACTION.SUBMITTED:
            return {
                ...state,
                addTransaction: {
                    ...state.addTransaction,
                    transactionHash: action.payload
                }
            };
        case WRITER_KEY_ADD_TRANSACTION.RESET:
            return {
                ...state,
                addTransaction: {}
            };
        case WRITER_KEY_ADD_TRANSACTION.RESULT:
            return {
                ...state,
                addTransaction: {
                    ...state.addTransaction,
                    result: action.payload
                }
            };
        default:
            return state;
    }
}
