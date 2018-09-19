const VideoContentFragment = `
    fragment VideoContentFragment on VideoContent {
        id,
        contentHostId,
        state,
        stakeId,
        nodeId,
        creatorId,
        contentType,
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
        premium,
        split,
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
        metadata {
            encoding,
            duration,
            width,
            height,
            aspectRatio,
            aspectRatioDisplay,
            bitRate,
            frameRate,
        },
        transactions {
            stakeTx,
            purchaseTx,
            hostTx,
        }
    }
`
export default VideoContentFragment