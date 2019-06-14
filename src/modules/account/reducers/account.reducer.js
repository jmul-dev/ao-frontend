import BigNumber from "bignumber.js";

// Constants
export const ACCOUNT_VIDEO_LISTING_FILTER = "ACCOUNT_VIDEO_LISTING_FILTER";
export const ACCOUNT_VIDEO_LISTING_ORDERING = "ACCOUNT_VIDEO_LISTING_ORDERING";
export const UPDATE_CONTENT_METRICS_BY_STAKE_ID =
    "UPDATE_CONTENT_METRICS_BY_STAKE_ID";
export const UPDATE_TAO_CONTENT_STATE = "UPDATE_TAO_CONTENT_STATE";
export const UPDATE_NAME_TAO_POSITION = "UPDATE_NAME_TAO_POSITION";
export const ACCOUNT_CONTENT_TYPE_FILTER = "ACCOUNT_CONTENT_TYPE_FILTER";
export const UPDATE_CONTENT_HOST_EARNINGS = "UPDATE_CONTENT_HOST_EARNINGS";
export const MEDIA_TYPES = [
    "all",
    "video",
    "image",
    "music",
    "document",
    "digital_asset",
    "application"
];

// Actions
export const setAccountVideoListingFilter = filter => ({
    type: ACCOUNT_VIDEO_LISTING_FILTER,
    payload: filter
});
export const setAccountVideoListingOrdering = ordering => ({
    type: ACCOUNT_VIDEO_LISTING_ORDERING,
    payload: ordering
});
export const getContentMetrics = stakeId => {
    return (dispatch, getState) => {
        const { contracts, ico } = getState();
        contracts.aoContentFactory.getContentMetrics(stakeId, function(
            err,
            result
        ) {
            if (!err) {
                dispatch({
                    type: UPDATE_CONTENT_METRICS_BY_STAKE_ID,
                    payload: {
                        stakeId,
                        networkTokenStaked: new BigNumber(result[0]),
                        primordialTokenStaked: new BigNumber(result[1]),
                        primordialTokenStakedWeight: new BigNumber(
                            result[2]
                        ).dividedBy(ico.weightedIndexDivisor),
                        totalStakeEarning: new BigNumber(result[3]),
                        totalHostEarning: new BigNumber(result[4]),
                        totalFoundationEarning: new BigNumber(result[5])
                    }
                });
            }
        });
    };
};
export const getContentHostEarnings = contentHostId => {
    return (dispatch, getState) => {
        const { contracts } = getState();
        contracts.aoEarning.contentHostEarning(contentHostId, function(
            err,
            hostEarnings
        ) {
            if (!err) {
                dispatch({
                    type: UPDATE_CONTENT_HOST_EARNINGS,
                    payload: {
                        contentHostId,
                        earnings: new BigNumber(hostEarnings)
                    }
                });
            }
        });
    };
};
export const getPurchaseReceipt = purchaseReceiptId => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const { contracts } = getState();
            if (!purchaseReceiptId)
                return reject(
                    new Error(
                        `getPurchaseReceipt called with no purchaseReceiptId`
                    )
                );
            contracts.aoPurchaseReceipt.getById(purchaseReceiptId, function(
                err,
                result
            ) {
                if (!err) {
                    resolve({
                        contentHostId: result[0],
                        stakedContentId: result[1],
                        contentId: result[2],
                        buyer: result[3],
                        price: result[4],
                        amountPaidByBuyer: result[5],
                        amountPaidByAO: result[6],
                        publicKey: result[7],
                        publicAddress: result[8],
                        createdOnTimestamp: result[9]
                    });
                } else {
                    reject(err);
                }
            });
        });
    };
};
export const getTaoContentState = contentId => {
    return (dispatch, getState) => {
        const { contracts } = getState();
        contracts.aoContent.getById(contentId, function(err, result) {
            if (!err) {
                dispatch({
                    type: UPDATE_TAO_CONTENT_STATE,
                    payload: {
                        contentId,
                        taoContentState: result[4]
                    }
                });
            }
        });
    };
};
export const getNameTaoPosition = taoId => {
    return (dispatch, getState) => {
        const { contracts } = getState();
        contracts.nameTAOPosition.getPositionById(taoId, function(err, result) {
            if (!err) {
                dispatch({
                    type: UPDATE_NAME_TAO_POSITION,
                    payload: {
                        taoId,
                        advocateName: result[0],
                        advocateId: result[1],
                        listenerName: result[2],
                        listenerId: result[3],
                        speakerName: result[4],
                        speakerId: result[5]
                    }
                });
            }
        });
    };
};

// State
const initialState = {
    videoListingFilter: "downloaded", // uploaded || downloaded
    videoListingOrdering: "recent", // recent || earned || staked
    contentMetrics: {}, // stakeId => { metrics }
    contentHostEarnings: {}, // contentHostId => BigNumber
    taoContentState: {}, // contentId
    nameTaoPosition: {} // taoId => { advocateName, speakerName, listenerName }
};

// Reducer
export default function accountReducer(state = initialState, action) {
    switch (action.type) {
        case ACCOUNT_VIDEO_LISTING_FILTER:
            return {
                ...state,
                videoListingFilter: action.payload
            };
        case ACCOUNT_VIDEO_LISTING_ORDERING:
            return {
                ...state,
                videoListingOrdering: action.payload
            };
        case UPDATE_CONTENT_METRICS_BY_STAKE_ID:
            return {
                ...state,
                contentMetrics: {
                    ...state.contentMetrics,
                    [action.payload.stakeId]: action.payload
                }
            };
        case UPDATE_CONTENT_HOST_EARNINGS:
            return {
                ...state,
                contentHostEarnings: {
                    ...state.contentHostEarnings,
                    [action.payload.contentHostId]: action.payload.earnings
                }
            };
        case UPDATE_TAO_CONTENT_STATE:
            return {
                ...state,
                taoContentState: {
                    ...state.taoContentState,
                    [action.payload.contentId]: action.payload.taoContentState
                }
            };
        case UPDATE_NAME_TAO_POSITION:
            return {
                ...state,
                nameTaoPosition: {
                    ...state.nameTaoPosition,
                    [action.payload.taoId]: action.payload
                }
            };
        default:
            return state;
    }
}
