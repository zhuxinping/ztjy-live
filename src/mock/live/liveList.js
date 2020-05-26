import Mock from 'mockjs'
import { USER_API_URL } from '@/api/modules/user'

export const getLiveListMock = (params) => {
	return { 'returncode': '10000', 'message': '获得直播列表数据成功', 'body': { 'livelist': [{ 'liveid': 131, 'livetitle': '121312312313', 'livebackground': '', 'livestate': 1, 'liveaudiences': 2, 'liveexpecttime': '2018-11-30 09:26:03' }, { 'liveid': 130, 'livetitle': '测试新建', 'livebackground': 'http://7mnnwj.com2.z0.glb.qiniucdn.com/GH0Sbf6yqMpkoXcv7RJ', 'livestate': 1, 'liveaudiences': 1, 'liveexpecttime': '2018-11-22 09:21:42' }, { 'liveid': 12708, 'livetitle': 'Wiki直播', 'livebackground': 'http://7mnnwj.com2.z0.glb.qiniucdn.com/GH0Sbf6yqMpkoXcv7RJ', 'livestate': 2, 'liveaudiences': 0, 'liveexpecttime': '2017-12-19 17:00:00' }], 'livestatus': { 'lastlivestate': 2, 'substatusmap': { '3': { 'receivetype': 3, 'lastlivecreatetime': 1577934429000, 'lastliveid': 12708 } } } } }
}
