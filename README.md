# https?-proxy

**Install**

```(sh)
git clone git@github.com:eShreder/http-proxy.git
cd http-proxy
pnpm build
```

**Configure**

- Change in `./config.json` `port` and `host`
- If you need TLS (HTTPS), you can use [Let’s Encrypt](https://letsencrypt.org/) and set path to keys in `tls`
- Else remove `tls`

**Run**

- start: `node dist`
- check: `curl https://2ip.ru --proxy https://<host>:<port> -v`
- start in docker: ```docker run -d --name http-proxy -p <port>:<port> -v `pwd`:/opt/proxy -v /etc/letsencrypt:/etc/letsencrypt node node /opt/proxy/dist```
