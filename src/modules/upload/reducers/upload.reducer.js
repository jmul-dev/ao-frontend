import { waitForTransactionReceipt } from "../../../store/contracts.reducer";
import { triggerMetamaskPopupWithinElectron } from "../../../utils/electron";
import { updateWallet } from "../../wallet/reducers/wallet.reducer";

// Constants
export const UPDATE_CURRENT_UPLOAD_STEP = "UPDATE_CURRENT_UPLOAD_STEP";
export const UPDATE_UPLOAD_FORM_FIELD = "UPDATE_UPLOAD_FORM_FIELD";
export const UPDATE_PRICING = "UPDATE_PRICING";
export const RESET_UPLOAD_FORM = "RESET_UPLOAD_FORM";
export const CONTENT_SUBMITTION_RESULT = "CONTENT_SUBMITTION_RESULT";

export const STAKE_TRANSACTION = Object.freeze({
    INITIALIZED: "STAKE_TRANSACTION.INITIALIZED",
    SUBMITTED: "STAKE_TRANSACTION.SUBMITTED",
    RESULT: "STAKE_TRANSACTION.RESULT",
    ERROR: "STAKE_TRANSACTION.ERROR",
    RESET: "STAKE_TRANSACTION.RESET"
});

export const PRICING_DEFAULTS = [
    {
        stakeRatio: 1,
        profitPercentage: 10,
        headline: "new content creators",
        label: "great exposure"
    },
    {
        stakeRatio: 1.4,
        profitPercentage: 25,
        headline: "established content creators",
        label: "moderate pricing"
    },
    {
        stakeRatio: 2.2,
        profitPercentage: 60,
        headline: "premium high demand content",
        label: "premium pricing"
    }
];

/**
 * Method that returns an error if the form is invalid.
 *
 * @param {object} form
 * @returns {boolean} false if form is invalid
 */
export const isFormValid = form => {
    let requiredFields = ["content", "featuredImage", "title", "description"];
    switch (form.contentType) {
        case "VOD":
            requiredFields.push("videoTeaser");
            break;
        default:
            break;
    }
    if (form.contentLicense === "TAO") {
        requiredFields.push("taoId");
    }
    for (let i = 0; i < requiredFields.length; i++) {
        const fieldName = requiredFields[i];
        const field = form[fieldName];
        if (typeof field === "string" && field === "") {
            return false;
        } else if (field === null || field === undefined) {
            return false;
        }
    }
    return true;
};

/**
 * Get the total content size
 *
 * @param {Array<File> || File} files
 * @returns {number} Size in bytes
 */
export const contentSize = files => {
    return Array.isArray(files)
        ? files.reduce((acc, file) => {
              return acc + file.size;
          }, 0)
        : files.size;
};

/**
 * If there are multiple files, this method will return
 * the folder name found in the first file, otherwise
 * returns the file name.
 *
 * @param {Array<File> || File} files
 * @returns {string}
 */
export const contentNameFromFileInputs = files => {
    if (files.name) {
        return files.name;
    } else if (files.length === 1) {
        return files[0].name;
    } else {
        let filePath = files[0].webkitRelativePath;
        return filePath.substring(0, filePath.indexOf("/") + 1);
    }
};

// Actions
export const updateLastReachedStep = step => ({
    type: UPDATE_CURRENT_UPLOAD_STEP,
    payload: step
});
export const updateUploadFormField = (inputName, inputValue) => ({
    type: UPDATE_UPLOAD_FORM_FIELD,
    payload: {
        inputName,
        inputValue
    }
});
export const resetUploadForm = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { content, videoTeaser, featuredImage } = state.upload.form;
        // Cleanup file resources
        if (content && content.length === 1) {
            window.URL.revokeObjectURL(content[0].preview);
        }
        if (videoTeaser) {
            window.URL.revokeObjectURL(videoTeaser.preview);
        }
        if (featuredImage) {
            window.URL.revokeObjectURL(featuredImage.preview);
        }
        dispatch({
            type: RESET_UPLOAD_FORM
        });
    };
};
// Only provide stake/profit if custom pricingOption = 0
// stakeTokenType: 'primordial' | 'network' | 'both'
// stakePrimordialPercentage: 'primordial' / 'network'
//      1 = 100% primordial,
//      0 = 0% primordial, 100% network
//      0.5 = 50/50 split
export const updatePricingOption = (
    pricingOption,
    stake = undefined,
    profitSplitPercentage = undefined,
    stakeTokenType = undefined,
    stakePrimordialPercentage = undefined
) => {
    return (dispatch, getState) => {
        const state = getState();
        const content = state.upload.form.content;
        const fileSize = contentSize(content);
        let payload = null;
        if (pricingOption > 0) {
            let pricingConstraints = PRICING_DEFAULTS[pricingOption - 1];
            payload = {
                pricingOption,
                stake: fileSize * pricingConstraints.stakeRatio,
                profitSplitPercentage: pricingConstraints.profitPercentage,
                stakeTokenType: "primordial",
                stakePrimordialPercentage: 100
            };
        } else {
            payload = {
                pricingOption,
                stake: stake
                    ? Math.max(stake, fileSize)
                    : state.upload.form.stake,
                profitSplitPercentage: profitSplitPercentage
                    ? Math.min(Math.max(profitSplitPercentage, 1), 99)
                    : state.upload.form.profitSplitPercentage,
                stakeTokenType: stakeTokenType
                    ? stakeTokenType
                    : state.upload.form.stakeTokenType,
                stakePrimordialPercentage:
                    stakePrimordialPercentage !== undefined
                        ? stakePrimordialPercentage
                        : state.upload.form.stakePrimordialPercentage
            };
        }
        let networkTokensRequired = payload.stake;
        let primordialTokensRequired = payload.stake;
        switch (payload.stakeTokenType) {
            case "primordial":
                networkTokensRequired = 0;
                primordialTokensRequired = payload.stake;
                break;
            case "network":
                networkTokensRequired = payload.stake;
                primordialTokensRequired = 0;
                break;
            case "both":
                networkTokensRequired =
                    ((100 - payload.stakePrimordialPercentage) / 100.0) *
                    payload.stake;
                primordialTokensRequired =
                    (payload.stakePrimordialPercentage / 100.0) * payload.stake;
                break;
            default:
                break;
        }
        payload.networkTokensRequired = networkTokensRequired;
        payload.primordialTokensRequired = primordialTokensRequired;
        dispatch({
            type: UPDATE_PRICING,
            payload
        });
    };
};
export const stakeContent = ({
    contentLicense,
    networkTokenAmount,
    primordialTokenAmount,
    fileDatKey,
    metadataDatKey,
    fileSizeInBytes,
    profitPercentage,
    baseChallenge,
    encChallenge,
    taoId // id contentLicense === 'TAO'
}) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const rejectAndDispatchError = err => {
                dispatch({
                    type: STAKE_TRANSACTION.ERROR,
                    payload: err
                });
                reject(err);
            };
            triggerMetamaskPopupWithinElectron(getState);
            dispatch({ type: STAKE_TRANSACTION.INITIALIZED });
            const { contracts, app } = getState();

            // NOTE: for now token & primordial token amounts are in base denomination
            const networkTokenAmountInBaseDenom = parseInt(
                networkTokenAmount,
                10
            ); // networkTokenIntegerAmount
            const primordialTokenAmountInBaseDenom = parseInt(
                primordialTokenAmount,
                10
            ); // primordialTokenAmount

            let stakeContentPromise = null;
            switch (contentLicense) {
                case "AO":
                    const profitPercentageWithDivisor =
                        parseInt(profitPercentage, 10) * 10000; // 10^4
                    stakeContentPromise = stakeAOContent(
                        contracts,
                        app.ethAddress,
                        {
                            networkTokenAmountInBaseDenom,
                            primordialTokenAmountInBaseDenom,
                            fileDatKey,
                            metadataDatKey,
                            fileSizeInBytes,
                            baseChallenge,
                            encChallenge,
                            profitPercentageWithDivisor
                        }
                    );
                    break;
                case "TAO":
                    stakeContentPromise = stakeTAOContent(
                        contracts,
                        app.ethAddress,
                        {
                            networkTokenAmountInBaseDenom,
                            primordialTokenAmountInBaseDenom,
                            fileDatKey,
                            metadataDatKey,
                            fileSizeInBytes,
                            baseChallenge,
                            encChallenge,
                            taoId
                        }
                    );
                    break;
                case "CC":
                    stakeContentPromise = stakeCreativeCommonsContent(
                        contracts,
                        app.ethAddress,
                        {
                            networkTokenAmountInBaseDenom,
                            primordialTokenAmountInBaseDenom,
                            fileDatKey,
                            metadataDatKey,
                            fileSizeInBytes,
                            baseChallenge,
                            encChallenge
                        }
                    );
                    break;
            }
            if (stakeContentPromise === null) {
                rejectAndDispatchError(new Error(`Invalid content license: ${contentLicense}`));
                return;
            }
            stakeContentPromise
                .then(transactionHash => {
                    resolve(transactionHash);
                    /**
                     * NOTE: we are actually listening for the tx success on the backend (core)
                     * as well. This is really only helpful for error messages.
                     */
                    // 2.
                    let eventListener = contracts.aoContentFactory.StakeContent(
                        { stakeOwner: app.ethAddress },
                        function(error, result) {
                            if (
                                result &&
                                result.transactionHash === transactionHash
                            ) {
                                dispatch({
                                    type: STAKE_TRANSACTION.RESULT,
                                    payload: result.args
                                });
                                dispatch(updateWallet());
                                eventListener.stopWatching();
                            }
                        }
                    );
                    dispatch({
                        type: STAKE_TRANSACTION.SUBMITTED,
                        payload: transactionHash
                    });
                    waitForTransactionReceipt(transactionHash)
                        .then(() => {
                            eventListener.stopWatching();
                        })
                        .catch(err => {
                            eventListener.stopWatching();
                            rejectAndDispatchError(err);
                        });
                })
                .catch(error => {
                    rejectAndDispatchError(error);
                });
        });
    };
};
const stakeAOContent = (
    contracts,
    ethAddress,
    {
        networkTokenAmountInBaseDenom,
        primordialTokenAmountInBaseDenom,
        fileDatKey,
        metadataDatKey,
        fileSizeInBytes,
        baseChallenge,
        encChallenge,
        profitPercentageWithDivisor
    }
) => {
    return new Promise((resolve, reject) => {
        contracts.aoContentFactory.stakeAOContent(
            networkTokenAmountInBaseDenom, // networkTokenIntegerAmount
            0, // networkTokenFractionalAmount
            "ao", // denomination
            primordialTokenAmountInBaseDenom,
            baseChallenge,
            encChallenge,
            fileDatKey,
            metadataDatKey,
            fileSizeInBytes,
            profitPercentageWithDivisor,
            { from: ethAddress },
            function(err, transactionHash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(transactionHash);
                }
            }
        );
    });
};
const stakeTAOContent = (
    contracts,
    ethAddress,
    {
        networkTokenAmountInBaseDenom,
        primordialTokenAmountInBaseDenom,
        fileDatKey,
        metadataDatKey,
        fileSizeInBytes,
        baseChallenge,
        encChallenge,
        taoId
    }
) => {
    return new Promise((resolve, reject) => {
        contracts.aoContentFactory.stakeTAOContent(
            networkTokenAmountInBaseDenom, // networkTokenIntegerAmount
            0, // networkTokenFractionalAmount
            "ao", // denomination
            primordialTokenAmountInBaseDenom,
            baseChallenge,
            encChallenge,
            fileDatKey,
            metadataDatKey,
            fileSizeInBytes,
            taoId,
            { from: ethAddress },
            function(err, transactionHash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(transactionHash);
                }
            }
        );
    });
};
const stakeCreativeCommonsContent = (
    contracts,
    ethAddress,
    {
        networkTokenAmountInBaseDenom,
        primordialTokenAmountInBaseDenom,
        fileDatKey,
        metadataDatKey,
        fileSizeInBytes,
        baseChallenge,
        encChallenge
    }
) => {
    return new Promise((resolve, reject) => {
        contracts.aoContentFactory.stakeCreativeCommonsContent(
            networkTokenAmountInBaseDenom, // networkTokenIntegerAmount
            0, // networkTokenFractionalAmount
            "ao", // denomination
            primordialTokenAmountInBaseDenom,
            baseChallenge,
            encChallenge,
            fileDatKey,
            metadataDatKey,
            fileSizeInBytes,
            { from: ethAddress },
            function(err, transactionHash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(transactionHash);
                }
            }
        );
    });
};

export const setContentSubmittionResult = result => ({
    type: CONTENT_SUBMITTION_RESULT,
    payload: result
});

// State
const initialState = {
    lastReachedUploadStep: "start",
    form: {
        contentType: "VOD",
        content: undefined, // May be single or multiple files!
        videoTeaser: undefined,
        featuredImage: undefined,
        title: "",
        description: "",
        pricingOption: 1, // 0 = custom, 1-3 predefined inputs
        stake: 0,
        profitSplitPercentage: 10,
        stakeTokenType: "primordial",
        stakePrimordialPercentage: 100,
        contentLicense: "AO",
        contentAttribution: undefined,
        taoId: undefined
    },
    contentSubmittionResult: undefined,
    stakeTransaction: {
        initialized: undefined,
        transactionHash: undefined,
        result: undefined,
        error: undefined
    }
};
export type UploadReducerType = {
    lastReachedUploadStep:
        | "start"
        | "license"
        | "pricing"
        | "reload"
        | "content"
        | "submit"
};

// Reducer
export default function uploadReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_CURRENT_UPLOAD_STEP:
            return {
                ...state,
                lastReachedUploadStep: action.payload
            };
        case UPDATE_UPLOAD_FORM_FIELD:
            return {
                ...state,
                form: {
                    ...state.form,
                    [action.payload.inputName]: action.payload.inputValue
                }
            };
        case UPDATE_PRICING:
            return {
                ...state,
                form: {
                    ...state.form,
                    ...action.payload
                }
            };
        case RESET_UPLOAD_FORM:
            return {
                ...initialState
            };
        case STAKE_TRANSACTION.INITIALIZED:
            return {
                ...state,
                stakeTransaction: {
                    initialized: true
                }
            };
        case STAKE_TRANSACTION.SUBMITTED:
            return {
                ...state,
                stakeTransaction: {
                    ...state.stakeTransaction,
                    transactionHash: action.payload
                }
            };
        case STAKE_TRANSACTION.RESULT:
            return {
                ...state,
                stakeTransaction: {
                    ...state.stakeTransaction,
                    result: action.payload
                }
            };
        case STAKE_TRANSACTION.ERROR:
            return {
                ...state,
                stakeTransaction: {
                    ...state.stakeTransaction,
                    error: action.payload
                }
            };
        case CONTENT_SUBMITTION_RESULT:
            return {
                ...state,
                contentSubmittionResult: action.payload
            };
        default:
            return state;
    }
}
