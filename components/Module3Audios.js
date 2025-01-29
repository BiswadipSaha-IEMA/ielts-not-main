import {Asset} from 'expo-asset'

export const tracks= [
    {
        id:'1',
        url:Asset.fromModule(require('../assets/M3L1P1.mp3')).uri,
    },
    {
        id:'2',
        url:Asset.fromModule(require('../assets/M3L1P2.mp3')).uri,
    },
    {
        id:'3',
        url:Asset.fromModule(require('../assets/M3L2P1.mp3')).uri,
    },
    {
        id:'4',
        url:Asset.fromModule(require('../assets/M3L2P2.mp3')).uri,
    }
]