export default {
    state: {
        currentMenu: null,
        isCollapse: false,
        tabsList: [{
            path: "/",
            name: "home",
            label: "首页",
            icon: "home"
        }],
        timeOut: false, // 是否超时
        startTask: false, // 是否关闭job001
    },
    mutations: {
        selectMenu(state, val) {
            if (val.name !== 'home') {
                state.currentMenu = val;
                let result = state.tabsList.findIndex(item => item.name === val.name);
                result === -1 ? state.tabsList.push(val) : ''
            } else {
                state.currentMenu = null
            }
        },
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse
        },
        closeTab(state, val) {
            let result = state.tabsList.findIndex(item => item.name === val.name);
            state.tabsList.splice(result, 1);
        },
        changeTimeOut(state, val) {
            state.timeOut = val
        },

        changeTaskState(state, val) {
            state.startTask = val
        }
    },
    actions: {}
}