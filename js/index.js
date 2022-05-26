import { AppApi } from './app_api.js'

window.onload = () => {
    const view = new Index();
    view.start();
}

class Index {

    constructor() {
        const healthCheckEl = document.getElementById('healthCheck');
        if (healthCheckEl) {
            healthCheckEl.onclick = ev => {
                AppApi.checkHealth(o => {
                    console.log(o);
                });
            };
        }

        const logoutEl = document.getElementById('logout');
        if (logoutEl) {
            logoutEl.onclick = ev => {
                AppApi.logout(o => {
                    console.log(o);
                    // window.location = "/";
                });
            };
        }

        const loginEl = document.getElementById('login');
        if (loginEl) {
            loginEl.onclick = ev => {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                AppApi.login(username, password, o => {
                    console.log(o);
                    // window.location = "/";
                });
            };
        }

        const getScenarioListEl = document.getElementById('getScenarioList');
        if (getScenarioListEl) {
            getScenarioListEl.onclick = ev => {
                AppApi.getScenarioList(o => {
                    console.log(o);
                });
            };
        }

        const uploadScenarioEl = document.getElementById('uploadScenario');
        const scenarioFileEl = document.getElementById('scenarioFile');
        if (uploadScenarioEl && scenarioFileEl) {
            uploadScenarioEl.onclick = ev => {
                const file = scenarioFileEl.files[0];
                AppApi.uploadScenarioZipFile(file, o => {
                    console.log(o);
                });
            };
        }
    }

    start() {

    }
}
