export default `
... on VideoContent {
    __typename,
    metadata {
        encoding,
        duration,
        width,
        height,
        aspectRatio,
        aspectRatioDisplay,
        bitRate,
        frameRate,
    }
}
`;
