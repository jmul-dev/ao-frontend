const DatStatsFragment = `
    fragment DatStatsFragment on DatStats {
        files,
        byteLength,
        length,
        version,
        downloadSpeed,
        uploadSpeed,
        downloadTotal,
        uploadTotal,
        peersTotal,
        peersComplete,
        complete,
        joinedNetwork,
    }
`
export default DatStatsFragment