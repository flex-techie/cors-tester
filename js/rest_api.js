export class RestApi {

    static StorageKeyForSession = 'sessioninfo';

    static getSession() {
        return JSON.parse(localStorage.getItem(this.StorageKeyForSession)) || {};
    }

    static deleteSession() {
        localStorage.removeItem(this.StorageKeyForSession);
    }

    static send(uArgs, uOptions) {
        const defaultOptions = {
            ignore401: false,
        };

        const options = { ...defaultOptions, ...uOptions}

        // const logKey = `${args.url}.send`;
        const defaultArgs = {
            type: 'GET',
            url: '/',
            data: {},
            dataType: 'json',
            timeout: 30000,
            success: function (data, status, xhr) {
                // console.log(`${logKey}: success`, data, status, xhr);
            },
            error: function (xhr, status, error) {
                // console.log(`${logKey}: error`, xhr, status, error);
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        const args = { ...defaultArgs, ...uArgs}

        const session = this.getSession();
        args.headers['Session-Token'] = session.token || '';

        if (args.type != 'GET') {
            args.headers['X-XSRF-TOKEN'] = ((document.cookie + ';').match('XSRF-TOKEN=([^¥S;]*)')||[])[1] || '';
        }

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.onreadystatechange = ev => {
            // const xhr = ev.currentTarget;
            // console.log('onreadystatechange', xhr);
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (args.success) {
                        // TODO: responseType での判断を
                        let data = xhr.responseText;
                        try {
                            data = JSON.parse(xhr.responseText || '{}');
                        }
                        catch (error) {
                            // HTML
                        }
                        args.success(data, xhr.status, xhr);
                    }
                }
                else {
                    if (args.error) {
                        const data = JSON.parse(xhr.responseText || '{}');
                        args.error(xhr, xhr.status, data);
                    }
                }
            }
        };
        xhr.onerror = ev => {
            // const xhr = ev.currentTarget;
            console.log('onerror', xhr);
            if (args.error) {
                const data = JSON.parse(xhr.responseText || '{}');
                args.error(xhr, xhr.status, data);
            }
        }

        let data = '';
        if (args.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
            xhr.open(args.type, `${args.url}?${this.encodeHTMLForm(args.data)}`, true);
        }
        else {
            xhr.open(args.type, args.url, true);
            data = typeof(args.data) != 'string' ? JSON.stringify(args.data) : args.data;
        }

        for (const key in args.headers) {
            // console.log(key, args.headers[key]);
            xhr.setRequestHeader(key, args.headers[key]);
        }

        xhr.send(data);
    }

    static encodeHTMLForm(data) {
        const params = [];
        for (const name in data) {
            const value = data[name];
            const param = encodeURIComponent(name) + '=' + encodeURIComponent(value);
            params.push(param);
        }
        return params.join('&').replace(/%20/g, '+');
    }

    static getJsonRequest(url, params, resolve, reject) {
        // const self = this;
        params = params ? JSON.stringify(params) : null;
        this.send({
            url: url,
            type: 'GET',
            data: params,
            success: function (data, status, xhr) {
                // console.log('success', data, status, xhr);
                if (resolve) {
                    resolve(data);
                }
            },
            error: function (xhr, status, data) {
                console.log('error', xhr, status, data);
                const res = JSON.parse(xhr.responseText || '{}');
                if (reject) {
                    reject(res);
                }
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static postJsonRequest(url, params, resolve, reject) {
        // const self = this;
        params = params ? JSON.stringify(params) : null;
        this.send({
            url: url,
            type: 'POST',
            data: params,
            success: function (data, status, xhr) {
                // console.log('success', data, status, xhr);
                if (resolve) {
                    resolve(data);
                }
            },
            error: function (xhr, status, data) {
                console.log('error', xhr, status, data);
                let res = { };
                if (data) {
                    res = data;
                }
                else if (xhr.statusText.indexOf('timeout') != -1) {
                    res.message = '通信がタイムアウトしました。';
                }
                else {
                    res.message = '予期しないエラーが発生しました。';
                }

                if (reject) {
                    reject(res);
                }
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
