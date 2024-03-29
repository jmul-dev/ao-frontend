import AOTreasury from "ao-contracts/build/minified/AOTreasury.json";
import AOContent from "ao-contracts/build/minified/AOContent.json";
import AOContentFactory from "ao-contracts/build/minified/AOContentFactory.json";
import AOContentHost from "ao-contracts/build/minified/AOContentHost.json";
import AOStakedContent from "ao-contracts/build/minified/AOStakedContent.json";
import AOEarning from "ao-contracts/build/minified/AOEarning.json";
import AOLibrary from "ao-contracts/build/minified/AOLibrary.json";
import AOPool from "ao-contracts/build/minified/AOPool.json";
import AOSetting from "ao-contracts/build/minified/AOSetting.json";
import AOIon from "ao-contracts/build/minified/AOIon.json";
import AOIonLot from "ao-contracts/build/minified/AOIonLot.json";
import AOPurchaseReceipt from "ao-contracts/build/minified/AOPurchaseReceipt.json";
import NameFactory from "ao-contracts/build/minified/NameFactory.json";
import NameTAOLookup from "ao-contracts/build/minified/NameTAOLookup.json";
import NameTAOPosition from "ao-contracts/build/minified/NameTAOPosition.json";
import NamePublicKey from "ao-contracts/build/minified/NamePublicKey.json";

import debounce from "debounce";
import { APP_STATES, updateAppState, getNetworkName } from "./app.reducer";
import { updateIcoState, startListeningForRecentTransactions } from "../modules/ico/reducers/ico.reducer";
import { addNotification } from "../modules/notifications/reducers/notifications.reducer";

// Constants
export const BLOCKS_PER_EVENT_GETTER = 10000;
export const CONTRACTS_INITIALIZED = "CONTRACTS_INITIALIZED";
export const SET_EVENTS_SINCE_BLOCK_NUMBER = "SET_EVENTS_SINCE_BLOCK_NUMBER";
export const LATEST_BLOCK_NUMBER = "LATEST_BLOCK_NUMBER";
export const UPDATE_CONTRACT_SETTINGS = "UPDATE_CONTRACT_SETTINGS";

export const waitForTransactionReceipt = transactionHash => {
    return new Promise((resolve, reject) => {
        const filter = window.web3.eth.filter("latest");
        filter.watch((error, result) => {
            window.web3.eth.getTransactionReceipt(
                transactionHash,
                (error, receipt) => {
                    if (error) {
                        reject(error);
                    } else if (receipt) {
                        filter.stopWatching();
                        // The TX has been added to the chain, now determine status
                        if (receipt.status === "0x0") {
                            console.log(receipt);
                            let error = new Error(`Transaction failed`);
                            reject(error);
                        } else {
                            resolve();
                        }
                    } else {
                        // no error and no receipt found on this block, keep listening
                    }
                }
            );
        });
    });
};

// Actions
export const initializeContracts = networkId => {
    return (dispatch, getState) => {
        const { app } = getState();
        if (app.states[APP_STATES.CONTRACTS_INITIALIZED])
            return console.warn(
                `Preventing attempt to re-initialize contracts`
            );
        try {
            let contracts = [
                AOTreasury,
                AOContent,
                AOContentFactory,
                AOContentHost,
                AOStakedContent,
                AOEarning,
                AOLibrary,
                AOPool,
                AOSetting,
                AOIon,
                AOIonLot,
                AOPurchaseReceipt,
                NameFactory,
                NameTAOLookup,
                NameTAOPosition,
                NamePublicKey
            ];
            let initializedContracts = contracts.reduce((acc, contract) => {
                if (!contract.networks[networkId]) {
                    throw new Error(
                        `${
                            contract.contractName
                        } has not been deployed to network ${networkId}`
                    );
                }
                let contractInstanceName = contract.contractName;
                if (contractInstanceName.indexOf("AO") === 0) {
                    // lowercasing "AO"
                    contractInstanceName =
                        "ao" + contract.contractName.substring(2);
                } else {
                    // lowercase first char
                    contractInstanceName =
                        contract.contractName[0].toLowerCase() +
                        contract.contractName.substring(1);
                }
                return Object.assign(acc, {
                    [contractInstanceName]: window.web3.eth
                        .contract(contract.abi)
                        .at(contract.networks[networkId].address)
                });
            }, {});
            dispatch({
                type: CONTRACTS_INITIALIZED,
                payload: initializedContracts
            });
            dispatch(updateAppState(APP_STATES.CONTRACTS_INITIALIZED, true));
            dispatch(watchBlockNumber());
            dispatch(updateIcoState());
            dispatch(fetchSettingsFromContract());
        } catch (error) {
            console.error("Error initializing contracts", error);
            if (error.message.indexOf("has not been deployed") > -1) {
                console.warn(
                    "Smart contracts have not been deployed on this network: " +
                        networkId
                );
                dispatch(
                    updateAppState(APP_STATES.CONTRACTS_INITIALIZED, false)
                );
                const networkIds = Object.keys(AOSetting.networks)
                    .map(networkId => getNetworkName(networkId))
                    .join(", ");
                dispatch(
                    addNotification({
                        message: `The Ethereum network you selected is not supported. Available networks: ${networkIds}`
                    })
                );
            }
        }
    };
};

const watchBlockNumber = () => {
    return (dispatch, getState) => {
        const update = (error, result) => {
            if (!error) {
                window.web3.eth.getBlock(result, (error, block) => {
                    if (!error) {
                        // For consistency, we update all the game stats *every* block number!
                        dispatch({
                            type: LATEST_BLOCK_NUMBER,
                            payload: block.number
                        });
                    } else {
                        console.error("Error calling getBlockNumber", error);
                    }
                });
            }
        };
        const debouncedUpdate = debounce(update, 750);
        var filter = window.web3.eth.filter("latest");
        filter.watch(debouncedUpdate);
    };
};

const fetchSettingsFromContract = () => {
    return (dispatch, getState) => {
        const { contracts } = getState();
        // 1. We have to fetch the settings TAO id before fetching the actual settings
        contracts.aoIon.settingTAOId((err, settingsTAOId) => {
            console.log(`settingsTAOId:`, settingsTAOId);

            let settingsPromises = [];
            settingsPromises.push(
                new Promise((resolve, reject) => {
                    contracts.aoSetting.getSettingValuesByTAOName(
                        settingsTAOId,
                        "ingressUrl",
                        function(err, settingsValue) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(settingsValue[4]);
                            }
                        }
                    );
                })
            );
            settingsPromises.push(
                new Promise((resolve, reject) => {
                    contracts.aoSetting.getSettingValuesByTAOName(
                        settingsTAOId,
                        "aoUrl",
                        function(err, settingsValue) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(settingsValue[4]);
                            }
                        }
                    );
                })
            );
            settingsPromises.push(
                new Promise((resolve, reject) => {
                    contracts.aoSetting.getSettingValuesByTAOName(
                        settingsTAOId,
                        "theAoDappId",
                        function(err, settingsValue) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(settingsValue[4]);
                            }
                        }
                    );
                })
            );
            settingsPromises.push(
                new Promise((resolve, reject) => {
                    contracts.aoSetting.getSettingValuesByTAOName(
                        settingsTAOId,
                        "defaultEthereumProvider_1",
                        function(err, settingsValue) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(settingsValue[4]);
                            }
                        }
                    );
                })
            );
            settingsPromises.push(
                new Promise((resolve, reject) => {
                    contracts.aoSetting.getSettingValuesByTAOName(
                        settingsTAOId,
                        "defaultEthereumProvider_4",
                        function(err, settingsValue) {
                            if (err) {
                                resolve(null);
                            } else {
                                resolve(settingsValue[4]);
                            }
                        }
                    );
                })
            );
            settingsPromises.push(
                new Promise((resolve, reject) => {
					contracts.aoIon.aoDevTeam1((err, aoDevTeam1) => {
						if (err) {
							resolve(null);
						} else {
							resolve(aoDevTeam1);
						}
					});
				})
            );
            settingsPromises.push(
                new Promise((resolve, reject) => {
					contracts.aoIon.aoDevTeam2((err, aoDevTeam2) => {
						if (err) {
							resolve(null);
						} else {
							resolve(aoDevTeam2);
						}
					});
				})
            );
            Promise.all(settingsPromises)
                .then(settings => {
                    dispatch({
                        type: UPDATE_CONTRACT_SETTINGS,
                        payload: {
                            ingressUrl: settings[0],
                            aoUrl: settings[1],
                            theAoDappId: settings[2],
                            recommendedEthNetworkRpcs: {
                                "1": settings[3],
                                "4": settings[4]
                            },
							aoDevTeam1: settings[5],
							aoDevTeam2: settings[6]
                        }
                    });
					dispatch(startListeningForRecentTransactions());
                })
                .catch(error => {
                    dispatch(
                        addNotification({
                            message: `Error fetching latest AO settings from contracts: ${
                                error.message
                            }`,
                            variant: "warning"
                        })
                    );
                });
        });
    };
};

// State
const initialState = {
    latestBlockNumber: 0,
    settings: {
        aoUrl: undefined,
        ingressUrl: undefined,
        theAoDappId: undefined,
        recommendedEthNetworkRpcs: {},
		aoDevTeam1: undefined,
		aoDevTeam2: undefined
    }
};

// Reducer
export default function contractsReducer(state = initialState, action) {
    switch (action.type) {
        case CONTRACTS_INITIALIZED:
            return {
                ...state,
                ...action.payload
            };
        case LATEST_BLOCK_NUMBER:
            return {
                ...state,
                latestBlockNumber: action.payload
            };
        case UPDATE_CONTRACT_SETTINGS:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    ...action.payload
                }
            };
        default:
            return state;
    }
}
