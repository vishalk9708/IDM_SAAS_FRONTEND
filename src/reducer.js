export const initialState = {
    fund: [], // list of all funds
    appName: "digix", // currently selected app from the dropdown
    userData: {} // user document with some formatting
}

export const reducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_FUND":
            return {
                ...state,
                fund: action.fund,
            };

        case "CHANGE_APP":
            return {
                ...state,
                appName: action.appName,
            };
        case "CHANGE_USERDATA":
            return {
                ...state,
                userData: action.userData,
            };
    }
}