const VideoContentFragment = `
    fragment VideoContentFragment on VideoContent {
        id,
        contentHostId,
        state,
        stakeId,
        nodeId,
        creatorId,
        taoId,
        purchaseId,
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
        },
        totalHosts,
        recentlySeenHostsCount,
        lastSeenContentHost {
            contentHostId,
            contentDatKey,
            timestamp
        }
    }
`
export default VideoContentFragment