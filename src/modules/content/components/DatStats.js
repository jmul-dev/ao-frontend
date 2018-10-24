import React from 'react';
import Typography from '@material-ui/core/Typography';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import PeersIcon from '@material-ui/icons/People';
import { FileSize } from '../../../utils/denominations';

/**
 * Renders peers connected, upload, and download speeds for the given dat stats.
 * Passing an array of stats will result in the sum of those stats.
 * 
 * @param {Array<DatStats> | DatStats} stats 
 * @param {boolean} renderPeerCount
 * @param {boolean} renderUploadSpeed
 * @param {boolean} renderDownloadSpeed
 */
const DatStats = ({stats, renderPeerCount, renderUploadSpeed, renderDownloadSpeed}) => {
    let peers = 0
    let downloadSpeed = 0
    let uploadSpeed = 0
    let combinedStats = []
    combinedStats.concat(stats).forEach(stats => {
        if ( stats ) {
            peers+= stats.peersTotal
            downloadSpeed+= stats.downloadSpeed
            uploadSpeed+= stats.uploadSpeed
        }
    })
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            {renderPeerCount ? (
                <div style={{marginRight: 6, display: 'flex', alignItems: 'center'}}>
                    {/* <PeersIcon style={{fontSize: 18, marginRight: 3}} color={peers > 0 ? 'primary' : 'inherit'} /> {peers} */}
                    {peers}
                </div>
            ) : null}
            {renderUploadSpeed ? (
                <div style={{marginRight: 6, display: 'flex', alignItems: 'center'}}>
                    <UpIcon style={{fontSize: 18, marginRight: 3}} color={uploadSpeed > 0 ? 'primary' : 'inherit'} /> <FileSize sizeInBytes={uploadSpeed} />{`/s`}
                </div>
            ) : null}    
            {renderDownloadSpeed ? (
                <div style={{marginRight: 6, display: 'flex', alignItems: 'center'}}>
                    <DownIcon style={{fontSize: 18, marginRight: 3}} color={downloadSpeed > 0 ? 'primary' : 'inherit'} /> <FileSize sizeInBytes={downloadSpeed} />{`/s`}
                </div>
            ) : null}                    
        </div>
    )
}
export default DatStats