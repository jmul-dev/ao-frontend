const VideoContentFragment = `
    fragment VideoContentFragment on VideoContent {
        id,
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
        encChallenge,
        teaserUrl,
        featuredImageUrl,
        metadata {
            duration,
            resolution,
            encoding,
        },
        transactions {
            stakeTx,
            purchaseTx,
            hostTx,
        }
    }
`
export default VideoContentFragment