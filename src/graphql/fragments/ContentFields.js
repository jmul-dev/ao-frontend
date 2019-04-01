import VideoContentFragment from "./VideoContentFragment";
import DappContentFragment from "./DappContentFragment";

const ContentFields = `
    __typename,
    id,
    contentHostId,
    state,
    stakeId,
    nodePublicKey,
    nodeEthAddress,
    creatorNodePublicKey,
    creatorEthAddress,
    taoId,
    purchaseReceiptId,
    contentType,
    contentLicense,
    contentAttribution,
    isFolder,
    isMutable,
    fileName,
    fileDatKey,
    fileUrl,
    metadataDatKey,
    title,
    description,
    stake,
    fileSize,
    stakePrimordialPercentage,
    profitSplitPercentage,
    adSupport,
    createdAt,
    baseChallenge,
    baseChallengeSignature {
        v, r, s
    },
    encChallenge,
    teaserUrl,
    featuredImageUrl,
    isNetworkContent,
    transactions {
        stakeTx,
        purchaseTx,
        hostTx,
    },
    totalHosts,
    recentlySeenHostsCount,
    lastSeenContentHost {
        contentHostId,
        contentDatKey,
        timestamp
    }
`;

export const ContentFieldsWithFragments = `
    ${ContentFields}
    ${VideoContentFragment}
    ${DappContentFragment}
`;

export default ContentFields;
