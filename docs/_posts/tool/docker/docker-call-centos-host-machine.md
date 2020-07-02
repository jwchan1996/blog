---
title: docker 访问宿主机的 ip 配置问题
date: 2020-04-28
categories: "docker" #分类
tags:  #标签
    - docker
    - mysql
    - centos
---

# docker 访问宿主机的 ip 配置问题
## 场景描述
在 `centos7` 运行 `docker` 容器应用时，需要连接宿主机的 `mysql` 的 `3306` 端口，发现连接不上，`docker` 容器无法访问宿主机的 `mysql` 数据库。但是，在容器内访问外部网络是可以 `ping` 通的。  
## 原因分析
在 `centos7` 上部署 `docker` 容器，其网络模式采用的是 `bridge` 模式。  
启动 `docker` 时，`docker` 进程会创建一个名为 `docker0` 的虚拟网桥，用于宿主机与容器之间的通信。当启动一个 `docker` 容器时，`docker` 容器将会附加到虚拟网桥上，容器内的报文通过 `docker0` 向外转发。

如果 `docker` 容器访问宿主机，那么 `docker0` 网桥将报文直接转发到本机，报文的源地址是 `docker0` 网段的地址。而如果 `docker` 容器访问宿主机以外的机器，`docker` 的 `SNAT` 网桥会将报文的源地址转换为宿主机的地址，通过宿主机的网卡向外发送。

因此，当 `docker` 容器访问宿主机时，如果宿主机服务端口会被防火墙拦截，那么就无法连通宿主机，出现 `No route to host` 的错误。

而访问宿主机所在局域网内的其他机器，由于报文的源地址是宿主机 `ip`，因此，不会被目的机器防火墙拦截，所以可以访问。
## 解决问题
首先设置了 `mysql` 的配置文件，保证 `mysql` 可以被任何 `ip` 访问：
```bash
[mysqld]
bind-address = 0.0.0.0
```
修改完配置文件重启生效。  
但为了安全考虑，防火墙的 `3306` 端口仍然是不开放外网访问的。  


容器访问宿主机的地址使用 `eth0` 的地址，即宿主机内网 `ip` 地址。  
运行 `ipconfig` 命令，查看网络的虚拟网桥相关信息。  

注意：宿主机会把容器 `ip` 地址段当成外网 `ip`。（当前说明是 `centos7` 环境）

编辑防火墙文件 `/etc/firewalld/zones/public.xml`，添加下面 `docker0` 地址段到配置：  
```xml
<rule family="ipv4">
  <source address="172.18.0.0/16"/>
  <accept/>
</rule>
```
重启防火墙，`docker` 容器即可正常访问宿主机端口。
```bash
service firewalld restart
```
🎨 如果有用到 `docker-compose` 命令，则会自动创建一个名为 `br-"docker network id"` 的虚拟网桥。  
🎨 此时同样需要将虚拟网桥地址段配置到防火墙白名单，才能正常访问，添加配置：  
```xml
<rule family="ipv4">
  <source address="172.20.0.0/16"/>
  <accept/>
</rule>
```
![image](/docker/docker_call_host/container_connect_host.png)

## 测试端口
在容器中测试宿主机端口是否可以连接，可以使用 `wget 内网ip:端口` 命令。
```bash
$ wget 172.17.25.162:3306  
wget: can not connect to remote host (172.17.25.162): Host is unreachable  #不可以连接

$ wget 172.17.25.162:3306
wget: bad header line: 5.7.29-log  #可以连接
```