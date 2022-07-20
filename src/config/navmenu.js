module.exports = [{
    path: '/home',
    label: '首页',
    name: 'home',
    icon: 'user-solid'
},
{
    path: '/operation',
    label: '运营平台',
    name: 'operation',
    icon: 'setting'
},
{
    path: '/schedule',
    label: '定时任务',
    name: 'schedule',
    icon: 'setting'
},
{
    label: '其他',
    icon: 'setting',
    children: [{
        path: '/page1',
        name: 'page1',
        label: '页面1'
    },
    {
        path: '/page2',
        name: 'page2',
        label: '页面2'
    },
    {
        path: '/page3',
        name: 'page3',
        label: '页面3'
    }
    ]
}
]