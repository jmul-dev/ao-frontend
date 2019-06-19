import BigNumber from "bignumber.js";
import { APP_STATES } from "../../../store/app.reducer";

// Constants
export const UPDATE_PRIMORDIAL_STATE = "UPDATE_PRIMORDIAL_STATE";
export const SET_LOT_CREATION_EVENT = "SET_LOT_CREATION_EVENT";
export const LOT_CREATION_EVENT_RECEIVED = "LOT_CREATION_EVENT_RECEIVED";

// Actions
export const updateIcoState = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { contracts, app } = state;
        if (!app.states[APP_STATES.CONTRACTS_INITIALIZED]) {
            console.warn(
                "Calling contract methods before contracts initialized"
            );
            return;
        }
        contracts.aoIon.networkExchangeEnded(function(err, ended) {
            if (ended) {
                dispatch({
                    type: UPDATE_PRIMORDIAL_STATE,
                    payload: {
                        primordialSaleEnded: true
                    }
                });
            }
        });
        // primordialTotalBought
        contracts.aoIon.primordialTotalSupply(function(err, supply) {
            if (supply) {
                dispatch({
                    type: UPDATE_PRIMORDIAL_STATE,
                    payload: {
                        primordialTotalSupply: new BigNumber(supply)
                    }
                });
            }
        });
        contracts.aoIon.TOTAL_PRIMORDIAL_FOR_SALE(function(err, supply) {
            if (supply) {
                dispatch({
                    type: UPDATE_PRIMORDIAL_STATE,
                    payload: {
                        primordialMaxSupply: new BigNumber(supply)
                    }
                });
            }
        });
        contracts.aoIon.primordialBuyPrice(function(err, buyPrice) {
            if (buyPrice) {
                dispatch({
                    type: UPDATE_PRIMORDIAL_STATE,
                    payload: {
                        primordialBuyPrice: new BigNumber(buyPrice)
                    }
                });
            }
        });
        contracts.aoLibrary.MULTIPLIER_DIVISOR(function(err, indexDivisor) {
            if (indexDivisor) {
                dispatch({
                    type: UPDATE_PRIMORDIAL_STATE,
                    payload: {
                        weightedIndexDivisor: new BigNumber(indexDivisor)
                    }
                });
            }
        });
        contracts.aoLibrary.PERCENTAGE_DIVISOR(function(
            err,
            percentageDivisor
        ) {
            if (percentageDivisor) {
                dispatch({
                    type: UPDATE_PRIMORDIAL_STATE,
                    payload: {
                        percentageDivisor: new BigNumber(percentageDivisor)
                    }
                });
            }
        });
    };
};
export const startListeningForRecentTransactions = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { contracts, app, ico } = state;
		const { aoDevTeam1, aoDevTeam2 } = contracts.settings;
        if (!app.states[APP_STATES.CONTRACTS_INITIALIZED])
            return console.warn(
                `Attempting to call contract method before contracts initialized`
            );
        // NOTE: web3 was being pretty unreliable (was not able to stop & restart event filter). This means that
        // our filter will be running constantly unfortuanatly
        if (!ico.lotCreationEvent) {
            let fromBlock = contracts.latestBlockNumber - 15 * 4 * 60 * 24 * 30; // ~30 days worth of txs
            if (fromBlock < 0) fromBlock = 0;
            let lotCreationEvent = contracts.aoIonLot.LotCreation(
                {},
                { fromBlock, toBlock: "latest" }
            );
            dispatch({
                type: SET_LOT_CREATION_EVENT,
                payload: lotCreationEvent
            });
            lotCreationEvent.watch((error, result) => {
                if (result &&
					(!aoDevTeam1 || (aoDevTeam1 && aoDevTeam1.toLowerCase() !== result.args.lotOwner.toLowerCase())) &&
					(!aoDevTeam2 || (aoDevTeam2 && aoDevTeam2.toLowerCase() !== result.args.lotOwner.toLowerCase()))
				) {
                    // event LotCreation(address indexed lotOwner, bytes32 indexed lotId, uint256 multiplier, uint256 primordialAmount, uint256 networkBonusAmount);
                    dispatch({
                        type: LOT_CREATION_EVENT_RECEIVED,
                        payload: {
                            blockNumber: result.blockNumber,
                            transactionHash: result.transactionHash,
                            ...result.args,
                            multiplier: new BigNumber(result.args.multiplier)
                                .dividedBy(ico.weightedIndexDivisor)
                                .toNumber(),
                            primordialTokenAmount: new BigNumber(
                                result.args.primordialAmount
                            ),
                            networkTokenBonusAmount: new BigNumber(
                                result.args.networkBonusAmount
                            )
                        }
                    });
                }
            });
        }
    };
};
/**
 *
 * @param {BigNumber} tokenAmount Token amount in base AO
 */
export const calculatePrimoridialExchangeMultiplierAndBonus = tokenAmount => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState();
            const { contracts, app, ico } = state;
            if (!app.states[APP_STATES.CONTRACTS_INITIALIZED]) {
                console.warn(
                    "Calling contract methods before contracts initialized"
                );
                return reject();
            }
            contracts.aoIon.calculateMultiplierAndBonus(
                tokenAmount.toString(),
                function(err, results) {
                    if (results) {
                        // [multiplier, bonus percentage, bonus amount]
                        resolve({
                            multiplier: new BigNumber(results[0])
                                .dividedBy(ico.weightedIndexDivisor)
                                .toNumber(),
                            bonusPercentage: new BigNumber(results[1])
                                .dividedBy(ico.percentageDivisor)
                                .multipliedBy(100)
                                .toNumber(),
                            networkTokenBonusAmount: new BigNumber(results[2])
                        });
                    }
                }
            );
        });
    };
};

// State
const initialState = {
    primordialSaleActive: false,
    primordialSaleEnded: false,
    primordialTotalSupply: new BigNumber(0),
    primordialMaxSupply: new BigNumber(0),
    primordialBuyPrice: new BigNumber(0),
    weightedIndexDivisor: new BigNumber(Math.pow(10, 6)),
    percentageDivisor: new BigNumber(Math.pow(10, 6)),
    // recent transactions
    lotCreations: {
        /* lotId => LotCreation */
    },
    lotCreationEvent: undefined // web3.contract.Event
};

// Reducer
export default function icoReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_PRIMORDIAL_STATE:
            let updatedState = {
                ...state,
                ...action.payload
            };
            if (
                updatedState.primordialBuyPrice.gt(0) &&
                !updatedState.primordialSaleEnded
            ) {
                updatedState.primordialSaleActive = true;
            } else {
                updatedState.primordialSaleActive = false;
            }
            return updatedState;
        case SET_LOT_CREATION_EVENT:
            return {
                ...state,
                lotCreationEvent: action.payload
            };
        case LOT_CREATION_EVENT_RECEIVED:
            return {
                ...state,
                lotCreations: {
                    ...state.lotCreations,
                    [action.payload.lotId]: action.payload
                }
            };
        default:
            return state;
    }
}
