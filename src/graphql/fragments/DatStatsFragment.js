const DatStatsFragment = `
    fragment DatStatsFragment on DatStats {
        key,
        writer,
        version,
        files,
        blocksDownloaded,
        blocksLength,
        byteLength,
        progress,
        connected,
        downloadSpeed,
        downloadTotal,
        uploadSpeed,
        uploadTotal,
        peersTotal,
        peersComplete,
    }
`;
export default DatStatsFragment;
