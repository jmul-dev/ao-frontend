const DatStatsFragment = `
    fragment DatStatsFragment on DatStats {
        files,
        byteLength,
        length,
        downloaded,
        version,
        downloadSpeed,
        uploadSpeed,
        downloadTotal,
        uploadTotal,
        peersTotal,
        peersComplete,
        complete,
        joinedNetwork,
        connected
    }
`;
export default DatStatsFragment;
