export class Consts {
    public static Elems() {
        return {
            COMMON_FILE_MENU: '#commonFileMenu',
            FILE_NAV_EVER: '#fileNavEver',
            APP_NAVIGATOR_WASP: '#appNavigatorWasp',
            APP_NAVIGATOR_EVER: '#appNavigatorEver',
            TOGGLE_PANEL: '#togglePanel',
            PROP_PANEL_WRAP: '#propPanelWrap',
            MAIN_PANEL_WRAP: '#mainPanelWrap'
        };
    }

    public static Clas() {
        return {
                CLASS_APP_HEIGHT: '.appHeight'
        };
    }

    public static Events() {
        return {
            WIN_SIZED: 'winSized',
            MENU_SELECTION: 'menuSelection',
            STATIONS_NETWORK_ERROR: 'stationsNetworkError'
        };
    }

    public static Values() {
        return {
            MENU_MIN_ICON_SHOW: 1550,
            APP_SIZE: 'AppSize',
            SERVER_MODE: 'serverMode', // 0 = cloud, 1 = private 2 = hybrid
            USER_NAME: 'userName',
            USER_PASS: 'userPass'
        };
    }

    public static Services() {
        return {
            App: 'Application',
            Properties: 'Properties',
            ActionService: 'ActionService'
        };
    }
}
