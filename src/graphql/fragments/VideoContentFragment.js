const VideoContentFragment = `
    fragment VideoContentFragment on VideoContent {
        id,
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
        teaserUrl,
        featuredImageUrl,
        metadata {
            duration,
            resolution,
            encoding,
        }
    }
`
export default VideoContentFragment