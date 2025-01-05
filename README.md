# alist cache

该项目主要是为了解决115刮削风控问题

# 环境要求

node: 18+

pm2

# 如何使用

## 1. 拉取项目

```angular2html
git clone https://github.com/gkl2013/alist_cache.git
```

## 2.修改配置 alist.json

## 3. 运行

```angular2html
pm2 start src/server.js --name alist_cache
```
## 4. 如何访问

以网易爆米花为例，如果alist和本项目在同一服务器，将原本配置的端口改为9115即可

## 注意事项

项目第一次运行后会扫描整个网盘，为了防止风控，请求频率很低，约2s请求一次，我测试的115我 9T文件，花费时间约3小时， 可以通过日志查看扫描情况

```angular2html
pm2 log
```

出现一下文本即为扫描完成
```angular2html
===扫描完成====
```
