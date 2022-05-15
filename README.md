# fixpoint-programming-exam

## 環境構築

### DevContainerを利用
```shell
$ git clone https://github.com/ieieiei59/fixpoint-programming-exam.git
$ cd fixpoint-programming-exam
$ code .
```

上記コマンド実行後、devcontainerを起動し、VSCodeのターミナルから以下コマンドを実行

```shell
$ yarn install
```

### その他の方法

```shell
$ git clone https://github.com/ieieiei59/fixpoint-programming-exam.git
$ cd fixpoint-programming-exam
$ yarn install
```

## 実行方法

```shell
$ npm install -g ping-logs-cli
$ ping-logs-cli logs strict <log-file-path>

or

$ npx ping-logs-cli logs strict path/to/log-file
```

## プログラム構成
[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) に記載

## 実行結果

### 設問1
```shell
$ cat example-logs/strict/default.log 
20201019133124,10.20.30.1/16,-
20201019133125,10.20.30.2/16,1
20201019133134,192.168.1.1/24,10
20201019133135,192.168.1.2/24,-
20201019133224,10.20.30.1/16,522
20201019133225,10.20.30.2/16,1
20201019133234,192.168.1.1/24,8
20201019133235,192.168.1.2/24,15
20201019133324,10.20.30.1/16,-
20201019133325,10.20.30.2/16,2

$ ping-logs-cli logs strict example-logs/strict/default.log 
 Address        Period                                                  
 ────────────── ─────────────────────────────────────────────────────── 
 10.20.30.1/16  2020年10月19日13時31分24秒 ~ 2020年10月19日13時32分24秒 
 10.20.30.1/16  2020年10月19日13時33分24秒 ~ 現在                       
 192.168.1.2/24 2020年10月19日13時31分35秒 ~ 2020年10月19日13時32分35秒
```

### 設問2
```shell
$ cat example-logs/check/default.log 
20201019133124,10.20.30.1/16,-
20201019133125,10.20.30.2/16,-
20201019133134,192.168.1.1/24,10
20201019133135,192.168.1.2/24,-
20201019133224,10.20.30.1/16,522
20201019133225,10.20.30.2/16,-
20201019133234,192.168.1.1/24,8
20201019133235,192.168.1.2/24,15
20201019133324,10.20.30.1/16,-
20201019133325,10.20.30.2/16,-
20201019133424,10.20.30.1/16,-
20201019133425,10.20.30.2/16,2

$ ping-logs-cli logs check -n 2 example-logs/check/default.log 
 Address       Period                                                  
 ───────────── ─────────────────────────────────────────────────────── 
 10.20.30.1/16 2020年10月19日13時33分24秒 ~ 現在                       
 10.20.30.2/16 2020年10月19日13時31分25秒 ~ 2020年10月19日13時34分25秒

 $ ping-logs-cli logs check -n 3 example-logs/check/default.log 
 Address       Period                                                  
 ───────────── ─────────────────────────────────────────────────────── 
 10.20.30.2/16 2020年10月19日13時31分25秒 ~ 2020年10月19日13時34分25秒
```

### 設問3
```shell
$ cat example-logs/high-load/default.log 
20201019133124,10.20.30.1/16,100
20201019133125,10.20.30.2/16,1
20201019133134,192.168.1.1/24,103
20201019133135,192.168.1.2/24,102
20201019133224,10.20.30.1/16,522
20201019133225,10.20.30.2/16,1
20201019133234,192.168.1.1/24,9
20201019133235,192.168.1.2/24,15
20201019133324,10.20.30.1/16,105
20201019133325,10.20.30.2/16,2
20201019133334,192.168.1.1/24,400
20201019133335,192.168.1.2/24,15

$ ping-logs-cli logs high-load -t 100 -m 1 example-logs/high-load/default.log 
 Address        Period                                                  
 ────────────── ─────────────────────────────────────────────────────── 
 10.20.30.1/16  2020年10月19日13時31分24秒 ~ 現在                       
 192.168.1.1/24 2020年10月19日13時31分34秒 ~ 2020年10月19日13時32分34秒 
 192.168.1.1/24 2020年10月19日13時33分34秒 ~ 現在                       
 192.168.1.2/24 2020年10月19日13時31分35秒 ~ 2020年10月19日13時32分35秒

$ ping-logs-cli logs high-load -t 100 -m 2 example-logs/high-load/default.log 
 Address       Period                            
 ───────────── ───────────────────────────────── 
 10.20.30.1/16 2020年10月19日13時31分24秒 ~ 現在

$ ping-logs-cli logs high-load -t 10 -m 2 example-logs/high-load/default.log 
 Address        Period                            
 ────────────── ───────────────────────────────── 
 10.20.30.1/16  2020年10月19日13時31分24秒 ~ 現在 
 192.168.1.2/24 2020年10月19日13時31分35秒 ~ 現在
```

### 設問4
```shell
$ cat example-logs/check-subnet/default.log 
20201019133124,10.20.30.1/16,-
20201019133125,10.20.30.2/16,-
20201019133134,192.168.1.1/24,10
20201019133135,192.168.1.2/24,-
20201019133224,10.20.30.1/16,522
20201019133225,10.20.30.2/16,-
20201019133234,192.168.1.1/24,8
20201019133235,192.168.1.2/24,-
20201019133324,10.20.30.1/16,-
20201019133325,10.20.30.2/16,-
20201019133424,10.20.30.1/16,-
20201019133425,10.20.30.2/16,-

$ ping-logs-cli logs check-subnet -n 2 example-logs/check-subnet/default.log 
 Subnet                    Period                                                  
 ───────────────────────── ─────────────────────────────────────────────────────── 
 10.20.0.0 ~ 10.20.255.255 2020年10月19日13時31分24秒 ~ 2020年10月19日13時32分24秒 
 10.20.0.0 ~ 10.20.255.255 2020年10月19日13時32分25秒 ~ 現在

$ ping-logs-cli logs check-subnet -n 3 example-logs/check-subnet/default.log 
 Subnet                    Period                            
 ───────────────────────── ───────────────────────────────── 
 10.20.0.0 ~ 10.20.255.255 2020年10月19日13時32分25秒 ~ 現在
```
