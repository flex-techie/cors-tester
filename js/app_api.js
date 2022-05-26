import { RestApi } from './rest_api.js'

export class AppApi extends RestApi {

    static get BaseUrl() { return 'http://localhost:8080'; }

    static uploadScenarioZipFile(file, resolve, reject) {
        const url = this.BaseUrl + '/api/scenario';
        const formData = new FormData();
        formData.append('file', file);

        const headers = {
            // 'Content-Type': 'multipart/form-data',
        };

        const session = this.getSession();
        headers['Session-Token'] = session.token || '';

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.open("POST", url, true);
        xhr.onreadystatechange = () => {
            // console.log('xhr.readyState', xhr.readyState);
            // console.log('xhr.status', xhr.status);
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (resolve) {
                        resolve(xhr.responseText);
                    }
                }
                else {
                    if (xhr.status === 401) {
                        // セッション切れ対応: 401 Unauthorized
                        return;
                    }

                    if (reject) {
                        const res = JSON.parse(xhr.responseText);
                        reject(res);
                    }
                }
            }
        };

        for (const key in headers) {
            // console.log(key, headers[key]);
            xhr.setRequestHeader(key, headers[key]);
        }

        xhr.send(formData);
    }

    static checkHealth(resolve, reject) {
        this.send({
            url: this.BaseUrl + '/api/healthcheck',
            type: 'GET',
            headers: {
            },
            data: {
            },
            success: function (data, status, xhr) {
                // console.log('success', data, status, xhr);
                if (resolve) {
                    resolve(data);
                }
            },
            error: function (xhr, status, error) {
                // console.log('error', xhr, status, error);
                if (reject) {
                    const res = JSON.parse(xhr.responseText || '{}');
                    reject(res);
                }
            },
        });
    }

    static login(username, password, resolve, reject) {
        // Cross-Origin で index.html の取得なしで直接ログインする状況を想定する。
        // (API だけを利用する状況)
        // Retrieve Cookies for XSRF token.
        this.checkHealth(() => {
            this._login(username, password, resolve, reject);
        });
    }

    static _login(username, password, resolve, reject) {
        // const auth = btoa(encodeURIComponent(`${username}:${password}`));
        const auth = btoa(`${username}:${password}`);
        this.send({
            url: this.BaseUrl + '/api/login',
            type: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
            },
            data: {
            },
            success: function (data, status, xhr) {
                // console.log('success', data, status, xhr);
                if (resolve) {
                    resolve(data);
                }
            },
            error: function (xhr, status, error) {
                // console.log('error', xhr, status, error);
                if (reject) {
                    const res = JSON.parse(xhr.responseText || '{}');
                    reject(res);
                }
            },
        });
    }

    static logout(resolve, reject) {
        this.send({
            url: this.BaseUrl + '/api/logout',
            type: 'POST',
            headers: {
            },
            data: {
            },
            success: function (data, status, xhr) {
                // console.log('success', data, status, xhr);
                if (resolve) {
                    resolve(data);
                }
            },
            error: function (xhr, status, error) {
                // console.log('error', xhr, status, error);
                if (reject) {
                    const res = JSON.parse(xhr.responseText || '{}');
                    reject(res);
                }
            },
        });
    }

    static getScenarioList(resolve, reject) {
        this.send({
            url: this.BaseUrl + '/api/scenarios',
            type: 'GET',
            headers: {
            },
            data: {
            },
            success: function (data, status, xhr) {
                // console.log('success', data, status, xhr);
                if (resolve) {
                    resolve(data);
                }
            },
            error: function (xhr, status, error) {
                // console.log('error', xhr, status, error);
                if (reject) {
                    const res = JSON.parse(xhr.responseText || '{}');
                    reject(res);
                }
            },
        });
    }
}
