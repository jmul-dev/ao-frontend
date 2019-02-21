import ContentFields from "./ContentFields";

const VideoContentFragment = `
    fragment VideoContentFragment on VideoContent {
        ${ContentFields}
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
export default VideoContentFragment;
